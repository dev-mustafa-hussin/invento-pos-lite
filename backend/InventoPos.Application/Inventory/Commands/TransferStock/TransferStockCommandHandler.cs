using InventoPos.Application.Common.Interfaces;
using InventoPos.Domain.Entities.Inventory;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace InventoPos.Application.Inventory.Commands.TransferStock;

public class TransferStockCommandHandler : IRequestHandler<TransferStockCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public TransferStockCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(TransferStockCommand request, CancellationToken cancellationToken)
    {
        if (request.Quantity <= 0)
        {
            throw new ArgumentException("Quantity must be greater than zero.");
        }

        if (request.FromWarehouseId == request.ToWarehouseId)
        {
            throw new ArgumentException("Source and destination warehouses must be different.");
        }

        // 1. Get Source Stock
        var sourceStock = await _context.Stocks
            .FirstOrDefaultAsync(s => s.ProductId == request.ProductId && s.WarehouseId == request.FromWarehouseId, cancellationToken);

        if (sourceStock == null || sourceStock.Quantity < request.Quantity)
        {
            throw new InvalidOperationException("Insufficient stock in source warehouse.");
        }

        // 2. Get Destination Stock (or create)
        var destStock = await _context.Stocks
            .FirstOrDefaultAsync(s => s.ProductId == request.ProductId && s.WarehouseId == request.ToWarehouseId, cancellationToken);

        if (destStock == null)
        {
            destStock = new Stock
            {
                ProductId = request.ProductId,
                WarehouseId = request.ToWarehouseId,
                Quantity = 0,
                UpdatedAt = DateTime.UtcNow
            };
            _context.Stocks.Add(destStock);
        }

        // 3. Update Quantities
        sourceStock.Quantity -= request.Quantity;
        sourceStock.UpdatedAt = DateTime.UtcNow;

        destStock.Quantity += request.Quantity;
        destStock.UpdatedAt = DateTime.UtcNow;

        // 4. Record Movements
        var movementOut = new StockMovement
        {
            Id = Guid.NewGuid(),
            ProductId = request.ProductId,
            WarehouseId = request.FromWarehouseId,
            Quantity = -request.Quantity, // Negative for Out
            Type = StockMovementType.Transfer,
            Reason = $"Transfer TO Warehouse {request.ToWarehouseId}. {request.Reason}",
            CreatedAt = DateTime.UtcNow
        };

        var movementIn = new StockMovement
        {
            Id = Guid.NewGuid(),
            ProductId = request.ProductId,
            WarehouseId = request.ToWarehouseId,
            Quantity = request.Quantity, // Positive for In
            Type = StockMovementType.Transfer,
            Reason = $"Transfer FROM Warehouse {request.FromWarehouseId}. {request.Reason}",
            CreatedAt = DateTime.UtcNow
        };

        _context.StockMovements.Add(movementOut);
        _context.StockMovements.Add(movementIn);

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
