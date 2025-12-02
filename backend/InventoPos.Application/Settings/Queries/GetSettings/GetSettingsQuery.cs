using MediatR;

namespace InventoPos.Application.Settings.Queries.GetSettings;

public record GetSettingsQuery : IRequest<Dictionary<string, string>>;
