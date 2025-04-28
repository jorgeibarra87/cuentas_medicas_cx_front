import useFetchPorcentajesByDates from "../../hooks/monitorizacionHC/useFetchPorcentajesByDates";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Loader from "../Loader";
import { useState } from "react";

function ReportesPorcentajes () {

    const {porcentajes, loading, error, fetchPorcentajesByDates} = useFetchPorcentajesByDates();

    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");

    const getLastDayOfMonth = (year, month) => {
        return new Date(year, month, 0).getDate();
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (fechaDesde === "" || fechaHasta === "") {
            alert("Por favor, complete ambos campos de fecha.");
            return;
        }

        if(fechaDesde > fechaHasta){
            alert("La fecha inicial no puede ser mayor o igual a la fecha final.");
            return;
        }

        const fechaActual = new Date();
        const mesActual = `${fechaActual.getFullYear()}-${String(fechaActual.getMonth() + 1).padStart(2, "0")}`;

        if (fechaDesde > mesActual || fechaHasta > mesActual) {
            alert("Las fechas no pueden ser de meses posteriores al mes actual.");
            return;
        }

        // Realizar la llamada con fechas válidas
        fetchPorcentajesByDates(`${fechaDesde}-01`, `${fechaHasta}-${getLastDayOfMonth(fechaHasta.split("-")[0], fechaHasta.split("-")[1])}`);

    }

    return (
        <div className="container-fluid">
            <div className="row">
                <form className="col-md-12 p-4 rounded-lg">
                    <div className="row gx-3 gy-2 align-items-center">
                        <div className="col-auto d-flex align-items-center">
                            <label htmlFor="fechaDesde" className="form-label mb-0 me-2">Fecha Inicial</label>
                            <input type="month" className="form-control" name="fechaDesde" id="fechaDesde" onChange={(e) => setFechaDesde(e.target.value)}/>
                        </div>
                        <div className="col-auto d-flex align-items-center">
                            <label htmlFor="fechaHasta" className="form-label mb-0 me-2">Fecha Final</label>
                            <input type="month" className="form-control" name="fechaHasta" id="fechaHasta" onChange={(e) => setFechaHasta(e.target.value)}/>
                        </div>
                        <div className="col-auto">
                            <button onClick={handleSubmit} type="submit" className="btn btn-primary">
                                Enviar
                            </button>
                        </div>
                    </div>
                </form>
            </div>
    
            {loading && <Loader />}
    
            {porcentajes.length === 0 ? null : (
                <div className="col-md-12 p-4 rounded-lg">
                    <h2 className="text-center">Porcentajes de Respuestas</h2>
                    <ResponsiveContainer width="100%" height={400} className="shadow-lg">
                        <LineChart data={porcentajes}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="fecha" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="porcentaje" stroke="#8884d8" strokeWidth={2} dot={{ r: 5 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
       
}

export default ReportesPorcentajes;