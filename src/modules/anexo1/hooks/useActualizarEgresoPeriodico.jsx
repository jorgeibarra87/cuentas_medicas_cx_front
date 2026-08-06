import { useEffect, useRef } from 'react';
import apiClienteAnexo1 from '../api/apiClienteAnexo1';
import { obtenerInformacionPacienteEgreso } from '../../dinamica/api/genPacienService';
import { crear as crearEgreso } from '../api/egresoService';

const INTERVALO = 5 * 60 * 1000;

export default function useActualizarEgresoPeriodico(activo = true) {
  const intervaloRef = useRef(null);

  useEffect(() => {
    if (!activo) return;

    const ejecutar = async () => {
      try {
        const { data: tramites } = await apiClienteAnexo1.get('/tramites/sin-egreso');
        for (const t of tramites) {
          if (!t.ingreso) continue;
          try {
            const egresoExterno = await obtenerInformacionPacienteEgreso(t.ingreso);
            if (egresoExterno?.fechaEgreso) {
              await crearEgreso({
                tramiteId: t.id,
                fechaEgreso: egresoExterno.fechaEgreso,
                servicioEgreso: egresoExterno.servicio
              });
            }
          } catch (e) {
            console.warn('Sin egreso externo para ingreso', t.ingreso, e?.response?.data || e.message);
          }
        }
      } catch (e) {
        console.error('Error al actualizar egresos:', e?.response?.data || e.message);
      }
    };

    ejecutar();
    intervaloRef.current = setInterval(ejecutar, INTERVALO);

    return () => {
      if (intervaloRef.current) clearInterval(intervaloRef.current);
    };
  }, [activo]);
}
