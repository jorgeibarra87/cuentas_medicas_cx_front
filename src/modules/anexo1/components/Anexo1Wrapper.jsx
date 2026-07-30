import { useSelector } from 'react-redux';
import useActualizarEgresoPeriodico from '../hooks/useActualizarEgresoPeriodico';

export default function Anexo1Wrapper({ children }) {
  const usuario = useSelector(state => state.login.decodeToken);
  useActualizarEgresoPeriodico(!!usuario);
  return children;
}
