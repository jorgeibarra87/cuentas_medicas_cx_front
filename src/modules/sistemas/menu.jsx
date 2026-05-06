export const sistemasMenu = {
    nombre: 'Sistemas',
    roles: ['ROLE_ADMINISTRADOR', 'ROLE_SISTEMAS_MANTENIMIENTO'],
    submenu: [
        {
            nombre: 'Mantenimiento chequeo', ruta: '/sistemas/mantenimientochequeo', roles: ['ROLE_ADMINISTRADOR', 'ROLE_SISTEMAS_MANTENIMIENTO'],
            // submenuAdicional: [
            //     { nombre: 'Mantenimiento preventivo chequeo', ruta: '/humanizacion/solicitudes', roles: ['ROLE_ADMINISTRADOR'] },
            //     { nombre: 'solicitudes almacen', ruta: 'almacen', roles: ['ROLE_ADMINISTRADOR'] }
            // ]
        },
        {
            nombre: 'Ajustes', ruta: '/sistemas/ajustes', roles: ['ROLE_ADMINISTRADOR'],
        }
    ]
};