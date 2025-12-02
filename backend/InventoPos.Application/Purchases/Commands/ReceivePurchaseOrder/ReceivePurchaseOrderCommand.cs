using MediatR;

namespace InventoPos.Application.Purchases.Commands.ReceivePurchaseOrder
{
    public class ReceivePurchaseOrderCommand : IRequest
    {
        public int OrderId { get; set; }
        public int WarehouseId { get; set; }
    }
}
