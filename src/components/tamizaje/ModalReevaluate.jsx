import { useEffect, useState } from 'react';
import { Button, Form, ListGroup, ListGroupItem, Modal } from 'react-bootstrap';
import { useEvalueteFirst } from '../../hooks/tamizaje/useEvalueteFirst';

export const ModalReevaluate = ({ isOpen, checksArr, onClose, refetch, clearChecks }) => {
  const { fetchFirstEvaluate, data, error, loading } = useEvalueteFirst();
  const [selectValue, setSelectValue] = useState('REEVALUAR SEMANALMENTE');

  useEffect(() => {
    if (error) {
      console.error('error', error);
    }
  }, [error]);

  useEffect(() => {
    if (!data) return;
    onClose();
    refetch();
    clearChecks();
  }, [data]);

  const handleEvaluete = () => {
    fetchFirstEvaluate({
      status: selectValue,
      arrPatients: checksArr.map((inf) => ({
        documentNumber: inf.documentNumber,
        hc84Id: inf.id,
        incomeId: inf.incomeId,
        initalValue: inf.valueNut,
        patient: inf.patient,
        folioId: inf.folioId,
      })),
    });
  };

  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Reevaluar</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <div>Reevaluar ({checksArr.length}) paciente{checksArr.length > 1 ? 's' : ''}
          </div>
          <div className="mb-4 max-h-48 overflow-y-auto">
            <ListGroup>
              {checksArr.map((inf, idx) => (
                <ListGroupItem key={inf.id} ripple={"false"} className={`py-1 pr-1 pl-4 ${idx < checksArr.length - 1 ? 'border-b' : ''}`}>
                  {inf.patient}
                  <span>
                    <span className="text-xs text-gray-800">{` ${inf.valueNut}`}</span>
                  </span>
                </ListGroupItem>
              ))}
            </ListGroup>
          </div>
          <div className="px-4">
            <Form.Select label="Seleccione valor" value={selectValue} onChange={(e) => { setSelectValue(e.target.value); }}> 
              <option value="REEVALUAR SEMANALMENTE">REEVALUAR SEMANALMENTE</option>
              <option value="REALIZAR INTERVENCION NUTRICIONAL">REALIZAR INTERVENCION NUTRICIONAL</option>
              <option value="CLOSE">CERRAR</option>
            </Form.Select>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleEvaluete} disabled={loading} >
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
