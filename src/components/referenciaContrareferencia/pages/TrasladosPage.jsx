import { useState } from 'react';
import TrasladosForm from '../forms/TrasladosForm';
import TrasladosTable from '../tables/TrasladosTable';

export default function TrasladosPage() {
    const [selectedTraslado, setSelectedTraslado] = useState(null);
    const [reloadFlag, setReloadFlag] = useState(0);

    const handleEdit = (traslado) => {
        setSelectedTraslado(traslado);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSaved = () => {
        setSelectedTraslado(null);
        setReloadFlag(prev => prev + 1);
    };

    return (
        <div className="p-4 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Traslados de ambulancia
            </h2>
            <p className="text-gray-600 mb-4">
                Gestiona los traslados, facturación y cuentas médicas asociados.
            </p>

            <TrasladosForm traslado={selectedTraslado} onSaved={handleSaved} />

            <TrasladosTable onEdit={handleEdit} reloadFlag={reloadFlag} />
        </div>
    );
}
