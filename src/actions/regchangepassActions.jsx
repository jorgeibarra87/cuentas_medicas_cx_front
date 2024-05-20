import { REGCHANGEPASS_INFO_USUARIO, REGCHANGEPASS_TIME_EXPIRED } from "../types";

export const regchangepassInfoUser = (data) => ({type: REGCHANGEPASS_INFO_USUARIO, payload: data});
export const regchangepassTimeExpired = (data) => ({type: REGCHANGEPASS_TIME_EXPIRED, payload: data});