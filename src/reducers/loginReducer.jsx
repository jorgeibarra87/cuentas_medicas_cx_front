import { jwtDecode } from "jwt-decode";
import { CERRAR_SESION, INICIAR_SESION, OBTENER_DECODE_TOKEN, OBTENER_TOKEN, OBTENER_USERNAME } from "../types";

export const loginInitialState = {
    token: null,
}

export function loginReducer(state= loginInitialState, action){
    switch (action.type) {
        case INICIAR_SESION:{
            localStorage.setItem('tokenhusjp', action.payload.jwt);
            
            return {
                token: action.payload.jwt,
                decodeToken: jwtDecode(action.payload.jwt),
            }
        }   

        case OBTENER_TOKEN:{
            return {
                ...state, token: localStorage.getItem('tokenhusjp'),
            }
        }

        case OBTENER_DECODE_TOKEN:{
            if(localStorage.getItem('tokenhusjp')){
                return {
                    ...state, decodeToken: jwtDecode(localStorage.getItem('tokenhusjp')),
                }
            }else{
                return state;
            }
            
        }

        case OBTENER_USERNAME:{
            return {
                username: localStorage.getItem('usernamehusjp'),
            }
        }

        case CERRAR_SESION:{
            localStorage.removeItem('tokenhusjp');
            return loginInitialState;
        }
        default:
            return state;
    }
}