var tag_list = []
var selected
var selected_index = [0,0]
var input_keybord
var composition
// document.addEventListener('keypress', keypress_ivent);

function strIns(str, idx, val)
{
    var res = str.slice(0, idx) + val + str.slice(idx);
    return res;
};

function strDel(str, index)
{
    var res = str.slice(0, Math.min(...index)) + str.slice(Math.max(...index))
    return res;
};



// ブロックタイトルの入力がされた
document.getElementById("input_block_title").onchange = function()
{
    element = document.getElementById("input_block_title");
    console.log(element.value);
}

// タグの追加ボタン
document.getElementById("button-add-tag").onclick = function()
{
    element = document.getElementById("input_add_tag");
    tag_list.push(element.value);
    element.value = ""
    tag_list_update();
}

// タグの削除ボタン
document.getElementById("button-select-tag").onclick = function()
{
    element = document.getElementById("select_tag_list");
    tag_list.splice(element.value, 1);
    tag_list_update();
}

// タグリストの更新
function tag_list_update()
{
    select = document.getElementById("select_tag_list");
    while(select.childElementCount != 0)
    {
        select.removeChild(select.firstChild)
    }
    for(let i = 0; i < tag_list.length; ++i)
    {
        element = document.createElement("option")
        element.value = i
        element.textContent = tag_list[i]
        select.appendChild(element);
    }
}

//クリック時の処理
function label_edit()
{
    //選択部分の確認
    selected = window.getSelection();
    selected_index = [selected.focusOffset, selected.anchorOffset]
    selected_index = [selected.focusOffset - Math.min(...selected_index), selected.anchorOffset - Math.min(...selected_index)]
    
    //入力部分の作成
    input_keybord = document.createElement("input")
    input_keybord.type = "text"
    input_keybord.classList.add("editor_input")
    event.target.after(input_keybord)

    //実装　文字の長さ調節
    input_keybord.oninput = function()
    {
        if(!composition)
        {
            if(event.target.previousElementSibling == null)
            {
                element = document.createElement("a")
                element.onclick = label_edit
                event.target.before(element)
            }

            event.target.previousElementSibling.textContent +=  event.target.value
            event.target.value = ""
            event.target.style.width = "0px"
        }
        else
        {
            // spanを生成.
            span = document.createElement('span');

            // 現在の表示要素に影響しないように、画面外に飛ばしておく.
            span.style.position = 'absolute';
            span.style.top = '-1000px';
            span.style.left = '-1000px';

            // 折り返しさせない.
            span.style.whiteSpace = 'nowrap';

            // 計測したい文字を設定する.
            span.innerHTML = event.target.value;

            // 必要に応じてスタイルを適用する.

            // DOMに追加する（追加することで、ブラウザで領域が計算されます）
            document.body.appendChild(span);

            // 横幅を取得します.
            width = span.clientWidth;
            event.target.style.width = (width + 4) + "px";

            // 終わったらDOMから削除します.
            span.parentElement.removeChild(span);
        }
    }

    //実装　変換待ち検知
    input_keybord.addEventListener('compositionstart', function(){
        //console.log("入力開始");
        composition = true
    });
    input_keybord.addEventListener('compositionend', function(){
        //console.log("入力終了");
        composition = false
        
        //反映しラベルに追加
        if(event.target.previousElementSibling == null)
        {
            element = document.createElement("a")
            event.target.befor(element)
        }

        event.target.previousElementSibling.textContent +=  event.target.value
        event.target.value = ""
        event.target.style.width = "0px"
    });

    //実装　カーソルが外れたらinputを削除
    input_keybord.onblur = function()
    {
        if(event.target.nextElementSibling != null)
        {
            event.target.previousElementSibling.textContent += event.target.nextElementSibling.textContent
            event.target.parentElement.removeChild(event.target.nextElementSibling)
        }
        event.target.parentElement.removeChild(event.target);
    }

    //前方部分作成
    str = selected.focusNode.textContent
    points = [Math.min(selected.focusOffset, selected.anchorOffset), Math.max(selected.focusOffset, selected.anchorOffset)]
    event.target.textContent = str.slice(0, points[0])
    //後方部分作成
    text_after = document.createElement("a")
    text_after.textContent = str.slice(points[1], str.length)
    text_after.onclick = label_edit
    input_keybord.after(text_after) 
    //inputの文字登録、フォーカスと選択
    input_keybord.value = str.slice(...points);
    input_keybord.focus();
    input_keybord.setSelectionRange(0, input_keybord.value.length);
    
    //初期のinputの長さを調整
    if(input_keybord.value.length != 0)
    {
        // spanを生成.
        span = document.createElement('span');

        // 現在の表示要素に影響しないように、画面外に飛ばしておく.
        span.style.position = 'absolute';
        span.style.top = '-1000px';
        span.style.left = '-1000px';

        // 折り返しさせない.
        span.style.whiteSpace = 'nowrap';

        // 計測したい文字を設定する.
        span.innerHTML = input_keybord.value;

        // 必要に応じてスタイルを適用する.

        // DOMに追加する（追加することで、ブラウザで領域が計算されます）
        document.body.appendChild(span);

        // 横幅を取得します.
        width = span.clientWidth;
        console.log(width)
        input_keybord.style.width = (width + 4) + "px";

        // 終わったらDOMから削除します.
        span.parentElement.removeChild(span);
    }
    else
    {
        input_keybord.style.width = "0px";
    }
}

//コンテンツの初期作成
function editer_content_start()
{
    editor_content_list = document.getElementById("editor-content-list")
    element_li = document.createElement("li")
    editor_content_list.appendChild(element_li)

    element_a = document.createElement("a")
    element_a.textContent = "test abcdefghi"
    element_a.onclick = label_edit
    element_li.appendChild(element_a)
}


$(document).keydown(function(event){
    // クリックされたキーのコード
    var keyCode = event.keyCode;
    // Ctrlキーがクリックされたか (true or false)
    var ctrlClick = event.ctrlKey;
    // Altキーがクリックされたか (true or false)
    var altClick = event.altKey;
    // キーイベントが発生した対象のオブジェクト
    var obj = event.target;
    
    // バックスペースキーを制御する
    if(keyCode == 8)
    {
        if(input_keybord.value == "")
        {
            console.log("back")
            if(input_keybord.previousElementSibling == undefined)
            {
                console.log("行削除")
            }
            else
            {
                str = input_keybord.previousElementSibling.textContent;
                if(str.slice(0,str.length - 1) != "")
                {
                    input_keybord.previousElementSibling.textContent = str.slice(0,str.length - 1);
                }
                else
                {
                    input_keybord.parentElement.removeChild(input_keybord.previousElementSibling);
                }
            }
        }
    }
    else if(keyCode == 13)
    {
        if(!composition && input_keybord != undefined)
        {
            console.log("enter")
            //　新しい行を作成
            str = input_keybord.nextElementSibling.textContent
            element_li = document.createElement("li")
            console.log(input_keybord.parentElement)
            input_keybord.parentElement.after(element_li)
            
            element_a = document.createElement("a")
            element_a.textContent = str
            element_a.onclick = label_edit
            element_li.appendChild(element_a)

            input_keybord.parentElement.removeChild(input_keybord.nextElementSibling)
            input_keybord.blur()
            
            //新しい行で入力状態にする
            select = new Range();
            select.setStart(element_a, 0)
            select.setEnd(element_a, 0)
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(select);

            element_a.click();
        }
    }
    else if(ctrlClick && keyCode == 90)
    {
        console.log("ctrl + Z")
    }
});

editer_content_start()