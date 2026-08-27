using FluentValidation;

namespace ChefMate.API.DTOs.Pantry;

public abstract class PantryItemRequestValidator<T> : AbstractValidator<T>
    where T : PantryItemRequest
{
    protected PantryItemRequestValidator()
    {
        RuleFor(x => x.Name)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .Must(name => name.Trim().Length > 0)
            .WithMessage("Name is required.")
            .MaximumLength(100);

        RuleFor(x => x.Quantity)
            .GreaterThanOrEqualTo(0)
            .LessThanOrEqualTo(99_999_999.99m)
            .Must(quantity => decimal.Round(quantity, 2) == quantity)
            .WithMessage("Quantity can have at most 2 decimal places.");

        RuleFor(x => x.Unit)
            .IsInEnum();

        RuleFor(x => x.CategoryName)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .Must(name => name.Trim().Length > 0)
            .WithMessage("Category is required.")
            .MaximumLength(100);

        RuleFor(x => x.ExpiryDate)
            .Must(date => date is null || date.Value <= DateOnly.FromDateTime(DateTime.UtcNow).AddYears(10))
            .WithMessage("Expiry date cannot be more than 10 years in the future.");
    }
}

public class CreatePantryItemRequestValidator : PantryItemRequestValidator<CreatePantryItemRequest>;

public class UpdatePantryItemRequestValidator : PantryItemRequestValidator<UpdatePantryItemRequest>;
