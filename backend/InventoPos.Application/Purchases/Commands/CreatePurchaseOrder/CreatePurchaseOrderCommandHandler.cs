using InventoPos.Application.Common.Interfaces;
using InventoPos.Domain.Entities.Purchases;
using MediatR;

namespace InventoPos.Application.Purchases.Commands.CreatePurchaseOrder
{
    public class CreatePurchaseOrderCommandHandler : IRequestHandler<CreatePurchaseOrderCommand, int>
    {
        private readonly IApplicationDbContext _context;

        public CreatePurchaseOrderCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle(CreatePurchaseOrderCommand request, CancellationToken cancellationToken)
        {
            var order = new PurchaseOrder
            {
                SupplierId = request.SupplierId,
                OrderDate = request.OrderDate,
                Notes = request.Notes,
                Status = PurchaseOrderStatus.Pending,
                TotalAmount = request.Items.Sum(i => i.Quantity * i.UnitPrice)
            };

            foreach (var item in request.Items)
            {
                order.Items.Add(new PurchaseOrderItem
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice,
                    TotalPrice = item.Quantity * item.UnitPrice
                });
            }

            _context.PurchaseOrders.Add(order);
            await _context.SaveChangesAsync(cancellationToken);

            return order.Id;
        }
    }
}
