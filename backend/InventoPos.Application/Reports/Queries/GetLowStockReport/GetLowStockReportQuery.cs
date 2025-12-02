using MediatR;

namespace InventoPos.Application.Reports.Queries.GetLowStockReport;

public record GetLowStockReportQuery : IRequest<List<LowStockProductDto>>;

public class LowStockProductDto
{
    public int ProductId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Stock { get; set; }
    public int MinimumStock { get; set; }
}
