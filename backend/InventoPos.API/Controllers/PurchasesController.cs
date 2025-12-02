using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InventoPos.Application.Purchases.Commands.CreatePurchaseOrder;
using InventoPos.Application.Purchases.Commands.CreateSupplier;
using InventoPos.Application.Purchases.Queries.GetPurchaseOrders;
using InventoPos.Application.Purchases.Queries.GetSuppliers;
using InventoPos.Application.Purchases.Commands.ReceivePurchaseOrder;

namespace InventoPos.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PurchasesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public PurchasesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("suppliers")]
        public async Task<ActionResult<List<SupplierDto>>> GetSuppliers()
        {
            return await _mediator.Send(new GetSuppliersQuery());
        }

        [HttpPost("suppliers")]
        public async Task<ActionResult<int>> CreateSupplier(CreateSupplierCommand command)
        {
            return await _mediator.Send(command);
        }

        [HttpGet("orders")]
        public async Task<ActionResult<List<PurchaseOrderDto>>> GetPurchaseOrders()
        {
            return await _mediator.Send(new GetPurchaseOrdersQuery());
        }

        [HttpPost("orders")]
        public async Task<ActionResult<int>> CreatePurchaseOrder(CreatePurchaseOrderCommand command)
        {
            return await _mediator.Send(command);
        }

        [HttpPost("orders/{id}/receive")]
        public async Task<IActionResult> ReceivePurchaseOrder(int id, [FromBody] ReceivePurchaseOrderCommand command)
        {
            if (id != command.OrderId)
            {
                return BadRequest();
            }
            await _mediator.Send(command);
            return NoContent();
        }
    }
}
