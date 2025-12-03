import React, { useEffect, useState, useMemo } from 'react'
import Loading from '../components/Loading'
import BlurCircle from '../components/BlurCircle'
import timeFormat from '../lib/timeFormat'
import { dateFormat } from '../lib/dateFormat'
import { useAppContext } from '../context/AppContext'
import { Link } from 'react-router-dom'
import { 
  Filter, 
  X, 
  Download, 
  Share2, 
  QrCode, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock,
  Trash2,
  Ticket
} from 'lucide-react'
import toast from 'react-hot-toast'

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY

  const { axios, getToken, user, image_base_url} = useAppContext()

  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, upcoming, past, cancelled, unpaid
  const [selectedBooking, setSelectedBooking] = useState(null) // For QR code modal

  const getMyBookings = async () =>{
    try {
      const {data} = await axios.get('/api/user/bookings', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
        if (data.success) {
          setBookings(data.bookings)
        }

    } catch (error) {
      console.log(error)
      toast.error('Failed to load bookings')
    }
    setIsLoading(false)
  }

  useEffect(()=>{
    if(user){
      getMyBookings()
    }
  },[user])

  // Filter bookings
  const filteredBookings = useMemo(() => {
    const now = new Date()
    return bookings.filter(booking => {
      const showDate = new Date(booking.show?.showDateTime)
      
      switch (filter) {
        case 'upcoming':
          return !booking.isCancelled && booking.isPaid && showDate > now
        case 'past':
          return !booking.isCancelled && booking.isPaid && showDate <= now
        case 'cancelled':
          return booking.isCancelled
        case 'unpaid':
          return !booking.isPaid && !booking.isCancelled
        default:
          return true
      }
    })
  }, [bookings, filter])

  const cancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return

    try {
      const {data} = await axios.post(`/api/booking/cancel/${bookingId}`, {}, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      
      if (data.success) {
        toast.success(data.message)
        if (data.refundAmount > 0) {
          toast.success(`Refund of ${currency}${data.refundAmount} will be processed`)
        }
        getMyBookings()
      } else {
        toast.error(data.message)
      }
    } catch {
      toast.error('Failed to cancel booking')
    }
  }

  const retryPayment = async (bookingId) => {
    try {
      const {data} = await axios.post(`/api/booking/retry-payment/${bookingId}`, {}, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      
      if (data.success) {
        window.location.href = data.url
      } else {
        toast.error(data.message)
      }
    } catch {
      toast.error('Failed to retry payment')
    }
  }

  const shareBooking = (booking) => {
    const shareText = `I'm watching "${booking.show.movie.title}" on ${dateFormat(booking.show.showDateTime)} at ${booking.show.showDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}. Seats: ${booking.bookedSeats.join(', ')}`
    
    if (navigator.share) {
      navigator.share({
        title: 'My Movie Booking',
        text: shareText,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(shareText)
      toast.success('Booking details copied to clipboard!')
    }
  }

  const downloadTicket = (booking) => {
    // Generate simple ticket HTML
    const ticketHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Ticket - ${booking.show.movie.title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; }
            .ticket { border: 2px solid #000; padding: 20px; border-radius: 10px; }
            .header { text-align: center; margin-bottom: 20px; }
            .details { margin: 15px 0; }
            .qr { text-align: center; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="header">
              <h1>KukiShow</h1>
              <h2>${booking.show.movie.title}</h2>
            </div>
            <div class="details">
              <p><strong>Booking Reference:</strong> ${booking.bookingReference || 'N/A'}</p>
              <p><strong>Date:</strong> ${dateFormat(booking.show.showDateTime)}</p>
              <p><strong>Time:</strong> ${new Date(booking.show.showDateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
              <p><strong>Seats:</strong> ${booking.bookedSeats.join(', ')}</p>
              <p><strong>Amount:</strong> ${currency}${booking.amount}</p>
            </div>
            <div class="qr">
              <p>Show this QR code at the theatre</p>
              <div style="font-family: monospace; padding: 20px; background: #f0f0f0; border-radius: 5px;">
                ${booking.bookingReference || booking._id}
              </div>
            </div>
          </div>
        </body>
      </html>
    `
    
    const blob = new Blob([ticketHTML], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ticket-${booking.bookingReference || booking._id}.html`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Ticket downloaded!')
  }

  const getStatusBadge = (booking) => {
    const showDate = new Date(booking.show?.showDateTime)
    const now = new Date()
    
    if (booking.isCancelled) {
      return { label: 'Cancelled', icon: XCircle, color: 'text-gray-400 bg-gray-400/20' }
    }
    if (!booking.isPaid) {
      return { label: 'Payment Pending', icon: Clock, color: 'text-yellow-400 bg-yellow-400/20' }
    }
    if (showDate > now) {
      return { label: 'Upcoming', icon: Calendar, color: 'text-blue-400 bg-blue-400/20' }
    }
    return { label: 'Completed', icon: CheckCircle, color: 'text-green-400 bg-green-400/20' }
  }

  return !isLoading ? (
    <div className='relative px-4 sm:px-6 md:px-16 lg:px-40 pt-24 sm:pt-28 md:pt-40 min-h-[80vh] pb-12'>
      <BlurCircle top="100px" left="100px"/>
      <div>
        <BlurCircle bottom="0px" left="600px"/>
      </div>
      
      <div className='mb-6 sm:mb-8'>
        <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3'>
          <Ticket className='w-6 h-6 sm:w-8 sm:h-8 text-red-500' />
          My Bookings
        </h1>

        {/* Filters */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6'>
          <span className='text-white/60 text-xs sm:text-sm'>Filter:</span>
          <div className='flex flex-wrap gap-2'>
            {[
              { value: 'all', label: 'All' },
              { value: 'upcoming', label: 'Upcoming' },
              { value: 'past', label: 'Past' },
              { value: 'unpaid', label: 'Pending' },
              { value: 'cancelled', label: 'Cancelled' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition min-h-[36px] ${
                  filter === option.value
                    ? 'bg-red-500 text-white'
                    : 'bg-white/5 text-white/80 hover:bg-white/10 border border-white/10'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <p className='text-white/60 text-xs sm:text-sm mb-3 sm:mb-4'>
          Showing {filteredBookings.length} of {bookings.length} bookings
        </p>
      </div>

      {filteredBookings.length > 0 ? (
        <div className='space-y-4'>
          {filteredBookings.map((item, index) => {
            const status = getStatusBadge(item)
            const StatusIcon = status.icon
            const showDate = new Date(item.show?.showDateTime)
            const canCancel = !item.isCancelled && !item.isPaid || (item.isPaid && showDate > new Date())
            
            return (
              <div key={index} className='flex flex-col bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-4 sm:p-6 max-w-4xl hover:border-red-500/30 transition'>
                <div className='flex flex-col sm:flex-row gap-4 flex-1'>
                  <img 
                    src={image_base_url + item.show.movie.poster_path} 
                    alt="" 
                    className='w-full sm:w-32 h-48 sm:h-auto object-cover rounded-lg flex-shrink-0'
                  />
                  <div className='flex flex-col flex-1 min-w-0'>
                    <div className='flex items-start justify-between mb-2 gap-2'>
                      <div className='flex-1 min-w-0'>
                        <h3 className='text-lg sm:text-xl font-semibold text-white mb-1 line-clamp-2'>{item.show.movie.title}</h3>
                        <div className='flex flex-wrap items-center gap-2 mb-2'>
                          <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                            <StatusIcon className='w-3 h-3' />
                            {status.label}
                          </span>
                          {item.bookingReference && (
                            <span className='text-xs text-white/40 font-mono break-all'>
                              Ref: {item.bookingReference}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className='flex-shrink-0 text-right sm:hidden'>
                        <p className='text-xl font-bold text-white'>{currency}{item.amount}</p>
                        {item.isCancelled && item.refundAmount > 0 && (
                          <p className='text-xs text-green-400'>Refund: {currency}{item.refundAmount}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className='space-y-1 text-xs sm:text-sm text-white/70 mb-3 sm:mb-4'>
                      <p><span className='text-white/50'>Date & Time:</span> {dateFormat(item.show.showDateTime)} at {showDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                      <p><span className='text-white/50'>Duration:</span> {timeFormat(item.show.movie.runtime)}</p>
                      <p><span className='text-white/50'>Seats:</span> <span className='text-white font-medium break-all'>{item.bookedSeats.join(", ")}</span></p>
                      <p><span className='text-white/50'>Total Tickets:</span> {item.bookedSeats.length}</p>
                    </div>

                    <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-auto'>
                      {item.isPaid && !item.isCancelled && (
                        <>
                          <button
                            onClick={() => setSelectedBooking(item)}
                            className='flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-xs sm:text-sm transition min-h-[40px]'
                          >
                            <QrCode className='w-3 h-3 sm:w-4 sm:h-4' />
                            View QR
                          </button>
                          <button
                            onClick={() => downloadTicket(item)}
                            className='flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-xs sm:text-sm transition min-h-[40px]'
                          >
                            <Download className='w-3 h-3 sm:w-4 sm:h-4' />
                            Download
                          </button>
                          <button
                            onClick={() => shareBooking(item)}
                            className='flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-xs sm:text-sm transition min-h-[40px]'
                          >
                            <Share2 className='w-3 h-3 sm:w-4 sm:h-4' />
                            Share
                          </button>
                        </>
                      )}
                      {canCancel && (
                        <button
                          onClick={() => cancelBooking(item._id)}
                          className='flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-xs sm:text-sm transition min-h-[40px]'
                        >
                          <Trash2 className='w-3 h-3 sm:w-4 sm:h-4' />
                          Cancel
                        </button>
                      )}
                      {!item.isPaid && !item.isCancelled && (
                        <>
                          {item.paymentLink ? (
                            <Link 
                              to={item.paymentLink} 
                              className='px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs sm:text-sm font-medium transition text-center min-h-[40px] flex items-center justify-center'
                            >
                              Pay Now
                            </Link>
                          ) : (
                            <button
                              onClick={() => retryPayment(item._id)}
                              className='px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs sm:text-sm font-medium transition min-h-[40px]'
                            >
                              Retry Payment
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className='hidden sm:flex flex-col sm:items-end sm:text-right justify-between p-4 border-t sm:border-t-0 sm:border-l border-white/10 mt-4 sm:mt-0'>
                  <div>
                    <p className='text-xl sm:text-2xl font-bold text-white mb-1'>{currency}{item.amount}</p>
                    {item.isCancelled && item.refundAmount > 0 && (
                      <p className='text-xs sm:text-sm text-green-400'>Refund: {currency}{item.refundAmount}</p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-20'>
          <Ticket className='w-16 h-16 text-white/20 mb-4' />
          <h2 className='text-2xl font-bold text-white mb-2'>No bookings found</h2>
          <p className='text-white/60 text-center'>
            {filter === 'all' 
              ? "You haven't made any bookings yet"
              : `No ${filter} bookings found`
            }
          </p>
        </div>
      )}

      {/* QR Code Modal */}
      {selectedBooking && (
        <div 
          className='fixed inset-0 bg-black/80 backdrop-blur-sm z-[99999] flex items-center justify-center p-4'
          onClick={() => setSelectedBooking(null)}
        >
          <div 
            className='bg-gray-900 border border-white/10 rounded-2xl p-4 sm:p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center justify-between mb-4 sm:mb-6'>
              <h3 className='text-lg sm:text-xl font-bold text-white'>Booking QR Code</h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className='text-white/60 hover:text-white p-1 min-w-[32px] min-h-[32px] flex items-center justify-center'
                aria-label="Close"
              >
                <X className='w-5 h-5 sm:w-6 sm:h-6' />
              </button>
            </div>
            
            <div className='text-center mb-4 sm:mb-6'>
              <div className='bg-white p-4 sm:p-6 rounded-lg inline-block mb-3 sm:mb-4'>
                <div className='font-mono text-lg sm:text-xl md:text-2xl font-bold text-black break-all px-2'>
                  {selectedBooking.bookingReference || selectedBooking._id}
                </div>
              </div>
              <p className='text-white/60 text-xs sm:text-sm mb-1 sm:mb-2 px-2'>{selectedBooking.show.movie.title}</p>
              <p className='text-white/60 text-xs sm:text-sm mb-1'>{dateFormat(selectedBooking.show.showDateTime)}</p>
              <p className='text-white/60 text-xs sm:text-sm break-all px-2'>Seats: {selectedBooking.bookedSeats.join(', ')}</p>
            </div>

            <div className='flex flex-col sm:flex-row gap-2 sm:gap-3'>
              <button
                onClick={() => downloadTicket(selectedBooking)}
                className='flex-1 px-4 py-2.5 sm:py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition text-sm min-h-[44px]'
              >
                Download Ticket
              </button>
              <button
                onClick={() => shareBooking(selectedBooking)}
                className='flex-1 px-4 py-2.5 sm:py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition text-sm min-h-[44px]'
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : <Loading />
}

export default MyBookings
