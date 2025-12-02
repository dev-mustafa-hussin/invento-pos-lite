using System;
using System.Collections.Generic;

namespace InventoPos.Domain.Entities.Purchases
{
    public enum PurchaseOrderStatus
    {
        Pending,
        Received,
        Cancelled
    }

    public class PurchaseOrder
    {
        public int Id { get; set; }
        public int SupplierId { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public PurchaseOrderStatus Status { get; set; } = PurchaseOrderStatus.Pending;
        public decimal TotalAmount { get; set; }
        public string? Notes { get; set; }

        // Navigation properties
        public Supplier? Supplier { get; set; }
        public ICollection<PurchaseOrderItem> Items { get; set; } = new List<PurchaseOrderItem>();
    }
}
