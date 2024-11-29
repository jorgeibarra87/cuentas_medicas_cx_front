import { useEffect, useState } from 'react';
import imgLogoDinamica from '../../img/logo-dg.png';
import spinnerLoginText from '../Loading';
import axios from 'axios';
import { RUTA_BACK_PRODUCCION } from '../../types';
import Swal from 'sweetalert2';
import FormChangePass from './FormChangePass';

export default function FormSolDocumento() {

    const [form , setForm] = useState('');
    const [datosContacto, setDatosContacto] = useState(null);
    const [datosProtegidos, setDatosProtegidos] = useState(null);
    const [error, setError] = useState(null);
    const [codigo, setCodigo] = useState(null);

    useEffect(() => {         
        document.title = 'Restablecer contraseña';
    },[]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({...form, [name]: value});
    }

    const handleSubmitDocumento = (e) => {
        setError(null);
        e.preventDefault();
        axios.get(`${RUTA_BACK_PRODUCCION}genUsuario/datosdecontacto/${form.documento}`)
        .then((response) => {
            setDatosContacto(response.data);
        }).catch((error) => {
            if(error && error.response && error.response.data && error.response.data.mensaje){
                setError(error.response.data.mensaje.split(',')[1]);
            }else{
                console.error(error);
            }
        });
    }

    useEffect(() => {
        if(datosContacto){
            if(datosContacto.usuemail){
                const partes = datosContacto.usuemail.split('@');
                const usuarioProtegido = partes[0].charAt(0) + '*'.repeat(partes[0].length - 2) + partes[0].charAt(partes[0].length - 1);
                const correoProtegido = partes[1].charAt(0) + '*'.repeat(partes[1].length - 2) + partes[1].charAt(partes[1].length - 1);
                setDatosProtegidos({usuemail: usuarioProtegido + '@' + correoProtegido});
            }
            if(datosContacto.gmemovil){
                const movilProtegido = datosContacto.gmemovil.charAt(0) + '*'.repeat(datosContacto.gmemovil.length - 2) + datosContacto.gmemovil.charAt(datosContacto.gmemovil.length - 1);
                setDatosProtegidos({gmemovil: movilProtegido});
            }
        }
    },[datosContacto]);

    const handleSubmitDatosContacto = async (e) => {
        setError(null);
        setCodigo(null);
        e.preventDefault();
        console.log(datosContacto);
        if(form.contactMethod === 'phone'){
            //enviar sms
            console.log('enviar sms');
        }else if(form.contactMethod === 'email'){
            spinnerLoginText('Enviando...');
            await axios.post(`${RUTA_BACK_PRODUCCION}regitrocambiopassoword/solicitarCodigo`, {oid: datosContacto.oid, documento: datosContacto.usunombre,email: datosContacto.usuemail})
                .then((response) => {
                    
                    setCodigo(response.data);
                    Swal.close();
                }).catch((error) => {
                    if(error && error.response && error.response.data && error.response.data.mensaje){
                        console.log(error.response.data.mensaje);
                        setError(error.response.data.mensaje.split(',')[1]);
                        setCodigo({...codigo, documento: datosContacto.usunombre})
                    }else{
                        setCodigo(null);
                        console.error(error);
                    }
                    Swal.close();
                });
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            {!codigo && <div className="card border-light mb-3" style={{ width: '33rem' }}>
                <img src={imgLogoDinamica} className="card-img-top" alt="..." />
                <div className="card-body text-bg-light text-center">
                    { !datosContacto && 
                    <>
                        <form onSubmit={handleSubmitDocumento} id='formulario'>
                            <h5 className="card-title mt-5">Restablecer la contraseña</h5>
                            
                            <div className='col-md-6 offset-md-3'>
                                <input className='form-control mt-4 ' placeholder='Ingrese número de documento' id='documento' name='documento' onChange={handleChange}/> 
                            </div>
                            {error && <span className='link-danger'>{error}</span>}
                        </form>
                        <div className="row justify-content-around mt-4 mb-4">
                            <div className='col-4'>
                                <button className='btn btn-primary' type='submit' form='formulario' > soliciar cambio </button> {/** onClick={solCambio} disabled={loading}  {loading ? 'Cargando...' : 'Solicitar cambio'}*/    }
                            </div>
                            <div className='col-4'>
                                <button className='btn btn-success'  >tengo un código</button> {/* onClick={solCambio} */}
                            </div>
                        </div>
                    </>
                    }
                    { datosContacto &&
                        <>
                            {!datosContacto.usuemail && !datosContacto.gmemovil ? 
                                <h5 className='card-title mt-5'>Tu usuario no cuenta con email ni número de telefono. No puedes restablecer tu contraseña</h5>
                                : 
                                <> 
                                    <form onSubmit={handleSubmitDatosContacto} id='formulario'>
                                        <h5 className="card-title mt-5">Selecciona el metodo de contacto </h5>                                        
                                        <div className='col-md-6 offset-md-3 mt-3'>
                                            {datosContacto.gmemovil && 
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="contactMethod" id="phone" value="phone" onChange={handleChange} />
                                                <label className="form-check-label" htmlFor="phone">
                                                    {datosProtegidos && datosProtegidos.gmemovil}
                                                </label>
                                            </div>
                                            }
                                            {datosContacto.usuemail &&
                                                <div className="form-check">
                                                    <input className="form-check-input" type="radio" name="contactMethod" id="email" value="email" onChange={handleChange}/>
                                                    <label className="form-check-label" htmlFor="email">
                                                        {datosProtegidos && datosProtegidos.usuemail}
                                                    </label>
                                                </div>
                                            }
                                        </div>
                                        {error && <span className='link-danger'>{error}</span>}
                                    </form>
                                    <div className="row justify-content-around mt-4 mb-4">
                                        <div className='col-4'>
                                            <button className='btn btn-primary' type='submit' form='formulario'>Enviar código</button> {/** onClick={solCambio} disabled={loading}  {loading ? 'Cargando...' : 'Solicitar cambio'}*/    }
                                        </div>
                                    </div>
                            </>}
                        </>
                    }
                </div>
            </div>}
            {codigo && <FormChangePass datosContacto={datosContacto}/>}
        </div>
    )
}
