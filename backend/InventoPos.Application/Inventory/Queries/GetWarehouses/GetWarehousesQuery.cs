using InventoPos.Application.Common.Interfaces;
using InventoPos.Domain.Entities.Inventory;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace InventoPos.Application.Inventory.Queries.GetWarehouses;

public record GetWarehousesQuery : IRequest<List<Warehouse>>;

public class GetWarehousesQueryHandler : IRequestHandler<GetWarehousesQuery, List<Warehouse>>
{
    private readonly IApplicationDbContext _context;

    public GetWarehousesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Warehouse>> Handle(GetWarehousesQuery request, CancellationToken cancellationToken)
    {
        return await _context.Warehouses
            .Where(w => w.IsActive)
            .OrderByDescending(w => w.IsPrimary)
            .ThenBy(w => w.Name)
            .ToListAsync(cancellationToken);
    }
}
