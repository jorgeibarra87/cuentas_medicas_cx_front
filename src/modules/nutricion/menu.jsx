export const nutricionMenu = {
    nombre: 'Nutricion',
    roles: ['ROLE_ADMINISTRADOR', 'ROLE_TAMIZAJE'],
    submenu: [
        { nombre: 'Tamizaje', ruta: '/nutricion/tamizaje', roles: ['ROLE_ADMINISTRADOR', 'ROLE_TAMIZAJE'] }
    ]
};