using InventoPos.Application.Common.Interfaces;
using InventoPos.Domain.Entities.Licensing;
using MediatR;

namespace InventoPos.Application.Licensing.Commands.CreateTenant;

public record CreateTenantCommand(string Name, string? TaxNumber, string? Address, string? Phone) : IRequest<Guid>;

public class CreateTenantCommandHandler : IRequestHandler<CreateTenantCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateTenantCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateTenantCommand request, CancellationToken cancellationToken)
    {
        var tenant = new Tenant
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            TaxNumber = request.TaxNumber,
            Address = request.Address,
            Phone = request.Phone,
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };

        _context.Tenants.Add(tenant);
        await _context.SaveChangesAsync(cancellationToken);

        return tenant.Id;
    }
}
