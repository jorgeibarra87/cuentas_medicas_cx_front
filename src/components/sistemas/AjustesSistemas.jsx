import { useEffect, useState } from 'react'
import useFetchUsuarioPageable from '../../hooks/authService/useFetchUsuarioPageable';
import Loader from '../Loader';
import Pagination from '../Pagination';
import useFetchRolesByMicroservice from '../../hooks/authService/useFetchRolesByMicroservice';
import Select from 'react-select';
import useUpdateUsuarioRoles from '../../hooks/authService/useUpdateUsuarioRoles';
import SincronizarUsuario from '../SincronizarUsuario';
import { ToastContainer } from 'react-toastify';

function AjustesSistemas() {

    const { data: dataU, setData: setDataU, loading: loadingU, error: errorU, fetchUsuarios } = useFetchUsuarioPageable();
    const { data: dataR, loading: loadingR, error: errorR, fetchRolesByMycroservice } = useFetchRolesByMicroservice();
    const { data: dataUpdateU, loading: loadingUpdateU, error: errorUpdateU, updateUsuarioRoles } = useUpdateUsuarioRoles();

    const [page, setPage] = useState(0);
    const [documento, setDocumento] = useState("");
    const [roles, setRoles] = useState([]);
    const [showSincronizar, setShowSincronizar] = useState(false);
    const [inputFind, setInputFind] = useState("");

    // Cambiar el título del documento al cargar el componente
    useEffect(() => {
        document.title = "Sistemas - Ajustes";
    }, []);

    // Cargar roles al montar el componente
    useEffect(() => {
        fetchRolesByMycroservice("ADMINSTRACIONALMACENAMIENTOINFORMACIONSISTEMAS");
    }, []);

    // Cargar usuarios al montar el componente y al cambiar de página
    useEffect(() => {
        fetchUsuarios("ADMINSTRACIONALMACENAMIENTOINFORMACIONSISTEMAS", page, 50);
    }, [page]);

    // Mostrar modal de sincronización si el usuario no esta en la db de authenticacion 
    useEffect(() => {
        if (errorUpdateU?.response?.data.codigoError == "AUS-US-01") {
            setShowSincronizar(true);
        }
    }, [errorUpdateU])

    // Actualizar la lista de usuarios, el usuario al que se le actualizan los roles
    useEffect(() => {
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

    const handleSubmit = (e) => {
        e.preventDefault();
        const doc = documento.trim();
        const rolesSeleccionados = roles.map(role => ({ id: role.value }));
        if (!doc || !rolesSeleccionados) {
            alert("Por favor, complete todos los campos.");
            return;
        }
        updateUsuarioRoles(doc, rolesSeleccionados);
    }

    return (
        <>
            {loadingUpdateU && <Loader />}
            <SincronizarUsuario show={showSincronizar} handleClose={() => setShowSincronizar(false)} documento={documento} />
            <form onSubmit={handleSubmit} className="p-3">
                <div className="form-group mb-3">
                    <h3>Sincronizar usuario</h3>
                    <p>Los usuarios que se muestran son los que pertenecen al microservicio
                        <strong> ADMINSTRACIONALMACENAMIENTOINFORMACIONSISTEMAS</strong>
                    </p>
                    <p>Para sincronizar un usuario, simplemente actualice los roles que le corresponden.</p>
                </div>

                <div className="d-flex align-items-center gap-2">
                    <div className="flex-grow-1">
                        <label htmlFor="documento" className="form-label mb-1">Documento</label>
                        <input type="text" className="form-control" id="documento" placeholder="Ingrese el documento" onChange={(e) => setDocumento(e.target.value)} required />
                    </div>
                    <div className="flex-grow-1">
                        <label className="form-label mb-1">Roles</label>
                        <Select isMulti options={opcionesRoles} placeholder="Seleccione los roles" onChange={(selectedOptions) => setRoles(selectedOptions)} className="react-select-container" classNamePrefix="react-select" />
                    </div>
                    <div className="mt-4">
                        <button type="submit" className="btn btn-primary"> Sincronizar </button>
                    </div>
                </div>
            </form>
            <input className="form-control" type="text" placeholder="Buscar..." value={inputFind} onChange={(e) => setInputFind(e.target.value)}/>
            <table className='table table-striped table-bordered'>
                <thead>
                    <tr>
                        <th>Documento</th>
                        <th>Nombre Completo</th>
                        <th>Roles</th>
                    </tr>
                </thead>
                <tbody>
                    {dataU?.content && dataU.content.length > 0 ? (
                        dataU?.content.filter((usuario) => usuario.username.includes(inputFind) || usuario.nombreCompleto.includes(inputFind.toLocaleUpperCase())).map((usuario) => {
                        return (
                            <tr key={usuario.id}>
                                <td>{usuario.username}</td>
                                <td>{usuario.nombreCompleto}</td>
                                <td>
                                    {<Select isMulti options={opcionesRoles} value={usuario.roles.map(rol => ({ value: rol.id, label: rol.rol }))} onChange={(selectOpci) => handleRolesChange(selectOpci, usuario)} />}
                                </td>
                            </tr>
                        )
                    })
                    ) : (
                        <tr>
                            <td colSpan={3} className='text-center'>
                                NO HAY USUARIOS ASOCIADOS
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <Pagination currentPage={page} totalPages={dataU.totalPages} onPageChange={setPage} />
            <ToastContainer />
        </>
    )
}

export default AjustesSistemas
