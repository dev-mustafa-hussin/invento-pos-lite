using System.ComponentModel.DataAnnotations;

namespace InventoPos.Domain.Entities.HR;

public class Employee
{
    public int Id { get; set; }

    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [MaxLength(100)]
    public string LastName { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(20)]
    public string? Phone { get; set; }

    [MaxLength(50)]
    public string JobTitle { get; set; } = string.Empty;

    public DateTime JoinDate { get; set; }

    public decimal BaseSalary { get; set; }

    public bool IsActive { get; set; } = true;

    public string FullName => $"{FirstName} {LastName}";
}
