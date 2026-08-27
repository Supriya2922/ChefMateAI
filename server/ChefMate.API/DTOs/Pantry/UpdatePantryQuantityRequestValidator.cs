using FluentValidation;

namespace ChefMate.API.DTOs.Pantry;

public class UpdatePantryQuantityRequestValidator : AbstractValidator<UpdatePantryQuantityRequest>
{
    public UpdatePantryQuantityRequestValidator()
    {
        RuleFor(x => x.Quantity)
            .GreaterThanOrEqualTo(0)
            .LessThanOrEqualTo(99_999_999.99m)
            .Must(quantity => decimal.Round(quantity, 2) == quantity)
            .WithMessage("Quantity can have at most 2 decimal places.");
    }
}
