import { formValueSelector } from "redux-form";
import { createSelector } from "reselect";
import { max, range, sumBy, orderBy } from "lodash";

import Languages from "./languages.json";

const LanguagesMap = Languages.reduce(
  (acc, item) => ({ ...acc, [item.title]: item }),
  {}
);

const HardGroupId = true;

const HardCharsMap = "aouıqğ".split("");
const SoftCharsMap = "âöüikg".split("");

const HardChars = HardCharsMap;
const SoftChars = SoftCharsMap.concat(["e"]);
const ReplacebleChars = HardCharsMap.concat(SoftChars);

const applyGroup = (groupId, char) => {
  const mapping =
    groupId !== HardGroupId
      ? {
          src: HardCharsMap,
          dst: SoftCharsMap
        }
      : {
          src: SoftCharsMap,
          dst: HardCharsMap
        };
  const index = mapping.src.indexOf(char);
  if (index !== -1) {
    return mapping.dst[index];
  } else {
    return char;
  }
};

const formSelector = formValueSelector("LanguagesList");
const wordsSelector = state => formSelector(state, "language") || [];

const countChars = words => {
  const valid = Object.keys(words)
    .map(key => words[key])
    .filter(word => word);
  const length = valid.map(word => word.length);
  return max(length);
};

const splitWords = words =>
  Object.keys(words)
    .map(title => ({
      language: LanguagesMap[title],
      chars: words[title] ? words[title].split("") : []
    }))
    .filter(row => row.chars.length > 0);

const getColumns = (rows, numCols) => {
  const columns = new Array(numCols);
  for (const i in range(numCols)) {
    columns[i] = {};
    for (const row of rows) {
      if (i < row.chars.length) {
        const column = columns[i];
        const char = row.chars[i];
        column[char] = column[char] || [];
        column[char].push(row.language);
      }
    }
  }
  return columns;
};

const getLanguagesStats = languages => ({
  countPercent: languages.length * 100 / Languages.length,
  peoplePercent: sumBy(languages, "num") * 100 / sumBy(Languages, "num")
});

const getStats = columns =>
  columns.map(
    column =>
      column &&
      Object.keys(column).map(char => {
        const languages = column[char];
        const { countPercent, peoplePercent } = getLanguagesStats(languages);
        return {
          char,
          languages,
          countPercent,
          peoplePercent,
          score: countPercent + peoplePercent
        };
      })
  );

const getScore = rows => sumBy(rows, "score");

const selectGroup = columns => {
  if (!columns) {
    return;
  }
  const softRows = [];
  const hardRows = [];

  for (const column of columns) {
    if (!column) {
      continue;
    }
    for (const row of column) {
      if (SoftChars.indexOf(row.char) !== -1) {
        softRows.push(row);
      }
      if (HardChars.indexOf(row.char) !== -1) {
        hardRows.push(row);
      }
    }
  }
  const softScore = getScore(softRows);
  const hardScore = getScore(hardRows);
  return { hardScore, softScore, groupId: hardScore > softScore };
};

const getBestChar = rows => {
  const stats = orderBy(rows, "score", "desc");
  return stats[0].char;
};

const getReport = (columns, { groupId }) =>
  columns &&
  columns.map(column => {
    if (!column) {
      return null;
    }
    const group = groupId === HardGroupId ? HardChars : SoftChars;
    let winner = getBestChar(column);
    let bestRow = column.find(row => row.char === winner);
    if (
      ReplacebleChars.indexOf(winner) !== -1 &&
      group.indexOf(winner) === -1
    ) {
      const validRows = column.filter(
        row => row && group.indexOf(row.char) !== -1
      );
      if (validRows.length > 0) {
        winner = applyGroup(groupId, getBestChar(validRows));
        bestRow = column.find(row => row.char === winner);
      } else {
        winner = applyGroup(groupId, winner);
      }
    }
    return { winner, bestRow, rows: orderBy(column, "score", "desc") };
  });

const getWinnerWord = columns =>
  columns && columns.map(column => column && column.winner).join("");

const getActiveLanguages = words => {
  const languages = Object.keys(words).map(word => LanguagesMap[word]);
  return getLanguagesStats(languages);
};

const charCountSelector = createSelector(wordsSelector, countChars);
const rowSelector = createSelector(wordsSelector, splitWords);
const columnSelector = createSelector(
  rowSelector,
  charCountSelector,
  getColumns
);
const statSelector = createSelector(columnSelector, getStats);
const groupSelector = createSelector(statSelector, selectGroup);
const reportSelector = createSelector(statSelector, groupSelector, getReport);
const winnerSelector = createSelector(reportSelector, getWinnerWord);
const activeLanguagesSelector = createSelector(
  wordsSelector,
  getActiveLanguages
);

export default state => ({
  charCount: charCountSelector(state),
  rows: rowSelector(state),
  report: reportSelector(state),
  winner: winnerSelector(state),
  group: groupSelector(state),
  languages: activeLanguagesSelector(state)
});
