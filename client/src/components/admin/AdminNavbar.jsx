import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { Home, ArrowLeft } from 'lucide-react'

const AdminNavbar = () => {
  const navigate = useNavigate()

  return (
    <div className='flex items-center justify-between px-6 md:px-10 h-16 border-b border-gray-300/30'>
      <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
        <img src={assets.logo} alt="logo" className="w-28 h-auto sm:w-36 md:w-48"/>
      </Link>
      <button
        onClick={() => {
          navigate('/')
          scrollTo(0, 0)
        }}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition text-sm font-medium"
      >
        <Home className="w-4 h-4" />
        <span className="hidden sm:inline">Back to Home</span>
        <span className="sm:hidden">Home</span>
      </button>
    </div>
  )
}

export default AdminNavbar
