using InventoPos.Application.Common.Interfaces;
using InventoPos.Domain.Entities.Inventory;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace InventoPos.Application.Inventory.Commands.AdjustStock;

public record AdjustStockCommand(
    int ProductId,
    int WarehouseId,
    int QuantityAdjustment, // Positive to add, negative to remove
    string Reason
) : IRequest<bool>;

public class AdjustStockCommandHandler : IRequestHandler<AdjustStockCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public AdjustStockCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(AdjustStockCommand request, CancellationToken cancellationToken)
    {
        var stock = await _context.Stocks
            .FirstOrDefaultAsync(s => s.ProductId == request.ProductId && s.WarehouseId == request.WarehouseId, cancellationToken);

        if (stock == null)
        {
            // Create stock entry if not exists (e.g., first time in this warehouse)
            stock = new Stock
            {
                ProductId = request.ProductId,
                WarehouseId = request.WarehouseId,
                Quantity = 0,
                UpdatedAt = DateTime.UtcNow
            };
            _context.Stocks.Add(stock);
        }

        // Check for negative stock if needed (optional rule)
        if (stock.Quantity + request.QuantityAdjustment < 0)
        {
            // For now, allow negative stock or throw exception?
            // Let's allow it but maybe log a warning, or return false.
            // Returning false for now to indicate failure.
            // return false; 
            // Actually, let's throw an exception or just allow it for flexibility.
            // Let's allow it.
        }

        stock.Quantity += request.QuantityAdjustment;
        stock.UpdatedAt = DateTime.UtcNow;

        // Record Movement
        var movement = new StockMovement
        {
            ProductId = request.ProductId,
            WarehouseId = request.WarehouseId,
            Quantity = request.QuantityAdjustment,
            Type = StockMovementType.Adjustment,
            Reason = request.Reason,
            CreatedAt = DateTime.UtcNow
        };
        _context.StockMovements.Add(movement);

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
