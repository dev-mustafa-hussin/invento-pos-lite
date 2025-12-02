using InventoPos.Application.Common.Interfaces;
using InventoPos.Domain.Entities.Inventory;
using InventoPos.Domain.Entities.Sales;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace InventoPos.Application.Sales.Commands.CreateInvoice;

public record InvoiceItemDto(int ProductId, int Quantity);

public record CreateInvoiceCommand(
    int CustomerId,
    int WarehouseId, // Required to know where to deduct stock from
    List<InvoiceItemDto> Items
) : IRequest<Guid>;

public class CreateInvoiceCommandHandler : IRequestHandler<CreateInvoiceCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateInvoiceCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateInvoiceCommand request, CancellationToken cancellationToken)
    {
        // 1. Validate Customer
        var customer = await _context.Customers.FindAsync(new object[] { request.CustomerId }, cancellationToken);
        if (customer == null) throw new Exception("Customer not found");

        // 2. Prepare Invoice
        var invoice = new Invoice
        {
            Id = Guid.NewGuid(),
            InvoiceNumber = $"INV-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 4).ToUpper()}", // Simple generation
            CustomerId = request.CustomerId,
            InvoiceDate = DateTime.UtcNow,
            PaymentStatus = PaymentStatus.Pending
        };

        decimal subTotal = 0;
        decimal taxAmount = 0; // Assuming 0 tax for now or flat rate? Let's keep it 0 or simple 15% later.

        // 3. Process Items & Deduct Stock
        foreach (var itemDto in request.Items)
        {
            var product = await _context.Products.FindAsync(new object[] { itemDto.ProductId }, cancellationToken);
            if (product == null) throw new Exception($"Product {itemDto.ProductId} not found");

            // Check Stock
            var stock = await _context.Stocks
                .FirstOrDefaultAsync(s => s.ProductId == itemDto.ProductId && s.WarehouseId == request.WarehouseId, cancellationToken);

            if (stock == null || stock.Quantity < itemDto.Quantity)
            {
                throw new Exception($"Insufficient stock for product '{product.Name}' in the selected warehouse.");
            }

            // Deduct Stock
            stock.Quantity -= itemDto.Quantity;
            stock.UpdatedAt = DateTime.UtcNow;

            // Record Movement
            var movement = new StockMovement
            {
                ProductId = itemDto.ProductId,
                WarehouseId = request.WarehouseId,
                Quantity = -itemDto.Quantity, // Negative for Out
                Type = StockMovementType.Out,
                Reason = $"Invoice {invoice.InvoiceNumber}",
                ReferenceId = invoice.Id.ToString(),
                CreatedAt = DateTime.UtcNow
            };
            _context.StockMovements.Add(movement);

            // Create Invoice Item
            var invoiceItem = new InvoiceItem
            {
                Id = Guid.NewGuid(),
                InvoiceId = invoice.Id,
                ProductId = product.Id,
                ProductName = product.Name,
                Quantity = itemDto.Quantity,
                UnitPrice = product.Price,
                TotalPrice = product.Price * itemDto.Quantity
            };
            invoice.Items.Add(invoiceItem);

            subTotal += invoiceItem.TotalPrice;
        }

        invoice.SubTotal = subTotal;
        invoice.TaxAmount = subTotal * 0.15m; // Example 15% Tax
        invoice.TotalAmount = invoice.SubTotal + invoice.TaxAmount;

        _context.Invoices.Add(invoice);
        await _context.SaveChangesAsync(cancellationToken);

        return invoice.Id;
    }
}
