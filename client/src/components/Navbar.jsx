import React, { useState } from 'react'
import { Link, useNavigate, NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { MenuIcon, SearchIcon, TicketPlus, XIcon, Shield } from 'lucide-react'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { useAppContext } from '../context/AppContext'
import MovieSearch from './MovieSearch'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { user } = useUser()
  const { openSignIn } = useClerk()
  const navigate = useNavigate()
  const { favoriteMovies, isAdmin } = useAppContext()

  return (
    <div className='fixed top-0 left-0 z-50 w-full flex items-center justify-between px-4 sm:px-6 md:px-16 lg:px-36 py-3 md:py-5 text-white bg-black/80 backdrop-blur-sm border-b border-white/10'>
      <Link to='/' className='flex-shrink-0 hover:opacity-90 transition-opacity'>
        <img
          src={assets.logo}
          alt="Kukishow logo"
          className='w-32 sm:w-40 md:w-44 lg:w-48 h-auto'
        />
      </Link>

      {/* Desktop Navigation */}
      <div className='hidden md:flex items-center gap-6 lg:gap-8 px-4 lg:px-8 py-2 rounded-full bg-white/10 border border-gray-300/20 backdrop-blur'>
        <Link onClick={() => scrollTo(0, 0)} to='/' className='hover:text-red-500 transition text-sm lg:text-base'>Home</Link>
        <Link onClick={() => scrollTo(0, 0)} to='/movies' className='hover:text-red-500 transition text-sm lg:text-base'>Movies</Link>
        <Link onClick={() => scrollTo(0, 0)} to='/theatres' className='hover:text-red-500 transition text-sm lg:text-base'>Theatres</Link>
        <Link onClick={() => scrollTo(0, 0)} to='/releases' className='hover:text-red-500 transition text-sm lg:text-base'>Releases</Link>
        {favoriteMovies.length > 0 && (
          <Link onClick={() => scrollTo(0, 0)} to='/favorite' className='hover:text-red-500 transition text-sm lg:text-base'>Favorites</Link>
        )}
        {isAdmin && (
          <Link 
            onClick={() => scrollTo(0, 0)} 
            to='/admin'
            className='flex items-center gap-1 text-red-400 font-semibold hover:text-red-300 transition text-sm lg:text-base'
          >
            <Shield className='w-4 h-4' />
            Admin
          </Link>
        )}
      </div>

      {/* Mobile/Desktop Actions */}
      <div className='flex items-center gap-3 sm:gap-4 md:gap-6'>
        <SearchIcon 
          className='w-5 h-5 sm:w-6 sm:h-6 cursor-pointer hover:text-red-500 transition flex-shrink-0' 
          onClick={() => setIsSearchOpen(true)}
        />
        {!user ? (
          <button
            onClick={openSignIn}
            className='px-3 py-1.5 sm:px-4 sm:py-2 md:px-7 md:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer text-xs sm:text-sm whitespace-nowrap'
          >
            Login
          </button>
        ) : (
          <div className='flex-shrink-0'>
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action
                  label="My Bookings"
                  labelIcon={<TicketPlus width={15} />}
                  onClick={() => navigate('/my-bookings')}
                />
                {isAdmin && (
                  <UserButton.Action
                    label="Admin Dashboard"
                    labelIcon={<Shield width={15} />}
                    onClick={() => {
                      navigate('/admin')
                      scrollTo(0, 0)
                    }}
                  />
                )}
              </UserButton.MenuItems>
            </UserButton>
          </div>
        )}
        <MenuIcon
          className='md:hidden w-6 h-6 sm:w-8 sm:h-8 cursor-pointer flex-shrink-0'
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/95 backdrop-blur-md z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={`absolute top-0 left-0 h-full w-80 max-w-[85vw] bg-gray-900 border-r border-white/10 shadow-2xl transform transition-transform duration-300 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className='flex flex-col h-full pt-20 px-6'>
            <XIcon
              className='absolute top-6 right-6 w-6 h-6 cursor-pointer text-white hover:text-red-500 transition'
              onClick={() => setIsOpen(false)}
            />
            
            <nav className='flex flex-col gap-6'>
              <Link 
                onClick={() => { scrollTo(0, 0); setIsOpen(false) }} 
                to='/' 
                className='text-lg font-medium text-white hover:text-red-500 transition py-2'
              >
                Home
              </Link>
              <Link 
                onClick={() => { scrollTo(0, 0); setIsOpen(false) }} 
                to='/movies' 
                className='text-lg font-medium text-white hover:text-red-500 transition py-2'
              >
                Movies
              </Link>
              <Link 
                onClick={() => { scrollTo(0, 0); setIsOpen(false) }} 
                to='/theatres' 
                className='text-lg font-medium text-white hover:text-red-500 transition py-2'
              >
                Theatres
              </Link>
              <Link 
                onClick={() => { scrollTo(0, 0); setIsOpen(false) }} 
                to='/releases' 
                className='text-lg font-medium text-white hover:text-red-500 transition py-2'
              >
                Releases
              </Link>
              {favoriteMovies.length > 0 && (
                <Link 
                  onClick={() => { scrollTo(0, 0); setIsOpen(false) }} 
                  to='/favorite' 
                  className='text-lg font-medium text-white hover:text-red-500 transition py-2'
                >
                  Favorites
                </Link>
              )}
              {isAdmin && (
                <Link 
                  onClick={() => { scrollTo(0, 0); setIsOpen(false) }} 
                  to='/admin'
                  className='flex items-center gap-2 text-lg font-semibold text-red-400 hover:text-red-300 transition py-2'
                >
                  <Shield className='w-5 h-5' />
                  Admin
                </Link>
              )}
            </nav>
          </div>
        </div>
      </div>

      <MovieSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  )
}

export default Navbar
