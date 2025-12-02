using InventoPos.Application.Inventory.Commands.CreateWarehouse;
using InventoPos.Application.Inventory.Queries.GetWarehouses;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InventoPos.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class WarehousesController : ControllerBase
{
    private readonly IMediator _mediator;

    public WarehousesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetWarehouses()
    {
        var warehouses = await _mediator.Send(new GetWarehousesQuery());
        return Ok(warehouses);
    }

    [HttpPost]
    public async Task<IActionResult> CreateWarehouse([FromBody] CreateWarehouseCommand command)
    {
        var warehouseId = await _mediator.Send(command);
        return Ok(new { WarehouseId = warehouseId });
    }
}
