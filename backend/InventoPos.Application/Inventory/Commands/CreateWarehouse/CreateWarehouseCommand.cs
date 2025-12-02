using InventoPos.Application.Common.Interfaces;
using InventoPos.Domain.Entities.Inventory;
using MediatR;

namespace InventoPos.Application.Inventory.Commands.CreateWarehouse;

public record CreateWarehouseCommand(string Name, string? Location, bool IsPrimary) : IRequest<int>;

public class CreateWarehouseCommandHandler : IRequestHandler<CreateWarehouseCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateWarehouseCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateWarehouseCommand request, CancellationToken cancellationToken)
    {
        var warehouse = new Warehouse
        {
            Name = request.Name,
            Location = request.Location,
            IsPrimary = request.IsPrimary,
            IsActive = true
        };

        _context.Warehouses.Add(warehouse);
        await _context.SaveChangesAsync(cancellationToken);

        return warehouse.Id;
    }
}
