export const dinamicaMenu = {
    nombre: 'InnoProduc',
    roles: ['ROLE_ADMINISTRADOR'], // Define los roles para esta opción
    children: [
        {
            nombre: 'Actualizar',
            ruta: '/dinamica/innProduc/update',
            roles: ['ROLE_ADMINISTRADOR', 'ROLE_INNPRODUC']
        }, // Roles permitidos para esta subopción
    ]
};