using InventoPos.Domain.Entities.Projects;
using MediatR;

namespace InventoPos.Application.Projects.Tasks.Commands.CreateTask;

public record CreateTaskCommand : IRequest<int>
{
    public int ProjectId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int? AssignedEmployeeId { get; set; }
    public DateTime? DueDate { get; set; }
}
