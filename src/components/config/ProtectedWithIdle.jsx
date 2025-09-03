import { useState } from "react";
import useIdleTimer from "../../hooks/useInactivity";
import { useDispatch } from "react-redux";
import { cerrarSesionAction } from "../../actions/loginActions";
import { Modal } from "react-bootstrap";

export default function ProtectedWithIdle({ children }) {
  const [showExpired, setShowExpired] = useState(false);
  const dispatch = useDispatch();

  useIdleTimer(10 * 60 * 1000, () => {
    setShowExpired(true);
  });

  const handleClose = () => {
    dispatch(cerrarSesionAction());
  };
  
  return (
    <>
      {children}
      <Modal show={showExpired} onHide={handleClose} centered>
        <Modal.Dialog className="m-auto w-full md:max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <Modal.Header closeButton>
              <h2 className="text-xl font-semibold text-gray-800">Tu sesión ha caducado</h2>
            </Modal.Header>
            <Modal.Body>
              <p className="text-gray-600">Has pasado mucho tiempo inactivo, vuelve a iniciar sesión.</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                onClick={handleClose} >
                Cerrar
              </button>
            </Modal.Body>
          </div>
        </Modal.Dialog>
      </Modal>
    </>
  );
}