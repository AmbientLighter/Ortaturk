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

function Item(char){
    this.nspeakers = 0;
    this.nlangs = 0;
    this.languages = [];
    this.ch = char;
}

Item.prototype = {
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
    this.rows = this.countWords();
    this.cols = this.countChars();
}

Calculator.prototype = {

    createReport: function(){
        var queues = this.getQueues(this.words);
        var newword = this.calcNewWord(queues);

        return {
            activelanguages: this.countActiveLanguages(),
            activespeakers: this.countActiveSpeakers(),
            newlangs: this.countWordLanguages(newword),
            newspeakers: this.countWordSpeakers(newword),
            queues: queues,
            newword: newword,
            rows: this.rows,
            cols: this.cols,
            words: this.words
        }
    },

    getQueues: function() {
        var columns = [];

        for (var i = 0; i < this.cols; i++){
            var items = {};

            for (var j in languages){
                var language = languages[j];
                var word = this.words[j];

                if (word.length == 0)
                    continue;

                var ch = word.charAt(i);
                if (items[ch] == undefined)
                    items[ch] = new Item(ch);
                
                items[ch].addLanguage(language);
            }

            var column = [];
            for (var ch in items){
                var item = items[ch];
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

    calcNewWord: function (queues){
        var chars = new Array(this.cols);
        for (var i in queues){
            var queue = queues[i];
            var ch = queue[0].ch;
            chars.push(ch);
        }
        var newword = chars.join("");

        if (!this.nonZeroWord(newword)){
            chars = new Array(this.cols);
            for (var i in queues){
                var queue = queues[i];
                if (queue.length > 1){
                    var ch = queue[1].ch;
                    chars.push(ch);
                }
            }
            newword = chars.join("");
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
        var result = 0;
        for (var j in languages)
            if (this.words[j].length != 0){
                result++;
            }

        result = result * 100 / languages.length;
        return result
    },

    countActiveSpeakers: function() {
        var result = 0;
        for (var j in languages)
            if (this.words[j].length != 0){
                result += languages[j].rel;
            }
        return result;
    },

    countWordSpeakers: function(newword) {
        var result = 0;
        for (var i in this.words){
            if (newword == this.words[i]){
                result += languages[i].num;
            }
        }
        return round(result, 5);
    },

    countWordLanguages: function(newword) {
        var result = 0;
        for (var i in this.words){
            if (newword == this.words[i]){
                result++;
            }
        }
        return result;
    },

    countWords: function() {
        var result = 0;
        for (var i in this.words)
            if (this.words[i].length != 0){
                result++;
            }
        return result;
    },

    countChars: function (){
        var result = 0;
        for (var i in this.words){
            result = Math.max(result, this.words[i].length);
        }
        return result;
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
            words.push(word);
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
        for (var i = 0; i < report.cols; i++)
            row.push("Фонема " + (i+1));
        table.addRow(row);

        for (var i in report.words){
            if (report.words[i].length == 0)
                continue;
            
            var row = [languages[i].title];
            for (var j = 0; j < report.cols; j++)
                row.push(report.words[i].charAt(j));
            table.addRow(row);
        }
        
        var row = ["STAT"];

        for (var i = 0; i < report.cols; i++){
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
        var calc = new Calculator(words);
        
        if (calc.rows == 0){
            ReportView.error();
            return;
        }
        var report = calc.createReport();
        ReportView.render(report);
    },

    save: function (){
        var words = InputView.getWords();
        prompt("Copy words with Ctrl-C", words.join("\t"));
    },

    load: function (){
        var str = prompt("Paste words with Ctrl-V");
        var words = str.split("\t");
        if (words.length > 1)
            InputView.putWords(words);
        else
            alert("Not enough words" + words);
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
    $("#save").click(App.save);
    $("#load").click(App.load);
    $("#test").click(App.test);
}

$(main)
