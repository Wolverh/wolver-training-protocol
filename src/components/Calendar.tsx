'use client'

import { format, subDays, isSameDay, getDay } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { useEffect, useRef } from 'react'

const CAIRO_TZ = 'Africa/Cairo'

// Training split mapped to day-of-week (0=Sun, 1=Mon, ..., 6=Sat)
// Sat=Day1(Lower), Sun=Day2(Upper), Mon=REST, Tue=Day4(Lower), Wed=Day5(Upper), Thu=REST, Fri=REST
const TRAINING_SCHEDULE: Record<number, { label: string; isRest: boolean }> = {
  6: { label: 'Lower 1', isRest: false },   // Saturday
  0: { label: 'Upper 1', isRest: false },   // Sunday
  1: { label: 'Rest', isRest: true },       // Monday
  2: { label: 'Lower 2', isRest: false },   // Tuesday
  3: { label: 'Upper 2', isRest: false },   // Wednesday
  4: { label: 'Rest', isRest: true },       // Thursday
  5: { label: 'Rest', isRest: true },       // Friday
}

interface CalendarProps {
  selectedDate: string
  onDateSelect: (date: string) => void
  completedDaysMap?: Set<string>
}

export default function Calendar({ selectedDate, onDateSelect, completedDaysMap = new Set() }: CalendarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const todayCairo = toZonedTime(new Date(), CAIRO_TZ)
  // Show 21 days back to today (3 full weeks)
  const days = Array.from({ length: 22 }).map((_, i) => subDays(todayCairo, 21 - i))

  useEffect(() => {
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
        <div className="flex gap-3 items-center">
          <span className="flex items-center gap-1.5 text-xs text-text-tertiary">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Logged
          </span>
          <span className="flex items-center gap-1.5 text-xs text-text-tertiary">
            <span className="w-2 h-2 rounded-full bg-red-500/40 inline-block" /> Rest
          </span>
        </div>
      </div>
      
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto py-6 px-4 gap-2 snap-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {days.map((date) => {
          const dateStr = format(date, 'yyyy-MM-dd')
          const isSelected = selectedDate === dateStr
          const isToday = isSameDay(date, todayCairo)
          const isCompleted = completedDaysMap.has(dateStr)
          const dayOfWeek = getDay(date)
          const schedule = TRAINING_SCHEDULE[dayOfWeek]
          const isRest = schedule.isRest

          return (
            <button
              key={dateStr}
              onClick={() => !isRest && onDateSelect(dateStr)}
              disabled={isRest}
              className={`
                snap-center flex-shrink-0 flex flex-col items-center justify-center w-16 h-24 rounded-md border transition-all duration-300
                ${isRest 
                  ? 'border-border/30 bg-bg/20 opacity-35 cursor-not-allowed'
                  : isSelected 
                    ? 'border-gold-start bg-gold-start/10 shadow-[0_0_15px_rgba(191,149,63,0.15)]' 
                    : 'border-border bg-bg/50 hover:border-border-hover cursor-pointer'
                }
              `}
            >
              <span className={`text-[10px] font-mono mb-0.5 ${isSelected ? 'text-gold-mid' : 'text-text-tertiary'}`}>
                {format(date, 'EEE')}
              </span>
              <span className={`font-display text-xl font-bold ${isSelected ? 'text-text-primary' : isRest ? 'text-text-tertiary' : 'text-text-secondary'}`}>
                {format(date, 'd')}
              </span>
              <span className={`text-[9px] font-mono mt-0.5 uppercase tracking-wider ${isSelected ? 'text-gold-start' : isRest ? 'text-red-500/40' : 'text-text-tertiary'}`}>
                {schedule.label}
              </span>
              
              {/* Status Indicator */}
              <div className="mt-1 flex gap-1">
                {isCompleted && !isRest && (
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                )}
                {isToday && !isSelected && !isRest && (
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
