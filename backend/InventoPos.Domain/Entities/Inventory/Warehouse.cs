using System.ComponentModel.DataAnnotations;

namespace InventoPos.Domain.Entities.Inventory;

public class Warehouse
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? Location { get; set; }

    public bool IsPrimary { get; set; }
    public bool IsActive { get; set; } = true;
}
