import { CERRAR_SESION, INICIAR_SESION, OBTENER_TOKEN } from "../types";
import { decodeJwt, getTokenPayload, getAccessToken } from "../shared/api/tokenStorage";

export const loginInitialState = {
    token: null,
    decodeToken: null,
}

export function loginReducer(state= loginInitialState, action){
    switch (action.type) {
        case INICIAR_SESION:{
            localStorage.setItem('tokenhusjp', action.payload.jwt);
            localStorage.setItem('tokenhusjp_refresh', action.payload.refreshToken)
            return {...state, token: action.payload.jwt, decodeToken: decodeJwt(action.payload.jwt)};
        }   

        case OBTENER_TOKEN:{
            if(state.token === null && getAccessToken()){
                return {...state, token: getAccessToken(), decodeToken: getTokenPayload()};
            }
            return state;
        }

        case CERRAR_SESION:{
            localStorage.removeItem('tokenhusjp');
            localStorage.removeItem('tokenhusjp_refresh');
            return loginInitialState;
        }
        default:
            return state;
    }
}