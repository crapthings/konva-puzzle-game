import { Outlet } from 'react-router-dom'

export default function Layout ({ children }) {
  return (
    <>
      {children ? children : <Outlet />}
    </>
  )
}
