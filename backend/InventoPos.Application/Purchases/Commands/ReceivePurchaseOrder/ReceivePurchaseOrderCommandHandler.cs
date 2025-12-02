using InventoPos.Application.Common.Interfaces;
using InventoPos.Domain.Entities.Inventory;
using InventoPos.Domain.Entities.Purchases;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace InventoPos.Application.Purchases.Commands.ReceivePurchaseOrder
{
    public class ReceivePurchaseOrderCommandHandler : IRequestHandler<ReceivePurchaseOrderCommand>
    {
        private readonly IApplicationDbContext _context;

        public ReceivePurchaseOrderCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task Handle(ReceivePurchaseOrderCommand request, CancellationToken cancellationToken)
        {
            var order = await _context.PurchaseOrders
                .Include(po => po.Items)
                .FirstOrDefaultAsync(po => po.Id == request.OrderId, cancellationToken);

            if (order == null)
            {
                throw new KeyNotFoundException($"Purchase Order {request.OrderId} not found.");
            }

            if (order.Status != PurchaseOrderStatus.Pending)
            {
                throw new InvalidOperationException($"Purchase Order {request.OrderId} is already received or cancelled.");
            }

            var warehouse = await _context.Warehouses.FindAsync(new object[] { request.WarehouseId }, cancellationToken);
            if (warehouse == null)
            {
                throw new KeyNotFoundException($"Warehouse {request.WarehouseId} not found.");
            }

            // Update Order Status
            order.Status = PurchaseOrderStatus.Received;

            // Update Stock
            foreach (var item in order.Items)
            {
                var stock = await _context.Stocks
                    .FirstOrDefaultAsync(s => s.ProductId == item.ProductId && s.WarehouseId == request.WarehouseId, cancellationToken);

                if (stock == null)
                {
                    stock = new Stock
                    {
                        ProductId = item.ProductId,
                        WarehouseId = request.WarehouseId,
                        Quantity = 0,
                        UpdatedAt = DateTime.UtcNow
                    };
                    _context.Stocks.Add(stock);
                }

                stock.Quantity += item.Quantity;
                stock.UpdatedAt = DateTime.UtcNow;

                // Record Movement
                var movement = new StockMovement
                {
                    Id = Guid.NewGuid(),
                    ProductId = item.ProductId,
                    WarehouseId = request.WarehouseId,
                    Quantity = item.Quantity,
                    Type = StockMovementType.In,
                    ReferenceId = $"PO-{order.Id}",
                    Reason = "Purchase Order Received",
                    CreatedAt = DateTime.UtcNow
                };
                _context.StockMovements.Add(movement);
            }

            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
