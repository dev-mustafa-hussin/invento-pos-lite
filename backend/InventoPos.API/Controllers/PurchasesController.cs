using InventoPos.Application.Purchases.Commands.CreatePurchaseOrder;
using InventoPos.Application.Purchases.Commands.CreateSupplier;
using InventoPos.Application.Purchases.Queries.GetPurchaseOrders;
using InventoPos.Application.Purchases.Queries.GetSuppliers;
using Microsoft.AspNetCore.Mvc;

namespace InventoPos.API.Controllers
{
    public class PurchasesController : ApiControllerBase
    {
        [HttpGet("suppliers")]
        public async Task<ActionResult<List<SupplierDto>>> GetSuppliers()
        {
            return await Mediator.Send(new GetSuppliersQuery());
        }

        [HttpPost("suppliers")]
        public async Task<ActionResult<int>> CreateSupplier(CreateSupplierCommand command)
        {
            return await Mediator.Send(command);
        }

        [HttpGet("orders")]
        public async Task<ActionResult<List<PurchaseOrderDto>>> GetPurchaseOrders()
        {
            return await Mediator.Send(new GetPurchaseOrdersQuery());
        }

        [HttpPost("orders")]
        public async Task<ActionResult<int>> CreatePurchaseOrder(CreatePurchaseOrderCommand command)
        {
            return await Mediator.Send(command);
        }
    }
}
