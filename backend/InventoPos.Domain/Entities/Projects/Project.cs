using System.ComponentModel.DataAnnotations;
using InventoPos.Domain.Entities.Sales;

namespace InventoPos.Domain.Entities.Projects;

public class Project
{
    public int Id { get; set; }

    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int? CustomerId { get; set; }
    public Customer? Customer { get; set; }

    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }

    public ProjectStatus Status { get; set; } = ProjectStatus.NotStarted;

    public ICollection<ProjectTask> Tasks { get; set; } = new List<ProjectTask>();
}

public enum ProjectStatus
{
    NotStarted,
    InProgress,
    Completed,
    OnHold
}
