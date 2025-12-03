import { 
    ChartLineIcon, 
    CircleDollarSignIcon, 
    PlayCircleIcon, 
    StarIcon, 
    UsersIcon,
    TrendingUp,
    Calendar,
    Ticket,
    DollarSign,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle
} from 'lucide-react';
import React, { useEffect, useState } from 'react'
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import BlurCircle from '../../components/BlurCircle';
import { dateFormat } from '../../lib/dateFormat';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Dashboard = () => {

    const {axios, getToken, user, image_base_url} = useAppContext()

    const currency = import.meta.env.VITE_CURRENCY

    const [dashboardData, setDashboardData] = useState({
        totalBookings: 0,
        totalRevenue: 0,
        recentBookings: 0,
        recentRevenue: 0,
        todayBookings: 0,
        todayRevenue: 0,
        activeShows: [],
        totalUser: 0,
        newUsers: 0,
        bookingStatus: { paid: 0, unpaid: 0, cancelled: 0 },
        latestBookings: [],
        revenueByDay: []
    });
    const [loading, setLoading] = useState(true);

    const dashboardCards = [
        { 
            title: "Total Revenue", 
            value: currency + (dashboardData.totalRevenue?.toFixed(2) || "0"), 
            icon: CircleDollarSignIcon,
            change: dashboardData.recentRevenue > 0 ? `+${currency}${dashboardData.recentRevenue.toFixed(2)} (7d)` : null,
            color: "text-green-400",
            bgColor: "bg-green-500/20"
        },
        { 
            title: "Total Bookings", 
            value: dashboardData.totalBookings || "0", 
            icon: Ticket,
            change: dashboardData.recentBookings > 0 ? `+${dashboardData.recentBookings} (7d)` : null,
            color: "text-blue-400",
            bgColor: "bg-blue-500/20"
        },
        { 
            title: "Today's Revenue", 
            value: currency + (dashboardData.todayRevenue?.toFixed(2) || "0"), 
            icon: TrendingUp,
            change: `${dashboardData.todayBookings} bookings today`,
            color: "text-purple-400",
            bgColor: "bg-purple-500/20"
        },
        { 
            title: "Total Users", 
            value: dashboardData.totalUser || "0", 
            icon: UsersIcon,
            change: dashboardData.newUsers > 0 ? `+${dashboardData.newUsers} (7d)` : null,
            color: "text-yellow-400",
            bgColor: "bg-yellow-500/20"
        }
    ]

    const fetchDashboardData = async () => {
        try {
           const { data } = await axios.get("/api/admin/dashboard", {headers: { Authorization: `Bearer ${await getToken()}`}}) 
           if (data.success) {
            setDashboardData(data.dashboardData)
            setLoading(false)
           }else{
            toast.error(data.message)
           }
        } catch (error) {
            toast.error("Error fetching dashboard data:", error)
        }
    };

    useEffect(() => {
        if(user){
            fetchDashboardData();
        }   
    }, [user]);

  return !loading ? (
    <>
      <Title text1="Admin" text2="Dashboard"/>

      {/* Stats Cards */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <BlurCircle top="-100px" left="0" />
        {dashboardCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div key={index} className="relative bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6 hover:border-red-500/30 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
              </div>
              <h3 className="text-sm text-white/60 mb-1">{card.title}</h3>
              <p className="text-2xl font-bold text-white mb-2">{card.value}</p>
              {card.change && (
                <p className="text-xs text-white/40 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {card.change}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Booking Status Overview */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white/80">Paid Bookings</h3>
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-green-400">{dashboardData.bookingStatus?.paid || 0}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white/80">Pending Payment</h3>
            <Clock className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-yellow-400">{dashboardData.bookingStatus?.unpaid || 0}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white/80">Cancelled</h3>
            <XCircle className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-3xl font-bold text-red-400">{dashboardData.bookingStatus?.cancelled || 0}</p>
        </div>
      </div>

      {/* Revenue Chart (Simple Bar Chart) */}
      {dashboardData.revenueByDay && dashboardData.revenueByDay.length > 0 && (
        <div className="mt-8 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <ChartLineIcon className="w-6 h-6 text-red-500" />
            Revenue Trend (Last 7 Days)
          </h2>
          <div className="flex items-end justify-between gap-2 h-64">
            {dashboardData.revenueByDay.map((day, index) => {
              const maxRevenue = Math.max(...dashboardData.revenueByDay.map(d => d.revenue));
              const height = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative w-full h-48 flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-red-500 to-red-400 rounded-t-lg hover:from-red-400 hover:to-red-300 transition-all cursor-pointer group"
                      style={{ height: `${height}%` }}
                      title={`${day.date}: ${currency}${day.revenue.toFixed(2)}`}
                    >
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {currency}{day.revenue.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-white/60 text-center">
                    <p>{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    <p className="text-white/40">{day.bookings} bookings</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Shows */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <PlayCircleIcon className="w-6 h-6 text-red-500" />
            Active Shows
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dashboardData.activeShows && dashboardData.activeShows.length > 0 ? (
              dashboardData.activeShows.map((show) => (
                <div key={show._id} className="bg-white/5 rounded-lg overflow-hidden border border-white/10 hover:border-red-500/30 transition-all group">
                  <div className="relative">
                    <img 
                      src={image_base_url + show.movie.poster_path} 
                      alt='' 
                      className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white font-medium">
                      {currency}{show.showPrice}
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-white truncate mb-1">{show.movie.title}</p>
                    <div className="flex items-center justify-between text-sm">
                      <p className="flex items-center gap-1 text-white/60">
                        <Calendar className="w-3 h-3" />
                        {dateFormat(show.showDateTime)}
                      </p>
                      <p className="flex items-center gap-1 text-yellow-400">
                        <StarIcon className="w-3 h-3 fill-yellow-400" />
                        {show.movie.vote_average.toFixed(1)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white/40 col-span-2 text-center py-8">No active shows</p>
            )}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Ticket className="w-6 h-6 text-red-500" />
            Recent Bookings
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {dashboardData.latestBookings && dashboardData.latestBookings.length > 0 ? (
              dashboardData.latestBookings.map((booking) => (
                <div key={booking._id} className="bg-white/5 rounded-lg p-3 border border-white/10 hover:border-red-500/30 transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">
                        {booking.show?.movie?.title || 'Unknown Movie'}
                      </p>
                      <p className="text-xs text-white/60 mt-1">
                        {booking.user?.name || booking.user?.email || 'Unknown User'}
                      </p>
                    </div>
                    <div className="ml-3 text-right">
                      <p className="text-sm font-bold text-green-400">{currency}{booking.amount?.toFixed(2)}</p>
                      {booking.isPaid ? (
                        <span className="text-xs text-green-400 flex items-center gap-1 mt-1">
                          <CheckCircle className="w-3 h-3" />
                          Paid
                        </span>
                      ) : (
                        <span className="text-xs text-yellow-400 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-white/50">
                    <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
                    <span>{booking.bookedSeats?.length || 0} seats</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white/40 text-center py-8">No recent bookings</p>
            )}
          </div>
        </div>
      </div>

    </>
  ) : <Loading />
}

export default Dashboard
