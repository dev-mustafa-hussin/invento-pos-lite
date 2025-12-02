using MediatR;

namespace InventoPos.Application.Purchases.Commands.CreatePurchaseOrder
{
    public record CreatePurchaseOrderCommand(
        int SupplierId,
        DateTime OrderDate,
        string? Notes,
        List<CreatePurchaseOrderItemDto> Items
    ) : IRequest<int>;

    public record CreatePurchaseOrderItemDto(
        int ProductId,
        int Quantity,
        decimal UnitPrice
    );
}
