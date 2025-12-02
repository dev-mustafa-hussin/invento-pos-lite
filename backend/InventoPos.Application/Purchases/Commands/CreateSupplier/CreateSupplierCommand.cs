using MediatR;

namespace InventoPos.Application.Purchases.Commands.CreateSupplier
{
    public record CreateSupplierCommand(
        string Name,
        string? ContactPerson,
        string? Email,
        string? Phone,
        string? Address,
        string? TaxNumber
    ) : IRequest<int>;
}
