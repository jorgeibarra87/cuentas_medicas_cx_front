import { ajustesMenu } from "../../modules/ajustes";
import { dinamicaMenu } from "../../modules/dinamica/menu";
import { facturacionMenu } from "../../modules/facturacion/menu";
import { monitorizacionHcMenu } from "../../modules/monitorizacionHc/menu";
import { nutricionMenu } from "../../modules/nutricion/menu";
import { referenciaContrareferenciaMenu } from "../../modules/referencia-contrareferencia";
import { rehabilitacionMenu } from "../../modules/rehabilitacion/menu";
import { sistemasMenu } from "../../modules/sistemas/menu";

const adminMenu = {
    nombre: 'Administración',
    roles: ['ROLE_ADMINISTRADOR'],
    children: [
        { nombre: 'Traslados', ruta: '/admin/traslados', roles: ['ROLE_ADMINISTRADOR'] },
        { nombre: 'Cuentas Médicas', ruta: '/admin/cuentas-medicas', roles: ['ROLE_ADMINISTRADOR'] },
        { nombre: 'Facturaciones', ruta: '/admin/facturaciones', roles: ['ROLE_ADMINISTRADOR'] },
        { nombre: 'Pacientes', ruta: '/admin/pacientes', roles: ['ROLE_ADMINISTRADOR'] },
        { nombre: 'Trámites', ruta: '/admin/tramites', roles: ['ROLE_ADMINISTRADOR'] },
        { nombre: 'Seguimiento Intra', ruta: '/admin/seguimiento-intra', roles: ['ROLE_ADMINISTRADOR'] },
        { nombre: 'Seguimiento Amb.', ruta: '/admin/seguimiento-ambulatorio', roles: ['ROLE_ADMINISTRADOR'] },
        { nombre: 'Egresos', ruta: '/admin/egresos', roles: ['ROLE_ADMINISTRADOR'] },
        { nombre: 'Tipos de Solicitud', ruta: '/admin/tipos-solicitud', roles: ['ROLE_ADMINISTRADOR'] },
    ],
};

export const appMenu = [
    adminMenu,
    dinamicaMenu,
    rehabilitacionMenu,
    sistemasMenu,
    referenciaContrareferenciaMenu,
    facturacionMenu,
    nutricionMenu,
    monitorizacionHcMenu,
    ajustesMenu
];