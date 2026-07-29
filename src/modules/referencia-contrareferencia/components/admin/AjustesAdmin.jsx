import { useState } from 'react';
import TrasladosAdminTable from './TrasladosAdminTable';
import CuentasMedicasAdminTable from './CuentasMedicasAdminTable';
import FacturacionesAdminTable from './FacturacionesAdminTable';
import PacientesAdminTable from '../../../anexo1/components/admin/PacientesAdminTable';
import TramitesAdminTable from '../../../anexo1/components/admin/TramitesAdminTable';
import SeguimientoIntraAdminTable from '../../../anexo1/components/admin/SeguimientoIntraAdminTable';
import SeguimientoAmbAdminTable from '../../../anexo1/components/admin/SeguimientoAmbAdminTable';
import EgresosAdminTable from '../../../anexo1/components/admin/EgresosAdminTable';
import TipoSolicitudAdminTable from '../../../anexo1/components/admin/TipoSolicitudAdminTable';

function AccordionSection({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-4 border rounded-xl shadow">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-t-xl font-semibold text-lg"
      >
        <span>{title}</span>
        <span className={`transform transition-transform ${open ? 'rotate-180' : ''}`}>&#x25BC;</span>
      </button>
      {open && <div className="p-4">{children}</div>}
    </div>
  );
}

export default function AjustesAdmin() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Ajustes de Administración</h1>

      <AccordionSection title="Referencia — Traslados, Cuentas Médicas, Facturaciones">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-3">Traslados</h2>
            <TrasladosAdminTable />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-3">Cuentas Médicas</h2>
            <CuentasMedicasAdminTable />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-3">Facturaciones</h2>
            <FacturacionesAdminTable />
          </div>
        </div>
      </AccordionSection>

      <AccordionSection title="Anexo 1 — Pacientes, Trámites, Seguimientos, Egresos, Tipos Solicitud">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-3">Pacientes</h2>
            <PacientesAdminTable />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-3">Trámites</h2>
            <TramitesAdminTable />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-3">Seguimiento Intrahospitalario</h2>
            <SeguimientoIntraAdminTable />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-3">Seguimiento Ambulatorio</h2>
            <SeguimientoAmbAdminTable />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-3">Egresos</h2>
            <EgresosAdminTable />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-3">Tipos de Solicitud</h2>
            <TipoSolicitudAdminTable />
          </div>
        </div>
      </AccordionSection>
    </div>
  );
}
