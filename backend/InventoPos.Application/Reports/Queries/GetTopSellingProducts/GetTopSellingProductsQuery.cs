using MediatR;

namespace InventoPos.Application.Reports.Queries.GetTopSellingProducts;

public record GetTopSellingProductsQuery(int Count = 5) : IRequest<List<TopProductDto>>;

public class TopProductDto
{
    public string ProductName { get; set; } = string.Empty;
    public int QuantitySold { get; set; }
    public decimal TotalRevenue { get; set; }
}
