import React from "react";
import { Modal } from "react-bootstrap";
import { connectModal } from "redux-modal";

const DetailsDialog = ({ stats, show, handleHide }) => (
  <Modal show={show} onHide={handleHide}>
    <Modal.Header>
      <Modal.Title>Подробности</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <table className="table">
        <thead>
          <tr>
            <th>Фонема</th>
            <th>Доля носителей</th>
            <th>Доля языков</th>
            <th>Список языков</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((row, index) => (
            <tr key={index}>
              <td>{row.char}</td>
              <td>{row.peoplePercent}</td>
              <td>{row.countPercent}</td>
              <td>{row.languages.map(lang => lang.title).join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Modal.Body>
  </Modal>
);

export default connectModal({ name: "detailsDialog" })(DetailsDialog);
