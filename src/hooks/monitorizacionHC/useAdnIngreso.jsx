import { useEffect, useState } from "react";
import { obtenerAdnIngreso } from "../../api/dinamica/adnIngresoService";
import AdnIngreso from "../../models/dinamica/AdnIngreso";

const useAdnIngreso = () => {
    const [adnIngreso, setAdnIngreso] = useState(new AdnIngreso());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() =>{
        if(error?.response?.data?.codigoError == "GC-0003"){
            // Swal.fire({
            //     icon: 'error',
            //     title: '¡ERROR!',
            //     text: 'No se encontró el ingreso'
            // });
        }
    },[error]);

    const fetchAdnIngreso = async (idAdnIngreso) => {
        setLoading(true);
        setError(null);
        try {
            const adnIngresoData = await obtenerAdnIngreso(idAdnIngreso);
            setAdnIngreso(new AdnIngreso(adnIngresoData));
        } catch (error) {
            setError(error);          
        }finally {
            setLoading(false);
        }
    }
    
    return {adnIngreso, setAdnIngreso, loadingAdnI: loading, fetchAdnIngreso};
};

export default useAdnIngreso;