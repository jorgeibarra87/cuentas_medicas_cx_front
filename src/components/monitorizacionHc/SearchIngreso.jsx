import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useFecthUsuarioProcServ from "../../hooks/monitorizacionHC/useFetchUsuarioProcServ";
import Select from "react-select";

const SearchIngreso = ({onSearchAdnIngreso, setAdnIngreso, adnIngreso, fetchPreguntas, onSearchIngreso, setServicio}) => {

    const [ingreso, setIngreso] = useState('');
    const [selectedService, setSelectedService] = useState('0');
    const {procServ, loadingUPS , error, fetchUsuaroProcServByDocumento} = useFecthUsuarioProcServ();

    const statelogin = useSelector(state => state.login);
    const [usuario] = useState(statelogin.decodeToken);
    const [servicios] = useState(usuario.servicios);

    const handleSearch = () =>  {
        if(ingreso.trim()){
            onSearchIngreso(ingreso); 
            onSearchAdnIngreso(ingreso); 
        }
    };

    useEffect(() => {
        if(procServ.length == 0){
            fetchUsuaroProcServByDocumento(usuario.sub);
        }
    },[procServ]);

    const handleChange = (e) => {
        setIngreso(e.target.value);
        setSelectedService('0');
        setAdnIngreso([]);
    }

    const handleSelect = (e) => {
        const { value, tipo } = e;
        setServicio({id: value, tipo: tipo});
        fetchPreguntas(value, tipo);
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