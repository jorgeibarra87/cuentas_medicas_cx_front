import { REGCHANGEPASS_INFO_USUARIO, REGCHANGEPASS_TIME_EXPIRED } from "../types";

export const regchangepassInfoUser = {
    infoUsuario : {
        documento: '',
        email: null,
        fecha: '',
        oid: 0,
        usunombre: ''
    }, 
    timeExpired: {
        minutos: null,
        milisegundos: null
    },
};

export function regchangepassReducer(state = regchangepassInfoUser, action){
    switch (action.type) {
        case REGCHANGEPASS_INFO_USUARIO:
            return {
                ...state, infoUsuario: {
                    oid: action.payload.oid,
                    documento: action.payload.usunombre,
                    email: action.payload.usuemail,
                    usunombre: action.payload.usunombre,
                    fecha: null
                },
            };
        case REGCHANGEPASS_TIME_EXPIRED:
            var diferenciaEnMilisegundos = new Date(action.payload.fecha) - new Date();
            var dif = 15 + Math.floor(diferenciaEnMilisegundos / (1000 * 60));
            return {
                ...state, timeExpired: {
                    minutos: dif,
                    milisegundos: diferenciaEnMilisegundos
                },
            }
        default:
            return state;
    }
}