import React from 'react'
import { MapPin, Ticket, Star, Zap, Shield, HeadphonesIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import BlurCircle from './BlurCircle'

const FeaturesSection = () => {
  const features = [
    {
      icon: MapPin,
      title: "20+ States Coverage",
      description: "Find theatres across major Indian states and cities",
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      link: "/theatres"
    },
    {
      icon: Ticket,
      title: "Easy Booking",
      description: "Book tickets in just a few clicks with our intuitive interface",
      color: "text-green-400",
      bgColor: "bg-green-500/20",
      link: "/movies"
    },
    {
      icon: Star,
      title: "Loyalty Rewards",
      description: "Earn points with every booking and get exclusive discounts",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
      link: "/movies"
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Get instant seat availability and booking confirmations",
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
      link: "/movies"
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Safe and secure payment processing with multiple options",
      color: "text-red-400",
      bgColor: "bg-red-500/20",
      link: "/movies"
    },
    {
      icon: HeadphonesIcon,
      title: "24/7 Support",
      description: "Round-the-clock customer support for all your queries",
      color: "text-pink-400",
      bgColor: "bg-pink-500/20",
      link: "/contact"
    }
  ]

  return (
    <div className='relative px-4 sm:px-6 md:px-16 lg:px-24 xl:px-44 py-12 sm:py-16 md:py-20 overflow-hidden'>
      <BlurCircle top='10%' left='-10%'/>
      <BlurCircle bottom='10%' right='-10%'/>

      <div className='text-center mb-8 sm:mb-10 md:mb-12'>
        <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 px-4'>
          Why Choose <span className='text-red-500'>KukiShow</span>?
        </h2>
        <p className='text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4'>
          Experience the best in movie ticket booking with our premium features
        </p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6'>
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <Link
              key={index}
              to={feature.link}
              className='group bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-4 sm:p-5 md:p-6 hover:border-red-500/50 transition-all active:scale-95 sm:hover:-translate-y-1'
            >
              <div className={`inline-flex p-3 sm:p-4 rounded-xl ${feature.bgColor} mb-3 sm:mb-4 group-active:scale-110 sm:group-hover:scale-110 transition-transform`}>
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${feature.color}`} />
              </div>
              <h3 className='text-lg sm:text-xl font-semibold text-white mb-2 group-hover:text-red-400 transition'>
                {feature.title}
              </h3>
              <p className='text-gray-400 text-xs sm:text-sm leading-relaxed'>
                {feature.description}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default FeaturesSection

