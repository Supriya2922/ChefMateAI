type ImagePreviewProps = {
  src: string
  alt: string
}

export function ImagePreview({ src, alt }: ImagePreviewProps) {
  return (
    <div className="pantry-scan__preview">
      <img className="pantry-scan__image" src={src} alt={alt} />
    </div>
  )
}
