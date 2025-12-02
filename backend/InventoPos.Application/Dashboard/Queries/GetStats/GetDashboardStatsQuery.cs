using MediatR;

namespace InventoPos.Application.Dashboard.Queries.GetStats;

public record GetDashboardStatsQuery : IRequest<DashboardStatsDto>;

public class DashboardStatsDto
{
    public decimal TotalRevenue { get; set; }
    public int TotalInvoices { get; set; }
    public int TotalProducts { get; set; }
    public int LowStockProducts { get; set; }
    public List<RecentSaleDto> RecentSales { get; set; } = new();
}

public class RecentSaleDto
{
    public string InvoiceNumber { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
}
