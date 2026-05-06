export const monitorizacionHcMenu = {
    nombre: 'MonitorizacionHc',
    roles: ['ROLE_ADMINISTRADOR', 'ROLE_MONITORIZACION'],
    submenu: [
        { nombre: 'Monitorizacion Medico', ruta: '/monitorizacionhc/preguntas/medico', roles: ['ROLE_ADMINISTRADOR', 'ROLE_MONITORIZACION_MEDICO'] },
        { nombre: 'Monitorizacion Enfermeria', ruta: '/monitorizacionhc/preguntas/enfermeria', roles: ['ROLE_ADMINISTRADOR', 'ROLE_MONITORIZACION_ENFERMERIA'] },
        { nombre: 'Monitorización Facturacion', ruta: '/monitorizacionhc/preguntas/facturacion', roles: ['ROLE_ADMINISTRADOR', 'ROLE_MONITORIZACION_FACTURACION'] },
        { nombre: 'Monitorización Rehabilitación', ruta: '/monitorizacionhc/preguntas/rehabilitacion', roles: ['ROLE_ADMINISTRADOR', 'ROLE_MONITORIZACION_REHABILITACION'] },
        { nombre: 'Reportes', ruta: '/monitorizacionhc/reportes', roles: ['ROLE_ADMINISTRADOR', 'ROLE_MONITORIZACION'] },
        { nombre: 'Ajustes', ruta: '/monitorizacionhc/ajustes', roles: ['ROLE_ADMINISTRADOR'] }
    ]
};