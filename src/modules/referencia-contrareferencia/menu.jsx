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
    }
  ]
};