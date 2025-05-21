import React from 'react'
import DashboardLayout from './common/DashboardLayout'
import FacultyLogin from './faculty/FacultyLogin'

function FacultyRoutManager() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  return (
    <>
    {isLoggedIn ? <DashboardLayout /> : <FacultyLogin />}
    </>
  )
}

export default FacultyRoutManager