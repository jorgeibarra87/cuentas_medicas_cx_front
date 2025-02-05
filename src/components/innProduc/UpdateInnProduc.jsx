import axios from "axios";
import { useEffect, useState } from "react";
import { RUTA_BACK_PRODUCCION } from "../../types";
import { useDispatch, useSelector } from "react-redux";
import { innoProducNoData, innoProducObtener } from "../../actions/innproducActions";

const initialForm = {
    oid: "",
    iprcodigo: "",
    iprdescor: "",//descripcion
    iprcostpe: "",//costo del producto
    iprulcope: "" //ultimo costo
}

function UpdateInnProduc() {
    const [form, setForm] = useState(initialForm);
    const stateLogin = useSelector(state => state.login);
    const stateInnproduc = useSelector(state => state.innproduc);
    const dispatch = useDispatch();
    const token = stateLogin.token;

    const axiosInstance = axios.create({
        baseURL: `${RUTA_BACK_PRODUCCION}`,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    useEffect(() => {
        setForm(stateInnproduc.innproduc);
    }
    , [stateInnproduc]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        if(name === 'iprcodigo'){
            dispatch(innoProducNoData());//limpia el fomulario
        }
        if (name === 'iprcostpe' || name === 'iprulcope') {
            const newValue = value.replace(/[^0-9]/g, '');
            setForm({
                ...form, [name]: newValue
            });
        }else {
            setForm({
                ...form, [name]: value
            });
        }
    };

    const buscarPorCodigo = async () => {
        if (!form.iprcodigo || form.iprcodigo.trim().length === 0) {
            alert("El codigo no puede ser vacio");
            return;
        }
        axiosInstance.get(`${RUTA_BACK_PRODUCCION}dinamica/api/innProduc/${form.iprcodigo}`)
            .then((response) => {
                dispatch(innoProducObtener(response.data));
            }).catch((error) => {
                console.error(error)
            })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        axiosInstance.put(`${RUTA_BACK_PRODUCCION}dinamica/api/innProduc`, form)
        .then(() =>{
            alert("se actualizo corectamente");
            dispatch(innoProducNoData());//limpia el fomulario
        }).catch((err) =>{
            console.err('error',err)
        })
    };

    // Función para formatear visualmente el número con separadores de miles
    const formatearNumeroVisualmente = (numero) => {
        return '$ ' + numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    return (
        <>
            <h2>Actualizar valores</h2>
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="form-group row">
                    <label htmlFor="iprcodigo" className="col-form-label col">Código:</label>
                    <div className="col">
                        <input type='text' id='iprcodigo' name='iprcodigo' placeholder='Digite código' className="form-control" onChange={handleChange} value={form.iprcodigo} required />
                    </div>
                    <div className="col-auto">
                        <button type="button" className="btn btn-primary" onClick={buscarPorCodigo}>Buscar</button>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="iprdescor">Descripción:</label>
                    <input type='text' id='iprdescor' name='iprdescor' placeholder='Digite descripción' className="form-control" onChange={handleChange} value={form.iprdescor} required />
                </div>
                <div className="form-group">
                    <label htmlFor="iprcostpe">Costo:</label>
                    <input type='text' id='iprcostpe' name='iprcostpe' placeholder='Digite costo' className="form-control" onChange={handleChange} value={formatearNumeroVisualmente(form.iprcostpe)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="iprulcope">Último costo:</label>
                    <input type='text' id='iprulcope' name='iprulcope' placeholder='Digite último costo' className="form-control" onChange={handleChange} value={formatearNumeroVisualmente(form.iprulcope)} required />
                </div>
                <button type="submit" className="btn btn-primary">Actualizar</button>
            </form>
        </>
    )
}

export default UpdateInnProduc