using InventoPos.Domain.Entities.Projects;
using MediatR;

namespace InventoPos.Application.Projects.Commands.CreateProject;

public record CreateProjectCommand : IRequest<int>
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int? CustomerId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public ProjectStatus Status { get; set; }
}
