using InventoPos.Application.Common.Interfaces;
using InventoPos.Domain.Entities.Licensing;
using InventoPos.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace InventoPos.Infrastructure.Services;

public class TenantService : ITenantService
{
    private readonly ApplicationDbContext _context;
    private Tenant? _currentTenant;

    public TenantService(ApplicationDbContext context)
    {
        _context = context;
    }

    public Guid? CurrentTenantId => _currentTenant?.Id;
    public Tenant? CurrentTenant => _currentTenant;

    public async Task SetTenantAsync(Guid tenantId)
    {
        _currentTenant = await _context.Tenants
            .Include(t => t.CurrentSubscription!)
            .ThenInclude(s => s.Plan)
            .FirstOrDefaultAsync(t => t.Id == tenantId);
    }
}
