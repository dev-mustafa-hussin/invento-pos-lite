using InventoPos.Domain.Entities.Licensing;

namespace InventoPos.Application.Common.Interfaces;

public interface ITenantService
{
    Guid? CurrentTenantId { get; }
    Tenant? CurrentTenant { get; }
    Task SetTenantAsync(Guid tenantId);
}
