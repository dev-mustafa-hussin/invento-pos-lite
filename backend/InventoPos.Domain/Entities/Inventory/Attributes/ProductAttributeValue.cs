using System.ComponentModel.DataAnnotations;

namespace InventoPos.Domain.Entities.Inventory.Attributes;

public class ProductAttributeValue
{
    public int Id { get; set; }

    public int AttributeId { get; set; }
    public ProductAttribute? Attribute { get; set; }

    [Required]
    [MaxLength(50)]
    public string Value { get; set; } = string.Empty; // e.g., Red, XL
}
