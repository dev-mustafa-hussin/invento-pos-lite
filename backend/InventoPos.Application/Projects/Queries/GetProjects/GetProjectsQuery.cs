using InventoPos.Domain.Entities.Projects;
using MediatR;

namespace InventoPos.Application.Projects.Queries.GetProjects;

public record GetProjectsQuery : IRequest<List<ProjectDto>>;

public class ProjectDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int? CustomerId { get; set; }
    public string? CustomerName { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public ProjectStatus Status { get; set; }
    public int TaskCount { get; set; }
    public int CompletedTaskCount { get; set; }
    public List<ProjectTaskDto> Tasks { get; set; } = new();
}

public class ProjectTaskDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Domain.Entities.Projects.TaskStatus Status { get; set; }
    public int? AssignedEmployeeId { get; set; }
    public string? AssignedEmployeeName { get; set; }
    public DateTime? DueDate { get; set; }
}
