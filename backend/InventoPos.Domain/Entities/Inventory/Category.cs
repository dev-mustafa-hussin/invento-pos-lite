using System.ComponentModel.DataAnnotations;

namespace InventoPos.Domain.Entities.Inventory;

public class Category
{
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;

    public List<Product> Products { get; set; } = new();
}
