import { brand, loader } from '../content/siteCopy'

export function ScreenLoader() {
  return (
    <div className="screen-loader">
      <p className="screen-loader__mark">{brand.name}</p>
      <p className="screen-loader__hint">{loader.hint}</p>
    </div>
  )
}
