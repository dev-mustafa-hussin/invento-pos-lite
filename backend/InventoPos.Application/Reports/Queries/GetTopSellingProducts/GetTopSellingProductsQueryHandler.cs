using InventoPos.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace InventoPos.Application.Reports.Queries.GetTopSellingProducts;

public class GetTopSellingProductsQueryHandler : IRequestHandler<GetTopSellingProductsQuery, List<TopProductDto>>
{
    private readonly IApplicationDbContext _context;

    public GetTopSellingProductsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<TopProductDto>> Handle(GetTopSellingProductsQuery request, CancellationToken cancellationToken)
    {
        // Note: This assumes InvoiceItems are linked to Products and Invoices are completed
        // For simplicity, we query InvoiceItems directly. In a real scenario, we might need to filter by Invoice Status.
        
        var topProducts = await _context.Invoices
            .SelectMany(i => i.Items)
            .GroupBy(item => item.ProductName)
            .Select(g => new TopProductDto
            {
                ProductName = g.Key,
                QuantitySold = g.Sum(i => i.Quantity),
                TotalRevenue = g.Sum(i => i.Quantity * i.UnitPrice)
            })
            .OrderByDescending(p => p.QuantitySold)
            .Take(request.Count)
            .ToListAsync(cancellationToken);

        return topProducts;
    }
}
