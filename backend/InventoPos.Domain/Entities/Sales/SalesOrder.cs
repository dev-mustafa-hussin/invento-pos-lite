using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventoPos.Domain.Entities.Sales;

public class SalesOrder
{
    public Guid Id { get; set; }

    public string OrderNumber { get; set; } = string.Empty;

    public int CustomerId { get; set; }
    public Customer? Customer { get; set; }

    public Guid? QuotationId { get; set; } // Optional link to source quotation

    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    public SalesStatus Status { get; set; } = SalesStatus.Draft;
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;

    [Column(TypeName = "decimal(18,2)")]
    public decimal SubTotal { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal TaxAmount { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalAmount { get; set; }

    public List<SalesOrderItem> Items { get; set; } = new();
}
