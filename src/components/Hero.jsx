import React from 'react'

export default function Hero() {
  return (
    <section className="py-5 bg-light">
      <div className="container py-5 d-flex flex-column flex-lg-row align-items-center gap-4">
        <div className="flex-fill">
          <h1 className="display-5">Banca Universitaria</h1>
          <p className="lead">Soluciones financieras pensadas para estudiantes y personal universitario: cuentas sin comisiones, tarjetas con beneficios y préstamos educativos.</p>
          <div>
            <a href="/register" className="btn btn-primary btn-lg me-2">Abrir cuenta</a>
            <a href="/info" className="btn btn-outline-secondary btn-lg">Conoce más</a>
          </div>
        </div>
        <div className="flex-fill text-center">
          <div style={{maxWidth: '820px'}} className="mx-auto">
            <img src="/assets/hero-illustration.jpg" alt="Ilustración" className="img-fluid" style={{filter: 'blur(0.06rem)'}} />
          </div>
        </div>
      </div>
    </section>
  )
}
