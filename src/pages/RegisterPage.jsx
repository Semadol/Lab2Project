import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function RegisterPage(){
  const [form, setForm] = useState({ 
    first_name: '',
    last_name: '',
    document_number: '',
    birth_date: '',
    phone_number: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('');
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  function validate(values){
    const errs = {};
    if (!values.first_name) errs.first_name = 'El nombre es obligatorio.';
    if (!values.last_name) errs.last_name = 'El apellido es obligatorio.';
    if (!values.document_number) errs.document_number = 'El documento es obligatorio.';
    if (!values.birth_date) errs.birth_date = 'La fecha de nacimiento es obligatoria.';
    if (!values.phone_number) errs.phone_number = 'El teléfono es obligatorio.';
    if (!values.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errs.email = 'Correo inválido.';
    }
    if (!values.password || values.password.length < 8) {
      errs.password = 'La contraseña debe tener al menos 8 caracteres.';
    }
    if(values.password !== values.confirmPassword) errs.confirmPassword = 'Las contraseñas no coinciden.'
    return errs;
  }

  function handleChange(e){
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: undefined }));
    setApiError('');
  }

  async function handleSubmit(e){
    e.preventDefault()
    const v = validate(form)
    setErrors(v)

    if (Object.keys(v).length === 0) {
      setLoading(true);
      try {
        // El input date da "YYYY-MM-DD", la API espera ISO "YYYY-MM-DDTHH:mm:ss.sssZ"
        // Le agregamos una hora fija (ej. mediodía UTC) para evitar problemas de zona horaria
        const isoDate = new Date(`${form.birth_date}T12:00:00.000Z`).toISOString();

        const payload = {
          ...form,
          birth_date: isoDate,
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          email: form.email.trim(),
          document_number: form.document_number.trim(),
          phone_number: "+58" + form.phone_number.trim().slice(1),
          password: form.password
        };

        const response = await fetch(`/v1/public/client/user/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept-Language': 'es'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) { // Status 201 Created
          setSubmitted(true);
          setSuccessMessage(data.message);
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          // Si el usuario ya existe (Conflicto 409) u otro error
          console.error('Error registro:', data);
          setApiError(data.message || 'Error al registrar el usuario.');
        }

      } catch (error) {
        console.error('Error de red:', error);
        setApiError('Error de conexión con el servidor.');
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <main className="py-5">
      <div className="container">
        <h2 className="mb-3">Regístrate</h2>

        {submitted ? (
          <div className="alert alert-success">{successMessage || 'Registro completado. Revisa tu correo para confirmar.'}</div>
        ) : (
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <form onSubmit={handleSubmit} className="row g-3" noValidate>
                {apiError && (
                  <div className="col-12">
                    <div className="alert alert-danger">{apiError}</div>
                  </div>
                )}
            <div className="col-md-6">
              <label className="form-label">Nombres</label>
              <input name="first_name" value={form.first_name} onChange={handleChange} required className={`form-control ${errors.first_name ? 'is-invalid' : ''}`} />
              {errors.first_name && <div className="invalid-feedback">{errors.first_name}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label">Apellidos</label>
              <input name="last_name" value={form.last_name} onChange={handleChange} required className={`form-control ${errors.last_name ? 'is-invalid' : ''}`} />
              {errors.last_name && <div className="invalid-feedback">{errors.last_name}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label">Cédula</label>
              <input name="document_number" value={form.document_number} onChange={handleChange} required className={`form-control ${errors.document_number ? 'is-invalid' : ''}`} />
              {errors.document_number && <div className="invalid-feedback">{errors.document_number}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label">Fecha de nacimiento</label>
              <input name="birth_date" type="date" value={form.birth_date} onChange={handleChange} required className={`form-control ${errors.birth_date ? 'is-invalid' : ''}`} />
              {errors.birth_date && <div className="invalid-feedback">{errors.birth_date}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label">Teléfono</label>
              <input name="phone_number" type="tel" value={form.phone_number} onChange={handleChange} required className={`form-control ${errors.phone_number ? 'is-invalid' : ''}`} />
              {errors.phone_number && <div className="invalid-feedback">{errors.phone_number}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label">Correo electrónico</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required className={`form-control ${errors.email ? 'is-invalid' : ''}`} />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label">Contraseña</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} required className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label">Repetir contraseña</label>
              <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} />
              {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
            </div>

                <div className="col-12">
                  <button className="btn btn-primary">Crear cuenta</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
