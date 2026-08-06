import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEye, faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { seguimientoAmbService } from '../../api/adminService';
import Modal from '../../../../shared/components/Modal';

const PAGE_SIZES = [5, 10, 25, 50];

function CreateEdit({ item, onClose, onActualizar }) {
  const isEdit = !!item;
  const [form, setForm] = useState({
    tramiteId: item?.tramiteId || '',
    fechaNota: item?.fechaNota ? new Date(item.fechaNota).toISOString().slice(0, 16) : '',
    notaSeguimiento: item?.notaSeguimiento || '',
    estado: item?.estado || 'ACTIVO',
    auxiliarReferencia: item?.auxiliarReferencia || '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await seguimientoAmbService.actualizar(item.id, form);
      } else {
        await seguimientoAmbService.crear(form);
      }
      onActualizar();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">ID Trámite</label>
        <input type="number" name="tramiteId" value={form.tramiteId} onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Fecha Nota</label>
        <input type="datetime-local" name="fechaNota" value={form.fechaNota} onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Nota Seguimiento</label>
        <textarea name="notaSeguimiento" value={form.notaSeguimiento} onChange={handleChange} rows={3}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Estado</label>
        <select name="estado" value={form.estado} onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
          <option value="ACTIVO">ACTIVO</option>
          <option value="INACTIVO">INACTIVO</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Auxiliar Referencia</label>
        <input type="text" name="auxiliarReferencia" value={form.auxiliarReferencia} onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onClose}
          className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">Cancelar</button>
        <button type="submit" disabled={saving}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
          {saving ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
}

function View({ item, onClose }) {
  return (
    <div className="space-y-3">
      <div><span className="font-semibold text-gray-600">ID:</span> <span className="float-right">{item.id}</span></div>
      <div><span className="font-semibold text-gray-600">ID Trámite:</span> <span className="float-right">{item.tramiteId}</span></div>
      <div><span className="font-semibold text-gray-600">Fecha Nota:</span> <span className="float-right">{item.fechaNota ? new Date(item.fechaNota).toLocaleString() : ''}</span></div>
      <div><span className="font-semibold text-gray-600">Nota Seguimiento:</span> <span className="float-right">{item.notaSeguimiento || ''}</span></div>
      <div><span className="font-semibold text-gray-600">Estado:</span> <span className="float-right">{item.estado}</span></div>
      <div><span className="font-semibold text-gray-600">Auxiliar Referencia:</span> <span className="float-right">{item.auxiliarReferencia || ''}</span></div>
      <div><span className="font-semibold text-gray-600">Creado:</span> <span className="float-right">{item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}</span></div>
      <div className="flex justify-end pt-2">
        <button type="button" onClick={onClose}
          className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">Cerrar</button>
      </div>
    </div>
  );
}

export default function SeguimientoAmbAdminTable() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [modalType, setModalType] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await seguimientoAmbService.listarTodos();
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error(err);
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) setPage(newPage);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setPage(0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este registro?')) return;
    try {
      await seguimientoAmbService.eliminar(id);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Error al eliminar');
    }
  };

  const openCreate = () => { setSelectedItem(null); setModalType('create'); };
  const openEdit = (item) => { setSelectedItem(item); setModalType('edit'); };
  const openView = (item) => { setSelectedItem(item); setModalType('view'); };
  const closeModal = () => { setModalType(null); setSelectedItem(null); };

  if (loading) return <p className="text-center py-4">Cargando...</p>;
  if (error) return <p className="text-center py-4 text-red-600">{error}</p>;

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Seguimiento Ambulatorio</h2>
        <button onClick={openCreate}
          className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700">
          <FontAwesomeIcon icon={faPlus} className="mr-1" /> Nuevo
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-black text-white">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">ID Trámite</th>
              <th className="px-4 py-2 text-left">Fecha Nota</th>
              <th className="px-4 py-2 text-left">Estado</th>
              <th className="px-4 py-2 text-left">Auxiliar Referencia</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-500">No hay registros</td></tr>
            ) : (
              paginatedData.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{item.id}</td>
                  <td className="px-4 py-2">{item.tramiteId}</td>
                  <td className="px-4 py-2">{item.fechaNota ? new Date(item.fechaNota).toLocaleString() : ''}</td>
                  <td className="px-4 py-2">{item.estado}</td>
                  <td className="px-4 py-2">{item.auxiliarReferencia || ''}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button onClick={() => openView(item)} className="text-blue-600 hover:text-blue-800" title="Ver">
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button onClick={() => openEdit(item)} className="text-yellow-600 hover:text-yellow-800" title="Editar">
                      <FontAwesomeIcon icon={faPencilAlt} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800" title="Eliminar">
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span>Mostrar</span>
          <select value={itemsPerPage} onChange={handleItemsPerPageChange}
            className="border border-gray-300 rounded px-2 py-1 text-sm">
            {PAGE_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <span>de {data.length} registros</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => handlePageChange(0)} disabled={page === 0}
            className="px-2 py-1 border rounded disabled:opacity-40">«</button>
          <button onClick={() => handlePageChange(page - 1)} disabled={page === 0}
            className="px-2 py-1 border rounded disabled:opacity-40">‹</button>
          <span className="px-3 py-1">{page + 1} / {totalPages || 1}</span>
          <button onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages - 1}
            className="px-2 py-1 border rounded disabled:opacity-40">›</button>
          <button onClick={() => handlePageChange(totalPages - 1)} disabled={page >= totalPages - 1}
            className="px-2 py-1 border rounded disabled:opacity-40">»</button>
        </div>
      </div>

      <Modal isOpen={modalType === 'create' || modalType === 'edit'} onClose={closeModal}
        title={modalType === 'create' ? 'Nuevo Seguimiento Ambulatorio' : 'Editar Seguimiento Ambulatorio'} size="lg">
        <CreateEdit item={selectedItem} onClose={closeModal} onActualizar={loadData} />
      </Modal>

      <Modal isOpen={modalType === 'view'} onClose={closeModal}
        title="Detalle del Seguimiento Ambulatorio" size="lg">
        {selectedItem && <View item={selectedItem} onClose={closeModal} />}
      </Modal>
    </div>
  );
}
