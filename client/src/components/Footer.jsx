import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <footer className="px-6 md:px-16 lg:px-36 mt-40 w-full text-gray-300">
      <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500 pb-14">
        
        {/* Left Section – Logo + About */}
        <div className="md:max-w-96">
          <img
            src={assets.logo}
            alt="logo"
            className="w-36 h-auto"
          />
          <p className="mt-6 text-sm">
            <strong>KukiShow</strong> is a modern movie ticket booking platform where users
            can easily explore the latest movies, check showtimes, and book tickets
            seamlessly. Designed for speed, simplicity, and an engaging experience, it
            brings cinema to your fingertips.
            </p>

          <div className="flex items-center gap-2 mt-4">
            <img src={assets.googlePlay} alt="google play" className="h-9 w-auto" />
            <img src={assets.appStore} alt="app store" className="h-9 w-auto" />
          </div>
        </div>

        {/* Right Section – Links + Contact */}
        <div className="flex-1 flex items-start md:justify-end gap-20 md:gap-40">
          
          {/* Company Links */}
          <div>
            <h2 className="font-semibold mb-5">Company</h2>
            <ul className="text-sm space-y-2">
              <li><Link to="/">Home</Link></li>
              <li>
                {/* ✅ Updated to route to /about */}
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/kushhh_90/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="https://www.privacypolicies.com/live/0f22a4d1-3b1a-4e35-bc9a-213d9a1cb8b1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h2 className="font-semibold mb-5">Get in touch</h2>
            <div className="text-sm space-y-2">
              <p>📞 +91 8788397057</p>
              <p>✉️ kushkore90@gmail.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <p className="pt-4 text-center text-sm pb-5">
        Copyright {new Date().getFullYear()} © KushKore. All Rights Reserved.
      </p>
    </footer>
  )
}

export default Footer
