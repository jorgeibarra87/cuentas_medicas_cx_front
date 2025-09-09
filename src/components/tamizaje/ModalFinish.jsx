import { useEffect, useState } from 'react';
import { Button, Form, ListGroup, ListGroupItem, Modal } from 'react-bootstrap';
import { useEvalueteSecond } from '../../hooks/tamizaje/useEvalueteSecond';

export const ModalFinish = ({ isOpen, checksArr, onClose, refetch, clearChecks }) => {
  const {fetchFinalizarTamizaje, data, error, loading } = useEvalueteSecond();
  const [selectValue, setSelectValue] = useState('REEVALUAR SEMANALMENTE');

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (!data) return;
    onClose();
    refetch();
    clearChecks();
  }, [data]);

  const handleEvaluete = () => {
    if (checksArr.some((inf) => inf.incomeId == null)) {
      return;
    }
    fetchFinalizarTamizaje({
      status: selectValue,
      arrPatients: checksArr.map((inf) => ({
        incomeId: inf.incomeId,
      })),
    });
  };
  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Finalizar tamizaje</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <div>Finalizar ({checksArr.length}) tamizaje{checksArr.length > 1 ? 's' : ''} </div>
          <div className="mb-4 max-h-48 overflow-y-auto">
            <ListGroup>
              {checksArr.map((inf, idx) => (
                <ListGroupItem key={inf.id} ripple={'false'} className={`py-1 pr-1 pl-4 ${idx < checksArr.length - 1 ? 'border-b' : ''}`}>
                  {inf.patient}
                  <span>
                    <span className="text-xs text-gray-800">{inf.valueNut}</span>
                  </span>
                </ListGroupItem>
              ))}
            </ListGroup>
          </div>
          <div className="px-4">
            <Form.Select label="Seleccione valor" value={selectValue} onChange={(e) => {setSelectValue(e.target.value);}}>
              <option value="REEVALUAR SEMANALMENTE">REEVALUAR SEMANALMENTE</option>
              <option value="REALIZAR INTERVENCION NUTRICIONAL">REALIZAR INTERVENCION NUTRICIONAL</option>
            </Form.Select>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Close </Button>
        <Button variant="primary" onClick={handleEvaluete} disabled={loading}> Save Changes </Button>
      </Modal.Footer>
    </Modal>
  );
};
