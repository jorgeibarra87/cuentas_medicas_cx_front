import { useState } from "react";
import { actualizarRolesDeUsuario } from "../../api/authservice/usuarioServiceApiAuth";

const useUpdateUsuarioRoles = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateUsuarioRoles = async (documento, roles) => {
        setLoading(true);
        setError(null);
        try {
            const response = await actualizarRolesDeUsuario(documento, roles);
            setData(response);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };
    return { data, loading, error, updateUsuarioRoles };
}

export default useUpdateUsuarioRoles;