using InventoPos.Domain.Entities.Purchases;
using MediatR;

namespace InventoPos.Application.Purchases.Queries.GetPurchaseOrders
{
    public record GetPurchaseOrdersQuery : IRequest<List<PurchaseOrderDto>>;

    public class PurchaseOrderDto
    {
        public int Id { get; set; }
        public int SupplierId { get; set; }
        public string SupplierName { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
        public PurchaseOrderStatus Status { get; set; }
        public decimal TotalAmount { get; set; }
        public int ItemCount { get; set; }
    }
}
