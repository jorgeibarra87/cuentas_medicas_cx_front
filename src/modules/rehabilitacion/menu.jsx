export const rehabilitacionMenu = {
    nombre: 'Rehabilitación y Terapias',
    roles: ['ROLE_ADMINISTRADOR', 'ROLE_JEFE_REHABILITACION', 'ROLE_FISIOTERAPEUTA_REHABILITACION', 'ROLE_FACTURACION_REHABILITACION'],
    children: [
        { 
            nombre: 'Indicadores', 
            ruta: '/rehabilitacion/indicadores', 
            roles: ['ROLE_ADMINISTRADOR', 'ROLE_JEFE_REHABILITACION'] 
        },
        { 
            nombre: 'Registro fases de atención consulta ambulatoria', 
            ruta: '/rehabilitacion/tomaAsistencias', 
            roles: ['ROLE_ADMINISTRADOR', 'ROLE_JEFE_REHABILITACION', 'ROLE_FISIOTERAPEUTA_REHABILITACION', 'ROLE_FACTURACION_REHABILITACION'] 
        }
    ]
};