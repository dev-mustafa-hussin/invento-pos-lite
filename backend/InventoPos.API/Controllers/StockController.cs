using InventoPos.Application.Inventory.Commands.AdjustStock;
using InventoPos.Application.Inventory.Commands.TransferStock;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InventoPos.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class StockController : ControllerBase
{
    private readonly IMediator _mediator;

    public StockController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("adjust")]
    public async Task<IActionResult> AdjustStock([FromBody] AdjustStockCommand command)
    {
        var result = await _mediator.Send(command);
        if (!result)
        {
            return BadRequest("Failed to adjust stock.");
        }
        return Ok(new { Message = "Stock adjusted successfully." });
    }
    [HttpPost("transfer")]
    public async Task<IActionResult> TransferStock([FromBody] TransferStockCommand command)
    {
        var result = await _mediator.Send(command);
        if (!result)
        {
            return BadRequest("Failed to transfer stock.");
        }
        return Ok(new { Message = "Stock transferred successfully." });
    }
}
