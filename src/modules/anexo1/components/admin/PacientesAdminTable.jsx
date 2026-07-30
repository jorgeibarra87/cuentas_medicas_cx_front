import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencilAlt, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { pacienteService } from '../../api/adminService';
import Modal from '../../../../shared/components/Modal';

function CreateEdit({ item, onClose, onActualizar }) {
  const [form, setForm] = useState({
    tipoDocumento: '',
    numeroDocumento: '',
    nombreCompleto: '',
    eps: '',
    telefono: '',
    email: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (item) setForm({ ...item });
  }, [item]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (item?.id) {
        await pacienteService.actualizar(item.id, form);
      } else {
        await pacienteService.crear(form);
      }
      onActualizar();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Error al guardar');
    } finally {
      setSubmitting(false);
    }
  };

  const tiposDocumento = ['CC', 'TI', 'RC', 'CE', 'PA', 'NIT', 'OTRO'];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
      <div>
        <label className="block text-sm font-medium text-gray-700">Tipo Documento</label>
        <select name="tipoDocumento" value={form.tipoDocumento} onChange={handleChange} required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
          <option value="">Seleccione...</option>
          {tiposDocumento.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Número Documento</label>
        <input name="numeroDocumento" value={form.numeroDocumento} onChange={handleChange} required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
        <input name="nombreCompleto" value={form.nombreCompleto} onChange={handleChange} required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">EPS</label>
        <input name="eps" value={form.eps} onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Teléfono</label>
        <input name="telefono" value={form.telefono} onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <div className="flex justify-end space-x-2 pt-2">
        <button type="button" onClick={onClose}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">Cancelar</button>
        <button type="submit" disabled={submitting}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
          {submitting ? 'Guardando...' : item?.id ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
}

function View({ item, onClose }) {
  if (!item) return null;
  const renderField = (label, value) => (
    <div className="border-b border-gray-200 pb-2">
      <span className="text-xs text-gray-500 block">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value || '-'}</span>
    </div>
  );

  return (
    <div className="space-y-3">
      {renderField('ID', item.id)}
      {renderField('Tipo Documento', item.tipoDocumento)}
      {renderField('Número Documento', item.numeroDocumento)}
      {renderField('Nombre Completo', item.nombreCompleto)}
      {renderField('EPS', item.eps)}
      {renderField('Teléfono', item.telefono)}
      {renderField('Email', item.email)}
      {renderField('Creado', item.createdAt ? new Date(item.createdAt).toLocaleString() : '-')}
      <div className="flex justify-end pt-2">
        <button onClick={onClose}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">Cerrar</button>
      </div>
    </div>
  );
}

export default function PacientesAdminTable() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showCreateEdit, setShowCreateEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [selected, setSelected] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await pacienteService.listarTodos();
      setData(Array.isArray(res) ? res : []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este paciente?')) return;
    try {
      await pacienteService.eliminar(id);
      loadData();
    } catch (err) {
      alert(err?.response?.data?.message || err.message || 'Error al eliminar');
    }
  };

  const filtered = data;
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated = filtered.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage);

  useEffect(() => { if (page >= totalPages) setPage(0); }, [totalPages, page]);

  return (
    <div className="bg-white shadow rounded">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-800">Pacientes</h2>
        <button onClick={() => { setSelected(null); setShowCreateEdit(true); }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
          <FontAwesomeIcon icon={faPlus} /> Nuevo
        </button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-4 rounded">{error}</div>}

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : paginated.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No hay pacientes registrados</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-black text-white uppercase text-xs">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Documento</th>
                <th className="px-4 py-3">EPS</th>
                <th className="px-4 py-3">Teléfono</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((row) => (
                <tr key={row.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 text-xs font-medium text-gray-900">{row.id}</td>
                  <td className="px-4 py-2 text-xs">{row.nombreCompleto}</td>
                  <td className="px-4 py-2 text-xs">{row.tipoDocumento} {row.numeroDocumento}</td>
                  <td className="px-4 py-2 text-xs">{row.eps}</td>
                  <td className="px-4 py-2 text-xs">{row.telefono}</td>
                  <td className="px-4 py-2 text-xs">{row.email}</td>
                  <td className="px-4 py-2 text-xs flex items-center gap-2">
                    <button onClick={() => { setSelected(row); setShowView(true); }}
                      className="text-blue-600 hover:text-blue-800" title="Ver">
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button onClick={() => { setSelected(row); setShowCreateEdit(true); }}
                      className="text-yellow-600 hover:text-yellow-800" title="Editar">
                      <FontAwesomeIcon icon={faPencilAlt} />
                    </button>
                    <button onClick={() => handleDelete(row.id)}
                      className="text-red-600 hover:text-red-800" title="Eliminar">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between p-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Mostrar</span>
          <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setPage(0); }}
            className="border border-gray-300 rounded p-1 text-sm">
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>de {filtered.length} registros</span>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <button onClick={() => setPage(0)} disabled={page === 0}
            className="px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-50">⏮</button>
          <button onClick={() => setPage(page - 1)} disabled={page === 0}
            className="px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-50">◀</button>
          <span className="px-3 py-1 text-gray-700">{page + 1} / {totalPages}</span>
          <button onClick={() => setPage(page + 1)} disabled={page + 1 >= totalPages}
            className="px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-50">▶</button>
          <button onClick={() => setPage(totalPages - 1)} disabled={page + 1 >= totalPages}
            className="px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-50">⏭</button>
        </div>
      </div>

      <Modal isOpen={showCreateEdit} onClose={() => setShowCreateEdit(false)}
        title={selected?.id ? 'Editar Paciente' : 'Nuevo Paciente'} size="md">
        <CreateEdit item={selected} onClose={() => setShowCreateEdit(false)}
          onActualizar={() => { setShowCreateEdit(false); loadData(); }} />
      </Modal>

      <Modal isOpen={showView} onClose={() => setShowView(false)} title="Detalle del Paciente" size="md">
        <View item={selected} onClose={() => setShowView(false)} />
      </Modal>
    </div>
  );
}
