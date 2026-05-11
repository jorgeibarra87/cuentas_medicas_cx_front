export const nutricionMenu = {
    nombre: 'Nutricion',
    roles: ['ROLE_ADMINISTRADOR', 'ROLE_TAMIZAJE'],
    children: [
        { 
            nombre: 'Tamizaje', 
            ruta: '/nutricion/tamizaje', 
            roles: ['ROLE_ADMINISTRADOR', 'ROLE_TAMIZAJE'] 
        }
    ]
};