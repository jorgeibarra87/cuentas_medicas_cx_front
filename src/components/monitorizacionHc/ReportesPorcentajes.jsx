import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ComposedChart } from "recharts";
import Loader from "../Loader";
import Select from "react-select";
import { useEffect, useState } from "react";
import useFetchPorcentajesByDates from "../../hooks/monitorizacionHC/useFetchDataRespByDateAndTipoPregunta";
import useFetchProcesoServicioConPreguntas from "../../hooks/monitorizacionHC/useFetchProcesoServicioConPreguntas";
import useFetchDataByProServTipoPregunta from "../../hooks/monitorizacionHC/useFetchDataByProServTipoPregunta";
import useFechDataByGrupoResumen from "../../hooks/monitorizacionHC/useFechDataByGrupoResumen";
import useFetchResumenRespuByPregunta from "../../hooks/monitorizacionHC/useFetchResumenRespuByPregunta";

function ReportesPorcentajes() {

    const { porcentajes, setPorcentajes, loading: loadingTodo, error: errorTodo, fetchPorcentajesByDates } = useFetchPorcentajesByDates();
    const { procesosServicios, loadingPs: loadingProServ, error: errorProServ } = useFetchProcesoServicioConPreguntas();
    const { data: dataGf1, setData: setDataGf1, loading: loadingGf1, error: errorGf1, fetchDataByProServTipoPregunta } = useFetchDataByProServTipoPregunta();
    const { data: dataGf2, setData: setDataGf2, loading: loadingGf2, error: errorGf2, fetchDataByGrupoResumen } = useFechDataByGrupoResumen();
    const { data: dataTbl, setData: setDataTbl, error: errorTbl, loading: loadingTbl, fetchResumenRespuByPregunta } = useFetchResumenRespuByPregunta();

    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");
    const [selectProserSeleccionado, setSelectProserSeleccionado] = useState(null);
    const [selectTipoPregunta, setSelectTipoPregunta] = useState(null);
    const [selectTipoGrafica, setSelectTipoGrafica] = useState(null);

    // Cambia el título de la página al cargar el componente
    useEffect(() => {
        document.title = "Monitorición HC - Reportes de Porcentajes";
    }, []);

    const getLastDayOfMonth = (year, month) => {
        return new Date(year, month, 0).getDate();
    }

    // si cambia algun input o se selecciona un proceso/servicio, resetea los datos de los gráficos
    useEffect(() => {
        setDataGf1([]);
        setDataGf2([]);
        setPorcentajes([]);
        setDataTbl([]);
    }, [fechaDesde, fechaHasta, selectProserSeleccionado, selectTipoPregunta, selectTipoGrafica]);

    // Maneja el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        if (fechaDesde === "" || fechaHasta === "") {
            alert("Por favor, complete ambos campos de fecha.");
            return;
        }
        if (fechaDesde > fechaHasta) {
            alert("La fecha inicial no puede ser mayor o igual a la fecha final.");
            return;
        }
        const fechaActual = new Date();
        const mesActual = `${fechaActual.getFullYear()}-${String(fechaActual.getMonth() + 1).padStart(2, "0")}`;
        if (fechaDesde > mesActual || fechaHasta > mesActual) {
            alert("Las fechas no pueden ser de meses posteriores al mes actual.");
            return;
        }
        if (!selectProserSeleccionado) {
            alert("Por favor, seleccione un Proceso/Servicio.");
            return;
        }

        // Realizar la llamada con fechas válidas
        if (selectProserSeleccionado.label == 'TODO') {
            fetchPorcentajesByDates(`${fechaDesde}-01`, `${fechaHasta}-${getLastDayOfMonth(fechaHasta.split("-")[0], fechaHasta.split("-")[1])}`, selectTipoPregunta);
        }
        if (selectProserSeleccionado != null && selectTipoGrafica == 'resumenGrupo') {
            const procesoId = selectProserSeleccionado.tipo === 'PROCESO' ? selectProserSeleccionado.value : null;
            const servicioId = selectProserSeleccionado.tipo === 'SERVICIO' ? selectProserSeleccionado.value : null;
            fetchDataByProServTipoPregunta(`${fechaDesde}-01`, `${fechaHasta}-${getLastDayOfMonth(fechaHasta.split("-")[0], fechaHasta.split("-")[1])}`, procesoId, servicioId, selectTipoPregunta);
        } if (selectProserSeleccionado != null && selectTipoGrafica == 'grupoMesCantidad') {
            const procesoId = selectProserSeleccionado.tipo === 'PROCESO' ? selectProserSeleccionado.value : null;
            const servicioId = selectProserSeleccionado.tipo === 'SERVICIO' ? selectProserSeleccionado.value : null;
            fetchDataByGrupoResumen(`${fechaDesde}-01`, `${fechaHasta}-${getLastDayOfMonth(fechaHasta.split("-")[0], fechaHasta.split("-")[1])}`, procesoId, servicioId, selectTipoPregunta);
        } if (selectProserSeleccionado != null && selectTipoGrafica == 'tablaResumenPreguntas') {
            const procesoId = selectProserSeleccionado.tipo === 'PROCESO' ? selectProserSeleccionado.value : null;
            const servicioId = selectProserSeleccionado.tipo === 'SERVICIO' ? selectProserSeleccionado.value : null;
            fetchResumenRespuByPregunta(`${fechaDesde}-01`, `${fechaHasta}-${getLastDayOfMonth(fechaHasta.split("-")[0], fechaHasta.split("-")[1])}`, procesoId, servicioId, selectTipoPregunta);
        }
    }

    // Opciones para el select de procesos y servicios
    const opcionesServicios = [{ value: 0, label: 'TODO', tipo: 'TODO' }, ...procesosServicios];

    // Maneja el cambio de selección del servicio o proceso 
    const handleProServChange = (seleccion) => {
        setSelectProserSeleccionado(seleccion);
        if (seleccion.tipo === 'TODO') {
            setSelectTipoGrafica(null);
        } else {
            setSelectTipoGrafica('');
        }
    }

    // Maneja el cambio del tipo de pregunta (MEDICO, ENFERMERIA)
    const handleTipoPregunta = (e) => {
        const { value } = e.target;
        if (value != 'TODO') {
            setSelectTipoPregunta(value);
        } else {
            setSelectTipoPregunta(null);
        }
    }

    if (errorTodo) return <div className="alert alert-danger">Error al cargar los datos: {errorTodo.message}</div>;
    if (errorProServ) return <div className="alert alert-danger">Error al cargar los procesos y servicios: {errorProServ.message}</div>;

    // Transformar los datos para que cada fila sea un mes con todos los grupos como propiedades
    const transformData = (data) => {
        if (!data || data.length === 0) return [];
        const groupedByMonth = {};
        data.forEach(({ mes, grupo, porcentaje }) => {
            if (!groupedByMonth[grupo]) groupedByMonth[grupo] = { grupo };
            groupedByMonth[grupo][mes] = porcentaje;
        });
        // Convertimos el objeto a array y ordenamos por mes
        return Object.values(groupedByMonth).sort((a, b) => a.grupo.localeCompare(b.mes));
    };

    const chartData = transformData(dataGf2);

    // Extraer nombres únicos de grupos
    const groupNames = [...new Set(dataGf2.map((d) => d.mes))];

    const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#8dd1e1", "#a4de6c", "#d0ed57","#d88884", "#ad82ca", "#84d888", "#de6ca4", "#57d0ed", "#7f50ff"];

    return (
        <div className="container-fluid">
            <div className="row">
                <form onSubmit={handleSubmit} className="col-md-12 p-4 rounded-lg">
                    <div className="row gx-3 gy-2 align-items-center">
                        <div className="col-auto d-flex align-items-center">
                            <label htmlFor="fechaDesde" className="form-label mb-0 me-2">Fecha Inicial</label>
                            <input type="month" className="form-control" name="fechaDesde" id="fechaDesde" onChange={(e) => setFechaDesde(e.target.value)} required />
                        </div>
                        <div className="col-auto d-flex align-items-center">
                            <label htmlFor="fechaHasta" className="form-label mb-0 me-2">Fecha Final</label>
                            <input type="month" className="form-control" name="fechaHasta" id="fechaHasta" onChange={(e) => setFechaHasta(e.target.value)} required />
                        </div>
                        <div className="col-auto d-flex align-items-center">
                            <label htmlFor="tipoPregunta" className="form-label mb-0 me-2">Tipo pregunta:</label>
                            <select className="form-select" name="tipoPregunta" id="tipoPregunta" onChange={handleTipoPregunta} required>
                                <option value="">Seleccione una opción</option>
                                <option value='TODO'>TODO</option>
                                <option value="MEDICO">MEDICO</option>
                                <option value="ENFERMERIA">ENFERMERIA</option>
                            </select>
                        </div>
                        <div className="col-auto d-flex align-items-center">
                            <label htmlFor="tipoPregunta" className="form-label mb-0 me-2">Servicio / Proceso</label>
                            <Select options={opcionesServicios} onChange={handleProServChange} className="w-50 ms-2" isLoading={loadingProServ} placeholder="Seleccione un Proceso/Servicio" required />
                        </div>
                        {selectTipoGrafica != null && (
                            <div className="col-auto d-flex align-items-center">
                                <label htmlFor="tipoGrafica" className="form-label mb-0 me-2">Tipo de Gráfica</label>
                                <select className="form-select" value={selectTipoGrafica} name="tipoGrafica" id="tipoGrafica" onChange={(e) => setSelectTipoGrafica(e.target.value)} required>
                                    <option value="">Seleccione una opción</option>
                                    <option value="resumenGrupo">Resumen entre fechas por grupo</option>
                                    <option value="grupoMesCantidad">Comparativo mensual por grupo</option>
                                    <option value="tablaResumenPreguntas">Tabla Resumen de Preguntas</option>
                                </select>
                            </div>
                        )
                        }
                        <div className="col-auto">
                            <button type="submit" className="btn btn-primary">Enviar</button>
                        </div>
                    </div>
                </form>
            </div>

            {loadingTodo || loadingGf1 || loadingGf2 && <Loader />}
            {errorTodo && <div className="alert alert-danger">Error al cargar los datos: {errorTodo.message}</div>}
            {errorGf1 && <div className="alert alert-danger">Error al cargar los datos del gráfico 1: {errorGf1.message}</div>}
            {errorGf2 && <div className="alert alert-danger">Error al cargar los datos del gráfico 2: {errorGf2.message}</div>}

            {porcentajes.length > 0 &&(
                <div className="col-md-12 p-4 rounded-lg">
                    <h2 className="text-center">Porcentajes de Respuestas para </h2>
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
            {dataGf1.length > 0 && (
                <>
                    <h2 className="text-center">Resumen de Porcentajes </h2>
                    <ResponsiveContainer width="100%" height={450}>
                        <ComposedChart data={dataGf1} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="grupo" angle={-45} textAnchor="end" interval={0} />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                            <Tooltip />
                            <Legend />
                            <Bar yAxisId="left" dataKey="cantidadSi" stackId="a" fill="#82ca9d" name="Sí" />
                            <Bar yAxisId="left" dataKey="cantidadNo" stackId="a" fill="#ff7f7f" name="No" />
                            <Bar yAxisId="left" dataKey="cantidadNoAplica" stackId="a" fill="#ccc" name="No Aplica" />
                            <Line yAxisId="right" type="monotone" dataKey="porcentaje" stroke="#8884d8" name="%" />
                        </ComposedChart>
                    </ResponsiveContainer>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={dataGf1} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="grupo" angle={-45} textAnchor="end" interval={0} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="cantidadSi" stackId="a" fill="#82ca9d" name="Sí" />
                            <Bar dataKey="cantidadNo" stackId="a" fill="#ff7f7f" name="No" />
                            <Bar dataKey="cantidadNoAplica" stackId="a" fill="#ccc" name="No Aplica" />
                            <Bar dataKey="porcentaje" stackId="a" fill="#3377ff" name="Porcentaje" />
                        </BarChart>
                    </ResponsiveContainer>
                </>
            )
            }
            {dataGf2.length > 0 && (
                <>
                <h2 className="text-center">Comparativo Mensual por Grupo </h2>
                <ResponsiveContainer width="100%" height={500}>
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="grupo" angle={-45} textAnchor="end" interval={0} height={100}/>
                        <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                        <Tooltip formatter={(value) => `${value?.toFixed(2)}%`} />
                        <Legend />
                        {groupNames.map((mes, index) => (
                            <Bar key={mes} dataKey={mes} fill={colors[index % colors.length]} name={mes} />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
                </>
            )}
            {dataTbl.length > 0 && (
                <>
                <table className="table table-striped table-bordered mt-4">
                    <thead>
                        <tr>
                            <th>Pregunta</th>
                            <th>Cantidad Si</th>
                            <th>Cantidad No</th>
                            <th>Cantidad No Aplica</th>
                            <th>Porcentaje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataTbl.map((item, index) => (
                            <tr key={index}>
                                <td>{item.pregunta}</td>
                                <td>{item.cantidadSi}</td>
                                <td>{item.cantidadNo}</td>
                                <td>{item.cantidadNoAplica}</td>
                                <td>{item.porcentaje.toFixed(2)}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <br/>
                <span>{`Numerador: ${dataTbl.reduce((acc, item) => acc + item.cantidadSi, 0)}`}</span>
                <br/>
                <span>{`Denominador: ${(dataTbl[0].cantidadSi + dataTbl[0].cantidadNo + dataTbl[0].cantidadNoAplica) * dataTbl.length }`}</span>
                </>
            )}
        </div>
    );
}

export default ReportesPorcentajes;