import axios from "axios";
import { useEffect, useState } from "react";
import { RUTA_BACK_PRODUCCION } from "../../types";
import { useSelector } from "react-redux";
import UseAxiosInstance from "../../utilities/UseAxiosInstance";
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import Select from "react-select";
import Swal from "sweetalert2";
 
DataTable.use(DT);

function OpcionesUsuario(){

    const axiosInstance = UseAxiosInstance();

    const [identificacion, setIdentificacion] = useState(null);
    const stateLogin = useSelector(state => state.login);
    const token = stateLogin.token;
    const [tableData, setTableData] = useState([]);
    const [rolesDisponibles, setRolesDisponibles] = useState([]);
    const [inputFind, setInputFind] = useState("");

    const handleChange = (e) => {
        const {value} = e.target;
        setIdentificacion(value);
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        axiosInstance.get(`${RUTA_BACK_PRODUCCION}usuario/sincronizarConDGH/${identificacion}`)
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Usuario sincronizado con éxito',
                    showConfirmButton: false,
                    timer: 1500
                })
            }).catch((error) =>{
                console.error("error: ",error)
            })
    };

    useEffect(() => {
        axiosInstance.get(`${RUTA_BACK_PRODUCCION}usuario`)
        .then((response) => {
            //convertir los roles, servicios al formato que requiere SelectReact
            const data = response.data.map(entry => ({
                ...entry,
                roles: entry.roles.map(role => ({
                    value: role.id,
                    label: role.rol
                })),
                servicios: entry.servicios.map(servicio => ({
                    value: servicio.id,
                    label: servicio.nombre
                }))
            }))
            setTableData(data);
        }).catch((error) => {
            console.error("error: ",error)
        })

        axiosInstance.get(`${RUTA_BACK_PRODUCCION}roles`)
            .then((response) => setRolesDisponibles(response.data))
            .catch((error) => console.error(error));
        
    },[]);   

    const opcionesRoles = rolesDisponibles.map((rol) => ({value: rol.id, label: rol.rol}));

    const handleRolesChange = (selectedOptions, usuario) =>{
        console.log("selectedOptions: ",selectedOptions);
        console.log("usuario: ",usuario);
        const form = {
            documento: usuario.documento,
            roles: selectedOptions.map(option => ({id: option.value, rol: option.label})),
        };
        axiosInstance.put(`${RUTA_BACK_PRODUCCION}usuario/roles/${usuario.documento}`, form)
            .then(() => {
                const newTableData = tableData.map((entry) => {
                    if(entry.documento === usuario.documento){
                        return {
                            ...entry,
                            roles: selectedOptions
                        }
                    }
                    return entry;
                });
                setTableData(newTableData);
            }
        ).catch((error) => {
            console.error("error: ",error)
        })
    }

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
            <input className="form-control" type="text" placeholder="Buscar..." value={inputFind} onChange={(e) => setInputFind(e.target.value)}/>
            <table className="table table-striped table-hover table-bordered">
                <thead className="">
                    <tr>
                        <th>Documento</th>
                        <th>Nombre Completo</th>
                        <th>Correo</th>
                        <th>Roles</th>
                        <th>Servicios</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        tableData.filter((usuario) => usuario.documento.includes(inputFind) || usuario.nombreCompleto.includes(inputFind.toLocaleUpperCase())).map((usuario) => {
                            return (
                                <tr key={usuario.documento}>
                                    <td>{usuario.documento}</td>
                                    <td>{usuario.nombreCompleto}</td>
                                    <td>{usuario.email}</td>
                                    <td>
                                        {<Select isMulti options={opcionesRoles} className="basic-multi-select" value={usuario.roles} classNamePrefix="select" onChange={(selectedOptions) => handleRolesChange(selectedOptions, usuario)}/>}
                                    </td>
                                    <td>
                                        {<Select isMulti options={opcionesRoles} className="basic-multi-select" value={usuario.servicios} classNamePrefix="select" onChange={handleRolesChange}/>}
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </>
    )
}
export default OpcionesUsuario