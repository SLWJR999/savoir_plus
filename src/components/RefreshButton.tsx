'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

export default function RefreshButton() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => {
        startTransition(() => {
          router.refresh()
        })
      }}
      disabled={isPending}
      className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-brand shadow-sm ring-1 ring-sand hover:bg-paper disabled:opacity-50"
    >
      <svg 
        className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} 
        fill="none" viewBox="0 0 24 24" stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      {isPending ? 'Actualisation...' : 'Actualiser'}
    </button>
  )
}