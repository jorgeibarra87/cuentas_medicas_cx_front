import { useState } from "react"
import { RUTA_BACK_PRODUCCION } from "../../types";
import axios from "axios";
import { useDispatch } from "react-redux";
import { iniciarSesionAction } from "../../actions/loginActions";
import Swal from "sweetalert2";
import spinnerLoginText from "../Loading";
// import { useNavigate } from "react-router-dom";

const initailForm = {
    username: "",
    password: "",
};

const Login = () => {
    const dispatch = useDispatch();
    // const navigate = useNavigate(); // Obtiene la función navigate
    const [datos, setDatos] = useState(initailForm);
    const [mostrarContrasena, setMostrarContrasena] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setDatos({
            ...datos,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!datos.username || datos.username.trim().length === 0 || !datos.password || datos.password.trim().length === 0) {
            setMessage("Campo(s) vacio(s)");
            setError("campos vacios")
            return;
        }
        spinnerLoginText("Por favor espere...");

        try{
            const response = await axios.post(`${RUTA_BACK_PRODUCCION}auth/login`, datos);
            // const decodeToken = jwtDecode(response.data.jwt);
            // const userResponse = await axios.get(`${RUTA_BACK_PRODUCCION}usuario/${decodeToken.sub}`, {
            //     headers: {
            //         'Authorization': `Bearer ${response.data.jwt}`,
            //     }
            // });

            const data = {
                jwt: response.data.jwt,
                // username: userResponse.data.nombrecompleto,
            }
            dispatch(iniciarSesionAction(data));
            Swal.close();
            //navigate('/'); // Redirige al usuario a '/'
        }catch(error){
            if (error && error.code === 'ERR_NETWORK') {
                Swal.fire({
                    title: "¡Error!",
                    text: `Codigo del error: ${error.code}`,
                    icon: "error"
                })
            } else {
                Swal.close();
                setError(error);
                setMessage("Verificar los datos.");
            }
        }
    };

    const showPass = () => {
        setMostrarContrasena(true);
    }
    const hidePass = () => {
        setMostrarContrasena(false);
    }

    return (
        <section className="vh-100 gradient-custom" style={{ background: "#1B244025" }}>
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                        <div className="card text-white" style={{ background: "#1B2440" }}>
                            <div className="card-body p-5 text-center">
                                <div className="mb-md-5 mt-md-4 pb-5">
                                    <h2 className="fw-bold mb-2 text-uppercase">Solution Husjp</h2>
                                    <p className="text-white-50 mb-5">Por favor ingresa tu usuario y contraseña!</p>
                                    <form onSubmit={handleSubmit}>
                                        <div data-mdb-input-init className="form-outline form-white mb-4">
                                            <input type="text" id="username" className="form-control form-control-lg" name="username" onChange={handleChange} value={datos.username} required />
                                            <label className="form-label" htmlFor="username">Usuario</label>
                                        </div>
                                        <div data-mdb-input-init className="form-outline form-white mb-4">
                                            <div className="input-group">
                                                <input type={mostrarContrasena ? 'text' : 'password'} id="password" className="form-control form-control-lg" name="password" onChange={handleChange} value={datos.password} required />
                                                <span className="input-group-text" onMouseDown={showPass} onMouseUp={hidePass} onMouseLeave={hidePass}>{mostrarContrasena ? <i className="bi bi-eye"></i> : <i className="bi bi-eye-slash"></i>}</span>
                                            </div>
                                            <label className="form-label" htmlFor="password">Contraseña</label>
                                        </div>
                                        {error && message && (
                                            <div className='col-md-12 alert alert-warning' role="alert">
                                                <span className="alert-link">{message}</span>
                                            </div>
                                        )}
                                        <p className="small mb-5 pb-lg-2"><a className="text-white-50" href="#!">Olvido su contraseña?</a></p>
                                        <input data-mdb-button-init data-mdb-ripple-init className="btn btn-outline-light btn-lg px-5" type="submit" value='Iniciar' />
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Login
