export const auditoriaCuentasMedicasMenu = {
    nombre: 'Auditoría Cuentas Médicas',
    roles: ['ROLE_ADMINISTRADOR', 'ROLE_CIRUGIAS_INDEX'],
    children: [
        {
            nombre: 'Procedimientos Quirúrgicos',
            ruta: '/auditoria/procedimientos',
            roles: ['ROLE_ADMINISTRADOR', 'ROLE_CIRUGIAS_INDEX']
        },
        /* {
            nombre: 'Reportes y Estadísticas',
            ruta: '/auditoria/reportes',
            roles: ['ROLE_ADMINISTRADOR', 'ROLE_CIRUGIAS_REPORTES']
        } */
    ]
};
