export const facturacionMenu = {
    nombre: 'Facturacion',
    roles: ['ROLE_ADMINISTRADOR', 'ROLE_FACTURACION'],
    submenu: [
        { nombre: 'Cambio estado servicio', ruta: '/facturacion/cambioestadoips', roles: ['ROLE_ADMINISTRADOR', 'ROLE_FACTURACION'] }
    ]
};