using InventoPos.Application.HR.Payroll.Commands.GeneratePayroll;
using InventoPos.Application.HR.Payroll.Queries.GetPayrolls;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InventoPos.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class PayrollController : ControllerBase
{
    private readonly IMediator _mediator;

    public PayrollController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<List<PayrollDto>>> GetPayrolls([FromQuery] int? month, [FromQuery] int? year)
    {
        return await _mediator.Send(new GetPayrollsQuery(month, year));
    }

    [HttpPost("generate")]
    public async Task<IActionResult> GeneratePayroll([FromBody] GeneratePayrollCommand command)
    {
        var count = await _mediator.Send(command);
        return Ok(new { GeneratedCount = count });
    }
}
