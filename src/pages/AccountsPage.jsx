import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AccountsPage() {
  const navigate = useNavigate()
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    fetchAccounts()
  }, [])

  async function fetchAccounts() {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }

      const [userResponse, balanceResponse] = await Promise.all([
        fetch('/v1/client/user/whoami', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/v1/client/user/balance', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      const userDataResult = await userResponse.json()
      const balanceDataResult = await balanceResponse.json()

      if (userResponse.ok) {
        const userData = userDataResult.data
        
        let currentBalance = 0
        if (balanceResponse.ok && balanceDataResult.data) {
          currentBalance = balanceDataResult.data.balance
        }

        if (userData) {
          userData.balance = currentBalance
          setAccounts([userData])
        } else {
          setAccounts([])
        }
      } else {
        setError(userDataResult.message || 'Error al cargar información')
      }
    } catch (err) {
      console.error(err)
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  async function createAccount() {
    if(!window.confirm('¿Estás seguro de que quieres abrir una nueva cuenta?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/v1/client/account', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      })
      
      const data = await response.json()

      if (response.ok) {
        alert('Cuenta creada exitosamente')
        fetchAccounts() 
      } else {
        alert(data.message || 'Error al crear cuenta')
      }
    } catch (err) {
      console.error(err)
      alert('Error de conexión al crear cuenta')
    }
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Mis Cuentas</h2>
        <button className="btn btn-primary" onClick={createAccount}>
          Abrir nueva cuenta
        </button>
      </div>

      {loading ? (
        <p>Cargando cuentas...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div className="row g-4">
          {accounts.length === 0 ? (
            <div className="col-12">
              <div className="alert alert-info">No tienes cuentas registradas.</div>
            </div>
          ) : (
            accounts.map(account => (
              <div className="col-12 col-md-6 col-lg-4" key={account.account_number}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title text-primary">Cuenta N° {account.account_number}</h5>
                    <p className="card-text text-muted mb-4">
                      {account.account_type || 'Corriente'}
                    </p>
                    <div className="d-flex justify-content-between align-items-end">
                      <div>
                        <small className="text-muted d-block">Saldo disponible</small>
                        <span className="h4 mb-0">
                          {new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES' }).format(account.balance || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer bg-transparent border-top-0 pb-3">
                     <button className="btn btn-outline-primary w-100" onClick={() => navigate('/movements')}>
                       Ver movimientos
                     </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
