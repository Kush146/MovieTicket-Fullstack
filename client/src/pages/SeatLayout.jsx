import React, { useEffect, useState, useMemo, useRef } from 'react'
import { useParams } from 'react-router-dom'
import Loading from '../components/Loading'
import { ArrowRightIcon, ClockIcon, Sparkles, Info, RefreshCw } from 'lucide-react'
import isoTimeFormat from '../lib/isoTimeFormat'
import BlurCircle from '../components/BlurCircle'
import toast from 'react-hot-toast'
import { useAppContext } from '../context/AppContext'

const SeatLayout = () => {

  const groupRows = [["A", "B"], ["C", "D"], ["E", "F"], ["G", "H"], ["I", "J"]]
  const currency = import.meta.env.VITE_CURRENCY || '$'

  // Seat type pricing
  const seatPricing = {
    'PREMIUM': { price: 1.5, label: 'Premium', color: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' },
    'STANDARD': { price: 1.0, label: 'Standard', color: 'bg-blue-500/20 border-blue-500/50 text-blue-400' },
    'ECONOMY': { price: 0.8, label: 'Economy', color: 'bg-gray-500/20 border-gray-500/50 text-gray-400' }
  }

  const {id, date } = useParams()
  const [selectedSeats, setSelectedSeats] = useState([])
  const [selectedTime, setSelectedTime] = useState(null)
  const [show, setShow] = useState(null)
  const [occupiedSeats, setOccupiedSeats] = useState({}) // Changed to object
  const [recommendedSeats, setRecommendedSeats] = useState([])
  const [lastUpdate, setLastUpdate] = useState(null)
  const [promoCode, setPromoCode] = useState('')
  const [promoDiscount, setPromoDiscount] = useState(null)
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false)
  const [loyaltyPoints, setLoyaltyPoints] = useState(0)
  const intervalRef = useRef(null)

  const {axios, getToken, user} = useAppContext();

  const getShow = async () =>{
    try {
      const { data } = await axios.get(`/api/show/${id}`)
      if (data.success){
        setShow(data)
      }
    } catch {
      // Error handled silently
    }
  }

  // Get seat type based on row (premium rows are closer to center)
  const getSeatType = (row) => {
    const rowIndex = groupRows.flat().indexOf(row)
    if (rowIndex < 2) return 'PREMIUM' // A, B
    if (rowIndex < 5) return 'STANDARD' // C, D, E
    return 'ECONOMY' // F, G, H, I, J
  }

  // Calculate seat price
  const getSeatPrice = (seatId) => {
    const row = seatId.charAt(0)
    const seatType = getSeatType(row)
    const basePrice = show?.showPrice || 10
    return Math.round(basePrice * seatPricing[seatType].price * 100) / 100
  }

  // Recommend best seats (center rows, middle seats)
  const calculateRecommendedSeats = useMemo(() => {
    if (!selectedTime || !occupiedSeats || Object.keys(occupiedSeats).length === 0) return []
    
    const recommendations = []
    // Recommend center rows (C, D, E) and middle seats (4, 5, 6)
    const centerRows = ['C', 'D', 'E']
    const centerSeats = [4, 5, 6]
    
    centerRows.forEach(row => {
      centerSeats.forEach(seatNum => {
        const seatId = `${row}${seatNum}`
        // Check if seat is not occupied (occupiedSeats is an object)
        if (!occupiedSeats[seatId] && !recommendations.includes(seatId)) {
          recommendations.push(seatId)
        }
      })
    })
    
    return recommendations.slice(0, 5) // Return top 5 recommendations
  }, [selectedTime, occupiedSeats])

  useEffect(() => {
    setRecommendedSeats(calculateRecommendedSeats)
  }, [calculateRecommendedSeats])

  const handleSeatClick = (seatId) =>{
      if (!selectedTime) {
        return toast("Please select time first")
      }
      if(!selectedSeats.includes(seatId) && selectedSeats.length > 4){
        return toast("You can only select 5 seats")
      }
      // Check if seat is occupied (occupiedSeats is an object)
      if(occupiedSeats[seatId]){
        return toast('This seat is already booked')
      }
      setSelectedSeats(prev => prev.includes(seatId) ? prev.filter(seat => seat !== seatId) : [...prev, seatId])
  }

  const selectRecommendedSeats = () => {
    if (recommendedSeats.length === 0) {
      toast.error('No recommended seats available')
      return
    }
    setSelectedSeats(recommendedSeats.slice(0, Math.min(5, recommendedSeats.length)))
    toast.success('Recommended seats selected!')
  }

  const renderSeats = (row, count = 9)=>(
    <div key={row} className="flex gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
      <div className="flex items-center gap-1.5 sm:gap-2">
        <span className="text-white/60 text-xs sm:text-sm w-3 sm:w-4 flex-shrink-0">{row}</span>
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {Array.from({ length: count }, (_, i) => {
            const seatId = `${row}${i + 1}`;
            // Check if seat is occupied (occupiedSeats is an object)
            const isOccupied = !!occupiedSeats[seatId];
            const isSelected = selectedSeats.includes(seatId);
            const isRecommended = recommendedSeats.includes(seatId);
            const seatType = getSeatType(row);
            const seatTypeInfo = seatPricing[seatType];
            
            return (
              <button 
                key={seatId} 
                onClick={() => handleSeatClick(seatId)} 
                disabled={isOccupied}
                title={`${seatId} - ${seatTypeInfo.label} - ${currency}${getSeatPrice(seatId)}`}
                className={`h-8 w-8 sm:h-10 sm:w-10 rounded-lg border-2 text-[10px] sm:text-xs font-medium transition-all relative min-w-[32px] min-h-[32px] sm:min-w-[40px] sm:min-h-[40px]
                  ${isSelected 
                    ? "bg-red-500 border-red-500 text-white scale-110 shadow-lg shadow-red-500/50" 
                    : isOccupied
                    ? "bg-gray-700/50 border-gray-600 text-gray-500 cursor-not-allowed opacity-50"
                    : isRecommended
                    ? `${seatTypeInfo.color} border-2 border-dashed active:scale-105`
                    : `${seatTypeInfo.color} active:scale-105 hover:border-opacity-100`
                  }`}
              >
                {seatId}
                {isRecommended && !isSelected && !isOccupied && (
                  <Sparkles className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  )

  const getOccupiedSeats = async ()=>{
    try {
      if (!selectedTime?.showId) return
      
      // Use the new real-time seat availability endpoint
      const { data } = await axios.get(`/api/show/${selectedTime.showId}/seats`)
      if (data.success) {
        setOccupiedSeats(data.occupiedSeats || {})
        setLastUpdate(new Date())
      }
    } catch {
      // Error handled silently
    }
  }

  // Real-time seat availability updates - poll every 2 seconds
  useEffect(() => {
    if (selectedTime && selectedTime.showId) {
      getOccupiedSeats() // Initial load
      
      // Poll every 2 seconds for real-time updates
      intervalRef.current = setInterval(() => {
        getOccupiedSeats()
      }, 2000) // Reduced from 5s to 2s for faster updates

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }
  }, [selectedTime])


  const bookTickets = async ()=>{
    try {
      if(!user) return toast.error('Please login to proceed')

        if(!selectedTime || !selectedSeats.length) return toast.error('Please select a time and seats');

        const {data} = await axios.post('/api/booking/create', {
          showId: selectedTime.showId, 
          selectedSeats,
          promoCode: promoDiscount?.code || null,
          useLoyaltyPoints: useLoyaltyPoints
        }, {headers: { Authorization: `Bearer ${await getToken()}` }});

        if (data.success){
          window.location.href = data.url;
        }else{
          toast.error(data.message)
        }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Calculate total with discounts
  const calculateTotal = () => {
    const baseAmount = selectedSeats.reduce((sum, seatId) => sum + getSeatPrice(seatId), 0)
    let discount = 0
    
    if (promoDiscount) {
      discount += promoDiscount.discountAmount || 0
    }
    
    if (useLoyaltyPoints && loyaltyPoints > 0) {
      const maxLoyaltyDiscount = baseAmount * 0.5
      const loyaltyDiscount = Math.min(loyaltyPoints * 0.01, maxLoyaltyDiscount, baseAmount - discount)
      discount += loyaltyDiscount
    }
    
    return Math.max(0, baseAmount - discount)
  }

  // Fetch loyalty points
  const fetchLoyaltyPoints = async () => {
    if (!user) return
    try {
      const {data} = await axios.get('/api/user/loyalty-points', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        setLoyaltyPoints(data.loyaltyPoints)
      }
    } catch {
      // Error handled silently
    }
  }

  // Validate promo code
  const validatePromoCode = async () => {
    if (!promoCode.trim()) {
      toast.error('Please enter a promo code')
      return
    }

    if (!selectedSeats.length) {
      toast.error('Please select seats first')
      return
    }

    try {
      const baseAmount = show?.showPrice * selectedSeats.length || 0
      const {data} = await axios.post('/api/booking/validate-promo', {
        code: promoCode,
        amount: baseAmount
      })
      
      if (data.success) {
        setPromoDiscount(data.promo)
        toast.success('Promo code applied!')
      } else {
        toast.error(data.message)
        setPromoDiscount(null)
      }
    } catch (error) {
      toast.error('Failed to validate promo code')
      setPromoDiscount(null)
    }
  }

  useEffect(()=>{
    getShow()
    if (user) {
      fetchLoyaltyPoints()
    }
  },[user])


  return show ? (
    <div className='flex flex-col md:flex-row px-4 sm:px-6 md:px-16 lg:px-40 py-24 sm:py-28 md:pt-40 gap-6 md:gap-8'>
      {/* Available Timings */}
      <div className='w-full md:w-64 lg:w-72 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-lg py-6 md:py-10 h-max md:sticky md:top-24'>
        <p className='text-base sm:text-lg font-semibold px-4 sm:px-6 mb-4'>Available Timings</p>
        <div className='mt-2 space-y-1 max-h-[300px] md:max-h-none overflow-y-auto'>
          {show.dateTime[date]?.map((item)=>(
            <div 
              key={item.time} 
              onClick={()=> setSelectedTime(item)} 
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 w-full rounded-md cursor-pointer transition min-h-[44px] ${
                selectedTime?.time === item.time 
                  ? "bg-red-500 text-white" 
                  : "hover:bg-white/10"
              }`}
            >
              <ClockIcon className="w-4 h-4 flex-shrink-0"/>
              <p className='text-sm sm:text-base'>{isoTimeFormat(item.time)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Seats Layout */}
      <div className='relative flex-1 flex flex-col items-center'>
          <BlurCircle top="-100px" left="-100px"/>
          <BlurCircle bottom="0" right="0"/>
          
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between w-full max-w-4xl mb-4 sm:mb-6 gap-3'>
            <h1 className='text-xl sm:text-2xl font-semibold'>Select your seat</h1>
            {selectedTime && (
              <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto'>
                {lastUpdate && (
                  <span className='text-xs text-white/40 flex items-center gap-1'>
                    <RefreshCw className='w-3 h-3' />
                    Updated {Math.floor((new Date() - lastUpdate) / 1000)}s ago
                  </span>
                )}
                {recommendedSeats.length > 0 && (
                  <button
                    onClick={selectRecommendedSeats}
                    className='flex items-center gap-2 px-3 sm:px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 rounded-lg text-yellow-400 text-xs sm:text-sm transition min-h-[44px] w-full sm:w-auto justify-center'
                  >
                    <Sparkles className='w-3 h-3 sm:w-4 sm:h-4' />
                    Select Best Seats
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Screen View */}
          <div className='relative w-full max-w-4xl mb-4 sm:mb-6 md:mb-8'>
            <div className='bg-gradient-to-b from-gray-800 to-gray-900 rounded-t-lg p-4 sm:p-6 md:p-8 border-2 border-white/10'>
              <div className='h-1 sm:h-2 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full'></div>
            </div>
            <p className='text-center text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2'>SCREEN</p>
          </div>

          {/* Seat Type Legend */}
          <div className='flex items-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 flex-wrap justify-center px-2'>
            {Object.entries(seatPricing).map(([type, info]) => (
              <div key={type} className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg ${info.color} border text-xs sm:text-sm`}>
                <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded flex-shrink-0 ${info.color.split(' ')[0]}`}></div>
                <span className='font-medium whitespace-nowrap'>{info.label}</span>
                <span className='text-white/60 whitespace-nowrap'>
                  ({currency}{show?.showPrice ? Math.round(show.showPrice * info.price * 100) / 100 : '0'})
                </span>
              </div>
            ))}
            <div className='flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-red-500/20 border border-red-500/50 text-xs sm:text-sm'>
              <div className='w-2.5 h-2.5 sm:w-3 sm:h-3 rounded bg-red-500 flex-shrink-0'></div>
              <span className='font-medium text-red-400 whitespace-nowrap'>Selected</span>
            </div>
            <div className='flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-gray-700/50 border border-gray-600 text-xs sm:text-sm'>
              <div className='w-2.5 h-2.5 sm:w-3 sm:h-3 rounded bg-gray-600 flex-shrink-0'></div>
              <span className='font-medium text-gray-400 whitespace-nowrap'>Booked</span>
            </div>
          </div>

          <div className='flex flex-col items-center mt-6 sm:mt-8 md:mt-10 text-xs text-gray-300 w-full overflow-x-auto px-2'>
              <div className='grid grid-cols-2 md:grid-cols-1 gap-4 sm:gap-6 md:gap-2 mb-4 sm:mb-6 w-full max-w-md md:max-w-none'>
                {groupRows[0].map(row => renderSeats(row))}
              </div>

               <div className='grid grid-cols-2 md:grid-cols-2 gap-4 sm:gap-6 md:gap-11 w-full max-w-2xl md:max-w-none'>
                {groupRows.slice(1).map((group, idx)=>(
                  <div key={idx} className='flex flex-col gap-2'>
                    {group.map(row => renderSeats(row))}
                  </div>
                ))}
              </div>
          </div>

          {/* Booking Summary */}
          {selectedSeats.length > 0 && (
            <div className='mt-6 sm:mt-8 w-full max-w-4xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-4 sm:p-6 mb-6'>
              <h3 className='text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4'>Booking Summary</h3>
              
              {/* Promo Code Section */}
              <div className='mb-3 sm:mb-4 p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10'>
                <label className='block text-xs sm:text-sm font-medium text-white mb-2'>Promo Code</label>
                <div className='flex flex-col sm:flex-row gap-2'>
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value.toUpperCase())
                      if (!e.target.value) setPromoDiscount(null)
                    }}
                    className='flex-1 px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm min-h-[44px]'
                  />
                  <button
                    onClick={validatePromoCode}
                    className='px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition text-sm font-medium min-h-[44px] whitespace-nowrap'
                  >
                    Apply
                  </button>
                </div>
                {promoDiscount && (
                  <div className='mt-2 text-xs sm:text-sm text-green-400 flex flex-col sm:flex-row items-start sm:items-center gap-2'>
                    <span>✓ Promo code applied: {promoDiscount.code} - {currency}{promoDiscount.discountAmount.toFixed(2)} off</span>
                    <button
                      onClick={() => {
                        setPromoCode('')
                        setPromoDiscount(null)
                      }}
                      className='text-red-400 hover:text-red-300 text-xs sm:text-sm'
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Loyalty Points Section */}
              {user && loyaltyPoints > 0 && (
                <div className='mb-3 sm:mb-4 p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10'>
                  <div className='flex items-center justify-between mb-2 gap-2'>
                    <label className='text-xs sm:text-sm font-medium text-white flex items-center gap-2 flex-1'>
                      <Sparkles className='w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 flex-shrink-0' />
                      <span className='break-words'>Use Loyalty Points ({loyaltyPoints} available)</span>
                    </label>
                    <label className='relative inline-flex items-center cursor-pointer flex-shrink-0'>
                      <input
                        type="checkbox"
                        checked={useLoyaltyPoints}
                        onChange={(e) => setUseLoyaltyPoints(e.target.checked)}
                        className='sr-only peer'
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                    </label>
                  </div>
                  {useLoyaltyPoints && (
                    <p className='text-xs text-white/60'>
                      You can use up to {Math.min(loyaltyPoints, Math.floor(calculateTotal() * 50))} points (max 50% discount)
                    </p>
                  )}
                </div>
              )}

              <div className='space-y-2 mb-3 sm:mb-4'>
                {selectedSeats.map(seatId => {
                  const price = getSeatPrice(seatId)
                  const seatType = getSeatType(seatId.charAt(0))
                  return (
                    <div key={seatId} className='flex items-center justify-between text-xs sm:text-sm'>
                      <span className='text-white/80'>
                        {seatId} <span className='text-white/50'>({seatPricing[seatType].label})</span>
                      </span>
                      <span className='text-white font-medium'>{currency}{price}</span>
                    </div>
                  )
                })}
              </div>
              
              {(promoDiscount || (useLoyaltyPoints && loyaltyPoints > 0)) && (
                <div className='space-y-1 mb-2 text-xs sm:text-sm'>
                  <div className='flex items-center justify-between text-white/70'>
                    <span>Subtotal</span>
                    <span>{currency}{selectedSeats.reduce((sum, seatId) => sum + getSeatPrice(seatId), 0).toFixed(2)}</span>
                  </div>
                  {promoDiscount && (
                    <div className='flex items-center justify-between text-green-400'>
                      <span className='break-words'>Promo Discount ({promoDiscount.code})</span>
                      <span className='ml-2 flex-shrink-0'>-{currency}{promoDiscount.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {useLoyaltyPoints && loyaltyPoints > 0 && (
                    <div className='flex items-center justify-between text-yellow-400'>
                      <span className='break-words'>Loyalty Points Discount</span>
                      <span className='ml-2 flex-shrink-0'>-{currency}{Math.min(loyaltyPoints * 0.01, calculateTotal() * 0.5, selectedSeats.reduce((sum, seatId) => sum + getSeatPrice(seatId), 0) - (promoDiscount?.discountAmount || 0)).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              )}
              
              <div className='flex items-center justify-between pt-3 sm:pt-4 border-t border-white/10'>
                <span className='text-base sm:text-lg font-semibold text-white'>Total</span>
                <span className='text-xl sm:text-2xl font-bold text-red-400'>
                  {currency}{calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <button 
            onClick={bookTickets} 
            disabled={!selectedTime || selectedSeats.length === 0}
            className='flex items-center justify-center gap-1 mt-4 sm:mt-6 px-6 sm:px-10 py-2.5 sm:py-3 text-sm bg-red-500 hover:bg-red-600 transition rounded-full font-medium cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto min-h-[44px]'
          >
            Proceed to Checkout
            <ArrowRightIcon strokeWidth={3} className="w-4 h-4"/>
          </button>

         
      </div>
    </div>
  ) : (
    <Loading />
  )
}

export default SeatLayout
