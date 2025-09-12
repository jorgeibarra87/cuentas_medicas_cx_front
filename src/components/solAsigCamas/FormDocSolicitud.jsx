import FormSolicitudCama from './FormSolicitudCama'
import { useState } from 'react';
import { obtenerInformacionPacienteHospitalizadoByIdentificacion } from '../../api/dinamica/pacientesHospitalizados';

export default function AsignarSolicitud({ showModalSolicitud, handleCloseModalSolicitud }) {

    const [form, setForm] = useState({
        documento: ''
    });
    const [showFormSolicitud, setShowFormSolicitud] = useState(false);
    const [error, setError] = useState('');
    const [pacienteHospitalizado, setPacienteHospitalizado] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await obtenerInformacionPacienteHospitalizadoByIdentificacion(form.documento);
            handleCloseModalSolicitud();
            setShowFormSolicitud(true);
            setForm({
                documento: ''
            })
            setPacienteHospitalizado(response);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.codigoError != undefined) {
                setError({ ...error, response: { ...error.response, data: { ...error.response.data, mensaje: error.response.data.mensaje.split(',')[1] } } });
            }
            else {
                console.error(error);
            }
        }
    };

    return (
        <>
            <Modal show={showModalSolicitud} onHide={handleCloseModalSolicitud}>
                <Modal.Header closeButton>
                    <Modal.Title>Buscar Paciente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Documento del paciente</Form.Label>
                            <Form.Control type="text" value={form.documento} name='documento' placeholder="Ingrese el documento" onChange={handleChange} />
                        </Form.Group>
                        {error && <p className='text-danger mt-3'>{error.response.data.mensaje}</p>}
                        <Button variant='primary' type='submit' className="mt-3">Buscar</Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <FormSolicitudCama  showFormSolicitud={showFormSolicitud} handleCloseFormSolicitud={() => setShowFormSolicitud(false)} pacienteHospitalizado={pacienteHospitalizado}/>
        </>
    )
}
