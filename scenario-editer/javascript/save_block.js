let tag_list = []
let selected
let selected_index = [0,0]
let input_keybord
let composition

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

//ラベルクリック時の処理
function label_edit()
{
    //選択部分の確認
    selected = window.getSelection();
    selected_index = [selected.focusOffset, selected.anchorOffset]
    selected_index = [selected.focusOffset - Math.min(...selected_index), selected.anchorOffset - Math.min(...selected_index)]
    
    //入力部分の作成
    input_keybord = document.createElement("input")
    input_keybord.type = "text"
    input_keybord.classList.add("editor-input")
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
            event.target.style.width = "5px"
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
            event.target.before(element)
        }

        event.target.previousElementSibling.textContent +=  event.target.value
        event.target.value = ""
        event.target.style.width = "5px"
    });

    //実装　カーソルが外れたらinputを削除
    input_keybord.onblur = function()
    {
        if(event.target.nextElementSibling != null && event.target.previousElementSibling != null)
        {
            event.target.previousElementSibling.textContent += event.target.nextElementSibling.textContent
            event.target.parentElement.removeChild(event.target.nextElementSibling)
        }
        event.target.parentElement.removeChild(event.target);
        input_keybord = undefined
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
        input_keybord.style.width = "5px";
    }
}

function li_click()
{
    parent = event.target
    i = parent.childElementCount - 1
    select = new Range();
    while(0 <= i)
    {
        if(parent.children[i].tagName == "A")
        {
            if(parent.children[i].firstChild == null)
            {
                select.setStart(parent.children[i], 0)
                select.setEnd(parent.children[i], 0)
            }
            else
            {
                select.setStart(parent.children[i].firstChild, parent.children[i].firstChild.length)
                select.setEnd(parent.children[i].firstChild, parent.children[i].firstChild.length)
            }
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(select);
            parent.children[i].click();
            break
        }
        i--
    }

}

//コンテンツの初期作成
function editer_content_start()
{
    editor_content_list = document.getElementById("editor-content-list")
    element_li = document.createElement("li")
    element_li.onclick = li_click
    element_li.classList.add("editor-row")
    editor_content_list.appendChild(element_li)

    element_a = document.createElement("a")
    element_a.textContent = "test abcdefghi"
    element_a.onclick = label_edit
    element_li.appendChild(element_a)
}

//ラベルの合成
function label_synthesis(element_li)
{
    i = 0
    str = ""
    while(i < element_li.childElementCount)
    {
        if(element_li.children[i].tagName == "A")
        {
            str += element_li.children[i].textContent
            element_li.removeChild(element_li.children[i])
        }
        else
        {
            i++
        }
    }
    element_a = document.createElement("a")
    element_a.textContent = str
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
        if(input_keybord != undefined && input_keybord.value == "")
        {
            if(input_keybord.previousElementSibling == null || input_keybord.previousElementSibling.textContent == "")
            {
                before_li = input_keybord.parentElement.previousElementSibling
                before_li.removeChild(before_li.children[before_li.childElementCount - 1])
                index = input_keybord.nextElementSibling.textContent.length
                if(input_keybord.previousElementSibling != null)
                {
                    input_keybord.parentElement.removeChild(input_keybord.previousElementSibling)
                }
                before_li.appendChild(input_keybord.nextElementSibling);
                input_keybord.parentElement.parentElement.removeChild(input_keybord.parentElement)
                label_synthesis(before_li)
                //新しい行で入力状態にする
                element_a = before_li.children[0]
                select = new Range();
                if(element_a.firstChild != null)
                {
                    select.setStart(element_a.firstChild, element_a.textContent.length - index)
                    select.setEnd(element_a.firstChild, element_a.textContent.length - index)
                }
                else
                {
                    select.setStart(element_a, 0)
                    select.setEnd(element_a, 0)
                }

                document.getSelection().removeAllRanges();
                document.getSelection().addRange(select);
                element_a.click();
            }
            else
            {
                //前方にテキストがある
                console.log("Back")
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
            if(input_keybord.nextElementSibling != null)
            {
                //　新しい行を作成
                str = input_keybord.nextElementSibling.textContent
                element_li = document.createElement("li")
                element_li.onclick = li_click
                element_li.classList.add("editor-row")
                input_keybord.parentElement.after(element_li)
                
                element_a = document.createElement("a")
                element_a.textContent = str
                element_a.onclick = label_edit
                element_li.appendChild(element_a)

                input_keybord.parentElement.removeChild(input_keybord.nextElementSibling)
                input_keybord.blur()
                br = document.createElement("br")
                element_li.previousElementSibling.appendChild(br);

                //新しい行で入力状態にする
                select = new Range();
                select.setStart(element_a, 0)
                select.setEnd(element_a, 0)
                document.getSelection().removeAllRanges();
                document.getSelection().addRange(select);

                element_a.click();
            }
            else
            {
                //後ろに要素がない場合
                element_li = document.createElement("li")
                element_li.onclick = li_click
                element_li.classList.add("editor-row")
                input_keybord.parentElement.after(element_li)
                
                element_a = document.createElement("a")
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
            }
        }
    }
    else if(ctrlClick && keyCode == 90)
    {
        console.log("ctrl + Z")
    }
    else if(keyCode == 37)
    {
        if(input_keybord != undefined && input_keybord.value == "")
        {
            if(input_keybord.previousElementSibling == null || input_keybord.previousElementSibling.textContent == "")
            {
                if(input_keybord.parentElement.previousElementSibling != null)
                {
                    destination = input_keybord.parentElement.previousElementSibling
                    input_keybord.blur()
                    destination.click()
                }
            }
            else
            {
                index = input_keybord.previousElementSibling.textContent.length - 1
                destination = input_keybord.parentElement
                input_keybord.blur()

                select = new Range();
                select.setStart(destination.children[0].firstChild, index)
                select.setEnd(destination.children[0].firstChild, index)
                document.getSelection().removeAllRanges();
                document.getSelection().addRange(select);
                destination.children[0].click()
            }
        }
    }
    else if(keyCode == 39)
    {
        if(input_keybord != undefined && input_keybord.value == "")
        {
            if(input_keybord.nextElementSibling == null || input_keybord.nextElementSibling.textContent == "")
            {
                if(input_keybord.parentElement.nextElementSibling != null)
                {
                    destination = input_keybord.parentElement.nextElementSibling
                    input_keybord.blur()
                    select = new Range();
                    select.setStart(destination.children[0], 0)
                    select.setEnd(destination.children[0], 0)
                    document.getSelection().removeAllRanges();
                    document.getSelection().addRange(select);
                    destination.children[0].click()
                }
            }
            else
            {
                index = input_keybord.previousElementSibling.textContent.length + 1
                destination = input_keybord.parentElement
                input_keybord.blur()

                select = new Range();
                select.setStart(destination.children[0].firstChild, index)
                select.setEnd(destination.children[0].firstChild, index)
                document.getSelection().removeAllRanges();
                document.getSelection().addRange(select);
                destination.children[0].click()
            }
        }
    }
});

editer_content_start()