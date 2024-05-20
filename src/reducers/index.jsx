import { combineReducers } from "redux";
import { loginReducer } from "./loginReducer";
import { sidebarReducer } from "./sidebarReducer";
import { innproducReducer } from "./innproducReducer";
import { regchangepassReducer } from "./regchangepassReducer";

const reducer = combineReducers({
    login: loginReducer,
    sidebar: sidebarReducer,
    innproduc: innproducReducer,
    regchangepass: regchangepassReducer,
})

export default reducer;