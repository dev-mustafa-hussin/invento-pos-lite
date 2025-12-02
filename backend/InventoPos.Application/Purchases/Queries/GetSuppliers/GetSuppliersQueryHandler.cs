using InventoPos.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace InventoPos.Application.Purchases.Queries.GetSuppliers
{
    public class GetSuppliersQueryHandler : IRequestHandler<GetSuppliersQuery, List<SupplierDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetSuppliersQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<SupplierDto>> Handle(GetSuppliersQuery request, CancellationToken cancellationToken)
        {
            return await _context.Suppliers
                .Select(s => new SupplierDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    ContactPerson = s.ContactPerson,
                    Email = s.Email,
                    Phone = s.Phone,
                    Address = s.Address,
                    TaxNumber = s.TaxNumber
                })
                .ToListAsync(cancellationToken);
        }
    }
}
