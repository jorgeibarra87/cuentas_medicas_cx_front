import { useState } from "react";
import { useSelector } from "react-redux";

const SearchIngreso = ({onSearchAdnIngreso, setAdnIngreso, adnIngreso, getPreguntas, onSearchIngreso, setServicio}) => {

    const [ingreso, setIngreso] = useState('');
    const [selectedService, setSelectedService] = useState('0');

    const statelogin = useSelector(state => state.login);
    const [usuario] = useState(statelogin.decodeToken);
    const [servicios] = useState(usuario.servicios);

    const handleSearch = () =>  {
        if(ingreso.trim()){
            onSearchIngreso(ingreso); 
            onSearchAdnIngreso(ingreso); 
        }
    };

    const handleChange = (e) => {
        setIngreso(e.target.value);
        setSelectedService('0');
        setAdnIngreso([]);
    }

    const handleSelect = (e) => {
        setSelectedService(e.target.value);
        setServicio( servicios.find(servicio => servicio.id == e.target.value));

        if(e.target.value !== '0'){
            getPreguntas(e.target.value);
        }
    }

    return (
        <div className="p-4 border rounded-lg shadow-lg">
            <input type="text" value={ingreso} onChange={(e) => handleChange(e)} placeholder="Número de ingreso" className="border p-2 rounded w-full"/>
            <button onClick={handleSearch} className="mt-2 px-4 py-2 rounded">Buscar</button>
            {adnIngreso.paciente &&  servicios &&(
                <>
                    <label className="mx-4">Documento:</label>
                    <span>{adnIngreso.paciente.documento}</span>
                    <select className="mx-4 border p-2 rounded w-full" value={selectedService} onChange={handleSelect}>
                        <option value="0">Seleccione un servicio</option>
                        {servicios.map(servicio => (
                            <option key={servicio.id} value={servicio.id} >{servicio.nombre}</option>
                        ))}
                    </select>
                </>            
            )}
        </div>
    )

}

export default SearchIngreso;