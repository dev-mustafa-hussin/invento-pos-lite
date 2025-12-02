using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using InventoPos.Domain.Entities.Inventory;

namespace InventoPos.Domain.Entities.Sales;

public class QuotationItem
{
    public Guid Id { get; set; }

    public Guid QuotationId { get; set; }
    public Quotation? Quotation { get; set; }

    public int ProductId { get; set; }
    public Product? Product { get; set; }

    public string ProductName { get; set; } = string.Empty; // Snapshot

    public int Quantity { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal UnitPrice { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalPrice { get; set; }
}
