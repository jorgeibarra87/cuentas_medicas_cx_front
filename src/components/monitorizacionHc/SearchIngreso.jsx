import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useFecthUsuarioProcServ from "../../hooks/monitorizacionHC/useFetchUsuarioProcServ";
import Select from "react-select";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import Error404 from "../Error404";
import AdnIngreso from "../../models/dinamica/AdnIngreso";

const SearchIngreso = ({fetchAdnIngreso, setAdnIngreso, adnIngreso, fetchPreguntas, setServicio}) => {
  
    const tiposValidos = ["medico", "enfermeria"];

    const [ingreso, setIngreso] = useState('');
    const {procServ, loadingUPS , error, fetchUsuaroProcServByDocumento} = useFecthUsuarioProcServ();
    const {tipo: tipoPregunta} = useParams(); // Medico, Enfermeria


    const statelogin = useSelector(state => state.login);
    const [usuario] = useState(statelogin.decodeToken);
    const [servicios] = useState(usuario.servicios);
    
    const handleSearch = () =>  {
      if(ingreso.trim()){
        fetchAdnIngreso(ingreso); 
      }
    };
    
    useEffect(() => {
      if(procServ.length == 0){
        fetchUsuaroProcServByDocumento(usuario.sub);
      }
    },[procServ]);
    
    useEffect(() => {
      if(error){
        Swal.fire({
          title: error?.title || 'Error',
          text: error?.mensaje || '',
          icon: error?.icon || 'error',
        })
      }
    },[error]);
    
    const handleChange = (e) => {
      setIngreso(e.target.value);
      setAdnIngreso(new AdnIngreso());
    }
    
    const handleSelect = (e) => {
      const { value, tipo } = e;
      setServicio({id: value, tipo: tipo});
      fetchPreguntas(value, tipo, tipoPregunta.toUpperCase());
    }
    
    if (!tiposValidos.includes(tipoPregunta.toLowerCase())) {
      return <Error404 />;
    } 
    
return (
    <div className="p-4 border rounded-lg shadow-lg">
      <div className="d-flex align-items-center flex-wrap gap-2">
        <input type="text" value={ingreso} onChange={(e) => handleChange(e)} placeholder="Número de ingreso" className="form-control" style={{ maxWidth: '200px' }} />
        <button onClick={handleSearch} className="btn btn-primary">
          Buscar
        </button>
        {adnIngreso.paciente && servicios && (
          <>
            <label className="mx-2 mb-0">doc paciente:</label>
            <span>{adnIngreso.paciente.documento}</span>
            <span className="mx-2">selecciona las preguntas:</span>
            <div style={{ minWidth: '300px' }}>
              <Select options={procServ} onChange={handleSelect}/>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SearchIngreso;