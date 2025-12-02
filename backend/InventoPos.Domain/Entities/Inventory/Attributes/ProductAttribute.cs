using System.ComponentModel.DataAnnotations;

namespace InventoPos.Domain.Entities.Inventory.Attributes;

public class ProductAttribute
{
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty; // e.g., Color, Size

    public List<ProductAttributeValue> Values { get; set; } = new();
}
