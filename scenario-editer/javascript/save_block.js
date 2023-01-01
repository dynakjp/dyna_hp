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
    selected = window.getSelection();
    selected_index = [selected.focusOffset, selected.anchorOffset]
    selected_index = [selected.focusOffset - Math.min(...selected_index), selected.anchorOffset - Math.min(...selected_index)]
    input_keybord = document.createElement("input")
    input_keybord.type = "text"
    input_keybord.classList.add("editor_input")
    
    event.target.after(input_keybord)

    //文字の長さを測り実装
    input_keybord.oninput = function()
    {
        if(!composition)
        {
            if(event.target.previousElementSibling == null)
            {
                element = document.createElement("a")
                element.onclick = label_edit
                event.target.befor(element)
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

    //変換待ち検知用
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

    //カーソルが外れたらinputを削除
    input_keybord.onblur = function()
    {
        if(event.target.nextElementSibling.textContent != null)
        {
            event.target.previousElementSibling.textContent += event.target.nextElementSibling.textContent
            event.target.parentElement.removeChild(event.target.nextElementSibling)
        }
        event.target.parentElement.removeChild(event.target);
    }

    str = selected.focusNode.textContent
    points = [Math.min(selected.focusOffset, selected.anchorOffset), Math.max(selected.focusOffset, selected.anchorOffset)]
    event.target.textContent = str.slice(0, points[0])

    text_after = document.createElement("a")
    text_after.textContent = str.slice(points[1], str.length)
    text_after.onclick = label_edit
    input_keybord.after(text_after) 

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

    // focusNodeを利用
    // console.log(selected.focusNode)
    // console.log(strIns(selected.focusNode.textContent, selected.focusOffset, "!"))
    // selected.focusNode.textContent = strIns(selected.focusNode.textContent, selected.focusOffset, "!")
    
    // console.log(selected.focusOffset)
    // console.log(selected.anchorOffset)
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


// $(document).keydown(function(event){
//     // クリックされたキーのコード
//     var keyCode = event.keyCode;
//     // Ctrlキーがクリックされたか (true or false)
//     var ctrlClick = event.ctrlKey;
//     // Altキーがクリックされたか (true or false)
//     var altClick = event.altKey;
//     // キーイベントが発生した対象のオブジェクト
//     var obj = event.target;
    
//     console.log(selected)
//     // バックスペースキーを制御する
//     if(keyCode == 8)
//     {
//         console.log("back")
//         if(selected != undefined)
//         {
//             if(selected_index[0] == selected_index[1])
//             {
//                 selected.focusNode.textContent = strDel(selected.focusNode.textContent, [selected_index[0], selected_index[0] + 1])
//                 num = Math.min(...selected_index) - 1
//                 selected_index = [num, num]
//             }
//             else
//             {
//                 selected.focusNode.textContent = strDel(selected.focusNode.textContent, selected_index);
//                 num = Math.min(...selected_index) - 1
//                 selected_index = [num, num]
//             }
//         }
//     }
//     else if(keyCode == 13)
//     {
//         console.log("enter")
//     }
//     else if(ctrlClick && keyCode == 90)
//     {
//         console.log("ctrl + Z")
//     }
// });

editer_content_start()