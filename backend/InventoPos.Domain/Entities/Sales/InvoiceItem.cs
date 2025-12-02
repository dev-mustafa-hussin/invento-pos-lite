using System.ComponentModel.DataAnnotations.Schema;
using InventoPos.Domain.Entities.Inventory;

namespace InventoPos.Domain.Entities.Sales;

public class InvoiceItem
{
    public Guid Id { get; set; }

    public Guid InvoiceId { get; set; }
    public Invoice? Invoice { get; set; }

    public int ProductId { get; set; }
    public Product? Product { get; set; }

    public string ProductName { get; set; } = string.Empty;

    public int Quantity { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal UnitPrice { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalPrice { get; set; }
}
