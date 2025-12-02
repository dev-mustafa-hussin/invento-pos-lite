using System.ComponentModel.DataAnnotations;
using InventoPos.Domain.Entities.HR;

namespace InventoPos.Domain.Entities.Projects;

public class ProjectTask
{
    public int Id { get; set; }

    public int ProjectId { get; set; }
    public Project Project { get; set; } = null!;

    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public TaskStatus Status { get; set; } = TaskStatus.Todo;

    public int? AssignedEmployeeId { get; set; }
    public Employee? AssignedEmployee { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? DueDate { get; set; }
}

public enum TaskStatus
{
    Todo,
    InProgress,
    Review,
    Done
}
