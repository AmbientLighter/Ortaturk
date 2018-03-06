import React from "react";
import { connect } from "react-redux";
import { range } from "lodash";

import tableSelector from "./selector";

const renderRows = ({ rows }) =>
  rows &&
  rows.map((row, i) => (
    <tr key={i}>
      <td>{row.language.title}</td>
      {row.chars.map((char, j) => <td key={j}>{char}</td>)}
    </tr>
  ));

const renderReport = ({ report }) => (
  <tr>
    <td>Отчёт</td>
    {report &&
      report.map(
        (column, index) =>
          column && (
            <td key={index}>
              {column.rows.map((row, index) => (
                <div key={index}>
                  {row.char}: {row.score.toFixed(2)}
                </div>
              ))}
            </td>
          )
      )}
  </tr>
);

let WordTable = ({ charCount, rows, report, winner, languages }) => rows.length > 0 ? (
  <div>
    <p>
      <strong>Победитель: </strong>
      {winner}
    </p>
    <p>
      <strong>Количество языков: </strong>
      {languages.countPercent.toFixed(2)}%
    </p>
    <p>
      <strong>Количество носителей: </strong>
      {languages.peoplePercent.toFixed(2)}%
    </p>
    <table className="table table-hover">
      <thead>
        <tr>
          <th>Язык</th>
          {range(charCount).map(index => (
            <th key={index}>Фонема {index + 1}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {renderRows({ rows })}
        {renderReport({ report })}
      </tbody>
    </table>
  </div>
) : null;

export default connect(tableSelector)(WordTable);
