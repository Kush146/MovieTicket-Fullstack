import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { Ticket, Star, DollarSign, Calendar, TrendingUp, Bookmark, Heart, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import BlurCircle from '../components/BlurCircle'
import Loading from '../components/Loading'

const UserDashboard = () => {
  const { axios, getToken, user, image_base_url } = useAppContext()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/user/dashboard', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        setDashboardData(data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className='flex items-center justify-center min-h-[80vh]'>
        <div className='text-center'>
          <p className='text-gray-400 mb-4'>Please login to view your dashboard</p>
          <Link to='/' className='text-red-500 hover:text-red-400'>
            Go to Home
          </Link>
        </div>
      </div>
    )
  }

  if (loading || !dashboardData) {
    return <Loading />
  }

  const { stats, recentBookings } = dashboardData

  const statCards = [
    {
      icon: Ticket,
      label: 'Total Bookings',
      value: stats.totalBookings,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      link: '/my-bookings'
    },
    {
      icon: Calendar,
      label: 'Upcoming',
      value: stats.upcomingBookings,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      link: '/my-bookings?filter=upcoming'
    },
    {
      icon: Clock,
      label: 'Past Bookings',
      value: stats.pastBookings,
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/20',
      link: '/my-bookings?filter=past'
    },
    {
      icon: DollarSign,
      label: 'Total Spent',
      value: `$${stats.totalSpent.toFixed(2)}`,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20'
    },
    {
      icon: Star,
      label: 'Loyalty Points',
      value: stats.loyaltyPoints,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    },
    {
      icon: Heart,
      label: 'Favorites',
      value: stats.favoriteCount,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      link: '/favorite'
    },
    {
      icon: Bookmark,
      label: 'Watchlist',
      value: stats.watchlistCount,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      link: '/watchlist'
    }
  ]

  return (
    <div className='relative px-4 sm:px-6 md:px-16 lg:px-40 xl:px-44 pt-24 sm:pt-28 md:pt-40 pb-12 min-h-screen overflow-hidden'>
      <BlurCircle top="10%" left="-10%"/>
      <BlurCircle bottom="10%" right="-10%"/>

      <div className='max-w-7xl mx-auto'>
        <h1 className='text-3xl sm:text-4xl font-bold mb-2'>My Dashboard</h1>
        <p className='text-gray-400 mb-8 sm:mb-12'>Welcome back! Here's your activity overview.</p>

        {/* Stats Grid */}
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12'>
          {statCards.map((stat, index) => {
            const CardContent = (
              <div className={`${stat.bgColor} rounded-lg p-4 sm:p-6 border border-gray-700/50 hover:border-gray-600 transition h-full`}>
                <div className='flex items-center justify-between mb-3'>
                  <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                  {stat.link && (
                    <TrendingUp className='w-4 h-4 text-gray-500' />
                  )}
                </div>
                <div className='text-2xl sm:text-3xl font-bold mb-1'>{stat.value}</div>
                <div className='text-xs sm:text-sm text-gray-400'>{stat.label}</div>
              </div>
            )

            return stat.link ? (
              <Link key={index} to={stat.link} className='block h-full'>
                {CardContent}
              </Link>
            ) : (
              <div key={index}>
                {CardContent}
              </div>
            )
          })}
        </div>

        {/* Recent Bookings */}
        {recentBookings && recentBookings.length > 0 && (
          <div className='mb-8 sm:mb-12'>
            <div className='flex items-center justify-between mb-4 sm:mb-6'>
              <h2 className='text-xl sm:text-2xl font-semibold'>Recent Bookings</h2>
              <Link
                to='/my-bookings'
                className='text-sm text-red-500 hover:text-red-400 transition'
              >
                View All →
              </Link>
            </div>
            <div className='space-y-4'>
              {recentBookings.map((booking) => (
                <Link
                  key={booking._id}
                  to='/my-bookings'
                  className='block bg-gray-800/50 rounded-lg p-4 sm:p-6 border border-gray-700 hover:border-gray-600 transition'
                >
                  <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                    <div className='flex-1'>
                      <div className='flex items-center gap-3 mb-2'>
                        {booking.show?.movie?.poster_path && (
                          <img
                            src={image_base_url + booking.show.movie.poster_path}
                            alt={booking.show?.movie?.title}
                            className='w-16 h-24 object-cover rounded'
                          />
                        )}
                        <div>
                          <h3 className='font-semibold text-lg mb-1'>
                            {booking.show?.movie?.title || 'Movie'}
                          </h3>
                          <p className='text-sm text-gray-400'>
                            {booking.show?.showDateTime
                              ? new Date(booking.show.showDateTime).toLocaleString()
                              : 'Date TBD'}
                          </p>
                          <p className='text-sm text-gray-400'>
                            {booking.bookedSeats?.length || 0} seat(s) • ${booking.amount?.toFixed(2) || '0.00'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          booking.isPaid
                            ? 'bg-green-500/20 text-green-400'
                            : booking.isCancelled
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {booking.isCancelled
                          ? 'Cancelled'
                          : booking.isPaid
                          ? 'Paid'
                          : 'Pending'}
                      </div>
                      {booking.bookingReference && (
                        <div className='text-xs text-gray-500'>
                          {booking.bookingReference}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className='bg-gray-800/50 rounded-lg p-6 sm:p-8 border border-gray-700'>
          <h2 className='text-xl sm:text-2xl font-semibold mb-4 sm:mb-6'>Quick Actions</h2>
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
            <Link
              to='/movies'
              className='p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-center transition'
            >
              <Ticket className='w-6 h-6 mx-auto mb-2 text-red-500' />
              <div className='text-sm font-medium'>Book Tickets</div>
            </Link>
            <Link
              to='/favorite'
              className='p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-center transition'
            >
              <Heart className='w-6 h-6 mx-auto mb-2 text-red-500' />
              <div className='text-sm font-medium'>Favorites</div>
            </Link>
            <Link
              to='/watchlist'
              className='p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-center transition'
            >
              <Bookmark className='w-6 h-6 mx-auto mb-2 text-red-500' />
              <div className='text-sm font-medium'>Watchlist</div>
            </Link>
            <Link
              to='/releases'
              className='p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-center transition'
            >
              <Calendar className='w-6 h-6 mx-auto mb-2 text-red-500' />
              <div className='text-sm font-medium'>Upcoming</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard

