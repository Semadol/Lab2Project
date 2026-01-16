import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const location = useLocation()
  const publicPaths = ['/', '/register', '/login', '/info']
  const isRegister = location.pathname === '/register'
  const isLogin = location.pathname === '/login'
  const showAuthLinks = publicPaths.includes(location.pathname)

  return (
    <header className="bg-white shadow-sm">
      <nav className="navbar navbar-expand-lg container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src="/assets/logo-no-background.png" alt="logo" className="logo" />
        </Link>
        
        <div className="collapse navbar-collapse" id="navMenu">
          {showAuthLinks && (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                {isRegister ? (
                  <Link className="nav-link" to="/">Volver</Link>
                ) : (
                  <Link className="nav-link" to="/register">Regístrate</Link>
                )}
              </li>
              <li className="nav-item">
                {isLogin ? (
                  <Link className="nav-link btn btn-primary ms-2" to="/">Volver</Link>
                ) : (
                  <Link className="nav-link btn btn-primary ms-2" to="/login">Acceso</Link>
                )}
              </li>
            </ul>
          )}
        </div>
      </nav>
    </header>
  )
}
