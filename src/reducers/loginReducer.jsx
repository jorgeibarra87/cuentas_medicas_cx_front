import { jwtDecode } from "jwt-decode";
import { ALMACENAR_USERNAME, CERRAR_SESION, INICIAR_SESION, OBTENER_DECODE_TOKEN, OBTENER_TOKEN, OBTENER_USERNAME } from "../types";

export const loginInitialState = {
    token: null,
}

export function loginReducer(state= loginInitialState, action){
    switch (action.type) {
        case INICIAR_SESION:{
            localStorage.setItem('usernamehusjp', action.payload.username);
            localStorage.setItem('tokenhusjp', action.payload.jwt);
            
            return {
                token: action.payload.jwt,
                decodeToken: jwtDecode(action.payload.jwt),
                username: localStorage.getItem('usernamehusjp'),
            }
        }   

        case OBTENER_TOKEN:{
            return {
                ...state, token: localStorage.getItem('tokenhusjp'),username: localStorage.getItem('usernamehusjp'),
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
            localStorage.removeItem('usernamehusjp');
            return loginInitialState;
        }

        case ALMACENAR_USERNAME:{
            localStorage.setItem('usernamehusjp', action.payload);
            return {
                ...state, username: localStorage.getItem('usernamehusjp'),
            }
        }
        default:
            return state;
    }
}