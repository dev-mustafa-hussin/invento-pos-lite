using InventoPos.Application.Common.Interfaces;
using InventoPos.Domain.Entities.Sales;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace InventoPos.Application.Dashboard.Queries.GetStats;

public class GetDashboardStatsQueryHandler : IRequestHandler<GetDashboardStatsQuery, DashboardStatsDto>
{
    private readonly IApplicationDbContext _context;

    public GetDashboardStatsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardStatsDto> Handle(GetDashboardStatsQuery request, CancellationToken cancellationToken)
    {
        var totalRevenue = await _context.Invoices
            .SumAsync(i => i.TotalAmount, cancellationToken);

        var totalInvoices = await _context.Invoices
            .CountAsync(cancellationToken);

        var totalProducts = await _context.Products
            .CountAsync(cancellationToken);

        var lowStockProducts = await _context.Products
            .CountAsync(p => p.Stock <= p.MinimumStock, cancellationToken);

        var recentSales = await _context.Invoices
            .OrderByDescending(i => i.InvoiceDate)
            .Take(5)
            .Select(i => new RecentSaleDto
            {
                InvoiceNumber = i.InvoiceNumber,
                CustomerName = i.Customer != null ? i.Customer.Name : "Walk-in Customer",
                Amount = i.TotalAmount,
                Date = i.InvoiceDate
            })
            .ToListAsync(cancellationToken);

        return new DashboardStatsDto
        {
            TotalRevenue = totalRevenue,
            TotalInvoices = totalInvoices,
            TotalProducts = totalProducts,
            LowStockProducts = lowStockProducts,
            RecentSales = recentSales
        };
    }
}
