import { Modal } from 'react-bootstrap'
import useSaveUsuarioAuthSer from '../hooks/authService/useSaveUsuario';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function SincronizarUsuario({ show, handleClose, documento }) {

    const notify = () => toast("Se regitro correctamente!");
    const { saveUsuario: saveUsuarioAuht, response: responseUsuAuth } = useSaveUsuarioAuthSer();
    const [inputDoc, setInputDoc] = useState(documento);

    const handleChange = (e) => {
        const { value } = e.target;
        setInputDoc(value);
    }

    useEffect(() => {
        setInputDoc(documento); // Actualiza el inputDoc cuando cambia el prop documento
    }, [documento]);

    useEffect(() => {
        if (responseUsuAuth) {
            notify(); 
            setInputDoc(""); // Limpia el campo de entrada
            // handleClose() en 2 segundos
            setTimeout(() => {
                handleClose();
            }, 1500);
        }
    }, [responseUsuAuth])

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputDoc === "") {
            alert("Debe ingresar un número de documento");
            return;
        }
        saveUsuarioAuht(inputDoc);
    }

    return (
        <>
        <Modal show={show} onHide={handleClose} >
            <Modal.Header closeButton>
                <span>Sincronizar usuario</span>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <div className="form-group">
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" id="documento" value={inputDoc} placeholder="Ingrese el número de documento" onChange={handleChange} />
                            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Sincronizar</button>
                        </div>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
        </>
    )
}

export default SincronizarUsuario