import { useEffect, useState } from 'react';
import imgLogoDinamica from '../../img/logo-dg.png';
import axios from 'axios';
import Swal from 'sweetalert2';
import { RUTA_BACK_PRODUCCION } from '../../types';
import { useSelector } from 'react-redux';

const form = {
    codigo: '',
    password: '',
    passwordConfirm: '',
}

export default function FormChangePass() {

    const { infoUsuario } = useSelector(state => state.regchangepass);

    const [correo, setCorreo] = useState("");
    const [error, setError] = useState(null);
    const [objetoEnviar, setObjetoEnviar] = useState(form);
    const [coincidencia, setCoincidencia] = useState(null);
    const [tamano, setTamano] = useState(null);
    const [disable, setDisable] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        //capturamos la pre para que si valide lo actual.
        const updateFormData = { ...objetoEnviar, [name]: value };

        setObjetoEnviar(updateFormData);
        if (name === 'password' || name === 'passwordConfirm') {
            if (updateFormData.password !== updateFormData.passwordConfirm) {
                setCoincidencia({ message: 'Las contraseñas no coinciden' });
                setDisable(true);
            } else if (updateFormData.password === updateFormData.passwordConfirm) {
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

    useEffect(() => {
        const partes = infoUsuario.email.split('@');
        const usuarioProtegido = partes[0].charAt(0) + '*'.repeat(partes[0].length - 2) + partes[0].charAt(partes[0].length - 1);
        const correoProtegido = partes[1].charAt(0) + '*'.repeat(partes[1].length - 2) + partes[1].charAt(partes[1].length - 1);
        setCorreo(usuarioProtegido + '@' + correoProtegido);
    }, [infoUsuario])


    const handleSubmit = async (e) => {
        if (disable) {//esto es una validación por si logran pasar una contraseña mas corta
            Swal.fire({
                title: "Ops",
                html: "Se presentó un error en el servidor, intenta más tarde o comunícate con el área encargada.<br><br>Código de error: " + error.code,
                icon: 'error',
            });
            return;
        }
        if (objetoEnviar.password !== objetoEnviar.passwordConfirm) {
            Swal.fire({
                title: "Ops",
                html: "Se presentó un error en el servidor, intenta más tarde o comunícate con el área encargada.<br><br>Código de error: " + error.code,
                icon: 'error',
            });
            return;
        }
        setDisable(true);
        setError(null);
        e.preventDefault();
        const urlBase = `${RUTA_BACK_PRODUCCION}genUsuario/${objetoEnviar.codigo}`;
        const genUsuario = ({
            oid: infoUsuario.oid,
            usuclave: objetoEnviar.password,
            usuemail: infoUsuario.email,
        });
        axios.put(urlBase, genUsuario)
            .then(() => {
                Swal.fire({
                    title: "información",
                    text: "Se ha realizado el cambio, seras redirigido a DGH",
                    icon: 'info',
                }).then(() => {
                    window.location.href = 'http://webdgh/';
                });
            }).catch(error => {
                setDisable(false);
                setError(error);
                console.error('error ', error);
                if (error != null && error.code === 'ERR_NETWORK') {
                    Swal.fire({
                        title: "Ops",
                        html: "Se presentó un error en el servidor, intenta más tarde o comunícate con el área encargada.<br><br>Código de error: " + error.code,
                        icon: 'error',
                    });
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
                            <span> Se envio el codigo al correo: {correo}</span>
                        </div>
                        {tamano && tamano.message && <span className='link-danger'>{tamano.message}</span>}
                        <div className='col-md-6 offset-md-3'>
                            <input className='form-control mt-3 ' type="text" placeholder='Ingrese código de verificación' id='codigo' name='codigo' required={true} onChange={handleChange} />
                            {error && error.response && error.response.data.codigo && (
                                <span className='link-danger'> {error.response.data.codigo}</span>
                            )}
                            {error && error.response && error.response.data.mensaje && (
                                <span className='link-danger'> codigo incorrecto</span>
                            )}
                        </div>
                        <div className='col-md-6 offset-md-3'>
                            <input className='form-control mt-2 ' type='password' placeholder='Ingrese nueva contraseña' id='password' name='password' required={true} onChange={handleChange} />
                            {error && error.response && error.response.data.password && (
                                <span className='link-danger'> {error.response.data.password}</span>
                            )}
                        </div>
                        <div className='col-md-6 offset-md-3'>
                            <input className='form-control mt-2 ' type='password' placeholder='confirme la contraseña' id='passwordConfirm' name='passwordConfirm' required={true} onChange={handleChange} />
                            {error && error.response && error.response.data.passwordConfirm && (
                                <span className='link-danger'> {error.response.data.passwordConfirm}</span>
                            )}
                            {coincidencia && coincidencia.message && <span className='link-danger'>{coincidencia.message}</span>}
                        </div>
                        <div className="row justify-content-around mt-4 mb-4">
                            <div className='col-6'>
                                <button type="submit" className='btn btn-primary' disabled={disable}>{disable ? 'Cargando...' : 'confirmar cambio'}</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}