using InventoPos.Application.Common.Interfaces;
using Microsoft.AspNetCore.Http;

namespace InventoPos.Infrastructure.Middleware;

public class TenantResolutionMiddleware
{
    private readonly RequestDelegate _next;

    public TenantResolutionMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, ITenantService tenantService)
    {
        // 1. Try to get TenantId from Header
        if (context.Request.Headers.TryGetValue("X-Tenant-ID", out var tenantIdValue) &&
            Guid.TryParse(tenantIdValue, out var tenantId))
        {
            await tenantService.SetTenantAsync(tenantId);
        }
        // 2. Alternatively, get from User Claims if authenticated
        else if (context.User.Identity?.IsAuthenticated == true)
        {
            var tenantClaim = context.User.FindFirst("TenantId")?.Value;
            if (Guid.TryParse(tenantClaim, out var userTenantId))
            {
                await tenantService.SetTenantAsync(userTenantId);
            }
        }

        await _next(context);
    }
}
