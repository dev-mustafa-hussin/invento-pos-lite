using InventoPos.Application.Common.Interfaces;
using Microsoft.AspNetCore.Http;

namespace InventoPos.Infrastructure.Middleware;

public class SubscriptionMiddleware
{
    private readonly RequestDelegate _next;

    public SubscriptionMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, ITenantService tenantService)
    {
        // Skip for public endpoints or login
        var path = context.Request.Path.Value?.ToLower();
        if (path != null && (path.Contains("/auth/") || path.Contains("/swagger")))
        {
            await _next(context);
            return;
        }

        var tenant = tenantService.CurrentTenant;

        if (tenant == null)
        {
            // If no tenant context, potentially allow if it's a super-admin or public area
            // For now, we might block or proceed depending on requirements.
            // Let's proceed but maybe the controller will fail if it needs tenant.
            await _next(context);
            return;
        }

        if (tenant.CurrentSubscription == null || !tenant.CurrentSubscription.IsActive || tenant.CurrentSubscription.EndDate < DateTime.UtcNow)
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            await context.Response.WriteAsync("Subscription is inactive or expired.");
            return;
        }

        await _next(context);
    }
}
