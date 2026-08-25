import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { getAllergies, getCuisines, updateProfile } from '../api/profile'
import { ApiError } from '../api/http'
import type {
  CatalogItem,
  CookingSkill,
  DietaryPreference,
  Profile,
} from '../api/types'
import { FormError } from './AuthLayout'

const DIETS: { value: DietaryPreference; label: string }[] = [
  { value: 'Vegetarian', label: 'Vegetarian' },
  { value: 'NonVegetarian', label: 'Non-vegetarian' },
  { value: 'Vegan', label: 'Vegan' },
]

const SKILLS: CookingSkill[] = ['Beginner', 'Intermediate', 'Advanced']

type ProfileFormProps = {
  profile: Profile
  onSaved: (profile: Profile) => Promise<void> | void
}

export function ProfileForm({ profile, onSaved }: ProfileFormProps) {
  const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference>(
    profile.dietaryPreference ?? 'Vegetarian',
  )
  const [cookingSkill, setCookingSkill] = useState<CookingSkill>(
    profile.cookingSkill ?? 'Beginner',
  )
  const [householdSize, setHouseholdSize] = useState(
    String(profile.householdSize ?? 1),
  )
  const [allergies, setAllergies] = useState<string[]>(profile.allergies)
  const [cuisines, setCuisines] = useState<string[]>(profile.cuisines)
  const [allergyDraft, setAllergyDraft] = useState('')
  const [cuisineDraft, setCuisineDraft] = useState('')
  const [catalogAllergies, setCatalogAllergies] = useState<CatalogItem[]>([])
  const [catalogCuisines, setCatalogCuisines] = useState<CatalogItem[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [saved, setSaved] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setDietaryPreference(profile.dietaryPreference ?? 'Vegetarian')
    setCookingSkill(profile.cookingSkill ?? 'Beginner')
    setHouseholdSize(String(profile.householdSize ?? 1))
    setAllergies(profile.allergies)
    setCuisines(profile.cuisines)
  }, [profile])

  useEffect(() => {
    let cancelled = false
    async function loadCatalogs() {
      try {
        const [nextAllergies, nextCuisines] = await Promise.all([
          getAllergies(),
          getCuisines(),
        ])
        if (!cancelled) {
          setCatalogAllergies(nextAllergies)
          setCatalogCuisines(nextCuisines)
        }
      } catch {
        if (!cancelled) {
          setCatalogAllergies([])
          setCatalogCuisines([])
        }
      }
    }
    void loadCatalogs()
    return () => {
      cancelled = true
    }
  }, [])

  const allergySuggestions = useMemo(() => {
    const selected = new Set(allergies.map((item) => item.toLowerCase()))
    return catalogAllergies.filter((item) => !selected.has(item.name.toLowerCase()))
  }, [allergies, catalogAllergies])

  function addAllergy(name: string) {
    const trimmed = name.trim()
    if (!trimmed) {
      return
    }
    setAllergies((current) => {
      if (current.some((item) => item.toLowerCase() === trimmed.toLowerCase())) {
        return current
      }
      return [...current, trimmed]
    })
    setAllergyDraft('')
  }

  function toggleCuisine(name: string) {
    setCuisines((current) =>
      current.some((item) => item.toLowerCase() === name.toLowerCase())
        ? current.filter((item) => item.toLowerCase() !== name.toLowerCase())
        : [...current, name],
    )
  }

  function addCuisine(name: string) {
    const trimmed = name.trim()
    if (!trimmed) {
      return
    }
    setCuisines((current) => {
      if (current.some((item) => item.toLowerCase() === trimmed.toLowerCase())) {
        return current
      }
      return [...current, trimmed]
    })
    setCuisineDraft('')
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrors([])
    setSaved(false)

    const size = Number(householdSize)
    if (!Number.isInteger(size) || size < 1) {
      setErrors(['Household size must be at least 1.'])
      return
    }

    setSubmitting(true)
    try {
      const next = await updateProfile({
        dietaryPreference,
        cookingSkill,
        householdSize: size,
        allergies,
        cuisines,
      })
      await onSaved(next)
      setSaved(true)
    } catch (error) {
      setErrors(error instanceof ApiError ? error.errors : ['Unable to save preferences.'])
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="profile-form" onSubmit={onSubmit}>
      <FormError messages={errors} />
      {saved ? (
        <p className="form-success" role="status">
          Preferences saved.
        </p>
      ) : null}

      <section className="profile-form__identity">
        <p className="profile-form__name">{profile.displayName}</p>
        <p>{profile.email}</p>
        {profile.phoneNumber ? <p>{profile.phoneNumber}</p> : null}
      </section>

      <fieldset className="profile-form__fieldset">
        <legend>Dietary preference</legend>
        <div className="profile-form__radios">
          {DIETS.map((diet) => (
            <label key={diet.value} className="radio">
              <input
                type="radio"
                name="dietaryPreference"
                value={diet.value}
                checked={dietaryPreference === diet.value}
                onChange={() => setDietaryPreference(diet.value)}
              />
              <span>{diet.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="profile-form__fieldset">
        <legend>Allergies</legend>
        <div className="chip-row">
          {allergies.map((item) => (
            <button
              key={item}
              type="button"
              className="chip chip--removable"
              onClick={() =>
                setAllergies((current) => current.filter((name) => name !== item))
              }
            >
              {item} <span aria-hidden="true">×</span>
            </button>
          ))}
        </div>
        <div className="profile-form__add">
          <input
            className="field__input"
            value={allergyDraft}
            onChange={(event) => setAllergyDraft(event.target.value)}
            placeholder="Add allergy"
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                addAllergy(allergyDraft)
              }
            }}
          />
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => addAllergy(allergyDraft)}
          >
            Add
          </button>
        </div>
        {allergySuggestions.length > 0 ? (
          <div className="chip-row chip-row--suggestions">
            {allergySuggestions.map((item) => (
              <button
                key={item.id}
                type="button"
                className="chip chip--outline"
                onClick={() => addAllergy(item.name)}
              >
                {item.name}
              </button>
            ))}
          </div>
        ) : null}
      </fieldset>

      <fieldset className="profile-form__fieldset">
        <legend>Preferred cuisines</legend>
        <div className="chip-row">
          {catalogCuisines.map((item) => {
            const selected = cuisines.some(
              (name) => name.toLowerCase() === item.name.toLowerCase(),
            )
            return (
              <button
                key={item.id}
                type="button"
                className={selected ? 'chip chip--selected' : 'chip chip--outline'}
                onClick={() => toggleCuisine(item.name)}
                aria-pressed={selected}
              >
                {item.name}
              </button>
            )
          })}
          {cuisines
            .filter(
              (name) =>
                !catalogCuisines.some(
                  (item) => item.name.toLowerCase() === name.toLowerCase(),
                ),
            )
            .map((name) => (
              <button
                key={name}
                type="button"
                className="chip chip--selected"
                onClick={() => toggleCuisine(name)}
                aria-pressed
              >
                {name}
              </button>
            ))}
        </div>
        <div className="profile-form__add">
          <input
            className="field__input"
            value={cuisineDraft}
            onChange={(event) => setCuisineDraft(event.target.value)}
            placeholder="Add cuisine"
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                addCuisine(cuisineDraft)
              }
            }}
          />
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => addCuisine(cuisineDraft)}
          >
            Add
          </button>
        </div>
      </fieldset>

      <label className="field" htmlFor="cookingSkill">
        <span className="field__label">Cooking skill</span>
        <select
          id="cookingSkill"
          className="field__input"
          value={cookingSkill}
          onChange={(event) => setCookingSkill(event.target.value as CookingSkill)}
        >
          {SKILLS.map((skill) => (
            <option key={skill} value={skill}>
              {skill}
            </option>
          ))}
        </select>
      </label>

      <label className="field" htmlFor="householdSize">
        <span className="field__label">Household size</span>
        <input
          id="householdSize"
          className="field__input"
          type="number"
          min={1}
          value={householdSize}
          onChange={(event) => setHouseholdSize(event.target.value)}
          required
        />
      </label>

      <button className="btn btn--primary" type="submit" disabled={submitting}>
        {submitting ? 'Saving…' : 'Save preferences'}
      </button>
    </form>
  )
}
