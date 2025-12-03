import React from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="px-4 sm:px-6 md:px-16 lg:px-36 mt-20 md:mt-40 w-full bg-black text-white">
      <div className="flex flex-col lg:flex-row justify-between w-full gap-8 md:gap-12 lg:gap-8 pb-8 md:pb-12 pt-8 md:pt-12">
        
        {/* Left Section – Logo + About */}
        <div className="lg:max-w-md">
          {/* Logo with styled K */}
          <div className="flex items-center mb-4 md:mb-6">
            <span className="text-2xl sm:text-3xl font-bold">
              <span className="text-red-500">K</span>
              <span className="text-white">ukishow</span>
            </span>
          </div>
          
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-4 md:mb-6">
            KukiShow is a modern movie ticket booking platform where users can easily explore 
            the latest movies, check showtimes, and book tickets seamlessly. Designed for speed, 
            simplicity, and an engaging experience, it brings cinema to your fingertips.
          </p>

          {/* App Store Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3">
            <a 
              href="#" 
              className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 bg-black border border-white rounded-lg hover:bg-white/10 transition group min-h-[44px]"
              aria-label="Download on Google Play"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
              </svg>
              <div className="flex flex-col text-left">
                <span className="text-[9px] sm:text-[10px] text-gray-400 leading-tight uppercase">GET IT ON</span>
                <span className="text-xs sm:text-sm font-semibold leading-tight text-white">Google Play</span>
              </div>
            </a>
            <a 
              href="#" 
              className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 bg-black border border-white rounded-lg hover:bg-white/10 transition group min-h-[44px]"
              aria-label="Download on App Store"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"/>
              </svg>
              <div className="flex flex-col text-left">
                <span className="text-[9px] sm:text-[10px] text-gray-400 leading-tight">Download on the</span>
                <span className="text-xs sm:text-sm font-semibold leading-tight text-white">App Store</span>
              </div>
            </a>
          </div>
        </div>

        {/* Middle and Right Sections */}
        <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 lg:gap-20">
          {/* Company Links */}
          <div>
            <h2 className="text-white font-semibold text-base sm:text-lg mb-4 sm:mb-6">Company</h2>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-red-500 transition-colors text-sm sm:text-base block py-1"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-300 hover:text-red-500 transition-colors text-sm sm:text-base block py-1"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-300 hover:text-red-500 transition-colors text-sm sm:text-base block py-1"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="text-gray-300 hover:text-red-500 transition-colors text-sm sm:text-base block py-1"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h2 className="text-white font-semibold text-base sm:text-lg mb-4 sm:mb-6">Get in touch</h2>
            <div className="space-y-3 sm:space-y-4">
              <a 
                href="tel:+918788397057"
                className="flex items-center gap-3 text-gray-300 hover:text-red-500 transition-colors group py-1 min-h-[44px]"
              >
                <Phone className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform flex-shrink-0" />
                <span className="text-sm sm:text-base break-all">+91 8788397057</span>
              </a>
              <a 
                href="mailto:kushkore90@gmail.com"
                className="flex items-center gap-3 text-gray-300 hover:text-red-500 transition-colors group py-1 min-h-[44px]"
              >
                <Mail className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform flex-shrink-0" />
                <span className="text-sm sm:text-base break-all">kushkore90@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom - Copyright */}
      <div className="border-t border-white/20 pt-4 sm:pt-6 pb-6 sm:pb-8">
        <p className="text-center text-xs sm:text-sm text-gray-400 px-4">
          Copyright {new Date().getFullYear()} © KushKore. All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
