//crear una instancia de axios que pueda ser utilizada en cualquier parte de la aplicacion
import axios from 'axios';
import { RUTA_BACK_PRODUCCION } from '../types';
import { useSelector } from 'react-redux';


// const stateLogin = useSelector(state => state.loginReducer);
// const token = stateLogin.token;

// const axiosInstance = axios.create({
//     baseURL: `${RUTA_BACK_PRODUCCION}`,
//     headers: {
//         'Authorization': `Bearer ${token}`
//     }
// });

// export default axiosInstance

// Creamos una función para obtener la instancia de Axios
const useAxiosInstance = () => {
    const stateLogin = useSelector(state => state.loginReducer);
    const token = stateLogin?.token;
  
    // Creamos la instancia de Axios con el token
    const axiosInstance = axios.create({
      baseURL: `${RUTA_BACK_PRODUCCION}`,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  
    return axiosInstance;
  };
  
  export default useAxiosInstance;