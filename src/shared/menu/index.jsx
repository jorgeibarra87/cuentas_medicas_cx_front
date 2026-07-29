import { ajustesMenu } from "../../modules/ajustes";
import { dinamicaMenu } from "../../modules/dinamica/menu";
import { facturacionMenu } from "../../modules/facturacion/menu";
import { monitorizacionHcMenu } from "../../modules/monitorizacionHc/menu";
import { nutricionMenu } from "../../modules/nutricion/menu";
import { adminMenu, referenciaContrareferenciaMenu } from "../../modules/referencia-contrareferencia";
import { rehabilitacionMenu } from "../../modules/rehabilitacion/menu";
import { sistemasMenu } from "../../modules/sistemas/menu";

export const appMenu = [
    dinamicaMenu,
    rehabilitacionMenu,
    sistemasMenu,
    referenciaContrareferenciaMenu,
    facturacionMenu,
    nutricionMenu,
    monitorizacionHcMenu,
    ajustesMenu,
    adminMenu
];
