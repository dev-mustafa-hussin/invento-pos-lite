using InventoPos.Application.Settings.Commands.UpdateSettings;
using InventoPos.Application.Settings.Queries.GetSettings;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InventoPos.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class SettingsController : ControllerBase
{
    private readonly IMediator _mediator;

    public SettingsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<Dictionary<string, string>>> GetSettings()
    {
        return await _mediator.Send(new GetSettingsQuery());
    }

    [HttpPut]
    public async Task<IActionResult> UpdateSettings([FromBody] Dictionary<string, string> settings)
    {
        await _mediator.Send(new UpdateSettingsCommand(settings));
        return NoContent();
    }
}
