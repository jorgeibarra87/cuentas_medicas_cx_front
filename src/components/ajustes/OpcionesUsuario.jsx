import { useEffect, useState } from 'react';
import Select from 'react-select';
import useFetchUsuario from '../../hooks/authService/useFetchUsuario';
import Loader from '../Loader';
import useFetchRol from '../../hooks/authService/useFetchRol';
import SincronizarUsuario from '../SincronizarUsuario';

function OpcionesUsuario() {
  const { usuarios, loading: loadingU, error: errorU, fetchUsuarios } = useFetchUsuario();
  const { roles, loading: loadingRoles, error: errorRoles, fetchRol } = useFetchRol();
  const [showSincronizar, setShowSincronizar] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [inputFind, setInputFind] = useState('');

  // obtener usuarios
  useEffect(() => {
    if (usuarios.length > 0) return;
    fetchUsuarios();
  }, []);

  // obtener roles
  useEffect(() => {
    if (roles.length > 0) return;
    fetchRol();
  }, []);

  useEffect(() => {
    if (usuarios.length == 0) return;
    const data = usuarios.map((entry) => ({
      ...entry,
      roles: entry.roles.map((role) => ({
        value: role.id,
        label: role.rol,
      })),
    }));
    setTableData(data);
  }, [usuarios]);

  const opcionesRoles = roles.map((rol) => ({ value: rol.id, label: rol.rol }));

  if (loadingU || loadingRoles) return <Loader />;
  if (errorU || errorRoles)return ( <div> Error al cargar los {errorU ? 'usuarios' : 'roles'} {errorU?.message || errorRoles?.message} </div> );

  return (
    <>
      <SincronizarUsuario show={showSincronizar} handleClose={() => setShowSincronizar(false)} />
      <div className="mt-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded" onClick={() => setShowSincronizar(true)}>
          Agregar Usuario 
        </button>
      </div>

      <input type="text" className="mt-4 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Buscar..." value={inputFind} onChange={(e) => setInputFind(e.target.value)} />

      <table className="w-full mt-4 table-auto border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">Documento</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Nombre Completo</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Roles</th>
          </tr>
        </thead>
        <tbody>
          {tableData.length > 0 &&
            tableData
              .filter((usuario) => usuario.username.includes(inputFind) || usuario.nombreCompleto.includes(inputFind.toLocaleUpperCase()))
              .map((usuario) => {
                return (
                  <tr key={usuario.username} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">{usuario.username}</td>
                    <td className="border border-gray-300 px-4 py-2">{usuario.nombreCompleto}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <Select isMulti options={opcionesRoles} className="w-full" value={usuario.roles} classNamePrefix="select" />
                    </td>
                  </tr>
                );
              })}
        </tbody>
      </table>
    </>
  );
}
export default OpcionesUsuario;