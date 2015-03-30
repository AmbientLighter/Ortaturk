function round(f, p){
    if (p == undefined)
        p = 2;
    var n = Math.pow(10, p);
    return Math.round(f*n)/n;
}

function writeMessage(msg){
    var p = $("<p>").text(msg);
    $("#place").append(p);
}

var languagesBase = [
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
    {title: "Фуюйских кыргызов", num: 0.001473},
    
];

function compareLangs (a, b){
    if (a.num > b.num)
        return -1;
    if (a.num < b.num)
        return 1;
    return 0;
}

var languages = languagesBase.sort(compareLangs);

var s = langSum();
for (var i in languages){
    languages[i].rel = round(languages[i].num*100 / s, 5);
};

function langSum(){
    var sum = 0;
    for (var i in languages)
        sum += languages[i].num;
    return sum;
}

var testWords = [
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
];

function wordid(i){
    return 'word_' + i;
}

function putWords(words){
    for (var i in words){
        $("#word_"+i).val(words[i]);
    }
}

function getWords(){
    var words = [];
    for (var i in languages)
        words.push($("#word_"+i).val());
    return words;
}

function showLangs(){
    var table = $("#langs");
    
    for (var i in languages){
        var tr = $('<tr>');
        $('<td>').text(languages[i].title).appendTo(tr);
        $('<td>').text(languages[i].num).appendTo(tr);
        $('<td>').text(languages[i].rel).appendTo(tr);
        
        var input = $('<input>')
                    .attr('type', 'text')
                    .attr('name', wordid(i))
                    .attr('id', wordid(i));
        
        var storedValue = localStorage.getItem(wordid(i));
        input.val(storedValue);
        
        (function (i){
            input.bind('keyup change', function(){
                localStorage.setItem(wordid(i), $(this).val());
            });
        })(i);
        
        $('<td>').append(input).appendTo(tr);

        table.append(tr);
    }

    writeMessage("Number of languages: " + languages.length);
    writeMessage("Sum: " + round(langSum()));
}

function findPositions(len, words){
    var positions = new Array(len);
    for (var i = 0; i < len; i++)
        positions[i] = {};
        
    for (var j in languages){
        if (words[j].length == 0)
            continue;
            
        for (var i = 0; i < len; i++){
            var ch = words[j].charAt(i);
            if (positions[i][ch] == undefined)
                positions[i][ch] = [];
            
            positions[i][ch].push(j);
        }
    }
    return positions;
}

function sortQueue(a, b){
    if (a.nspeakers + a.nlangs > b.nspeakers + b.nlangs)
        return -1;
    if (a.nspeakers + a.nlangs < b.nspeakers + b.nlangs)
        return 1;
    return 0;
}

function findWinnerChar(i, chars, nwords){
    var queue = [];
    for (var ch in chars){
        var langs = chars[ch];
        var nlangs = langs.length * 100 / languages.length;
        var nspeakers = 0;
        var lstspeakers = [];
        
        for (var j in langs){
            var lang = languages[langs[j]];
            nspeakers += lang.rel;
            lstspeakers.push(lang.rel);
        }
        
        queue.push({
            ch: ch,
            nspeakers: nspeakers,
            lstspeakers: lstspeakers,
            nlangs: nlangs
        });        
    }
    
    queue = queue.sort(sortQueue);
    return queue;
}

function checkActive(words){
    var activelanguages = 0;
    var activespeakers = 0;
    for (var j in languages)
        if (words[j].length != 0){
            activelanguages++;
            activespeakers += languages[j].rel;
        }

    activelanguages = activelanguages *100 / languages.length;
    writeMessage("Active languages: " + round(activelanguages, 3)+"%");
    writeMessage("Active speakers: " + round(activespeakers, 3)+"%");
    
    if (activespeakers < 50)
        writeMessage("Warning: not enough speakers.");
        
    if (activelanguages < 50)
        writeMessage("Warning: not enough languages.");
}

function nonZeroWord(word){
    var res = false;
    for (var i in word)
        if (word.charAt(i) != '0'){
            res = true;
            break;
        }
    return res;
}

function compute(){
    $("#place").empty();
    var words = getWords();
    var nchars = 0;
    for (var i in words){
        nchars = Math.max(nchars, words[i].length);
    }
    
    var nonemptywords = 0;
    for (var i in words)
        if (words[i].length != 0){
            nonemptywords++;
            writeMessage(languages[i].title + ": " + words[i]);
        }
    
    if (nonemptywords == 0){
        writeMessage("i've got no words!");
        return;
    }
    
    checkActive(words);
    var positions = findPositions(nchars, words);

    var queues = [];
    var chars = new Array(nchars);
    var chars2 = new Array(nchars);
    
    for (var i = 0; i < nchars; i++){
        var queue = findWinnerChar(i, positions[i], nonemptywords);
        queues.push(queue);
        var ch = queue[0].ch;
        chars.push(ch);
        
        if (queue.length > 1){
            var ch2 = queue[1].ch;
            chars2.push(ch2);
        }
    }
    var newword = chars.join("");
    if (!nonZeroWord(newword))
        newword = chars2.join("");
        
    writeMessage("ОТВЕТ: " + newword);
    
    checkWord(words, newword);
    var data = prepareTable(nchars, words, newword, queues);
    formatTable(data, $("#place"));
}

function checkWord(words, newword){
    var newspeakers = 0;
    var newlangs = 0;
    for (var i in words){
        if (newword == words[i]){
            newspeakers += languages[i].num;
            newlangs++;
        }
    }
    if (newlangs > 0)
        writeMessage("This word is used in " + newlangs + " language(s) by " + round(newspeakers, 5) + " speakers");
}

function prepareTable(nchars, words, newword, queues){
    var table = [];
    
    var row = ["Язык"];
    for (var i = 0; i < nchars; i++)
        row.push("Фонема " + (i+1));
    table.push(row);
    
    for (var i in words){
        if (words[i].length == 0)
            continue;
        
        var row = [languages[i].title];
        for (var j = 0; j < nchars; j++)
            row.push(words[i].charAt(j));
        table.push(row);
    }
    
    var row = ["STAT"];

    for (var i = 0; i < nchars; i++){
        var s = "";
        for (var j in queues[i]){
            s += queues[i][j].ch + ": " +
                "P: " + round(queues[i][j].nspeakers, 3) + "%; " +
                "L: " + round(queues[i][j].nlangs, 3) + "%"+ "<br>";
        }
        row.push(s)
    }
    table.push(row);
    return table;
}

function formatTable(data, placeholder){
    var table = $("<table>").attr("class", "table table-hover");
    for (var i = 0; i < data.length; i++){
        var row = $("<tr>");
        for (var j = 0; j < data[i].length; j++){
            var text = data[i][j];
            var cell = $("<td>").html(text);
            row.append(cell);
        }
        table.append(row);
    }
    placeholder.append(table);
}

function saveWords(){
    var words = getWords();
    var str = words[0];
    for (var i = 1; i < words.length; i++)
        str += "\t" + words[i];
    prompt("Copy words with Ctrl-C", str);
}

function loadWords(){
    var str = prompt("Paste words with Ctrl-V");
    var words = str.split("\t");
    if (words.length > 1)
        putWords(words);
    else
        alert("Not enough words" + words);
}

$(function(){
    showLangs();
    $("#compute").click(compute);
    $("#save").click(saveWords);
    $("#load").click(loadWords);
    $("#test").click(function(){
        putWords(testWords);
    });
})
