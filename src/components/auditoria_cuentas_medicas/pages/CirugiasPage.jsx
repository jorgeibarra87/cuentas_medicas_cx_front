import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CirugiasForm from '../forms/CirugiasForm';
import CirugiasTable from '../tables/CirugiasTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBookMedical, faFileEdit, faFile, faChartBar } from '@fortawesome/free-solid-svg-icons';

export default function CirugiasPage() {
    const navigate = useNavigate();
    const [modo, setModo] = useState('lista');
    const [selectedCirugia, setSelectedCirugia] = useState(null);
    const [reloadFlag, setReloadFlag] = useState(0);

    const token = localStorage.getItem('tokenhusjp');
    const payload = token ? JSON.parse(atob(token.split('.')[1])) : {};
    const roles = Array.isArray(payload.authorities)
        ? payload.authorities
        : payload.authorities?.split(',').map(r => r.trim()) || [];

    const tieneRol = (...rolesRequeridos) => rolesRequeridos.some(rol => roles.includes(rol));

    const handleEdit = (cirugia) => {
        setSelectedCirugia(cirugia);
        setModo('editar');
    };

    const handleNuevo = () => {
        setSelectedCirugia(null);
        setModo('crear');
    };

    const handleSaved = () => {
        setModo('lista');
        setSelectedCirugia(null);
        setReloadFlag(prev => prev + 1);
    };

    const handleCancelar = () => {
        setModo('lista');
        setSelectedCirugia(null);
    };

    if (modo === 'editar' || modo === 'crear') {
        return (
            <div className="min-h-screen bg-white">
                <div className="mx-auto">
                    <div className="bg-white shadow-2xl rounded-2xl p-4 border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                                    {modo === 'editar' ? <><FontAwesomeIcon icon={faFileEdit} className="w-5 h-5 text-blue-600 mr-2" /> Editar Procedimiento</> : <><FontAwesomeIcon icon={faFile} className="w-5 h-5 text-green-600 mr-2" /> Nuevo Procedimiento</>}
                                </h1>
                                {modo === 'editar' && selectedCirugia && (
                                    <p className="text-gray-600 text-sm">
                                        ID:{' '}
                                        <span className="font-semibold text-blue-600">
                                            {selectedCirugia.id}
                                        </span>
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={handleCancelar}
                                className="px-4 py-2 bg-gray-500 text-white font-semibold rounded hover:bg-gray-600 transition-all duration-200 shadow-md"
                            >
                                ← Volver a Lista
                            </button>
                        </div>

                        <CirugiasForm
                            cirugia={selectedCirugia}
                            onSaved={handleSaved}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="w-full mx-auto">
                <div className="bg-white shadow-2xl rounded-3xl p-2 border border-gray-100 mb-2">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-2">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800 mb-1">
                                <FontAwesomeIcon icon={faBookMedical} className="w-6 h-6 text-gray-700 pr-2" />
                                Gestión Auditoría Procedimientos Quirúrgicos
                            </h1>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleNuevo}
                                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md flex items-center gap-2"
                            >
                                <FontAwesomeIcon icon={faPlus} />
                                Nuevo Procedimiento
                            </button>
                            <button
                                onClick={() => navigate('/auditoria/reportes')}
                                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md flex items-center gap-2"
                            >
                                <FontAwesomeIcon icon={faChartBar} />
                                Ver Reportes
                            </button>
                        </div>
                    </div>

                    <CirugiasTable
                        onEdit={handleEdit}
                        reloadFlag={reloadFlag}
                    />
                </div>
            </div>
        </div>
    );
}