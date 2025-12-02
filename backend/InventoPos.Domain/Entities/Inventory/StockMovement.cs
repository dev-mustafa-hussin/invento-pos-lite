using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventoPos.Domain.Entities.Inventory;

public enum StockMovementType
{
    In,
    Out,
    Transfer,
    Adjustment
}

public class StockMovement
{
    public Guid Id { get; set; }

    public int ProductId { get; set; }
    public Product? Product { get; set; }

    public int WarehouseId { get; set; }
    public Warehouse? Warehouse { get; set; }

    public int Quantity { get; set; } // Positive for In, Negative for Out
    public StockMovementType Type { get; set; }

    [MaxLength(500)]
    public string? Reason { get; set; }

    public string? ReferenceId { get; set; } // e.g., Invoice ID, Order ID

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string? CreatedByUserId { get; set; }
}
