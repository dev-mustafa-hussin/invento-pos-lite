using InventoPos.Application.Reports.Queries.GetLowStockReport;
using InventoPos.Application.Reports.Queries.GetSalesReport;
using InventoPos.Application.Reports.Queries.GetTopSellingProducts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InventoPos.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ReportsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("sales")]
    public async Task<ActionResult<List<SalesReportDto>>> GetSalesReport([FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
    {
        return await _mediator.Send(new GetSalesReportQuery(fromDate, toDate));
    }

    [HttpGet("top-products")]
    public async Task<ActionResult<List<TopProductDto>>> GetTopProducts([FromQuery] int count = 5)
    {
        return await _mediator.Send(new GetTopSellingProductsQuery(count));
    }

    [HttpGet("low-stock")]
    public async Task<ActionResult<List<LowStockProductDto>>> GetLowStock()
    {
        return await _mediator.Send(new GetLowStockReportQuery());
    }
}
