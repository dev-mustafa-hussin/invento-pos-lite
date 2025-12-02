using InventoPos.Application.Common.Interfaces;
using InventoPos.Domain.Entities.Projects;
using MediatR;

namespace InventoPos.Application.Projects.Tasks.Commands.CreateTask;

public class CreateTaskCommandHandler : IRequestHandler<CreateTaskCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateTaskCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateTaskCommand request, CancellationToken cancellationToken)
    {
        var task = new ProjectTask
        {
            ProjectId = request.ProjectId,
            Title = request.Title,
            Description = request.Description,
            AssignedEmployeeId = request.AssignedEmployeeId,
            DueDate = request.DueDate,
            Status = Domain.Entities.Projects.TaskStatus.Todo
        };

        _context.ProjectTasks.Add(task);
        await _context.SaveChangesAsync(cancellationToken);

        return task.Id;
    }
}
