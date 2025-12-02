using InventoPos.Application.Common.Interfaces;
using MediatR;

namespace InventoPos.Application.Projects.Tasks.Commands.UpdateTaskStatus;

public class UpdateTaskStatusCommandHandler : IRequestHandler<UpdateTaskStatusCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateTaskStatusCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateTaskStatusCommand request, CancellationToken cancellationToken)
    {
        var task = await _context.ProjectTasks.FindAsync(new object[] { request.TaskId }, cancellationToken);

        if (task == null)
        {
            throw new Exception("Task not found");
        }

        task.Status = request.Status;
        await _context.SaveChangesAsync(cancellationToken);
    }
}
