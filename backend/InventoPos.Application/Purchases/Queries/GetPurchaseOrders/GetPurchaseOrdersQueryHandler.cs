using InventoPos.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace InventoPos.Application.Purchases.Queries.GetPurchaseOrders
{
    public class GetPurchaseOrdersQueryHandler : IRequestHandler<GetPurchaseOrdersQuery, List<PurchaseOrderDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetPurchaseOrdersQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<PurchaseOrderDto>> Handle(GetPurchaseOrdersQuery request, CancellationToken cancellationToken)
        {
            return await _context.PurchaseOrders
                .Include(po => po.Supplier)
                .Include(po => po.Items)
                .Select(po => new PurchaseOrderDto
                {
                    Id = po.Id,
                    SupplierId = po.SupplierId,
                    SupplierName = po.Supplier != null ? po.Supplier.Name : "Unknown",
                    OrderDate = po.OrderDate,
                    Status = po.Status,
                    TotalAmount = po.TotalAmount,
                    ItemCount = po.Items.Count
                })
                .ToListAsync(cancellationToken);
        }
    }
}
