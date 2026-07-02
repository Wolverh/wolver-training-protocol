'use client'

import { format, subDays, addDays, isSameDay } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { useEffect, useRef } from 'react'

const CAIRO_TZ = 'Africa/Cairo'

interface CalendarProps {
  selectedDate: string // YYYY-MM-DD
  onDateSelect: (date: string) => void
  completedDaysMap?: Set<string> // Set of YYYY-MM-DD strings that have been completed
}

export default function Calendar({ selectedDate, onDateSelect, completedDaysMap = new Set() }: CalendarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Generate a window of dates: 14 days in the past to today
  const todayCairo = toZonedTime(new Date(), CAIRO_TZ)
  const days = Array.from({ length: 15 }).map((_, i) => subDays(todayCairo, 14 - i))

  useEffect(() => {
    // Scroll to the end (today) on mount
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth
    }
  }, [])

  return (
    <div className="w-full border border-border rounded-md bg-surface/50 overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-border flex justify-between items-center">
        <div>
          <h2 className="font-display text-lg font-bold text-text-primary">Temporal Log</h2>
          <p className="text-xs text-text-tertiary uppercase tracking-widest">Africa/Cairo Timeline</p>
        </div>
      </div>
      
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto py-6 px-4 gap-3 snap-x scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {days.map((date) => {
          const dateStr = format(date, 'yyyy-MM-dd')
          const isSelected = selectedDate === dateStr
          const isToday = isSameDay(date, todayCairo)
          const isCompleted = completedDaysMap.has(dateStr)

          return (
            <button
              key={dateStr}
              onClick={() => onDateSelect(dateStr)}
              className={`
                snap-center flex-shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-md border transition-all duration-300
                ${isSelected 
                  ? 'border-gold-start bg-gold-start/10 shadow-[0_0_15px_rgba(191,149,63,0.15)]' 
                  : 'border-border bg-bg/50 hover:border-border-hover'
                }
              `}
            >
              <span className={`text-xs font-mono mb-1 ${isSelected ? 'text-gold-mid' : 'text-text-tertiary'}`}>
                {format(date, 'EEE')}
              </span>
              <span className={`font-display text-xl font-bold ${isSelected ? 'text-text-primary' : 'text-text-secondary'}`}>
                {format(date, 'd')}
              </span>
              
              {/* Status Indicator */}
              <div className="mt-2 flex gap-1">
                {isCompleted && (
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                )}
                {isToday && !isSelected && (
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
