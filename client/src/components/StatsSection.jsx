import React from 'react'
import { Ticket, Users, Film, TrendingUp } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import BlurCircle from './BlurCircle'

const StatsSection = () => {
  const { shows } = useAppContext()

  const stats = [
    {
      icon: Film,
      value: shows.length || 0,
      label: "Movies Available",
      color: "text-red-400",
      bgColor: "bg-red-500/20"
    },
    {
      icon: Ticket,
      value: "100+",
      label: "Theatres",
      color: "text-blue-400",
      bgColor: "bg-blue-500/20"
    },
    {
      icon: Users,
      value: "50K+",
      label: "Happy Customers",
      color: "text-green-400",
      bgColor: "bg-green-500/20"
    },
    {
      icon: TrendingUp,
      value: "20+",
      label: "States Covered",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20"
    }
  ]

  return (
    <div className='relative px-4 sm:px-6 md:px-16 lg:px-24 xl:px-44 py-12 sm:py-16 overflow-hidden bg-gradient-to-b from-transparent to-gray-900/30'>
      <BlurCircle top='20%' left='5%'/>
      <BlurCircle bottom='20%' right='5%'/>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6'>
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className='text-center bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-4 sm:p-5 md:p-6 hover:border-red-500/50 transition-all'
            >
              <div className={`inline-flex p-2 sm:p-3 rounded-lg ${stat.bgColor} mb-2 sm:mb-3`}>
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
              </div>
              <div className={`text-2xl sm:text-3xl md:text-4xl font-bold ${stat.color} mb-1 sm:mb-2`}>
                {stat.value}
              </div>
              <div className='text-xs sm:text-sm text-gray-400 leading-tight'>
                {stat.label}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default StatsSection

