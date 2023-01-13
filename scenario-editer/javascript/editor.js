let tag_list = []
let selected
let input_keybord
let composition

// ブロックタイトルの入力がされた
document.getElementById("input-block-title").onchange = function()
{
    let element = document.getElementById("input-block-title");
    console.log(element.value);
    save_data()
}

// タグの追加ボタン
document.getElementById("button-add-tag").onclick = function()
{
    let element = document.getElementById("input-add-tag");
    tag_list.push(element.value);
    element.value = ""
    update_tag_list();
}

// タグの削除ボタン
document.getElementById("button-delete-tag").onclick = function()
{
    let element = document.getElementById("select-tag-list");
    tag_list.splice(element.value, 1);
    update_tag_list();
}

// タグリストの更新
function update_tag_list()
{
    let select = document.getElementById("select-tag-list");
    while(select.childElementCount != 0)
    {
        select.removeChild(select.firstChild)
    }
    for(let i = 0; i < tag_list.length; ++i)
    {
        let element = document.createElement("option")
        element.value = i
        element.textContent = tag_list[i]
        select.appendChild(element);
    }
    save_data()
}

function copy_text_style(one, two)
{
    one.style.fontSize = two.style.fontSize
    one.style.fontWeight = two.style.fontWeight
    one.style.color = two.style.color
}

// ラベルクリック時の処理
function edit_text()
{
    // 選択部分の更新
    selected = window.getSelection();
    
    // キーボード入力部の作成
    input_keybord = document.createElement("input")
    input_keybord.type = "text"
    input_keybord.classList.add("editor-input")
    event.target.after(input_keybord)

    // 文字が変わった時
    input_keybord.oninput = function(event)
    {
        if(!composition)
        {
            // 変換前でないなら前のラベルに文字追加
            if(event.target.previousElementSibling == null)
            {
                // ラベルがないなら作成する
                let element = document.createElement("a")
                element.onclick = edit_text
                event.target.before(element)
            }

            event.target.previousElementSibling.textContent +=  event.target.value
            event.target.value = ""
            event.target.style.width = "5px"
        }
        else
        {
            // 変換前ならinputの長さを調節
            // spanを生成し配置することで文字の横幅を得る
            let span = document.createElement('span');

            // 画面外に折り返しなしで配置
            span.style.position = 'absolute';
            span.style.top = '-1000px';
            span.style.left = '-1000px';

            span.style.whiteSpace = 'nowrap';
            span.innerHTML = event.target.value;
            document.body.appendChild(span);

            // 横幅を取得
            width = span.clientWidth;
            event.target.style.width = (width + 4) + "px";

            // 終わったら削除
            span.parentElement.removeChild(span);
        }
    }

    // 変換前であることを記録
    input_keybord.addEventListener('compositionstart', function(){
        composition = true
    });
    // 変換完了時　記録とラベルに反映
    input_keybord.addEventListener('compositionend', function(event){
        composition = false
        
        //反映しラベルに追加
        if(event.target.previousElementSibling == null)
        {
            let element = document.createElement("a")
            event.target.before(element)
        }

        event.target.previousElementSibling.textContent +=  event.target.value
        event.target.value = ""
        event.target.style.width = "5px"
    });

    // カーソルが外れた時　ラベルの合成とinputの削除
    input_keybord.onblur = function()
    {
        synthesis_text(input_keybord.parentElement)
        input_keybord.parentElement.removeChild(input_keybord);
        // 入力していないことを記録
        input_keybord = undefined
        save_data()
    }

    // 前方ラベルの文字を選択部分より前のみに
    let str = selected.focusNode.textContent
    let points = [Math.min(selected.focusOffset, selected.anchorOffset), Math.max(selected.focusOffset, selected.anchorOffset)]
    event.target.textContent = str.slice(0, points[0])
    // 後方ラベルを作成し選択部分以降を表示
    let text_after = document.createElement("a")
    text_after.textContent = str.slice(points[1], str.length)
    copy_text_style(text_after, event.target)
    text_after.onclick = edit_text
    input_keybord.after(text_after) 
    // input内に選択した文字を入れ、フォーカスとinput内全選択
    input_keybord.value = str.slice(...points);
    input_keybord.focus();
    input_keybord.setSelectionRange(0, input_keybord.value.length);
    
    //初期のinputの長さを調整
    if(input_keybord.value.length != 0)
    {
        // 変換前ならinputの長さを調節
        // spanを生成し配置することで文字の横幅を得る
        let span = document.createElement('span');

        // 画面外に折り返しなしで配置
        span.style.position = 'absolute';
        span.style.top = '-1000px';
        span.style.left = '-1000px';

        span.style.whiteSpace = 'nowrap';
        span.innerHTML = input_keybord.value;
        document.body.appendChild(span);

        // 横幅を取得
        width = span.clientWidth;
        input_keybord.style.width = (width + 4) + "px";

        // 終わったら削除
        span.parentElement.removeChild(span);
    }
    else
    {
        input_keybord.style.width = "5px";
    }
}

// 行のラベルのない部分をクリックした時
function click_row_text()
{
    // その行の一番最後のラベルの一番後ろにカーソルを合わせる
    let parent = event.target
    let i = parent.childElementCount - 1
    select = new Range();
    // 後ろから前に生きつつ<a>を探す
    while(0 <= i)
    {
        if(parent.children[i].tagName == "A")
        {
            // <a>の最後尾にカーソルを合わせクリックする
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

function reset_editor()
{
    let input_block_title = document.getElementById("input-block-title");
    input_block_title.value = ""

    let select_tag_list = document.getElementById("select-tag-list")
    while(select_tag_list.childElementCount != 0)
    {
        select_tag_list.removeChild(select_tag_list.firstChild)
    }
    
    let editor_content_list = document.getElementById("editor-content-list")
    while(editor_content_list.childElementCount != 0)
    {
        editor_content_list.removeChild(editor_content_list.firstChild)
    }
}

function import_data(data)
{
    reset_editor()
    let title = document.getElementById("input-block-title")
    title.value = data[3]
    
    tag_list = data[4]
    update_tag_list()

    let i = 5
    while(i < data.length)
    {
        if(data[i][0] != "<")
        {
            i++
            continue
        }
        const status = data[i].slice(1, data[i].indexOf(">")).split(",")
        const content = data[i].slice(data[i].indexOf(">") + 1)
        if(status[0] == "text")
        {
            make_row_text(content, status.slice(1))
        }
        i++;
    }
}

function export_data()
{
    let data = []
    data.push(document.getElementById("input-block-title").value)
    data.push(tag_list)

    if(input_keybord != undefined)
    {
        input_keybord.blur()
    }
    contents = document.getElementById("editor-content-list").children
    for(let i = 0; i < contents.length; i++)
    {
        synthesis_text(contents[i])
        let row = contents[i]
        for(element of row.children)
        {
            if(element.tagName == "A")
            {
                let head = "<text"
                if(element.style.fontSize != "")
                {
                    head += ",size="
                    head += element.style.fontSize
                }
                if(element.style.fontWeight == "bold")
                {
                    head += ",bold"
                }
                head += ">"
                data.push(head + element.textContent)
            }
        }
    }
    return data
}

function make_row_text(str, styles)
{
    let editor_content_list = document.getElementById("editor-content-list")
    let element_li = document.createElement("li")
    element_li.onclick = click_row_text
    element_li.classList.add("editor-row")
    editor_content_list.appendChild(element_li)

    let element_a = document.createElement("a")
    element_a.textContent = str
    element_a.onclick = edit_text
    for(const style of styles)
    {
        if(style.indexOf("size=") == 0)
        {
            element_a.style.fontSize = style.slice(style.indexOf("=") + 1)
        }
        else if(style == "bold")
        {
            element_a.style.fontWeight = "bold"
        }
    }
    element_li.appendChild(element_a)

    let element_br = document.createElement("br")
    element_li.appendChild(element_br)
}

//ラベルの合成
function synthesis_text(element_li)
{
    // 行のコンテンツを1つずつ見て以下の処理
    // <a> 内容をまとめながら削除
    // <br> 削除
    let i = 0
    let str = ""
    let last = -1
    while(i < element_li.childElementCount)
    {
        if(element_li.children[i].tagName == "A")
        {
            if(element_li.children[i].textContent == "")
            {
                element_li.removeChild(element_li.children[i])
            }
            else if(last != -1 && element_li.children[last].style.fontSize == element_li.children[i].style.fontSize && element_li.children[last].style.fontWeight == element_li.children[i].style.fontWeight && element_li.children[last].style.color == element_li.children[i].style.color)
            {
                element_li.children[last].textContent += element_li.children[i].textContent
                element_li.removeChild(element_li.children[i])
            }
            else
            {
                last = i ++
            }
        }
        else if(element_li.children[i].tagName == "BR")
        {
            element_li.removeChild(element_li.children[i])
        }
        else
        {
            i++
        }
    }
    // 行の最後に改行を追加
    let element_br = document.createElement("br")
    element_li.appendChild(element_br)
}

$(document).keydown(function(event){
    // クリックされたキーのコード
    var keyCode = event.keyCode;
    // Ctrlキーがクリックされたか (true or false)
    var ctrlClick = event.ctrlKey;
    // Altキーがクリックされたか (true or false)
    var altClick = event.altKey;
    
    // キーを制御する
    if(keyCode == 8)
    {
        // 削除（back sapace）
        if(input_keybord != undefined && input_keybord.value == "")
        {
            // 入力中でかつ、inputに文字が入っていない時
            if(input_keybord.previousElementSibling == null || input_keybord.previousElementSibling.textContent == "")
            {
                if(input_keybord.parentElement.previousElementSibling != null)
                {
                    //　前方にラベルがなく　前の行があるなら前の行と合成する
                    before_li = input_keybord.parentElement.previousElementSibling
                    //　前の行の<br>を削除する
                    before_li.removeChild(before_li.children[before_li.childElementCount - 1])
                    //　現在の行の文字数を数えておく
                    index = input_keybord.nextElementSibling.textContent.length
                    // 空のラベルは削除
                    if(input_keybord.previousElementSibling != null)
                    {
                        input_keybord.parentElement.removeChild(input_keybord.previousElementSibling)
                    }
                    //前の行に現在の行のラベルを追加し、現在の行を消す
                    before_li.appendChild(input_keybord.nextElementSibling);
                    input_keybord.parentElement.parentElement.removeChild(input_keybord.parentElement)
                    synthesis_text(before_li)
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
            }
            else
            {
                //前方にテキストがある場合　前のラベルの文字を1つ消す
                str = input_keybord.previousElementSibling.textContent;
                if(str.slice(0,str.length - 1) != "")
                {
                    input_keybord.previousElementSibling.textContent = str.slice(0,str.length - 1);
                }
                else
                {
                    //　ラベルの文字数が0になるならラベルを削除
                    input_keybord.parentElement.removeChild(input_keybord.previousElementSibling);
                }
            }
        }
    }
    else if(keyCode == 46)
    {
        // 削除(Delete)
        if(input_keybord != undefined && input_keybord.value == "")
        {
            // 入力中でかつ、inputに文字が入っていない時
            if(input_keybord.nextElementSibling == null || input_keybord.nextElementSibling.textContent == "")
            {
                if(input_keybord.parentElement.nextElementSibling != null)
                {
                    // 後ろにラベルがない、または空のラベルの場合　改行を削除する
                    // 後ろの行の取得、現在の行の<br>の削除、カーソルの位置を記憶、空のラベルは削除
                    let after_li = input_keybord.parentElement.nextElementSibling
                    input_keybord.parentElement.removeChild(input_keybord.parentElement.children[input_keybord.parentElement.childElementCount - 1])
                    let index = input_keybord.previousElementSibling.textContent.length
                    if(input_keybord.nextElementSibling != null)
                    {
                        input_keybord.parentElement.removeChild(input_keybord.nextElementSibling)
                    }
                    // 後ろの行の要素を現在の行に移していく
                    let i = 0
                    while(after_li.childElementCount > i)
                    {
                        if(after_li.children[i].tagName == "input")
                        {
                            i++
                        }
                        else
                        {
                            input_keybord.parentElement.appendChild(after_li.children[i]);
                        }
                    }
                    after_li.parentElement.removeChild(after_li)
                    // ラベルの要素を合成
                    let element_li = input_keybord.parentElement
                    input_keybord.blur()
                    synthesis_text(element_li)
                    //新しい行で入力状態にする
                    let element_a = element_li.children[0]
                    let select = new Range();
                    if(element_a.firstChild != null)
                    {
                        select.setStart(element_a.firstChild, index)
                        select.setEnd(element_a.firstChild, index)
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
            }
            else
            {
                //後方にテキストがあるなら1文字削除
                let str = input_keybord.nextElementSibling.textContent;
                if(str.length >= 2)
                {
                    input_keybord.nextElementSibling.textContent = str.slice(1,str.length);
                }
                else
                {
                    input_keybord.parentElement.removeChild(input_keybord.nextElementSibling);
                }
            }
        }
    }
    else if(keyCode == 13)
    {
        // 改行(Enter)
        if(!composition && input_keybord != undefined)
        {
            // 変換中でない　＋　入力中
            if(input_keybord.nextElementSibling != null)
            {
                // 後ろに要素がある
                // 新しい行を作成
                let str = input_keybord.nextElementSibling.textContent
                let element_li = document.createElement("li")
                element_li.onclick = click_row_text
                element_li.classList.add("editor-row")
                input_keybord.parentElement.after(element_li)
                // 後ろの要素を次の行に引き継ぐ
                let element_a = document.createElement("a")
                element_a.textContent = str
                element_a.onclick = edit_text
                element_li.appendChild(element_a)
                // 元の行の要らばい部分を削除
                input_keybord.parentElement.removeChild(input_keybord.nextElementSibling)
                input_keybord.blur()

                // 新しい行で入力状態にする
                let select = new Range();
                select.setStart(element_a, 0)
                select.setEnd(element_a, 0)
                document.getSelection().removeAllRanges();
                document.getSelection().addRange(select);

                element_a.click();
            }
            else
            {
                // 後ろに要素がない場合
                // 新しい行を作る
                let element_li = document.createElement("li")
                element_li.onclick = click_row_text
                element_li.classList.add("editor-row")
                input_keybord.parentElement.after(element_li)
                
                let element_a = document.createElement("a")
                element_a.onclick = edit_text
                element_li.appendChild(element_a)

                input_keybord.blur()
                
                //新しい行で入力状態にする
                let select = new Range();
                select.setStart(element_a, 0)
                select.setEnd(element_a, 0)
                document.getSelection().removeAllRanges();
                document.getSelection().addRange(select);

                element_a.click();
            }
        }
    }
    else if(keyCode == 37)
    {
        // ←（左キー）
        if(input_keybord != undefined && input_keybord.value == "")
        {
            // 入力中でかつ、inputに文字が入っていない時
            if(input_keybord.previousElementSibling == null || input_keybord.previousElementSibling.textContent == "")
            {
                if(input_keybord.parentElement.previousElementSibling != null)
                {
                    // 前に移動できる要素がなく、前の行があるならば前の行の末尾に移る
                    let destination = input_keybord.parentElement.previousElementSibling
                    input_keybord.blur()
                    destination.click()
                }
            }
            else
            {
                // 前に1つ進む
                // 移動先の確認
                let index = input_keybord.previousElementSibling.textContent.length - 1
                let destination = input_keybord.parentElement
                input_keybord.blur()
                // 移動
                let select = new Range();
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
        // →（右キー）
        if(input_keybord != undefined && input_keybord.value == "")
        {
            // 入力中でかつ、inputに文字が入っていない時
            if(input_keybord.nextElementSibling == null || input_keybord.nextElementSibling.textContent == "")
            {
                // 後ろに移動先の要素がない場合
                if(input_keybord.parentElement.nextElementSibling != null)
                {
                    // 後ろに行が存在するなら後ろの行の先頭に移動
                    let destination = input_keybord.parentElement.nextElementSibling
                    input_keybord.blur()
                    let select = new Range();
                    select.setStart(destination.children[0], 0)
                    select.setEnd(destination.children[0], 0)
                    document.getSelection().removeAllRanges();
                    document.getSelection().addRange(select);
                    destination.children[0].click()
                }
            }
            else
            {
                // 後ろに要素があるなら1つ後ろに移動
                let index = 0
                if(input_keybord.previousElementSibling == null)
                {
                    index = 1
                }
                else
                {
                    index = input_keybord.previousElementSibling.textContent.length + 1
                }
                let destination = input_keybord.parentElement
                input_keybord.blur()

                let select = new Range();
                select.setStart(destination.children[0].firstChild, index)
                select.setEnd(destination.children[0].firstChild, index)
                document.getSelection().removeAllRanges();
                document.getSelection().addRange(select);
                destination.children[0].click()
            }
        }
    }
    else if(keyCode == 38)
    {
        // ↑（上キー）
        if(input_keybord != undefined && input_keybord.value == "")
        {
            // 入力中でかつ、inputに文字が入っていない時
            if(input_keybord.parentElement.previousElementSibling != null)
            {
                // 上に要素があるならば上に移動
                // 移動先の設定と元の行の整理
                let destination = input_keybord.parentElement.previousElementSibling
                let index = input_keybord.previousElementSibling.textContent.length
                input_keybord.blur()
                // 移動
                let select = new Range();
                if(destination.children[0].firstChild == null)
                {
                    select.setStart(destination.children[0], 0)
                    select.setEnd(destination.children[0], 0)
                }
                else
                {
                    // 出来る限り元と同じX軸(文字数)を残す
                    select.setStart(destination.children[0].firstChild, Math.min(index, destination.children[0].firstChild.length))
                    select.setEnd(destination.children[0].firstChild,  Math.min(index, destination.children[0].firstChild.length))
                }
                document.getSelection().removeAllRanges();
                document.getSelection().addRange(select);
                destination.children[0].click()
            }
        }
    }
    else if(keyCode == 40)
    {
        // ↓（下キー）
        if(input_keybord != undefined && input_keybord.value == "")
        {
            // 入力中でかつ、inputに文字が入っていない時
            if(input_keybord.parentElement.nextElementSibling != null)
            {
                // 下に行があるなら移動
                // 移動先の設定と元の行の整理
                let destination = input_keybord.parentElement.nextElementSibling
                let index = input_keybord.previousElementSibling.textContent.length
                input_keybord.blur()
                // 移動
                let select = new Range();
                if(destination.children[0].firstChild == null)
                {
                    select.setStart(destination.children[0], 0)
                    select.setEnd(destination.children[0], 0)
                }
                else
                {
                    // 出来る限り元と同じX軸(文字数)を残す
                    select.setStart(destination.children[0].firstChild, Math.min(index, destination.children[0].firstChild.length))
                    select.setEnd(destination.children[0].firstChild,  Math.min(index, destination.children[0].firstChild.length))
                }
                document.getSelection().removeAllRanges();
                document.getSelection().addRange(select);
                destination.children[0].click()
            }
        }
    }
});