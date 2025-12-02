namespace InventoPos.Domain.Entities.Sales;

public enum SalesStatus
{
    Draft,
    Sent,
    Accepted,
    Rejected,
    Cancelled
}

public enum PaymentStatus
{
    Pending,
    Partial,
    Paid,
    Overdue
}
