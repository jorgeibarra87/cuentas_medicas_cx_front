import { useEffect, useState } from 'react';
import imgLogoDinamica from '../../img/logo-dg.png';
import axios from 'axios';
import { RUTA_BACK_PRODUCCION } from '../../types';
import Swal from 'sweetalert2';


const formInitial = {
    oid: '',
    codigo: '',
    username: '',
    password: '',
    newPassword: ''
}

export default function FormChangePass({datosContacto}) {

    const [form, setForm] = useState(formInitial);
    const [coincidencia, setCoincidencia] = useState(null);
    const [tamano, setTamano] = useState(null);
    const [error, setError] = useState(null);
    const [disable, setDisable] = useState(false);
    const INACTIVITY_TIME = 5 * 60 * 1000; // 5 minutos

    let inactivityTimer;

    const handleInactivity = () => {
        Swal.fire({
            title: 'Inactividad detectada',
            text: 'Serás redirigido debido a la inactividad.',
            icon: 'warning',
            timer: 3000,
            showConfirmButton: false,
        }).then(() => {
            window.location.href = 'http://optimus/vulcano/'; // Cambiar por la URL de redirección
        });
    };

    const resetInactivityTimer = () => {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(handleInactivity, INACTIVITY_TIME);
    };

    useEffect(() => {
        // Configurar eventos para detectar actividad
        const events = ['mousemove', 'keydown', 'click', 'scroll'];
        events.forEach(event => window.addEventListener(event, resetInactivityTimer));
        // Iniciar el temporizador de inactividad
        resetInactivityTimer();
        return () => {
            // Limpiar eventos y temporizador al desmontar el componente
            events.forEach(event => window.removeEventListener(event, resetInactivityTimer));
            clearTimeout(inactivityTimer);
        };
    }, []);

    useEffect(() => {
       document.title = 'Restablecer contraseña';
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        //capturamos la pre para que si valide lo actual.
        const updateFormData = { ...form, [name]: value };

        setForm(updateFormData);
        if (name === 'password' || name === 'newPassword') {
            if (updateFormData.password !== updateFormData.newPassword) {
                setCoincidencia({ message: 'Las contraseñas no coinciden' });
                setDisable(true);
            } else if (updateFormData.password === updateFormData.newPassword) {
                setCoincidencia(null);
                setDisable(false);
            }
            if (updateFormData.password.length < 6) {
                setTamano({ message: 'contraseña muy corta, minimo 6 caracteres' })
                setDisable(true);
            } else if (updateFormData.password.length >= 6) {
                setTamano(null);
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const formData = {
            ...form,
            oid: datosContacto.oid,
            username: datosContacto.usunombre,
        };
        if(formData.oid == '' || formData.username == ''){
            return;
        }
        axios.post(`${RUTA_BACK_PRODUCCION}regitrocambiopassoword/cambiarPassword`, formData)
            .then((response) => {
                // al recibir respuesta redirigir a una pagina externa  http://optimus/vulcano/
                Swal.fire({
                    title: 'Contraseña cambiada',
                    text: 'La contraseña se cambio correctamente',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = 'http://optimus/vulcano/';
                    }
                });

                if(response.data.message){
                    setError(response.data.message);
                }
            }).catch((error) => {
                if(error && error.response && error.response.data && error.response.data.mensaje){
                    setError(error.response.data.mensaje.split(',')[1]);
                }else{
                    console.error(error);
                }
            });
    }

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="card border-light mb-3" style={{ width: '33rem' }}>
                <img src={imgLogoDinamica} className="card-img-top" alt="..." />
                <div className="card-body text-bg-light text-center">
                    <form onSubmit={handleSubmit}>
                        <h5 className="card-title mt-5">Restablecer la contraseña</h5>
                        <div className='col-md-12'>
                            <span> Se envio el codigo al correo: </span>
                        </div>
                        {tamano && tamano.message && <span className='link-danger'>{tamano.message}</span>}
                        <div className='col-md-6 offset-md-3'>
                            <input className='form-control mt-3 ' type="text" placeholder='Ingrese código de verificación' id='codigo' name='codigo' required={true} onChange={handleChange} />
                            
                        </div>
                        <div className='col-md-6 offset-md-3'>
                            <input className='form-control mt-2 ' type='password' placeholder='Ingrese nueva contraseña' id='password' name='password' required={true} onChange={handleChange} />
                        </div>
                        <div className='col-md-6 offset-md-3'>
                            <input className='form-control mt-2 ' type='password' placeholder='confirme la contraseña' id='newPassword' name='newPassword' required={true} onChange={handleChange} />
                            
                            {coincidencia && coincidencia.message && <span className='link-danger'>{coincidencia.message}</span>}
                        </div>
                        {error && <span className='link-danger'>{error}</span>}
                        <div className="row justify-content-around mt-4 mb-4">
                            <div className='col-6'>
                                <button type="submit" className='btn btn-primary' disabled={disable} >cambio</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}