import { useState } from 'react';
import { obtenerTodosLosUsuarios } from '../../api/authservice/usuarioServiceApiAuth';

const useFetchUsuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await obtenerTodosLosUsuarios();
      setUsuarios(response);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { usuarios, loading, error, fetchUsuarios };
};

export default useFetchUsuario;
