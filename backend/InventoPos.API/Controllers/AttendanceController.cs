using InventoPos.Application.HR.Attendance.Commands.CheckIn;
using InventoPos.Application.HR.Attendance.Commands.CheckOut;
using InventoPos.Application.HR.Attendance.Queries.GetAttendance;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InventoPos.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class AttendanceController : ControllerBase
{
    private readonly IMediator _mediator;

    public AttendanceController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<List<AttendanceDto>>> GetAttendance([FromQuery] DateTime? date)
    {
        return await _mediator.Send(new GetAttendanceQuery(date));
    }

    [HttpPost("check-in")]
    public async Task<IActionResult> CheckIn([FromBody] CheckInCommand command)
    {
        var attendanceId = await _mediator.Send(command);
        return Ok(new { AttendanceId = attendanceId });
    }

    [HttpPost("check-out")]
    public async Task<IActionResult> CheckOut([FromBody] CheckOutCommand command)
    {
        await _mediator.Send(command);
        return NoContent();
    }
}
