import React from 'react'
import { Film, Code, Zap, Heart, MapPin, Mail, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import BlurCircle from '../components/BlurCircle'

const About = () => {
  return (
    <div className="relative min-h-screen pt-20 sm:pt-24 md:pt-28 px-4 sm:px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden pb-12">
      <BlurCircle top="100px" left="0px" />
      <BlurCircle bottom="200px" right="50px" />

      <div className="max-w-5xl mx-auto py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Film className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">About KukiShow</h1>
          </div>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto px-4">
            Your premier destination for seamless movie ticket booking
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8 sm:space-y-10 md:space-y-12">
          {/* Mission Section */}
          <section className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-5 sm:p-6 md:p-8 lg:p-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-red-500" />
              Our Mission
            </h2>
            <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed">
              At <strong className="text-white">KukiShow</strong>, we believe that going to the movies should be a 
              hassle-free and enjoyable experience. Our mission is to revolutionize the way people book movie tickets 
              by providing a fast, intuitive, and user-friendly platform that connects movie lovers with their favorite 
              cinemas across India.
            </p>
          </section>

          {/* What We Offer */}
          <section className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-5 sm:p-6 md:p-8 lg:p-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-red-500" />
              What We Offer
            </h2>
            <div className="grid md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              <div className="bg-white/5 rounded-xl p-4 sm:p-5 md:p-6 border border-white/10">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">🎬 Extensive Movie Library</h3>
                <p className="text-gray-400 text-sm sm:text-base">
                  Browse through the latest releases and upcoming movies from major studios, 
                  all in one place with detailed information and trailers.
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-3">📍 Multi-City Support</h3>
                <p className="text-gray-400">
                  Find theatres across 20+ major Indian states and 100+ cities. 
                  Select your location and discover nearby cinemas instantly.
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-3">💺 Easy Seat Selection</h3>
                <p className="text-gray-400">
                  Interactive seat maps let you choose your preferred seats with real-time 
                  availability updates for a smooth booking experience.
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-3">💳 Secure Payments</h3>
                <p className="text-gray-400">
                  Safe and secure payment processing through Stripe, ensuring your 
                  transactions are protected with industry-standard encryption.
                </p>
              </div>
            </div>
          </section>

          {/* Technology Stack */}
          <section className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <Code className="w-7 h-7 text-red-500" />
              Built With Modern Technology
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
                <p className="text-white font-semibold">Frontend</p>
                <p className="text-gray-400 text-sm mt-1">React 19, Vite, Tailwind CSS</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
                <p className="text-white font-semibold">Backend</p>
                <p className="text-gray-400 text-sm mt-1">Node.js, Express 5, MongoDB</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
                <p className="text-white font-semibold">Services</p>
                <p className="text-gray-400 text-sm mt-1">Stripe, Clerk, Inngest, TMDB</p>
              </div>
            </div>
          </section>

          {/* About Developer */}
          <section className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">About the Developer</h2>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-500" />
                  Kush Kore
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Hello! I'm <strong className="text-white">Kush Kore</strong>, a passionate Fullstack Developer 
                  from <strong className="text-white">Mumbai, Maharashtra</strong>. I specialize in building modern 
                  web applications with clean UI, efficient backend logic, and a focus on performance and user experience.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  I love turning ideas into functional, beautiful digital solutions. KukiShow represents my commitment 
                  to creating seamless user experiences and leveraging cutting-edge technology to solve real-world problems.
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h4 className="text-white font-semibold mb-4">Get in Touch</h4>
                <div className="space-y-3">
                  <a 
                    href="mailto:kushkore90@gmail.com" 
                    className="flex items-center gap-3 text-gray-300 hover:text-red-400 transition"
                  >
                    <Mail className="w-5 h-5 text-red-500" />
                    <span>kushkore90@gmail.com</span>
                  </a>
                  <a 
                    href="tel:+918788397057" 
                    className="flex items-center gap-3 text-gray-300 hover:text-red-400 transition"
                  >
                    <Phone className="w-5 h-5 text-red-500" />
                    <span>+91 8788397057</span>
                  </a>
                  <Link 
                    to="/contact" 
                    className="inline-block mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition font-medium"
                  >
                    Contact Me
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default About
