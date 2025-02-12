/* eslint-disable react/prop-types */
import { Button, Dropdown, Form } from "react-bootstrap";
import { TableIcon } from "../../icons";

export const DropdownTableCols = ({ tableColums, handleChange }) => {
  return (
    <Dropdown align="end" autoClose="outside">
      <Dropdown.Toggle as={Button} variant="light" className="border">
        <TableIcon size={20} />
      </Dropdown.Toggle>

      <Dropdown.Menu style={{ zIndex: 9999 }}>
        <Dropdown.Item as="div" className="d-flex">
          <Form.Check
            className="w-100"
            type="checkbox"
            id="item-1"
            label="Edad"
            checked={tableColums.age}
            onChange={(e) => handleChange(e.target.checked, "age")}
          />
        </Dropdown.Item>
        <Dropdown.Item as="div" className="d-flex">
          <Form.Check
            className="w-100"
            type="checkbox"
            id="item-2"
            label="Género"
            checked={tableColums.gender}
            onChange={(e) => handleChange(e.target.checked, "gender")}
          />
        </Dropdown.Item>
        <Dropdown.Item as="div" className="d-flex">
          <Form.Check
            className="w-100"
            type="checkbox"
            id="item-3"
            label="Servicio"
            checked={tableColums.service}
            onChange={(e) => handleChange(e.target.checked, "service")}
          />
        </Dropdown.Item>
        <Dropdown.Item as="div" className="d-flex">
          <Form.Check
            className="w-100"
            type="checkbox"
            id="item-4"
            label="Cama"
            checked={tableColums.bethCode}
            onChange={(e) => handleChange(e.target.checked, "bethCode")}
          />
        </Dropdown.Item>
        <Dropdown.Item as="div" className="d-flex">
          <Form.Check
            className="w-100"
            type="checkbox"
            id="item-5"
            label="Ingreso"
            checked={tableColums.income}
            onChange={(e) => handleChange(e.target.checked, "income")}
          />
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
