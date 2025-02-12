import { useEffect, useMemo, useState } from 'react';
import { useDisclourse } from '../../hooks/tamizaje/useDisclourse';
import { useGetData } from '../../hooks/tamizaje/useGetData';
import { getFormattedDate, getNextSevenDay, getSevenDayAgo, isPassedSeveDays, parseDate, parseDateHours } from '../helpers';
import { Button, Col, Container, Form, OverlayTrigger, Row, Spinner, Table, Tooltip } from 'react-bootstrap';
import { DropdownTableCols } from './DropdownTableCols';
import { DeleteBtn } from './DeleteBtn';
import { ModalReevaluate } from './ModalReevaluate';
import { ModalFinish } from './ModalFinish';

const OPTIONS = {
  REEVALUAR: 'REEVALUAR',
  INTERVENCION: 'REALIZAR INTERVENCION',
  TODOS: '',
};

function Tamizaje() {
  const [getData, { data, error, loading }] = useGetData();
  const [tableColums, setTableColums] = useState({
    age: true,
    gender: true,
    service: true,
    bethCode: true,
    bethDescription: true,
    income: true,
  });
  const { isOpen, onClose, onOpen } = useDisclourse();
  const { isOpen: isOpenFinish, onClose: onCloseFinish, onOpen: onOpenFinish } = useDisclourse();
  const [checksArr, setChecksArr] = useState([]);
  const [dateValueStart, setDateValueStart] = useState(getFormattedDate(getSevenDayAgo()));
  const [dateValueEnd, setDateValueEnd] = useState(getFormattedDate(new Date()));
  const [select, setSelect] = useState(OPTIONS.TODOS);

  useEffect(() => {
    if (!dateValueEnd) return;
    if (!dateValueStart) return;
    getData({
      fechaFinal: dateValueEnd,
      fechaInicial: dateValueStart,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateValueEnd, dateValueStart]);

  useEffect(() => {
    if (error) {
      console.log('error', error);
    }
  }, [error]);

  useEffect(() => {
    if (!data) setChecksArr([]);
  }, [data]);

  const isCreated = useMemo(() => checksArr.some((inf) => inf.firstValue != null), [checksArr]);
  const isNew = useMemo(() => checksArr.some((inf) => inf.firstValue == null), [checksArr]);

  const handleChange = (value, key) => {
    setTableColums((p) => ({ ...p, [key]: value }));
  };

  const handleCopy = () => {
    if (checksArr.length === 0) return;
    let text = '';
    checksArr.forEach((info) => {
      text += `${info.documentNumber}\t${info.patient}\t${info.age}\t${info.gender}\t${info.bethDescription || '\t'}\t${info.bethCode || '\t'} \t ${info.incomeConsec}\t${`${parseDate(
        info.folioDate,
      )} ${parseDateHours(info.folioDate, true)}`}\t${info.valueNut}\t${info.firstValue || '\t'} \t${
        info.evaluationDate ? `${parseDate(info.evaluationDate)} ${parseDateHours(info.evaluationDate)}` : '\t'
      }\t${info.evaluationDate ? getNextSevenDay(info.evaluationDate) : '\t'}\t${info.secondValue || ''}\n`;
    });
    /* navigator.clipboard.writeText(text).then(() => {
      setShowSuccess(true);
    }); */

    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    /* toast.info("Copiado", {
      position: "top-center",
      delay: 0,
    }); */
  };

  const clearChecks = () => setChecksArr([]);

  const arr =
    data?.filter((inf) => {
      if (!select) return true;
      return inf.valueNut.includes(select);
    }) || [];

  const sort = arr.sort((a, b) => {
    if (a?.close && !a.firstValue) return 1;
    if (b?.close && !b.firstValue) return -1;
    return new Date(a.folioDate).getTime() - new Date(b.folioDate).getTime();
  });
  
  return (
    <div className=''>
      <Container className="my-4 px-4">
        <Row className="align-items-center justify-content-between">
          {/* Logo y título */}
          <Col xs="auto" className="d-flex align-items-center gap-2">
            <h1 className="h4 mb-0">Tamizaje nutricional</h1>
          </Col>
          {/* Controles */}
          <Col xs="auto" className="d-flex align-items-center gap-3 flex-wrap">
            {/* Inputs de fecha */}
            <div className="d-flex align-items-center gap-2">
              <Form.Group controlId="date-init">
                <Form.Label>Inicio</Form.Label>
                <Form.Control
                  type="date"
                  value={dateValueStart}
                  onChange={(e) => {
                    setDateValueStart(e.target.value);
                    setDateValueEnd('');
                  }}
                />
              </Form.Group>
              <Form.Group controlId="date-end">
                <Form.Label>Fin</Form.Label>
                <Form.Control type="date" value={dateValueEnd} onChange={(e) => setDateValueEnd(e.target.value)} />
              </Form.Group>
            </div>

            {/* Select de estado */}
            <Form.Group controlId="option-type">
              <Form.Label>Estado</Form.Label>
              <Form.Select value={select} onChange={(e) => setSelect(e.target.value)}>
                {Object.keys(OPTIONS).map((key) => (
                  <option key={key} value={OPTIONS[key]}>
                    {key}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Container>

      <Container className="my-2 px-4">
        <Row className="align-items-center justify-content-between flex-wrap">
          {/* Dropdown y selección */}
          <Col xs="auto" className="d-flex align-items-center gap-3">
            <DropdownTableCols handleChange={handleChange} tableColums={tableColums} />
            <div className="d-flex align-items-center gap-2 mb-0">
              <span className="text-muted">Seleccionados</span>
              {loading ? <Spinner animation="grow" size="sm" variant="primary" /> : `(${checksArr.length})`}
            </div>
          </Col>

          {/* Botones de acción */}
          <Col xs="auto" className="d-flex align-items-center gap-3">
            <Button variant="secondary" disabled={loading || !data || checksArr.length === 0} onClick={handleCopy}>
              Copiar
            </Button>
            <Button variant="primary" disabled={loading || !data || checksArr.length === 0 || isCreated} onClick={onOpen}>
              Reevaluar
            </Button>
            <Button variant="success" disabled={loading || !data || checksArr.length === 0 || isNew || checksArr.some((inf) => inf.close)} onClick={onOpenFinish}>
              Finalizar
            </Button>
            <DeleteBtn disabled={checksArr.length !== 1 || checksArr?.[0]?.firstValue == null} info={checksArr?.[0]} clearChecks={clearChecks}
              refetch={() => {
                getData({
                  fechaFinal: dateValueEnd,
                  fechaInicial: dateValueStart,
                });
              }}
            />
          </Col>

          {/* Total de exámenes */}
          <Col xs="auto" className="d-flex align-items-center gap-2">
            <span className="text-muted">Total exámenes</span>
            {loading || !data ? <Spinner animation="grow" size="sm" variant="primary" /> : <span className="ms-2">{arr.length}</span>}
          </Col>
        </Row>
      </Container>

      <div className="container table-responsive" style={{ maxHeight: 'calc(100vh - 300px)', maxWidth : 'calc(100vw - 300px)', overflowX: 'auto' , overflowY: 'auto', whiteSpace: 'nowrap'}}>
        <Table bordered hover className="text-uppercase table-small-text" style={{ minWidth: '100%', whiteSpace: 'nowrap' }}>
          <thead className="sticky-top bg-light">
            <tr>
              <th className="sticky-left bg-light px-3" style={{ backgroundColor: 'gray' }}>
                <Form.Check type="checkbox" checked={checksArr.length === arr.length} onChange={(e) => {setChecksArr(e.target.checked ? arr || [] : []);}} />
              </th>
              <th style={{ minWidth: '20ch' }} className="bg-light">HC</th>
              <th style={{ minWidth: '40ch' }} className="bg-light">PACIENTE</th>
              {tableColums.age && <th className="bg-light">EDAD</th>}
              {tableColums.gender && <th className="bg-light">GÉNERO</th>}
              {tableColums.service && (
                <th className="bg-light" style={{ minWidth: '20ch' }}>SERVICIO</th>
              )}
              {tableColums.bethCode && <th className="bg-light">CAMA</th>}
              {tableColums.income && <th className="bg-light">INGRESO</th>}
              <th className="bg-light" style={{ minWidth: '20ch' }}>FECHA FOLIO</th>
              <th className="bg-light">VALOR</th>
              <th className="bg-light">PRIMERA EVALUACIÓN</th>
              <th className="bg-light">FECHA 1RA EVALUACIÓN</th>
              <th className="bg-light">PRÓXIMA EVALUACIÓN</th>
              <th className="bg-light">SEGUNDA EVALUACIÓN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="100%">
                  <div className="d-flex align-items-center justify-content-center w-100 h-100" style={{ minHeight: '40vh' }}>
                    <Spinner animation="border" />
                  </div>
                </td>
              </tr>
            ) : (
              sort.map((info) => (
                <tr key={info.id} className={checksArr.some((inf) => inf.id === info.id)? 'table-primary': info?.close && !info.firstValue? 'table-secondary'
                      : !info.secondValue && !info.close && info.evaluationDate && isPassedSeveDays(info.evaluationDate) ? 'table-warning bg-warning blink' : ''
                  }>
                  <td className="sticky-left px-3">
                    <Form.Check type="checkbox" checked={checksArr.some((inf) => inf.id === info.id)} onChange={(e) => {
                        setChecksArr((prev) => (e.target.checked ? [...prev, info] : prev.filter((it) => it.id !== info.id)));
                      }} />
                  </td>
                  <td>{info.documentNumber}</td>
                  <td title={info.patient}>{info.patient}</td>
                  {tableColums.age && <td>{info.age}</td>}
                  {tableColums.gender && <td>{info.gender}</td>}
                  {tableColums.service && (
                    <td title={info.bethDescription}>
                      <div style={{
                          maxWidth: '20ch',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                        {info.bethDescription}
                      </div>
                    </td>
                  )}
                  {tableColums.bethCode && <td>{info.bethCode}</td>}
                  {tableColums.income && <td>{info.incomeConsec}</td>}
                  <td>
                    {parseDate(info.folioDate)} {parseDateHours(info.folioDate, true)}
                  </td>
                  <td title={info.valueNut} className={`${info.firstValue ? (info.valueNut === info.firstValue ? '' : 'bg-danger text-light') : ''}`}>
                    <div style={{
                        maxWidth: '20ch',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                      {info.valueNut}
                    </div>
                  </td>
                  <td title={info.firstValue} className={`${info.firstValue ? (info.firstValue === info.firstValue ? '' : 'bg-danger text-light') : ''}`}>
                    <div
                      style={{
                        maxWidth: '20ch',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                      {info.firstValue || ' '}
                    </div>
                  </td>
                  <td> {info.evaluationDate ? `${parseDate(info.evaluationDate)}  ${parseDateHours(info.evaluationDate)}` : ''} </td>
                  <td>{info.evaluationDate && info.firstValue ? getNextSevenDay(info.evaluationDate) : ''}</td>
                  <td title={info.secondValue} className={`${info.secondValue ? (info.secondValue === info.secondValue ? '' : 'bg-danger text-light') : ''}`}>
                    <div
                      style={{
                        maxWidth: '20ch',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                      {info.secondValue || ' '}
                    </div>
                  </td>
                  <td>
                    {info.usuerName && (
                      <OverlayTrigger overlay={<Tooltip>{info.usuerName}</Tooltip>}>
                        <span className="text-primary">ℹ️</span>
                      </OverlayTrigger>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {isOpen && checksArr.length > 0 && (
        <ModalReevaluate checksArr={checksArr} isOpen={isOpen} onClose={onClose} aria-modal refetch={() => {
            getData({
              fechaFinal: dateValueEnd,
              fechaInicial: dateValueStart,
            });
          }}
          clearChecks={clearChecks}
        />
      )}
      {isOpenFinish && checksArr.length > 0 && (
        <ModalFinish checksArr={checksArr} isOpen={isOpenFinish} onClose={onCloseFinish} aria-modal refetch={() => { 
          getData({
            fechaFinal: dateValueEnd, 
            fechaInicial: dateValueStart,
          }); 
        }} 
        clearChecks={clearChecks} />
      )}
    </div>
  );
}

export default Tamizaje;
