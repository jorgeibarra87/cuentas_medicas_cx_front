/** Este componente se encarga de sicronizar unicamente al usuario con el authentication-service
 * solo sincroniza documento, NO SINCRONIZA ROLES
 */

import { Modal, Spinner } from 'react-bootstrap'
import useSaveUsuarioAuthSer from '../hooks/authService/useSaveUsuario';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function SincronizarUsuario({ show, handleClose, documento }) {

    const { saveUsuario: saveUsuarioAuht, loading, error, response: responseUsuAuth } = useSaveUsuarioAuthSer();
    const [inputDoc, setInputDoc] = useState(documento);

    useEffect(() => {
        setInputDoc(documento);
    }, [documento]);

    // Efecto para manejar la respuesta de la sincronización del usuario
    // Si la respuesta es exitosa, muestra un mensaje de éxito y cierra el modal
    useEffect(() => {
        if(!responseUsuAuth) return;
        toast.success("!Se sincronizó correctamente el usuario!");
        setInputDoc(""); // Limpia el campo de entrada
        //setTimeout(handleClose, 1000); // Cierra el modal después de 1.5 segundos
        handleClose();
    }, [responseUsuAuth])

    // Efecto para limpiar el campo de entrada cuando se cierra el modal
    // Esto asegura que el campo esté vacío la próxima vez que se abra el modal
    useEffect(() => {
        if(!show) setInputDoc(""); 
    }, [show]);

    // Maneja el cambio en el campo de entrada del documento
    const handleChange = (e) => {
        const { value } = e.target;
        setInputDoc(value);
    }

    // Maneja el estado del error 
    useEffect(() => {
        if(error){
            if(error.response?.data?.mensaje) { // si trae algun mensaje de error personalizado desde el backend
                toast.error(error.response.data.mensaje);
            } else {
                toast.error("Ocurrió un error al sincronizar el usuario");
            }
        }
    }, [error]);

    // Maneja el envío del formulario
    // Verifica que el campo de documento no esté vacío antes de llamar a la función de 
    // sincronización del usuario
    // Si el campo está vacío, muestra un mensaje de error
    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputDoc === "") {
            toast.error("Debe ingresar un número de documento");
            return;
        }
        saveUsuarioAuht(inputDoc);
    }

    return (
        <Modal show={show} onHide={handleClose} >
            <Modal.Header closeButton>
                <span>Sincronizar usuario</span>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" id="documento" value={inputDoc} placeholder="Ingrese el número de documento" onChange={handleChange} />
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? (
                                <>
                                    <Spinner size='sm' animation='border' className='me-2' />
                                    Sincronizando...
                                </>
                                ):(
                                "Sincronizar")}
                            </button>
                        </div>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    )
}

export default SincronizarUsuario