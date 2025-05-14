import Pregunta from "./Pregunta";

class Respuesta{
    constructor(data = {}){
        this.pregunta = new Pregunta(data.pregunta);
        this.respuesta = data.respuesta;
    }
}

export default Respuesta;