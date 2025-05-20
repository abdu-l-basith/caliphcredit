import React from 'react'

function DirectorSidebar({ isOpen, closeSidebar }) {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <ul>
        <li onClick={closeSidebar}>Profile</li>
        <li onClick={closeSidebar}>Mark Credits</li>
        <li onClick={closeSidebar}>Settings</li>
        <li onClick={closeSidebar}>Add Credit</li>
        <li onClick={closeSidebar}>Logout</li>
      </ul>
        </div>
  )
}

export default DirectorSidebar