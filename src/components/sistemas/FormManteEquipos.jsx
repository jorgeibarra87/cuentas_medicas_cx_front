import React, { useRef, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas';

export default function FormManteEquipos() {

    const firmaClienteRef = useRef();
    const firmaTecnicoRef = useRef();

    const [datos, setDatos] = useState({
        nombre: "",
        correo: "",
    });

    const handleChange = (e) => {
        setDatos({...datos, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const firmaCliente = firmaClienteRef.current.toDataURL();
        const firmaTecnico = firmaTecnicoRef.current.toDataURL();

        console.log({
            ...datos,
            firmaCliente,
            firmaTecnico
        });
    };

    const limpiarFirma = (ref) => {
        ref.current.clear();
    }

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <label>Nombre:</label>
      <input name="nombre" onChange={handleChange} className="border p-1 block mb-2" required />
      
      <label>Correo:</label>
      <input name="correo" onChange={handleChange} className="border p-1 block mb-2" required />

      <div className="mb-4">
        <h2>Firma del Cliente</h2>
        <SignatureCanvas penColor="black" canvasProps={{ width: 300, height: 150, className: "border" }} ref={firmaClienteRef} />
        <button type="button" onClick={() => limpiarFirma(firmaClienteRef)}>Limpiar</button>
      </div>

      <div className="mb-4">
        <h2>Firma del Técnico</h2>
        <SignatureCanvas penColor="black" canvasProps={{ width: 300, height: 150, className: "border" }} ref={firmaTecnicoRef} />
        <button type="button" onClick={() => limpiarFirma(firmaTecnicoRef)}>Limpiar</button>
      </div>

      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Enviar
      </button>
    </form>
  )
}
