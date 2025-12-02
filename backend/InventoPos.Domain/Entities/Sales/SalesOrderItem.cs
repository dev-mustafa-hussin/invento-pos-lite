using System.ComponentModel.DataAnnotations.Schema;
using InventoPos.Domain.Entities.Inventory;

namespace InventoPos.Domain.Entities.Sales;

public class SalesOrderItem
{
    public Guid Id { get; set; }

    public Guid SalesOrderId { get; set; }
    public SalesOrder? SalesOrder { get; set; }

    public int ProductId { get; set; }
    public Product? Product { get; set; }

    public string ProductName { get; set; } = string.Empty;

    public int Quantity { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal UnitPrice { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalPrice { get; set; }
}
