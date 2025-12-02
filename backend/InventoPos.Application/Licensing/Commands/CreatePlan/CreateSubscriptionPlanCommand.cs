using InventoPos.Application.Common.Interfaces;
using InventoPos.Domain.Entities.Licensing;
using MediatR;

namespace InventoPos.Application.Licensing.Commands.CreatePlan;

public record CreateSubscriptionPlanCommand(
    string Name,
    decimal PriceMonthly,
    decimal PriceYearly,
    int MaxUsers,
    int MaxBranches,
    int MaxInvoicesPerMonth,
    bool AllowApiAccess
) : IRequest<int>;

public class CreateSubscriptionPlanCommandHandler : IRequestHandler<CreateSubscriptionPlanCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateSubscriptionPlanCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateSubscriptionPlanCommand request, CancellationToken cancellationToken)
    {
        var plan = new SubscriptionPlan
        {
            Name = request.Name,
            PriceMonthly = request.PriceMonthly,
            PriceYearly = request.PriceYearly,
            MaxUsers = request.MaxUsers,
            MaxBranches = request.MaxBranches,
            MaxInvoicesPerMonth = request.MaxInvoicesPerMonth,
            AllowApiAccess = request.AllowApiAccess,
            IsActive = true
        };

        _context.SubscriptionPlans.Add(plan);
        await _context.SaveChangesAsync(cancellationToken);

        return plan.Id;
    }
}
