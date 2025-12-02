using InventoPos.Application.Common.Interfaces;
using InventoPos.Domain.Entities.Purchases;
using MediatR;

namespace InventoPos.Application.Purchases.Commands.CreateSupplier
{
    public class CreateSupplierCommandHandler : IRequestHandler<CreateSupplierCommand, int>
    {
        private readonly IApplicationDbContext _context;

        public CreateSupplierCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle(CreateSupplierCommand request, CancellationToken cancellationToken)
        {
            var entity = new Supplier
            {
                Name = request.Name,
                ContactPerson = request.ContactPerson,
                Email = request.Email,
                Phone = request.Phone,
                Address = request.Address,
                TaxNumber = request.TaxNumber
            };

            _context.Suppliers.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);

            return entity.Id;
        }
    }
}
