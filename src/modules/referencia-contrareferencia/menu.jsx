export const referenciaContrareferenciaMenu = {
  nombre: 'Referencia Contrareferencia',
  roles: ['ROLE_ADMINISTRADOR', 'ROLE_REFERENCIA_INDEX'],
  children: [
    {
      nombre: 'Formulario de datos',
      ruta: '/referenciacontrareferencia/formulario',
      roles: ['ROLE_ADMINISTRADOR', 'ROLE_REFERENCIA_FORMULARIO']
    },
    {
      nombre: 'Tabla de referencias',
      ruta: '/referenciacontrareferencia/datos',
      roles: [
        'ROLE_ADMINISTRADOR',
        'ROLE_REFERENCIA_EXPORTAR_DATA',
        'ROLE_REFERENCIA_MODIFICAR_DATA',
        'ROLE_REFERENCIA_COMENTARIO_TRIAGE'
      ]
    },
    {
      nombre: 'Traslados de ambulancia',
      ruta: '/referenciacontrareferencia/totaltraslados',
      roles: ['ROLE_ADMINISTRADOR', 'ROLE_REFERENCIA_TRASLADOS_INDEX']
    },
    {
      nombre: 'Anexo 1',
      ruta: '/anexo1/general',
      roles: ['ROLE_ADMINISTRADOR', 'ROLE_REFERENCIA_ANEXO1']
    },
    {
      nombre: 'Administración',
      roles: ['ROLE_ADMINISTRADOR'],
      children: [
        { nombre: 'Traslados', ruta: '/admin/traslados', roles: ['ROLE_ADMINISTRADOR'] },
        { nombre: 'Cuentas Médicas', ruta: '/admin/cuentas-medicas', roles: ['ROLE_ADMINISTRADOR'] },
        { nombre: 'Facturaciones', ruta: '/admin/facturaciones', roles: ['ROLE_ADMINISTRADOR'] },
        { nombre: 'Pacientes', ruta: '/admin/pacientes', roles: ['ROLE_ADMINISTRADOR'] },
        { nombre: 'Trámites', ruta: '/admin/tramites', roles: ['ROLE_ADMINISTRADOR'] },
        { nombre: 'Seg. Intra', ruta: '/admin/seguimiento-intra', roles: ['ROLE_ADMINISTRADOR'] },
        { nombre: 'Seg. Amb.', ruta: '/admin/seguimiento-ambulatorio', roles: ['ROLE_ADMINISTRADOR'] },
        { nombre: 'Egresos', ruta: '/admin/egresos', roles: ['ROLE_ADMINISTRADOR'] },
        { nombre: 'Tipos Solicitud', ruta: '/admin/tipos-solicitud', roles: ['ROLE_ADMINISTRADOR'] }
      ]
    }
  ]
};