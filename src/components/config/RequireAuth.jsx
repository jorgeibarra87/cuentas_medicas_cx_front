import PropTypes from 'prop-types';
import { Navigate } from "react-router-dom"

const RequireAuth = ({isLogged, children }) => {
    if(!isLogged){
        return <Navigate to="/login" />;
    }
    return children;
};
//agregamos para que se valinden errores de prop.types
RequireAuth.propTypes = {
    isLogged: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
};

export default RequireAuth
