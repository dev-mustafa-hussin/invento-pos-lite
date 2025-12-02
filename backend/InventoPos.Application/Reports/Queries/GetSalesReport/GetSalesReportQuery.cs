using MediatR;

namespace InventoPos.Application.Reports.Queries.GetSalesReport;

public record GetSalesReportQuery(DateTime? FromDate, DateTime? ToDate) : IRequest<List<SalesReportDto>>;

public class SalesReportDto
{
    public DateTime Date { get; set; }
    public decimal TotalRevenue { get; set; }
    public int InvoiceCount { get; set; }
}
