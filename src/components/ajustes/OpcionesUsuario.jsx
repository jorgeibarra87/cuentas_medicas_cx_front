import axios from "axios";
import { useState } from "react";
import { RUTA_BACK_PRODUCCION } from "../../types";
import { useSelector } from "react-redux";

function OpcionesUsuario(){

    const [identificacion, setIdentificacion] = useState(null);
    const stateLogin = useSelector(state => state.login);
    const token = stateLogin.token;

    const handleChange = (e) => {
        const {value} = e.target;
        setIdentificacion(value);
    }

    const axiosInstance = axios.create({
        baseURL: `${RUTA_BACK_PRODUCCION}`,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const handleSubmit = async (e) =>{
        e.preventDefault();
        axiosInstance.get(`${RUTA_BACK_PRODUCCION}usuario/sincronizarConDGH/${identificacion}`)
            .then((response) => {
                console.log("respuesta ",response.data);
            }).catch((error) =>{
                console.log("error: ",error)
            })
    };

    return (
        <>
            <div className="row mt-4">
                <h3>Sincronizar usuario</h3>
            </div>
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="form-group row">
                    <span>Número de identificación</span>
                    <div className="col">
                        <input name="identificacion" onChange={handleChange} type="text"/>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">Sincronizar</button>
            </form>
        </>
    )
}
export default OpcionesUsuario