import Image from 'next/image'

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      {/* 
        - On force la taille avec h-12 w-12 (48px).
        - On ajoute "rounded-xl bg-white" pour que le fond blanc de ton image 
          soit bien délimité et fasse un joli badge carré.
      */}
      <span className="flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1 shadow-sm">
        <Image 
          src="/mon-logo.png" 
          alt="Logo Savoir +" 
          width={64} 
          height={64} 
          className="h-12 w-12 object-contain" 
        />
      </span>
      
      <span className={`font-display text-2xl font-extrabold tracking-tight ${light ? 'text-white' : 'text-ink'}`}>
        Savoir +
      </span>
    </span>
  )
}