import UsuarioProcesoServicio from "../../models/monitorizacionHc/UsuarioProcesoServicio";
import apiClienteMonitorizacionHc from "./apiClienteMonitorizacionHc";

export const obtenerUsuariosQueTienenProcesosYServicios = async () =>{
    try {
        const response = await apiClienteMonitorizacionHc.get(`/api/monitorizacionhc/usuario/conAsignacionProcesoAndServicio`);
        const usuarios = response.data.map(usuario => new UsuarioProcesoServicio(usuario));
        return usuarios;
    } catch (error) {
        console.error('Error al obtener los usuarios que tienen procesos y servicios de monitorizacion microservice',error);
        throw error;
    }
}

export const obtenerUsuarioConProcesosYServiciosPorDocumento = async (documento) => {
    try {
        const response = await apiClienteMonitorizacionHc.get(`/api/monitorizacionhc/usuario/relacionProcesosServicios/${documento}`);
        return new UsuarioProcesoServicio(response.data);
    } catch (error) {
        console.error('Error al obtener los usuarios que tienen procesos y servicios de monitorizacion microservice',error);
        throw error;
    }
};