import { LayoutDashboardIcon, ListCollapseIcon, ListIcon, PlusSquareIcon, TicketIcon, BarChart3Icon } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'

const AdminSidebar = () => {

    const { user } = useAppContext()

    const adminNavlinks = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboardIcon },
        { name: 'Add Shows', path: '/admin/add-shows', icon: PlusSquareIcon },
        { name: 'List Shows', path: '/admin/list-shows', icon: ListIcon },
        { name: 'List Bookings', path: '/admin/list-bookings', icon: ListCollapseIcon },
        { name: 'Promo Codes', path: '/admin/promo-codes', icon: TicketIcon },
        { name: 'Analytics', path: '/admin/analytics', icon: BarChart3Icon },
    ]

  return (
    <div className='h-[calc(100vh-64px)] md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-gray-300/20 text-sm'>
      <img className='h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto' src={user?.imageUrl || assets.profile} alt="sidebar" />
      <p className='mt-2 text-base max-md:hidden'>{user?.firstName || 'Admin'} {user?.lastName || 'User'}</p>
      <p className='mt-1 text-xs text-gray-500 max-md:hidden'>{user?.primaryEmailAddress?.emailAddress || 'admin@example.com'}</p>
      <div className='w-full'>
        {adminNavlinks.map((link, index)=>(
            <NavLink key={index} to={link.path} end className={({ isActive }) => `relative flex items-center max-md:justify-center gap-2 w-full py-2.5 min-md:pl-10 first:mt-6 text-gray-400 ${isActive && 'bg-primary/15 text-primary group'}`}>
                {({ isActive })=>(
                    <>
                        <link.icon className="w-5 h-5" />
                        <p className="max-md:hidden">{link.name}</p>
                        <span className={`w-1.5 h-10 rounded-l right-0 absolute ${isActive && 'bg-primary'}`} />
                    </>
                )}
            </NavLink>
        ))}
      </div>
    </div>
  )
}

export default AdminSidebar
