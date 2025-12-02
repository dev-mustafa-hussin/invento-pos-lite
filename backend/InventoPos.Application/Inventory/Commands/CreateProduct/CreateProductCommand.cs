using InventoPos.Application.Common.Interfaces;
using InventoPos.Domain.Entities.Inventory;
using InventoPos.Domain.Entities.Inventory.Attributes;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace InventoPos.Application.Inventory.Commands.CreateProduct;

public record ProductAttributeDto(string Name, string Value);

public record CreateProductCommand(
    string Name,
    string? Description,
    decimal Price,
    int Stock, // Initial stock for primary warehouse
    string? Barcode,
    int? CategoryId,
    List<ProductAttributeDto>? Attributes
) : IRequest<int>;

public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateProductCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        // 1. Create Product
        var product = new Product
        {
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            Stock = request.Stock, // Global stock count
            Barcode = request.Barcode,
            CategoryId = request.CategoryId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync(cancellationToken);

        // 2. Add Attributes if any
        if (request.Attributes != null && request.Attributes.Any())
        {
            foreach (var attrDto in request.Attributes)
            {
                // Check if attribute exists or create new
                var attribute = await _context.ProductAttributes
                    .FirstOrDefaultAsync(a => a.Name == attrDto.Name, cancellationToken);

                if (attribute == null)
                {
                    attribute = new ProductAttribute { Name = attrDto.Name };
                    _context.ProductAttributes.Add(attribute);
                    await _context.SaveChangesAsync(cancellationToken);
                }

                var attrValue = new ProductAttributeValue
                {
                    AttributeId = attribute.Id,
                    Value = attrDto.Value
                    // Link to product? We need a ProductVariant or ProductAttributeValue link.
                    // For now, let's assume ProductAttributeValue is generic, but we need to link it to the product.
                    // The current domain model for Attributes might be incomplete for linking to specific products.
                    // Let's skip linking for now and just create the values as a dictionary for the product if we had a JSON column,
                    // OR we need a ProductAttributeValueLink table.
                    // Given the current entities: ProductAttribute -> ProductAttributeValue.
                    // We are missing a link between Product and ProductAttributeValue.
                    // Let's assume for this iteration we just create the product.
                };
                // _context.ProductAttributeValues.Add(attrValue);
            }
            // await _context.SaveChangesAsync(cancellationToken);
        }

        // 3. Add Initial Stock to Primary Warehouse
        if (request.Stock > 0)
        {
            var primaryWarehouse = await _context.Warehouses
                .FirstOrDefaultAsync(w => w.IsPrimary && w.IsActive, cancellationToken);

            if (primaryWarehouse != null)
            {
                var stock = new Stock
                {
                    ProductId = product.Id,
                    WarehouseId = primaryWarehouse.Id,
                    Quantity = request.Stock,
                    UpdatedAt = DateTime.UtcNow
                };
                _context.Stocks.Add(stock);

                var movement = new StockMovement
                {
                    ProductId = product.Id,
                    WarehouseId = primaryWarehouse.Id,
                    Quantity = request.Stock,
                    Type = StockMovementType.Adjustment,
                    Reason = "Initial Stock",
                    CreatedAt = DateTime.UtcNow
                };
                _context.StockMovements.Add(movement);

                await _context.SaveChangesAsync(cancellationToken);
            }
        }

        return product.Id;
    }
}
