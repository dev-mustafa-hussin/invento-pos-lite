using InventoPos.Application.Common.Interfaces;
using InventoPos.Domain.Entities.Sales;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace InventoPos.Application.Sales.Queries.GetInvoices;

public record GetInvoicesQuery(int Page = 1, int PageSize = 10) : IRequest<List<Invoice>>;

public class GetInvoicesQueryHandler : IRequestHandler<GetInvoicesQuery, List<Invoice>>
{
    private readonly IApplicationDbContext _context;

    public GetInvoicesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Invoice>> Handle(GetInvoicesQuery request, CancellationToken cancellationToken)
    {
        return await _context.Invoices
            .Include(i => i.Customer)
            .OrderByDescending(i => i.InvoiceDate)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);
    }
}
