'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface CheckboxProps {
  id?: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  className?: string
}

export function Checkbox({ 
  id, 
  checked = false, 
  onCheckedChange,
  className 
}: CheckboxProps) {
  return (
    <div 
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "relative w-6 h-6 rounded border-2 cursor-pointer shadow-md",
        "bg-white/40 hover:bg-white/50 transition-colors",
        checked ? "border-miami-coral bg-miami-coral" : "border-miami-coral-dark/50",
        className
      )}
    >
      {checked && (
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          className="absolute inset-0 w-full h-full p-1 text-white"
        >
          <path 
            d="M20 6L9 17L4 12" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  )
}
