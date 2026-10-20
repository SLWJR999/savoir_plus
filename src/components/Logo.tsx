import Image from 'next/image'

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      {/* On utilise l'image de ton logo */}
      <Image 
        src="/mon-logo.png" 
        alt="Logo Savoir +" 
        width={36} 
        height={36} 
        className="h-9 w-9 object-contain" 
      />
      <span className={`font-display text-xl font-extrabold tracking-tight ${light ? 'text-white' : 'text-ink'}`}>
        Savoir +
      </span>
    </span>
  )
}