function round(f, p){
    if (p == undefined)
        p = 2;
    var n = Math.pow(10, p);
    return Math.round(f*n)/n;
}

var Languages = {

    items: [
        {title: "Чувашский", num: 1.3},
        {title: "Cаха", num: 0.5},
        {title: "Татарский", num: 5.3},
        {title: "Башкирский", num: 1.4},
        {title: "Казахский", num: 14},
        {title: "Узбекский", num: 28},
        {title: "Туркменский", num: 6},
        {title: "Азербайджанский", num: 29},
        {title: "Турецкий", num: 60},
        {title: "Крымскотатарский", num: 0.4},
        {title: "Ногайский", num: 0.4},
        {title: "Каракалпакский", num: 0.55},
        {title: "Уйгурский", num: 10},
        {title: "Кыргызский", num: 5},
        {title: "Кумыкский", num: 0.45},
        {title: "Карачаево-балкарский", num: 0.39},
        {title: "Гагаузский", num: 0.23},
        {title: "Тувинский", num: 0.28},
        {title: "Хакасский", num: 0.07},
        {title: "Алтайский", num: 0.065},
        {title: "Урумский", num: 0.06},
        {title: "Сибирско-татарский", num: 0.009611},
        {title: "Караимский (крымский)", num: 0.000028},
        {title: "Караимский (галичский)", num: 0.000012},
        {title: "Караимский (тракайский)", num: 0.000060}, 
        {title: "Шорский", num: 0.008},
        {title: "Телеутский", num: 0.008},
        {title: "Чулымский (среднечулымский)", num: 0.00656},   
        {title: "Тофаларский", num: 0.0003},
        {title: "Крымчакский", num: 0.00001},
        {title: "Саларский", num: 0.04}, 
        {title: "Хорасано-тюркский", num: 0.4}, 
        {title: "Халаджский", num: 0.002},
        {title: "Сарыг-югурский", num: 0.0002},
        {title: "Долганский", num: 0.003425},
        {title: "Древнетюркский", num: 0.0},
        {title: "Караханидско-уйгурский", num: 0.0},
        {title: "Чагатайский", num: 0.0},
        {title: "Хорезмско-тюркский (староузбекский)", num: 0.0},
        {title: "Древне-булгарский", num: 0.0},
        {title: "Древне-уйгурский", num: 0.0},
        {title: "Древне-кыпчакский", num: 0.0},
        {title: "Армяно-кыпчакский", num: 0.0},
        {title: "Орхоно-енисейский", num: 0.0},
        {title: "Среднетюркский (язык Махмуда Кашгарского)", num: 0.0},
        {title: "Средне-уйгурский", num: 0.0},
        {title: "Средне-кыпчакский", num: 0.0},
        {title: "Средне-огузский", num: 0.0},
        {title: "Старо-османский", num: 0.0},
        {title: "Фуюйских кыргызов", num: 0.001473}
    ],

    sum: function (){
        var sum = 0;
        for (var i in Languages.items)
            sum += Languages.items[i].num;
        return sum;
    },

    compare: function (a, b){
        if (a.num > b.num)
            return -1;
        if (a.num < b.num)
            return 1;
        return 0;
    },

    sorted: function(){
        return Languages.items.sort(Languages.compare);
    },

    relational: function(){
        var sorted = Languages.sorted();
        var sum = Languages.sum();
        for (var i in sorted){
            sorted[i].rel = round(sorted[i].num * 100 / sum, 5);
        }
        return sorted;
    }
}

var languages = Languages.relational();

function Char(char){
    this.nspeakers = 0;
    this.nlangs = 0;
    this.languages = [];
    this.ch = char;
}

Char.prototype = {
    addLanguage: function (language){
        this.languages.push(language);
    },

    compute: function(){
        this.nlangs = this.languages.length * 100 / languages.length;

        this.nspeakers = 0;
        for (var i in this.languages){
            this.nspeakers += this.languages[i].rel;
        }
    }
}

function Calculator(words){
    this.words = words;
    this.wordLength = this.getWordLength();
}

Calculator.prototype = {

    createReport: function(){
        var chars = this.getChars(this.words);
        var word = this.createWord(chars);

        return {
            activelanguages: this.countActiveLanguages(),
            activespeakers: this.countActiveSpeakers(),
            newlangs: this.countWordLanguages(word),
            newspeakers: this.countWordSpeakers(word),
            queues: chars,
            newword: word,
            wordLength: this.wordLength,
            words: this.words
        }
    },

    getChars: function() {
        var columns = [];

        for (var i = 0; i < this.wordLength; i++){
            var chars = {};

            for (var j in this.words){
                var language = this.words[j].language;
                var word = this.words[j].word;

                var ch = word.charAt(i);
                if (chars[ch] == undefined)
                    chars[ch] = new Char(ch);

                chars[ch].addLanguage(language);
            }

            var column = [];
            for (var ch in chars){
                var item = chars[ch];
                item.compute();
                column.push(item);
            }

            column = _.sortBy(column, function(item){
                return -item.nspeakers-item.nlangs;
            });
            columns.push(column);
        }
        return columns;
    },

    createWord: function (chars){
        var items = new Array(this.wordLength);
        for (var i in chars){
            items.push(chars[i][0].ch);
        }
        var newword = items.join("");

        if (!this.nonZeroWord(newword)){
            items = new Array(this.wordLength);
            for (var i in chars){
                var queue = chars[i];
                if (queue.length > 1){
                    var ch = queue[1].ch;
                    items.push(ch);
                }
            }
            newword = items.join("");
        }
        return newword;
    },

    nonZeroWord: function (word){
        var res = false;
        for (var i in word)
            if (word.charAt(i) != '0'){
                res = true;
                break;
            }
        return res;
    },

    countActiveLanguages: function (){
        return this.words.length * 100 / languages.length;
    },

    countActiveSpeakers: function() {
        var result = 0;
        for (var j in this.words)
            result += this.words[j].language.rel;
        return result;
    },

    countWordSpeakers: function(newword) {
        var result = 0;
        for (var i in this.words){
            if (newword == this.words[i].word){
                result += this.words[i].language.num;
            }
        }
        return round(result, 5);
    },

    countWordLanguages: function(newword) {
        var result = 0;
        for (var i in this.words){
            if (newword == this.words[i].word){
                result++;
            }
        }
        return result;
    },

    getWordLength: function (){
        var length = 0;
        for (var i in this.words){
            var item = this.words[i];
            length = Math.max(length, item.word.length);
        }
        return length;
    }
}

function Word(word, language){
    this.word = word;
    this.language = language;
}

var InputView = {
    wordid: function (i){
        return 'word_' + i;
    },

    putWords: function (words){
        for (var i in words){
            $("#word_"+i).val(words[i]);
        }
    },

    getWords: function (){
        var words = [];
        for (var i in languages){
            var word = $("#word_"+i).val();
            if (word.length > 0)
                words.push(new Word(word, languages[i]));
        }
        return words;
    },

    render: function (){
        var table = $("#langs");
        
        for (var i in languages){
            var tr = $('<tr>');
            $('<td>').text(languages[i].title).appendTo(tr);
            $('<td>').text(languages[i].num).appendTo(tr);
            $('<td>').text(languages[i].rel).appendTo(tr);
            
            var input = $('<input>')
                        .attr('type', 'text')
                        .attr('name', InputView.wordid(i))
                        .attr('id', InputView.wordid(i));
            
            var storedValue = localStorage.getItem(InputView.wordid(i));
            input.val(storedValue);
            
            (function (i){
                input.bind('keyup change', function(){
                    localStorage.setItem(InputView.wordid(i), $(this).val());
                });
            })(i);
            
            $('<td>').append(input).appendTo(tr);

            table.append(tr);
        }
    }
}

var ReportView = {
    clean: function(){
        $("#place").empty();
    },

    error: function(){
        this.clean();
        this.write("I've got no words!");
    },

    render: function(report){
        this.clean();

        this.write("Active languages: " + round(report.activelanguages, 3)+"%");
        if (report.activelanguages < 50)
            this.write("Warning: not enough languages.");
            
        this.write("Active speakers: " + round(report.activespeakers, 3)+"%");
        if (report.activespeakers < 50)
            this.write("Warning: not enough speakers.");

        this.write("ОТВЕТ: " + report.newword);

        if (report.newlangs > 0)
            this.write("This word is used in " + report.newlangs + " language(s) by " + report.newspeakers + " speakers");

        var table = this.buildTable(report);
        table.render($("#place"));
    },

    write: function (msg){
        $("<p>").text(msg).appendTo($("#place"));
    },

    buildTable: function (report){
        var table = new TableView();

        var row = ["Язык"];
        for (var i = 0; i < report.wordLength; i++)
            row.push("Фонема " + (i+1));
        table.addRow(row);

        for (var i in report.words){
            var item = report.words[i];
            var row = [item.language.title];
            for (var j = 0; j < report.wordLength; j++)
                row.push(item.word.charAt(j));
            table.addRow(row);
        }
        
        var row = ["STAT"];

        for (var i = 0; i < report.wordLength; i++){
            var s = "";
            for (var j in report.queues[i]){
                s += report.queues[i][j].ch + ": " +
                    "P: " + round(report.queues[i][j].nspeakers, 3) + "%; " +
                    "L: " + round(report.queues[i][j].nlangs, 3) + "%"+ "<br>";
            }
            row.push(s)
        }
        table.addRow(row);
        return table;
    }
}

function TableView(){
    this.rows = [];
}

TableView.prototype = {
    addRow: function(row){
        this.rows.push(row);
    },

    render: function(placeholder){
        var table = $("<table>").attr("class", "table table-hover");
        for (var i in this.rows){
            this.renderRow(this.rows[i]).appendTo(table);
        }
        placeholder.append(table);
    },

    renderRow: function(cells){
        var row = $("<tr>");
        for (var col in cells){
            $("<td>").html(cells[col]).appendTo(row);
        }
        return row;
    }
}

var App = {
    compute: function (){
        var words = InputView.getWords();
        
        if (words.length == 0){
            ReportView.error();
            return;
        }

        var calc = new Calculator(words);
        var report = calc.createReport();
        ReportView.render(report);
    },

    test: function(){
        InputView.putWords(App.testWords);
    },

    testWords: [
        "ikke",
        "ikki",
        "ik0e",
        "ik0e",
        "ek0i",
        "ikki",
        "ik0i",
        "ik0i",
        "ik0i",
        "ek0i",
        "ek0i",
        "ek0i"
    ]
}

function main(){
    InputView.render();
    $("#compute").click(App.compute);
    $("#test").click(App.test);
}

$(main)
