import { useEffect, useState } from "react";
import { sincronizarUsuario } from "../../api/authservice/sincronizarUsuario";
import Swal from "sweetalert2";

const useSaveUsuarioAuthSer = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    useEffect(() => {
        if (error?.response?.data?.codigoError != null) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error?.response.data.mensaje || 'Ocurrió un error al sincronizar el usuario.'
            });
            setError(null);
        }
    })

    const saveUsuario = async (documento) => {
        setLoading(true);
        setError(null);
        try {
            const responseData = await sincronizarUsuario(documento);
            setResponse(responseData);
        } catch (error) {
            setError(error);
        }finally {
            setLoading(false);
        }
    }
    return { loading, response, error, saveUsuario };
}

export default useSaveUsuarioAuthSer;