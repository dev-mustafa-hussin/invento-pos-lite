using InventoPos.Application.Licensing.Commands.CreatePlan;
using InventoPos.Application.Licensing.Commands.CreateTenant;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InventoPos.API.Controllers;

[Route("api/[controller]")]
[ApiController]
// [Authorize(Roles = "SuperAdmin")] // TODO: Enable when roles are ready
public class AdminController : ControllerBase
{
    private readonly IMediator _mediator;

    public AdminController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("tenants")]
    public async Task<IActionResult> CreateTenant([FromBody] CreateTenantCommand command)
    {
        var tenantId = await _mediator.Send(command);
        return Ok(new { TenantId = tenantId });
    }

    [HttpPost("plans")]
    public async Task<IActionResult> CreatePlan([FromBody] CreateSubscriptionPlanCommand command)
    {
        var planId = await _mediator.Send(command);
        return Ok(new { PlanId = planId });
    }
}
