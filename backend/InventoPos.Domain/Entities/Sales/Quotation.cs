using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventoPos.Domain.Entities.Sales;

public class Quotation
{
    public Guid Id { get; set; }

    public string QuotationNumber { get; set; } = string.Empty; // Auto-generated

    public int CustomerId { get; set; }
    public Customer? Customer { get; set; }

    public DateTime QuotationDate { get; set; } = DateTime.UtcNow;
    public DateTime? ExpiryDate { get; set; }

    public SalesStatus Status { get; set; } = SalesStatus.Draft;

    [Column(TypeName = "decimal(18,2)")]
    public decimal SubTotal { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal TaxAmount { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalAmount { get; set; }

    public string? Notes { get; set; }

    public List<QuotationItem> Items { get; set; } = new();
}
