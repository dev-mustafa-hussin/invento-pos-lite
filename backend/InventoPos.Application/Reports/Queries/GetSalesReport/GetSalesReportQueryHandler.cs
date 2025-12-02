using InventoPos.Application.Common.Interfaces;
using InventoPos.Domain.Entities.Sales;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace InventoPos.Application.Reports.Queries.GetSalesReport;

public class GetSalesReportQueryHandler : IRequestHandler<GetSalesReportQuery, List<SalesReportDto>>
{
    private readonly IApplicationDbContext _context;

    public GetSalesReportQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<SalesReportDto>> Handle(GetSalesReportQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Invoices.AsQueryable();

        if (request.FromDate.HasValue)
            query = query.Where(i => i.InvoiceDate >= request.FromDate.Value);

        if (request.ToDate.HasValue)
            query = query.Where(i => i.InvoiceDate <= request.ToDate.Value);

        var report = await query
            .GroupBy(i => i.InvoiceDate.Date)
            .Select(g => new SalesReportDto
            {
                Date = g.Key,
                TotalRevenue = g.Sum(i => i.TotalAmount),
                InvoiceCount = g.Count()
            })
            .OrderBy(r => r.Date)
            .ToListAsync(cancellationToken);

        return report;
    }
}
