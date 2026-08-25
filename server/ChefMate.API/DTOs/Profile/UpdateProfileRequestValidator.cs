using FluentValidation;

namespace ChefMate.API.DTOs.Profile;

public class UpdateProfileRequestValidator : AbstractValidator<UpdateProfileRequest>
{
    public UpdateProfileRequestValidator()
    {
        RuleFor(x => x.DietaryPreference)
            .IsInEnum();

        RuleFor(x => x.CookingSkill)
            .IsInEnum();

        RuleFor(x => x.HouseholdSize)
            .GreaterThanOrEqualTo(1);

        RuleFor(x => x.Allergies)
            .NotNull();

        RuleForEach(x => x.Allergies)
            .NotEmpty()
            .MaximumLength(100);

        RuleFor(x => x.Cuisines)
            .NotNull();

        RuleForEach(x => x.Cuisines)
            .NotEmpty()
            .MaximumLength(100);
    }
}
