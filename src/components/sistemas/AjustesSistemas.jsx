import { useEffect, useState } from 'react'
import useFetchUsuarioPageable from '../../hooks/authService/useFetchUsuarioPageable';
import Loader from '../Loader';
import Pagination from '../Pagination';
import useFetchRolesByMicroservice from '../../hooks/authService/useFetchRolesByMicroservice';
import Select from 'react-select';
import useUpdateUsuarioRoles from '../../hooks/authService/useUpdateUsuarioRoles';
import ModificarRolesUsuario from '../ModificarRolesUsuario';
import { Spinner } from 'react-bootstrap';

function AjustesSistemas() {

    const MICROSERVICE_NAME = "ADMINSTRACIONALMACENAMIENTOINFORMACIONSISTEMAS";

    const { data: dataU, setData: setDataU, loading: loadingU, error: errorU, fetchUsuarios } = useFetchUsuarioPageable();
    const { data: dataR, loading: loadingR, error: errorR, fetchRolesByMycroservice } = useFetchRolesByMicroservice();
    const { data: dataUpdateU, loading: loadingUpdateU, error: errorUpdateU, updateUsuarioRoles } = useUpdateUsuarioRoles();

    const [page, setPage] = useState(0);
    
    const [inputFind, setInputFind] = useState("");
    const [openForm, setOpenForm] = useState(false);
    const [openTabla, setOpenTabla] = useState(true);

    // Cambiar el título al cargar el componente
    useEffect(() => {
        document.title = "Sistemas - Ajustes";
    }, []);

    // Cargar roles al montar el componente
    useEffect(() => {
        fetchRolesByMycroservice(MICROSERVICE_NAME);
    }, []);

    // Cargar usuarios al montar el componente y al cambiar de página
    useEffect(() => {
        fetchUsuarios(MICROSERVICE_NAME, page, 50);
    }, [page]);

    // Actualizar la lista de usuarios, el usuario al que se le actualizan los roles
    useEffect(() => {
        if (!dataUpdateU || !dataU?.content) return;
        const newUsuarios = dataU?.content?.map((usuario) => {
            if (usuario?.username === dataUpdateU?.username) {
                return {
                    ...usuario,
                    roles: dataUpdateU.roles
                }
            }
            return usuario;
        });
        setDataU(prevData => ({
            ...prevData,
            content: newUsuarios
        }));
    }, [dataUpdateU])

    if (loadingU || loadingR) return <Loader />;
    if (errorU) return <div>Error al cargar los datos: {errorU.message}</div>;
    if (errorR) return <div>Error al cargar los roles: {errorR.message}</div>;

    const opcionesRoles = dataR?.map((rol) => ({ value: rol.id, label: rol.rol }));

    const handleRolesChange = (selectOption, usuario) => {
        const roles = selectOption.map(option => ({ id: option.value, rol: option.label }));
        updateUsuarioRoles(usuario.username, roles);
    }

    return (
        <>
            {loadingUpdateU && <Loader />}
            
            {/* Título de la página */}
            <p className="text-center bg-gray-100 text-gray-800 p-2 rounded-md text-lg font-medium">
                Ajustes <strong className="text-blue-600">ADMINSTRACIONALMACENAMIENTOINFORMACIONSISTEMAS</strong>
            </p>
            {/* Acordeón - Formulario */}
            <div className="mb-4 border rounded-xl overflow-visible shadow">
                <button onClick={() => setOpenForm(!openForm)}
                    className="w-full flex justify-between items-center px-6 py-2 bg-blue-100 hover:bg-blue-200 text-left" >
                    <h6 className="text-lg font-semibold text-blue-800">Formulario de sincronización</h6>
                    <span className="ml-2 text-gray-500">&#x25BC;</span> {/* ▼ */}
                </button>

                {openForm && (
                    <ModificarRolesUsuario listRoles={dataR} />
                )}
            </div>

            {/* Acordeón - Tabla */}
            <div className="mb-4 border rounded-xl overflow-visible shadow">
                <button onClick={() => setOpenTabla(!openTabla)}
                    className="w-full flex justify-between items-center px-6 py-2 bg-blue-100 hover:bg-blue-200 text-left" >
                    <h6 className="text-lg font-semibold text-blue-800">Usuarios sincronizados con el microservicio </h6>
                    <span className="ml-2 text-gray-500">&#x25BC;</span> {/* ▼ */}
                </button>

                {openTabla && (
                    <div className="p-6 bg-white space-y-6">
                        <input className="w-full mb-4 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            type="text" placeholder="Buscar..." value={inputFind} onChange={(e) => setInputFind(e.target.value)}
                        />
                        <div className="flex flex-col lg:flex-row items-start lg:items-end gap-4">
                            <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-2 font-semibold text-gray-700">Documento</th>
                                        <th className="px-4 py-2 font-semibold text-gray-700">Nombre Completo</th>
                                        <th className="px-4 py-2 font-semibold text-gray-700">Roles</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {dataU?.content && dataU.content.length > 0 ? (
                                        dataU.content
                                            .filter((usuario) =>
                                                usuario.username.toLowerCase().includes(inputFind.toLowerCase()) || usuario.nombreCompleto.toLowerCase().includes(inputFind.toLowerCase())
                                            )
                                            .map((usuario) => (
                                                <tr key={usuario.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-2">{usuario.username}</td>
                                                    <td className="px-4 py-2">{usuario.nombreCompleto}</td>
                                                    <td className="px-4 py-2">
                                                        <Select isMulti options={opcionesRoles}
                                                            value={usuario.roles.map((rol) => ({ value: rol.id, label: rol.rol }))}
                                                            onChange={(selectOpci) => handleRolesChange(selectOpci, usuario)}
                                                        />
                                                    </td>
                                                </tr>
                                            ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="text-center px-4 py-6 text-gray-500 italic">
                                                NO HAY USUARIOS ASOCIADOS
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6">
                            {dataU?.totalPages > 1 && (<Pagination currentPage={page} totalPages={dataU?.totalPages || 1} onPageChange={setPage} />)}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default AjustesSistemas
