using MediatR;

namespace InventoPos.Application.Inventory.Commands.TransferStock;

public record TransferStockCommand(
    int ProductId,
    int FromWarehouseId,
    int ToWarehouseId,
    int Quantity,
    string? Reason
) : IRequest<bool>;
