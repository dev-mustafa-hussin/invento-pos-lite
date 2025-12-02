using MediatR;
using TaskStatus = InventoPos.Domain.Entities.Projects.TaskStatus;

namespace InventoPos.Application.Projects.Tasks.Commands.UpdateTaskStatus;

public record UpdateTaskStatusCommand(int TaskId, TaskStatus Status) : IRequest;
