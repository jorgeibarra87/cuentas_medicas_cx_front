import { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:8082';

export default function TrasladosForm({ traslado, onSaved }) {
    const [formData, setFormData] = useState({
        fechaTraslado: '',
        nomPaciente: '',
        documento: '',
        ingreso: '',
        eps: '',
        tipoTraslado: '',
        servicio: '',
        destino: '',
        ciudad: '',
        autorizacion: '',
        auxiliarReferencia: '',
        auxiliarAmbulancia: '',
        medicamentos: [],
        Archivo: '',
        Estado: ''
    });
    const [medicamentosTexto, setMedicamentosTexto] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (traslado) {
            setFormData({
                fechaTraslado: traslado.fechaTraslado?.slice(0, 16) || '',
                nomPaciente: traslado.nomPaciente || '',
                documento: traslado.documento || '',
                ingreso: traslado.ingreso || '',
                eps: traslado.eps || '',
                tipoTraslado: traslado.tipoTraslado || '',
                servicio: traslado.servicio || '',
                destino: traslado.destino || '',
                ciudad: traslado.ciudad || '',
                autorizacion: traslado.autorizacion || '',
                auxiliarReferencia: traslado.auxiliarReferencia || '',
                auxiliarAmbulancia: traslado.auxiliarAmbulancia || '',
                medicamentos: traslado.medicamentos || [],
                Archivo: traslado.Archivo || '',
                Estado: traslado.Estado || ''
            });
            setMedicamentosTexto((traslado.medicamentos || []).join(', '));
        } else {
            const now = new Date().toISOString().slice(0, 16);
            setFormData(prev => ({
                ...prev,
                fechaTraslado: now,
                fechaArchivo: now
            }));
            setMedicamentosTexto('');
        }
    }, [traslado]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                ...formData,
                medicamentos: medicamentosTexto
                    .split(',')
                    .map(m => m.trim())
                    .filter(Boolean)
            };

            const url = traslado
                ? `${API_BASE}/traslados/${traslado.id}`
                : `${API_BASE}/traslados`;

            const method = traslado ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(`Error ${res.status}: ${txt}`);
            }

            onSaved && onSaved();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold mb-4">
                {traslado ? 'Editar traslado' : 'Nuevo traslado'}
            </h3>

            {error && (
                <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha traslado
                    </label>
                    <input
                        type="datetime-local"
                        value={formData.fechaTraslado}
                        onChange={e => handleChange('fechaTraslado', e.target.value)}
                        className="input-field"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha archivo
                    </label>
                    <input
                        type="datetime-local"
                        value={formData.fechaArchivo}
                        onChange={e => handleChange('fechaArchivo', e.target.value)}
                        className="input-field"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Paciente
                    </label>
                    <input
                        type="text"
                        value={formData.nomPaciente}
                        onChange={e => handleChange('nomPaciente', e.target.value)}
                        className="input-field"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Documento
                    </label>
                    <input
                        type="text"
                        value={formData.documento}
                        onChange={e => handleChange('documento', e.target.value)}
                        className="input-field"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ingreso
                    </label>
                    <input
                        type="text"
                        value={formData.ingreso}
                        onChange={e => handleChange('ingreso', e.target.value)}
                        className="input-field"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        EPS
                    </label>
                    <input
                        type="text"
                        value={formData.eps}
                        onChange={e => handleChange('eps', e.target.value)}
                        className="input-field"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo traslado
                    </label>
                    <input
                        type="text"
                        value={formData.tipoTraslado}
                        onChange={e => handleChange('tipoTraslado', e.target.value)}
                        className="input-field"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Servicio
                    </label>
                    <input
                        type="text"
                        value={formData.servicio}
                        onChange={e => handleChange('servicio', e.target.value)}
                        className="input-field"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Destino
                    </label>
                    <input
                        type="text"
                        value={formData.destino}
                        onChange={e => handleChange('destino', e.target.value)}
                        className="input-field"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ciudad
                    </label>
                    <input
                        type="text"
                        value={formData.ciudad}
                        onChange={e => handleChange('ciudad', e.target.value)}
                        className="input-field"
                        required
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Autorización
                    </label>
                    <textarea
                        rows={2}
                        value={formData.autorizacion}
                        onChange={e => handleChange('autorizacion', e.target.value)}
                        className="input-field"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Auxiliar referencia
                    </label>
                    <input
                        type="text"
                        value={formData.auxiliarReferencia}
                        onChange={e => handleChange('auxiliarReferencia', e.target.value)}
                        className="input-field"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Auxiliar ambulancia
                    </label>
                    <input
                        type="text"
                        value={formData.auxiliarAmbulancia}
                        onChange={e => handleChange('auxiliarAmbulancia', e.target.value)}
                        className="input-field"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Medicamentos (separados por coma)
                    </label>
                    <input
                        type="text"
                        value={medicamentosTexto}
                        onChange={e => setMedicamentosTexto(e.target.value)}
                        className="input-field"
                        placeholder="Paracetamol 1g IV, Omeprazol 40mg..."
                    />
                </div>

                <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                    >
                        {loading ? 'Guardando...' : (traslado ? 'Actualizar' : 'Crear')}
                    </button>
                </div>
            </form>
        </div>
    );
}
