using FluentValidation;

namespace ChefMate.API.DTOs.Pantry;

public class ConfirmPantryScanRequestValidator : AbstractValidator<ConfirmPantryScanRequest>
{
    public ConfirmPantryScanRequestValidator()
    {
        RuleFor(request => request.Items)
            .NotEmpty()
            .WithMessage("At least one ingredient is required.");

        RuleForEach(request => request.Items).ChildRules(item =>
        {
            item.RuleFor(i => i.IngredientId)
                .GreaterThan(0);

            item.RuleFor(i => i.Quantity)
                .GreaterThan(0);

            item.RuleFor(i => i.Unit)
                .IsInEnum();
        });
    }
}
