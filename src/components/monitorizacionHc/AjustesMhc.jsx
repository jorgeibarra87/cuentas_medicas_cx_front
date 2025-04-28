import Select from 'react-select';
import useFetchUsuarioProcServ from '../../hooks/monitorizacionHC/useFetchUsuarioProcServ';
import useFetchProcesoServicioConPreguntas from '../../hooks/monitorizacionHC/useFetchProcesoServicioConPreguntas';
import useSaveUsuarioProcServ from '../../hooks/monitorizacionHC/useSaveUsuarioProcServ';
import { useEffect, useState } from 'react';
import Loader from "../Loader";
import Swal from 'sweetalert2';

function AjustesMhc() {

    const {usuariosProServ,setUsuariosProcServ, loadingUps} = useFetchUsuarioProcServ();
    const {procesosServicios, loadingPs} = useFetchProcesoServicioConPreguntas();
    const {loadingRPS, saveUsuarioRelacionProcesoServicio,  response, error} = useSaveUsuarioProcServ();

    const [documento, setDocumento] = useState("");
    const [selectedOptions, setSelectedOptions] = useState([]);

    // maneja el error de la respuesta
    useEffect(() => {
        if(error && error.mensaje){
            Swal.fire({
                icon: `${error.icon}`,
                title: `${error.title}`,
                text: `${error.mensaje}`,
                showConfirmButton: true
            });
        }
    }, [error]);
    
    // maneja la respuesta al guardar la relacion de usuario con procesos y servicios
    useEffect(() => {
        if(response && response.respuesta){
            Swal.fire({
                icon: 'success',
                title: 'Exito',
                text: `${response?.respuesta}`,
                showConfirmButton: true
            });
        }
    }, [response]);

    // actualizamos el estado de los usuarios con procesos y servicios
    const handleSelectChange = (documento, tipo, selected) => {
        // enviar la peticion al backend para actualizar la relacion de usuario con procesos y servicios
        setUsuariosProcServ((prev) =>
          prev.map((u) =>
            u.usuario.documento === documento
              ? { ...u, [tipo]: selected }
              : u
          )
        );
      };
      
    
    const handleSubmit = (e) => {
        e.preventDefault();
        saveUsuarioRelacionProcesoServicio(selectedOptions, documento);
    }
    agregar metodo para editar la relacion de usuario con procesos y servicios
  return (
    <div className="my-4 container">
        {(loadingUps || loadingPs || loadingRPS ) && <Loader />}
      <label>Agregar usuario y relaciones con procesos y/o servicios</label>
      <form onSubmit={handleSubmit} className="my-3 d-flex align-items-center gap-2">
        <input type="text" onChange={(e) => setDocumento(e.target.value)} className="form-control" placeholder="Numero de documento" style={{ width: '30%' }} />
        <Select isMulti options={procesosServicios} onChange={setSelectedOptions} className="basic-multi-select" classNamePrefix="select" placeholder="Selecciona una opción" style={{ width: '30%' }} />
        <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
          Guardar
        </button>
      </form>
      <div className="">
        <table className="table table-striped table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th scope="col">Documento</th>
              <th scope="col">Proceso</th>
              <th scope="col">Servicio</th>
            </tr>
          </thead>
          <tbody>
            {usuariosProServ.map((u, index) => {
                return (
                    <tr key={index}>
                        <td>{u.usuario.documento}</td>
                        <td>{<Select isMulti options={procesosServicios.filter(i => i.tipo == 'proceso')} className='basic-multi-select' value={u.procesos} classNamePrefix="select" onChange={(selected) => handleSelectChange(u.usuario.documento, "procesos", selected)}/>}</td>
                        <td>{<Select isMulti options={procesosServicios.filter(i => i.tipo == 'servicio')} className='basic-multi-select' value={u.servicios} classNamePrefix="select" onChange={(selected) => handleSelectChange(u.usuario.documento, "servicios", selected)}/>}</td>
                    </tr>
                )
            })}
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default AjustesMhc;
