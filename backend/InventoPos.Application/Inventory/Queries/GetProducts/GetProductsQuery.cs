using InventoPos.Application.Common.Interfaces;
using InventoPos.Domain.Entities.Inventory;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace InventoPos.Application.Inventory.Queries.GetProducts;

public record GetProductsQuery(int Page = 1, int PageSize = 10, int? CategoryId = null) : IRequest<List<Product>>;

public class GetProductsQueryHandler : IRequestHandler<GetProductsQuery, List<Product>>
{
    private readonly IApplicationDbContext _context;

    public GetProductsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Product>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Products
            .Include(p => p.Category)
            .AsQueryable();

        if (request.CategoryId.HasValue)
        {
            query = query.Where(p => p.CategoryId == request.CategoryId);
        }

        return await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);
    }
}
