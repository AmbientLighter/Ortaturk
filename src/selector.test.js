import selector from "./selector";

const getWinnerWord = words => {
  const state = {
    form: {
      LanguagesList: {
        values: {
          language: words
        }
      }
    }
  };
  const report = selector(state);
  return report.winner;
};

describe("Selector", () => {
  it("calculates first case", () => {
    expect(
      getWinnerWord({
        Турецкий: "güya",
        Азербайджанский: "güya",
        Узбекский: "goyo",
        Уйгурский: "goyâ",
        Туркменский: "gӧyâ",
        Татарский: "güyâ",
        Башкирский: "güyâ",
        Крымскотатарский: "güya"
      })
    ).toEqual("güyâ");
  });

  it("calculates case 2", () => {
    expect(
      getWinnerWord({
        Турецкий: "imtihan",
        Азербайджанский: "imtahan",
        Узбекский: "imtihon",
        Казахский: "emtixan",
        Уйгурский: "emtihan",
        Татарский: "imtixan",
        Башкирский: "imtixan",
        Каракалпакский: "imtixan",
        Крымскотатарский: "imti_an",
        Гагаузский: "imtihan",
        "Хорезмско-тюркский (староузбекский)": "imtihan"
      })
    ).toEqual("imtihân");
  });

  it("calculates case 3", () => {
    expect(
      getWinnerWord({
        Турецкий: "kadeh",
        Азербайджанский: "gâdâh",
        Узбекский: "qadah",
        Казахский: "qadaq",
        Уйгурский: "qâdâh",
        Татарский: "qadâx",
        Крымскотатарский: "qade_",
        Урумский: "xadıy",
        "Караимский (крымский)": "qadex",
        Крымчакский: "qade_"
      })
    ).toEqual("qadah");
  });
});
