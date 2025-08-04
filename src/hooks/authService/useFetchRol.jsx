import { useState } from "react";
import { obtenerTodosLosRoles } from "../../api/authservice/rolesServiceApiAuth";

const useFetchRol = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRol = async () => {
    setLoading(true);
    setError(null);
    try {
        const response = await obtenerTodosLosRoles();
        setRoles(response);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

  return { roles, loading, error , fetchRol };
};

export default useFetchRol