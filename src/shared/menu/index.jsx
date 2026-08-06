import { ajustesMenu } from "../../modules/ajustes";
import { auditoriaCuentasMedicasMenu } from "../../modules/auditoria_cuentas_medicas";
import { dinamicaMenu } from "../../modules/dinamica/menu";
import { facturacionMenu } from "../../modules/facturacion/menu";
import { monitorizacionHcMenu } from "../../modules/monitorizacionHc/menu";
import { nutricionMenu } from "../../modules/nutricion/menu";
import { referenciaContrareferenciaMenu } from "../../modules/referencia-contrareferencia";
import { rehabilitacionMenu } from "../../modules/rehabilitacion/menu";
import { sistemasMenu } from "../../modules/sistemas/menu";

export const appMenu = [
    dinamicaMenu,
    auditoriaCuentasMedicasMenu,
    rehabilitacionMenu,
    sistemasMenu,
    referenciaContrareferenciaMenu,
    facturacionMenu,
    nutricionMenu,
    monitorizacionHcMenu,
    ajustesMenu
];