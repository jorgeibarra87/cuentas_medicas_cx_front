export const facturacionMenu = {
    nombre: 'Facturacion',
    roles: ['ROLE_ADMINISTRADOR', 'ROLE_FACTURACION'],
    children: [
        {
            nombre: 'Cambio estado servicio',
            ruta: '/facturacion/cambioestadoips',
            roles: ['ROLE_ADMINISTRADOR', 'ROLE_FACTURACION']
        }
    ]
};