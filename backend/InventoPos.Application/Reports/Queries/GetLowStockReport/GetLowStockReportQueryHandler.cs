using InventoPos.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace InventoPos.Application.Reports.Queries.GetLowStockReport;

public class GetLowStockReportQueryHandler : IRequestHandler<GetLowStockReportQuery, List<LowStockProductDto>>
{
    private readonly IApplicationDbContext _context;

    public GetLowStockReportQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<LowStockProductDto>> Handle(GetLowStockReportQuery request, CancellationToken cancellationToken)
    {
        return await _context.Products
            .Where(p => p.Stock <= p.MinimumStock)
            .Select(p => new LowStockProductDto
            {
                ProductId = p.Id,
                Name = p.Name,
                Stock = p.Stock,
                MinimumStock = p.MinimumStock
            })
            .ToListAsync(cancellationToken);
    }
}
