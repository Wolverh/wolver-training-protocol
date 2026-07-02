'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { format, subDays } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { Download } from 'lucide-react'

const CAIRO_TZ = 'Africa/Cairo'

interface DataPoint {
  date: string
  displayDate: string
  xp: number
}

interface AnalyticsDashboardProps {
  userId: string | undefined
}

export default function AnalyticsDashboard({ userId }: AnalyticsDashboardProps) {
  const [data, setData] = useState<DataPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    async function fetchAnalytics() {
      setLoading(true)
      const todayCairo = toZonedTime(new Date(), CAIRO_TZ)
      
      // Generate last 14 days
      const days = Array.from({ length: 14 }).map((_, i) => subDays(todayCairo, 13 - i))
      const dateStrings = days.map(d => format(d, 'yyyy-MM-dd'))

      const { data: completions } = await supabase
        .from('exercise_completions')
        .select('completed_date, xp_earned')
        .eq('user_id', userId)
        .in('completed_date', dateStrings)
        
      const { data: dayCompletions } = await supabase
        .from('day_completions')
        .select('completed_date, bonus_xp')
        .eq('user_id', userId)
        .in('completed_date', dateStrings)

      const map = new Map<string, number>()
      dateStrings.forEach(d => map.set(d, 0))

      if (completions) {
        completions.forEach((c: any) => {
          map.set(c.completed_date, (map.get(c.completed_date) || 0) + c.xp_earned)
        })
      }
      
      if (dayCompletions) {
        dayCompletions.forEach((c: any) => {
          map.set(c.completed_date, (map.get(c.completed_date) || 0) + c.bonus_xp)
        })
      }

      const chartData = days.map(d => {
        const dateStr = format(d, 'yyyy-MM-dd')
        return {
          date: dateStr,
          displayDate: format(d, 'MMM d'),
          xp: map.get(dateStr) || 0
        }
      })

      setData(chartData)
      setLoading(false)
    }

    fetchAnalytics()
  }, [userId])

  const handleExport = async () => {
    if (!userId) return
    
    // Fetch all historical exercise data
    const { data, error } = await supabase
      .from('exercise_completions')
      .select(`
        completed_date,
        xp_earned,
        exercises(name, muscle_groups)
      `)
      .eq('user_id', userId)
      .order('completed_date', { ascending: false })

    if (error || !data) return

    // Convert to CSV
    let csv = 'Date,Exercise,Muscle Groups,XP Earned\n'
    data.forEach((row: any) => {
      const name = `"${row.exercises?.name || 'Unknown'}"`
      const muscles = `"${(row.exercises?.muscle_groups || []).join(', ')}"`
      csv += `${row.completed_date},${name},${muscles},${row.xp_earned}\n`
    })

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `wolver_training_export_${format(new Date(), 'yyyy-MM-dd')}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="w-full border border-border rounded-md bg-surface/50 h-[300px] flex items-center justify-center mt-8">
        <div className="w-6 h-6 border-2 border-gold-start border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="w-full border border-border rounded-md bg-surface/50 overflow-hidden mt-8">
      <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-border gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-text-primary">Performance Analytics</h2>
          <p className="text-xs text-text-tertiary uppercase tracking-widest mt-1">14-Day Volume Tracking</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-surface hover:text-gold-start transition-colors text-sm font-mono text-text-secondary"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="p-6 h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#bf953f" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#bf953f" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="displayDate" 
              stroke="#333" 
              tick={{ fill: '#555', fontSize: 12, fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#333" 
              tick={{ fill: '#555', fontSize: 12, fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#1a1a1a', borderRadius: '4px' }}
              itemStyle={{ color: '#bf953f', fontWeight: 'bold' }}
              labelStyle={{ color: '#888', marginBottom: '4px' }}
            />
            <Area 
              type="monotone" 
              dataKey="xp" 
              stroke="#bf953f" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorXp)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
