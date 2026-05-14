import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faFileAlt, faArrowLeft, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { obtenerReporteAnual } from '../../../api/auditoria_cuentas_medicas/reportesService';
import { toast } from 'react-toastify';

const NOMBRES_MESES = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export default function ReportesCirugias() {
    const navigate = useNavigate();
    const [anio, setAnio] = useState('2026');
    const [reporte, setReporte] = useState(null);
    const [loading, setLoading] = useState(false);

    const cargarReporte = async () => {
        setLoading(true);
        try {
            const data = await obtenerReporteAnual(anio);
            setReporte(data);
        } catch (err) {
            toast.error('Error al cargar reporte: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarReporte();
    }, [anio]);

    const procesarDatosMes = () => {
        if (!reporte?.totalPorMes) return [];
        const datos = [];
        for (let i = 1; i <= 12; i++) {
            const mes = String(i).padStart(2, '0');
            const encontrado = reporte.totalPorMes.find(d => d.mes === mes);
            datos.push({
                mes: NOMBRES_MESES[i],
                total: encontrado ? Number(encontrado.total) : 0
            });
        }
        return datos;
    };

    const procesarEstadoPorMes = () => {
        if (!reporte?.estadoPorMes) return [];
        const datos = [];
        for (let i = 1; i <= 12; i++) {
            const mes = String(i).padStart(2, '0');
            const fila = { mes: NOMBRES_MESES[i] };
            reporte.estadoPorMes.forEach(d => {
                if (d.mes === mes) {
                    const estado = d.estado?.replace(' ', '_') || 'SinEstado';
                    fila[estado] = Number(d.total);
                }
            });
            if (!fila['No_facturable']) fila['No_facturable'] = 0;
            if (!fila['Adición']) fila['Adición'] = 0;
            if (!fila['Hecho']) fila['Hecho'] = 0;
            datos.push(fila);
        }
        return datos;
    };

    const handleExportarExcel = () => {
        const wb = XLSX.utils.book_new();

        const h1 = ['Mes', 'Total'];
        const f1 = datosMes.map(d => [d.mes, d.total]);
        f1.push(['TOTAL', datosMes.reduce((s, d) => s + d.total, 0)]);
        const ws1 = XLSX.utils.aoa_to_sheet([h1, ...f1]);
        XLSX.utils.book_append_sheet(wb, ws1, 'Procedimientos x Mes');

        const h2 = ['Mes', 'No Facturable', 'Adición', 'Hecho'];
        const f2 = datosEstado.map(d => [d.mes, d['No_facturable'], d['Adición'], d['Hecho']]);
        f2.push(['TOTAL',
            datosEstado.reduce((s, d) => s + d['No_facturable'], 0),
            datosEstado.reduce((s, d) => s + d['Adición'], 0),
            datosEstado.reduce((s, d) => s + d['Hecho'], 0)
        ]);
        const ws2 = XLSX.utils.aoa_to_sheet([h2, ...f2]);
        XLSX.utils.book_append_sheet(wb, ws2, 'Estado x Mes');

        if (reporte?.porEspecialidad?.length > 0) {
            const h3 = ['Especialidad', 'Total'];
            const f3 = reporte.porEspecialidad.map(d => [d.especialidad, Number(d.total)]);
            const ws3 = XLSX.utils.aoa_to_sheet([h3, ...f3]);
            XLSX.utils.book_append_sheet(wb, ws3, 'Especialidad');
        }

        if (reporte?.porAuditor?.length > 0) {
            const h4 = ['Auditor', 'Total Auditados'];
            const f4 = reporte.porAuditor.map(d => [d.auditor, Number(d.total)]);
            const ws4 = XLSX.utils.aoa_to_sheet([h4, ...f4]);
            XLSX.utils.book_append_sheet(wb, ws4, 'Auditor');
        }

        XLSX.writeFile(wb, `reporte_cirugias_${anio}.xlsx`);
    };

    const totalGeneral = reporte?.totalGeneral || 0;
    const datosMes = procesarDatosMes();
    const datosEstado = procesarEstadoPorMes();

    if (loading) return <p className="text-center py-8">Cargando reporte...</p>;

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-4xl font-bold text-gray-800">
                        <FontAwesomeIcon icon={faChartBar} className="mr-2" />
                        Reportes y Estadísticas
                    </h2>
                </div>
                
                <div className="flex items-center gap-2">
                <button
                    onClick={() => navigate('/auditoria/procedimientos')}
                    className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all duration-200 shadow-md flex items-center gap-2"
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Volver a Procedimientos
                </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-blue-600 font-medium">Total General</p>
                    <p className="text-3xl font-bold text-blue-800">{totalGeneral}</p>
                </div>
                <div className="flex items-center">
                    <label className="ml-15 px-3 text-sm font-medium">Año:</label>
                    <select value={anio} onChange={e => setAnio(e.target.value)} className="border-2 border-gray-300 rounded-md px-3 py-1.5 text-sm">
                        <option value="2026">2026</option>
                        <option value="2025">2025</option>
                    </select>
                    <button onClick={handleExportarExcel} className="ml-10 px-5 py-1.5 bg-green-700 text-white text-md font-semibold rounded hover:bg-green-800 transition-all flex items-center gap-1">
                        <FontAwesomeIcon icon={faFileExcel} />
                        Exportar Excel
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-blue-600" />
                        Total de Procedimientos por Mes
                    </h3>
                    <div className="mb-4" style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={datosMes}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="mes" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="total" fill="#3b82f6" name="Total" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-3 py-2 text-left">Mes</th>
                                <th className="border px-3 py-2 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datosMes.map((d, i) => (
                                <tr key={i} className={d.total > 0 ? '' : 'text-gray-400'}>
                                    <td className="border px-3 py-1">{d.mes}</td>
                                    <td className="border px-3 py-1 text-right font-medium">{d.total > 0 ? d.total : '-'}</td>
                                </tr>
                            ))}
                            <tr className="bg-gray-50 font-bold">
                                <td className="border px-3 py-2">TOTAL</td>
                                <td className="border px-3 py-2 text-right">{datosMes.reduce((sum, d) => sum + d.total, 0)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="bg-white shadow-md rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-green-600" />
                        Estado de Auditoría por Mes
                    </h3>
                    <div className="mb-4" style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={datosEstado}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="mes" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="No_facturable" fill="#ef4444" name="No Facturable" />
                                <Bar dataKey="Adición" fill="#f59e0b" name="Adición" />
                                <Bar dataKey="Hecho" fill="#22c55e" name="Hecho" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-3 py-2 text-left">Mes</th>
                                <th className="border px-3 py-2 text-right">No Facturable</th>
                                <th className="border px-3 py-2 text-right">Adición</th>
                                <th className="border px-3 py-2 text-right">Hecho</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datosEstado.map((d, i) => (
                                <tr key={i}>
                                    <td className="border px-3 py-1">{d.mes}</td>
                                    <td className="border px-3 py-1 text-right">{d['No_facturable'] > 0 ? d['No_facturable'] : '-'}</td>
                                    <td className="border px-3 py-1 text-right">{d['Adición'] > 0 ? d['Adición'] : '-'}</td>
                                    <td className="border px-3 py-1 text-right">{d['Hecho'] > 0 ? d['Hecho'] : '-'}</td>
                                </tr>
                            ))}
                            <tr className="bg-gray-50 font-bold">
                                <td className="border px-3 py-2">TOTAL</td>
                                <td className="border px-3 py-2 text-right">{datosEstado.reduce((sum, d) => sum + d['No_facturable'], 0)}</td>
                                <td className="border px-3 py-2 text-right">{datosEstado.reduce((sum, d) => sum + d['Adición'], 0)}</td>
                                <td className="border px-3 py-2 text-right">{datosEstado.reduce((sum, d) => sum + d['Hecho'], 0)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {reporte?.porEspecialidad && reporte.porEspecialidad.length > 0 && (
                <div className="bg-white shadow-md rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <FontAwesomeIcon icon={faChartBar} className="mr-2 text-purple-600" />
                        Procedimientos por Especialidad
                    </h3>
                    <div className="mb-4" style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={reporte.porEspecialidad.slice(0, 10).map(d => ({ especialidad: d.especialidad?.substring(0, 20), total: Number(d.total) }))} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="especialidad" type="category" width={150} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="total" fill="#8b5cf6" name="Total" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-3 py-2 text-left">Especialidad</th>
                                <th className="border px-3 py-2 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reporte.porEspecialidad.map((d, i) => (
                                <tr key={i}>
                                    <td className="border px-3 py-1">{d.especialidad}</td>
                                    <td className="border px-3 py-1 text-right font-medium">{Number(d.total)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {reporte?.porAuditor && reporte.porAuditor.length > 0 && (
                <div className="bg-white shadow-md rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <FontAwesomeIcon icon={faChartBar} className="mr-2 text-indigo-600" />
                        Procedimientos Auditados por Usuario
                    </h3>
                    <div className="mb-4" style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={reporte.porAuditor.slice(0, 10).map(d => ({ auditor: d.auditor?.substring(0, 20), total: Number(d.total) }))} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="auditor" type="category" width={150} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="total" fill="#6366f1" name="Total" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-3 py-2 text-left">Auditor</th>
                                <th className="border px-3 py-2 text-right">Total Auditados</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reporte.porAuditor.map((d, i) => (
                                <tr key={i}>
                                    <td className="border px-3 py-1">{d.auditor}</td>
                                    <td className="border px-3 py-1 text-right font-medium">{Number(d.total)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
