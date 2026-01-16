import React, { useState, useEffect } from 'react'

const fetchContacts = async (page = 1, pageSize = 20, alias ='') => {
    const BASE_URL = 'http://localhost:3000/v1/client/contact';

    const url = new URL(BASE_URL)
    if (alias) url.searchParams.append('alias', alias);
    url.searchParams.append('page', page)
    url.searchParams.append('page_size', pageSize)
    
    try {
        const token = localStorage.getItem('authToken')
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`)
        }
        const data = await response.json()
        return data
    } catch (error) {
        setErrors(prev => ({ ...prev, form: error.message }))
    } finally {
        setLoading(false)
    }
    
        
}

export default function ContactsPage() {
    const [contacts, setContacts] = useState([]);
    const [search, setSearch] = useState("")
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({ id: "", alias: "", account_number: "", description: "" })
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadContacts();
    }, [search])

    const loadContacts = async () => {
        try {
            const data = await fetchContacts(1, 20, search);
            setContacts(data.data || [])
        } catch (err) {
            console.error(err);
        }
    }
    function validate(values) {
        const errs = {}
        if(!values.alias) errs.alias = 'Ingrese un alias para el contacto'
        if(!values.account_number || !/^[0-9A-Za-z]{8,32}$/.test(values.account_number)) errs.account_number = 'Número de cuenta inválido (8/32 caracteres alfanuéricos). '
        if(values.description && values.description.length > 250) errs.description = 'La descripción es demasiado larga.'
        return errs
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const v = validate(form)
        setErrors(v)
        if(Object.keys(v).length !== 0) return

        const isEditing = !!formData.id;

        const url = isEditing 
        ? `http://localhost:3000/v1/client/contact/${formData.id}`
        : `http://localhost:3000/v1/client/contact`

        const method = isEditing ? "PATCH": "POST"

        const payload = isEditing
        ? { alias: formData.alias, description: formData.description }
        : { alias: formData.alias, description: formData.description, account_number: formData.account_number }

        try {
            const res = await fetch(url, {
                method: method,
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            } else {
                setShowModal(false);
                loadContacts();
            }
        } catch (err) {
            setErrors(prev => ({ ...prev, form: error.message }))
        }
    }

    const handleDelete = async (id) => {
        const BASE_URL = 'http://localhost:3000/v1/client/contact';
        if (window.confirm("Seguro que deseas eliminar este contacto?")) {
            try {
                const token = localStorage.getItem('authToken')
                const response = await fetch(`${BASE_URL}/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`)
                }
            } catch (error) {
                setErrors(prev => ({ ...prev, form: error.message }))
            } finally {
                setLoading(false)
            }
        }
    }

    const handleCopy = (num) => {
        navigator.clipboard.writeText(num);
        alert("Numero de cuenta copiado");
    }

    const openModal = (contact = { alias: "", account_number: "", description: "" }) => {
        setFormData(contact)
        setShowModal(true)
    }
    
    return (
        <main className = "mt-5">
            <div className='container'>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className='fw-bold'>Contactos</h2>
                    <button className='btn btn-primary' onClick={() => openModal()}>
                        Agregar contacto
                    </button>
                </div>
                <input
                    type="text"
                    className='form-control mb-3'
                    placeholder='Buscar por alias...'
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className='table-responsive shadow-sm rounded'>
                    <table className='table table-hover align-middle bg-white'>
                        <thead className='table-dark'>
                            <tr>
                                <th>Alias</th>
                                <th>Numero de Cuenta</th>
                                <th>Descripcion</th>
                                <th className="text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.map((c) => (
                                <tr key={c.id}>
                                    <td className='fw-semibold'>{c.alias}</td>
                                    <td>
                                        <code className='me-2 text-primary'>{c.account_number}</code>
                                        <button
                                            className='btn btn-outline-secondary btn-sm border-0'
                                            onClick={() => handleCopy(c.account_number)}
                                        >📋</button>
                                    </td>
                                    <td className='text-center'>
                                        <button className='btn btn-sm btn-warning me-2' onClick={() => openModal(c)}>Editar Contacto</button>
                                        <button className='btn btn-sm btn-danger' onClick={() => handleDelete(c.id)}>Eliminar contacto</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {showModal && (
                    <div className='modal d-block' tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5' }}>
                        <div className='modal-dialog modal-dialog-centered'>
                            <div className='modal-content border-0 shadow'>
                                {errors.form && <div className='alert alert-danger'>{errors.form}</div>}
                                <form onSubmit={handleSubmit}>
                                    <div className='modal-header'>
                                        <h5 className='modal-title'>{formData.id ? "Editar contacto": "Nuevo contacto"}</h5>
                                        <button type="button" className='btn-close' onClick={() => setShowModal(false)}></button>
                                    </div>
                                    <div className='modal-body'>
                                        <div className='mb-3'>
                                            <label className='form-label'>Alias</label>
                                            <input
                                                name="alias"
                                                type="text"
                                                value={formData.alias}
                                                onChange={(e) => setFormData({...formData, alias: e.target.value})}
                                                className={`form-control ${errors.alias ? 'is-invalid' : ''}`}
                                                required
                                            />
                                            {errors.alias && <div className='invalid-feedback'>{errors.alias}</div>}
                                        </div>
                                        <div className='mb-3'>
                                            <label className='form-label'>Numero de Cuenta</label>
                                            <input 
                                                name="account number"
                                                type="text"
                                                value={formData.account_number}
                                                onChange={(e) => setFormData({...formData, account_number: e.target.value})}
                                                className={`form-control ${errors.account_number ? 'is-invalid' : ''}`}
                                                required
                                                disabled={!!formData.id} 
                                            />
                                            {errors.account_number && <div className='invalid-feedback'>{errors.account_number}</div>}
                                        </div>
                                        <div className='mb-3'>
                                            <label className='form-label'>Descripcion</label>
                                            <input 
                                                name="description"
                                                type="text"
                                                value={formData.description}
                                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                            />
                                            {errors.description && <div className='invalid-feedback'>{errors.description}</div>}
                                        </div>
                                    </div>
                                    <div className='modal-footer'>
                                        <button className='btn btn-secondary' onClick={() => setShowModal(false)}>Cerrar</button>
                                        <button type="submit" className='btn btn-primary'>{formData.id ? "Guardar cambios" : "Agregar contacto"}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

