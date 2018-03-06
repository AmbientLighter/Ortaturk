import React from "react";
import { Field, reduxForm } from "redux-form";

import Languages from "./languages.json";

const renderRow = (Language, index) => (
  <tr key={index}>
    <td>{Language.title}</td>
    <td>{Language.num}</td>
    <td>
      <Field
        name={`language.${Language.title}`}
        className="form-control"
        component="input"
        type="text"
      />
    </td>
  </tr>
);

let LanguagesList = props => (
  <table className="table">
    <thead>
      <tr>
        <th>Язык</th>
        <th>Носителей (млн)</th>
        <th>Слово</th>
      </tr>
    </thead>
    <tbody>{Languages.map(renderRow)}</tbody>
  </table>
);

LanguagesList = reduxForm({ form: "LanguagesList" })(LanguagesList);

export default LanguagesList;
