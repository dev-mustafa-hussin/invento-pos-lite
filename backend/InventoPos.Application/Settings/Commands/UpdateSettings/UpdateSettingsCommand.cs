using MediatR;

namespace InventoPos.Application.Settings.Commands.UpdateSettings;

public record UpdateSettingsCommand(Dictionary<string, string> Settings) : IRequest;
