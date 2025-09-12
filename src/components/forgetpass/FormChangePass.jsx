import { useEffect, useRef, useState } from 'react';
import imgLogoDinamica from '../../img/logo-dg.png';
import { usePutChangePassword } from '../../hooks/sistemas/usePutChangePassword';
import { toast } from 'react-toastify';
import Loader from '../Loader';

const formInitial = {
  username: '',
  code: '',
  password: '',
  confirmPassword: '',
};

export default function FormChangePass({ datosContacto }) {
  const { loading, error, data, putChangePassword } = usePutChangePassword();

  const [form, setForm] = useState(formInitial);
  const [isInactive, setIsInactive] = useState(false);
  const [coincidencia, setCoincidencia] = useState(null);
  const [tamano, setTamano] = useState(null);
  const [disable, setDisable] = useState(false);
  const INACTIVITY_TIME = 5 * 60 * 1000; // 5 minutos

  const inactivityTimerRef = useRef(null);

  // manejo de la respuesta exitosa
  useEffect(() => {
    if (data) {
      toast.success('Contraseña cambiada con éxito');
    }
  }, [data]);

  // manejo del error.
  useEffect(() => {
    if (error && error.response?.data?.codigoError == 'AAI-US-03') {
      toast.warning(error.response.data.mensaje);
    } else {
      if (error) toast.error('Error al cambiar la contraseña, revisar logs.');
    }
  }, [error]);

  // manejo de la inactividad
  useEffect(() => {
    // Configurar eventos para detectar actividad
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach((event) => window.addEventListener(event, resetInactivityTimer));
    // Iniciar el temporizador de inactividad
    resetInactivityTimer();
    return () => {
      // Limpiar eventos y temporizador al desmontar el componente
      events.forEach((event) => window.removeEventListener(event, resetInactivityTimer));
      clearTimeout(inactivityTimerRef.current);
    };
  }, []);

  // manejo del título
  useEffect(() => {
    document.title = 'Restablecer contraseña';
  }, []);

  // manejo de la inactividad
  const handleInactivity = () => {
    setIsInactive(true);
    toast.warning('Inactividad detectada. Serás redirigido debido a la inactividad.', {
      autoClose: false,
      onClose: () => {
        window.location.href = 'http://optimus/vulcano/'; // Cambiar por la URL de redirección
      },
    });
  };

  // reiniciar el temporizador de inactividad
  const resetInactivityTimer = () => {
    if (isInactive) return; // Si ya está inactivo, no reiniciar el temporizador
    clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(handleInactivity, INACTIVITY_TIME);
  };

  // manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    //capturamos la pre para que si valide lo actual.
    const updateFormData = { ...form, [name]: value };

    setForm(updateFormData);
    if (name === 'password' || name === 'confirmPassword') {
      if (updateFormData.password !== updateFormData.confirmPassword) {
        setCoincidencia({ message: 'Las contraseñas no coinciden' });
        setDisable(true);
      } else if (updateFormData.password === updateFormData.confirmPassword) {
        setCoincidencia(null);
        setDisable(false);
      }
      if (updateFormData.password.length < 6) {
        setTamano({ message: 'contraseña muy corta, minimo 6 caracteres' });
        setDisable(true);
      } else if (updateFormData.password.length >= 6) {
        setTamano(null);
      }
    }
  };

  // manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      ...form,
      username: datosContacto.usunombre,
    };
    putChangePassword(formData);
  };

  if (loading) return <Loader />;

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      {isInactive && <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999, pointerEvents: 'none' }} />}
      <div className="card border-light mb-3" style={{ width: '33rem' }}>
        <img src={imgLogoDinamica} className="card-img-top" alt="..." />
        <div className="card-body text-bg-light text-center">
          <form onSubmit={handleSubmit}>
            <h5 className="card-title mt-5">Restablecer la contraseña</h5>
            <div className="col-md-12">
              <span> Se envio el codigo al correo: </span>
            </div>
            {tamano && tamano.message && <span className="link-danger">{tamano.message}</span>}
            <div className="col-md-6 offset-md-3">
              <input className="form-control mt-3 " type="text" placeholder="Ingrese código de verificación" id="code" name="code" required={true} onChange={handleChange} />
            </div>
            <div className="col-md-6 offset-md-3">
              <input className="form-control mt-2 " type="password" placeholder="Ingrese nueva contraseña" id="password" name="password" required={true} onChange={handleChange} />
            </div>
            <div className="col-md-6 offset-md-3">
              <input className="form-control mt-2 " type="password" placeholder="confirme la contraseña" id="confirmPassword" name="confirmPassword" required={true} onChange={handleChange} />
              {coincidencia && coincidencia.message && <span className="link-danger">{coincidencia.message}</span>}
            </div>
            <div className="row justify-content-around mt-4 mb-4">
              <div className="col-6">
                <button type="submit" className="btn btn-primary" disabled={disable}>
                  cambio
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}