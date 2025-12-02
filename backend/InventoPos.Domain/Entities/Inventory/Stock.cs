using System.ComponentModel.DataAnnotations.Schema;

namespace InventoPos.Domain.Entities.Inventory;

public class Stock
{
    public int Id { get; set; }

    public int ProductId { get; set; }
    public Product? Product { get; set; }

    public int WarehouseId { get; set; }
    public Warehouse? Warehouse { get; set; }

    public int Quantity { get; set; }

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
