import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import Title from '../../components/admin/Title'
import Loading from '../../components/Loading'
import toast from 'react-hot-toast'
import { 
  TrendingUp, 
  DollarSign, 
  Ticket, 
  Users, 
  Calendar,
  Film,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'

const Analytics = () => {
  const { axios, getToken, image_base_url } = useAppContext()
  const currency = import.meta.env.VITE_CURRENCY || '$'
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchAnalytics = async () => {
    try {
      const { data } = await axios.get('/api/admin/analytics', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        setAnalytics(data.analytics)
      }
      setLoading(false)
    } catch {
      toast.error('Failed to fetch analytics')
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  if (loading) return <Loading />

  if (!analytics) return null

  const statCards = [
    {
      title: 'Total Bookings',
      value: analytics.totalBookings,
      icon: Ticket,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      title: 'Total Revenue',
      value: `${currency}${analytics.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      title: 'Recent Bookings (30 days)',
      value: analytics.recentBookings,
      icon: Calendar,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    },
    {
      title: 'Recent Revenue (30 days)',
      value: `${currency}${analytics.recentRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20'
    }
  ]

  return (
    <>
      <Title text1="Analytics" text2="Dashboard" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <h3 className="text-sm text-white/60 mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Bookings by Status */}
      <div className="mt-8 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Bookings by Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-white/60">Paid</p>
              <p className="text-2xl font-bold text-white">{analytics.bookingsByStatus.paid}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-white/60">Unpaid</p>
              <p className="text-2xl font-bold text-white">{analytics.bookingsByStatus.unpaid}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <XCircle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-white/60">Cancelled</p>
              <p className="text-2xl font-bold text-white">{analytics.bookingsByStatus.cancelled}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Movies */}
      {analytics.topMovies && analytics.topMovies.length > 0 && (
        <div className="mt-8 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Film className="w-6 h-6 text-red-500" />
            Top Movies by Bookings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.topMovies.map((movie, index) => (
              <div
                key={movie._id}
                className="bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition"
              >
                <div className="flex gap-4 p-4">
                  <img
                    src={image_base_url + movie.poster_path}
                    alt={movie.title}
                    className="w-16 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-2 line-clamp-2">{movie.title}</h3>
                    <div className="space-y-1 text-sm">
                      <p className="text-white/60">
                        <Ticket className="w-4 h-4 inline mr-1" />
                        {movie.count} bookings
                      </p>
                      <p className="text-green-400 font-medium">
                        <DollarSign className="w-4 h-4 inline mr-1" />
                        {currency}{movie.revenue.toFixed(2)} revenue
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/20 text-red-400 font-bold">
                    {index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Revenue Chart Placeholder */}
      <div className="mt-8 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Revenue Overview</h2>
        <div className="h-64 flex items-center justify-center text-white/40">
          <div className="text-center">
            <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Revenue chart visualization</p>
            <p className="text-sm mt-2">Total: {currency}{analytics.totalRevenue.toFixed(2)}</p>
            <p className="text-sm">Last 30 days: {currency}{analytics.recentRevenue.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Analytics

