import { useEffect, useState } from 'react';
import imgLogoDinamica from '../../img/logo-dg.png';
import axios from 'axios';
import { RUTA_BACK_PRODUCCION } from '../../types';
import Swal from 'sweetalert2';
import FormChangePass from './FormChangePass';
import { useDispatch, useSelector } from 'react-redux';
import { regchangepassInfoUser, regchangepassTimeExpired } from '../../actions/regchangepassActions';
import spinnerLoginText from '../Loading';

export default function FormSolDocumento() {

    const { infoUsuario, timeExpired } = useSelector(state => state.regchangepass);
    const dispatch = useDispatch();

    const [inputDocumento, setInputDocumento] = useState("");
    const [error, setError] = useState(null);
    const [loading] = useState(false); // para controlar estado del boton de solicitar codigo.

    const handleChange = (e) => {
        const { value } = e.target;
        setInputDocumento(value);
    }

    useEffect(() => {
        if (infoUsuario.email) {
            spinnerLoginText('Por favor espere...');
            const urlbase = `${RUTA_BACK_PRODUCCION}regchangepass/solicitarCodigo`;
            axios.post(urlbase, infoUsuario)
                .then(response => {
                    dispatch(regchangepassTimeExpired(response.data));
                    Swal.close();
                }).catch(error => {
                    Swal.fire({
                        title: "¡Error!",
                        text: "Se ha presentado un error interno.",
                        icon: 'error',
                    })
                    console.error("Error en la petición POST:", error);
                })
        }
    }, [infoUsuario, dispatch])

    useEffect(() => {
        if (timeExpired.milisegundos && timeExpired.milisegundos < -150) {
            Swal.fire({
                title: "información",
                text: "Actualmente tienes un codigo vigente, tienes " + timeExpired.minutos + " minutos restantes para utilizarlo",
                icon: "info",
            })
        }
    }, [timeExpired])

    const solCambio = async () => {
        setError(null);
        const documento = inputDocumento.trim();
        axios.get(`${RUTA_BACK_PRODUCCION}genUsuario/${documento}/infogeneral`)
            .then((response) => {
                dispatch(regchangepassInfoUser(response.data));
            }).catch((error) => {
                setError(error);
                console.err("Error ", error)
            })
    }

    return (
        <div>
            {timeExpired.minutos ? (<>
                <FormChangePass />
            </>
            ) :
                (<div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                    <div className="card border-light mb-3" style={{ width: '33rem' }}>
                        <img src={imgLogoDinamica} className="card-img-top" alt="..." />
                        <div className="card-body text-bg-light text-center">
                            <div >
                                <h5 className="card-title mt-5">Restablecer la contraseña</h5>
                                {error && error.response && error.response.data && error.response.data.codigoError && error.response.data.codigoError === "GC-0003" && (
                                    <div className='col-md-12'>
                                        <p className="link-warning">¡documento no encontrado!</p>
                                    </div>
                                )}
                                {infoUsuario.oid != 0 && !infoUsuario.email && (
                                    <div className='col-md-12'>
                                        <p className="link-warning">¡No cuenta con correo electronico!</p>
                                    </div>
                                )}
                                <div className='col-md-6 offset-md-3'>
                                    <input className='form-control mt-4 ' placeholder='Ingrese número de documento' id='documento' name='documento' onChange={handleChange} value={inputDocumento} />
                                </div>
                                <div className="row justify-content-around mt-4 mb-4">
                                    <div className='col-4'>
                                        <button className='btn btn-primary' onClick={solCambio} disabled={loading} >{loading ? 'Cargando...' : 'Solicitar cambio'} </button>
                                    </div>
                                    <div className='col-4'>
                                        <button className='btn btn-success' onClick={solCambio} >tengo un código</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)}
        </div>
    )
}
