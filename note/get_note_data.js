var NL
var div = document.getElementById('note_links');

function getCSV(){
    var req1 = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
    req1.open("get", "./note_link.csv", true); // アクセスするファイルを指定
    req1.send(null); // HTTPリクエストの発行
	
    // レスポンスが返ってきたらconvertCSVtoArray()を呼ぶ	
    req1.onload = function(){
	    NL=convertCSVtoArray(req1.responseText); // 渡されるのは読み込んだCSVデータ
        console.log(NL);
        for(i of NL){
            console.log(i[0]);
            console.log("./note_data/"+i[2]+".html");
            makelink(i[0],"./note_data/"+i[2]+".html");
        }
    }
}

// 読み込んだCSVデータを二次元配列に変換する関数convertCSVtoArray()の定義
function convertCSVtoArray(str){ // 読み込んだCSVデータが文字列として渡される
    var result = []; // 最終的な二次元配列を入れるための配列
    var tmp = str.replace("\r","").split("\n"); // 改行を区切り文字として行を要素とした配列を生成
 
    // 各行ごとにカンマで区切った文字列を要素とした二次元配列を生成
    for(var i=0;i<tmp.length;++i){
        result[i] = tmp[i].split(',');
    }
    return result;
}

function makelink(text,link){
    var label = document.createElement('a');
    label.textContent = text;
    label.href = link;
    div.appendChild(label);
    div.appendChild(document.createElement('br'));
}

getCSV();

