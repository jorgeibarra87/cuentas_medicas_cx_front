export const ajustesMenu = {
    nombre: 'Ajustes',
    roles: ['ROLE_ADMINISTRADOR'],
    children: [
        {
            nombre: 'Usuario',
            ruta: '/ajustes/usuario', 
            roles: ['ROLE_ADMINISTRADOR']
        }
    ]
};