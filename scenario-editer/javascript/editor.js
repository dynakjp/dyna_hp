let tag_list = []
let selected = window.getSelection()
let input_keybord = undefined
let composition
let cursor

// ブロックタイトルの入力がされた
document.getElementById("input-block-title").onchange = function()
{
    let element = document.getElementById("input-block-title");
    console.log(element.value);
    save_data()
    make_tree()
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

// 文字の装飾ボタン
document.getElementById("button-font-small").onclick = function()
{
    edit_select_text(function(element)
    {
        const plus = -2
        let font_size = element.style.fontSize
        if(font_size == "")
        {
            font_size = window.getComputedStyle(document.documentElement).getPropertyValue('font-size')
        }
        font_size = parseFloat(font_size)
        if(font_size + plus > 0)
        {
            element.style.fontSize = String(font_size + plus) + "px"
        }
    });
}

document.getElementById("button-font-big").onclick = function()
{
    edit_select_text(function(element)
    {
        const plus = 2
        let font_size = element.style.fontSize
        if(font_size == "")
        {
            font_size = window.getComputedStyle(document.documentElement).getPropertyValue('font-size')
        }
        font_size = parseFloat(font_size)
        if(font_size + plus > 0)
        {
            element.style.fontSize = String(font_size + plus) + "px"
        }
    });
}

document.getElementById("button-font-normal").onclick = function()
{
    edit_select_text(function(element){element.style.fontWeight = "normal";});
}

document.getElementById("button-font-bold").onclick = function()
{
    edit_select_text(function(element){element.style.fontWeight = "bold";});
} 


function edit_select_text(func)
{
    const range = selected.getRangeAt(0)
    if(document.getElementById("editor-content").contains(range.startContainer) && document.getElementById("editor-content").contains(selected.focusNode))
    {
        if(selected.isCollapsed)
        {
            // 文字が選択されていない
            console.log("edit_select_text: no select")
        }
        else if(range.startContainer == range.endContainer && range.startContainer.parentElement.tagName == "A")
        {
            // 1つの要素内を選択
            // 選択外(前方)の作成
            const text = range.startContainer.parentElement.textContent
            let before_element = make_label(text.slice(0, range.startOffset))
            copy_text_style(before_element, range.startContainer.parentElement)
            range.startContainer.parentElement.before(before_element)

            // 選択された部分の作成
            let select_element = make_label(text.slice(range.startOffset, range.endOffset))
            copy_text_style(select_element, range.startContainer.parentElement)
            func(select_element)
            range.startContainer.parentElement.before(select_element)
            
            // 選択外(後方)の作成
            let after_element = make_label(text.slice(range.endOffset))
            copy_text_style(after_element, range.startContainer.parentElement)
            range.startContainer.parentElement.before(after_element)
            
            // 元の要素の削除
            range.startContainer.parentElement.parentElement.removeChild(range.startContainer.parentElement)
            // 選択状態再決定
            let select = new Range()
            select.setStart(select_element.firstChild, 0)
            select.setEnd(select_element.firstChild, select_element.firstChild.length)
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(select);
        }
        else if(range.startContainer.parentElement.parentElement == selected.focusNode.parentElement.parentElement)
        {
            // 1行の内で選択されている
            let select = new Range()
            
            // 最初の要素の編集
            let element = range.startContainer.parentElement
            if(element.tagName == "A")
            {
                // ラベルなら選択部分を分けて編集
                const text = element.textContent.slice(range.startOffset)
                element.textContent = element.textContent.slice(0, range.startOffset)

                let select_element = make_label(text)
                copy_text_style(select_element, element)
                func(select_element)
                element.after(select_element)

                select.setStart(select_element.firstChild, 0)
                element = select_element.nextElementSibling
            }

            // 終わりの要素までたどっていって、テキストなら編集する
            while(element != range.endContainer.parentElement)
            {
                if(element.tagName == "A")
                {
                    func(element)
                }
                element = element.nextElementSibling
            }
            // 終わりの要素を編集
            if(element.tagName == "A")
            {
                // ラベルなら選択部分を分けて編集
                const text = element.textContent.slice(0, range.endOffset)
                element.textContent = element.textContent.slice(range.endOffset)

                let select_element = make_label(text)
                copy_text_style(select_element, element)
                func(select_element)
                element.before(select_element)
                select.setEnd(select_element.firstChild, select_element.firstChild.length)
            }
            // 選択状態の変更
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(select);
        }
        else
        {
            // 2以上の行を選択している
            let select = new Range()
            
            // 最初の要素を編集
            let element = range.startContainer.parentElement
            if(element.tagName == "A")
            {
                // 選択部分を分割し編集
                const text = element.textContent.slice(range.startOffset)
                element.textContent = element.textContent.slice(0, range.startOffset)

                let select_element = make_label(text)
                copy_text_style(select_element, element)
                func(select_element)
                element.after(select_element)

                select.setStart(select_element.firstChild, 0)
                element = select_element.nextElementSibling
            }
            else if(range.startContainer.tagName == "LI")
            {
                // 要素が行なら選択位置を変更
                element = range.startContainer.children[range.startContainer.childElementCount - 1]
            }

            // 行の端まで文字をたどっていく
            while(element.tagName != "BR")
            {
                if(element.tagName == "A")
                {
                    func(element)
                }
                element = element.nextElementSibling
            }

            // 最後の要素を取得しておき、そこまでの行を編集していく
            element = element.parentElement.nextElementSibling
            let end = range.endContainer.parentElement
            if(range.endContainer.tagName == "LI")
            {
                end = range.endContainer.children[0]
            }
            while(element != end.parentElement)
            {
                for(let ele of element.children)
                {
                    if(ele.tagName == "A")
                    {
                        func(ele)
                    }
                }
                element = element.nextElementSibling
            }

            // 最後の行の最初から最後の要素まで編集をしていく
            element = element.children[0]
            while(element != end)
            {
                if(element.tagName == "A")
                {
                    func(element)
                }
                element = element.nextElementSibling
            }
            if(element.tagName == "A")
            {
                // 最後の要素を選択部分を分割し編集する
                const text = element.textContent.slice(0, range.endOffset)
                element.textContent = element.textContent.slice(range.endOffset)

                let select_element = make_label(text)
                copy_text_style(select_element, element)
                func(select_element)
                element.before(select_element)
                select.setEnd(select_element.firstChild, select_element.firstChild.length)
            }
            // 選択部分を変更
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(select);
        }
    }
}

function copy_text_style(one, two)
{
    // 現状扱うスタイル　(サイズ、太さ)
    one.style.fontSize = two.style.fontSize
    one.style.fontWeight = two.style.fontWeight
}

function text_size(element, select)
{
    // spanを生成し配置することで文字の横幅を得る
    let span = document.createElement('span');

    // 画面外に折り返しなしで配置
    span.style.position = 'absolute';
    span.style.top = '-1000px';
    span.style.left = '-1000px';
    copy_text_style(span ,element)

    // 範囲選択をしていない場合
    if(select == -1 || select == undefined)
    {
        select = element.textContent.length
    }
    span.style.maxWidth = element.getBoundingClientRect().width;
    span.innerHTML = element.textContent.slice(0, select);
    document.body.appendChild(span);

    // 終わったら削除　幅、高さを返す
    const width = span.clientWidth
    const height = span.clientHeight
    span.parentElement.removeChild(span);
    return [width, height]
}

function edit_text()
{
    // 選択部分の更新
    selected = window.getSelection();
    if(selected.isCollapsed)
    {
        // 範囲選択がされていない場合、入力状態へ
        // キーボード入力部の作成
        input_keybord = document.createElement("input")
        input_keybord.type = "text"
        input_keybord.classList.add("editor-input")
        event.target.after(input_keybord)
        copy_text_style(input_keybord, event.target)

        // 文字が変わった時
        input_keybord.oninput = load_input_keybord
        function load_input_keybord()
        {
            if(input_keybord.value == "")
            {
                // 文字が何も入っていないなら何もしない
                return
            }
            if(!composition)
            {
                // コピペなどでスペースを含む文章を渡された場合
                // inputは改行をスペースとして受け取るのでやや不本意だがスペースを改行として考えて変換する
                const datas = input_keybord.value.split(" ")
                if(datas.length > 1 && input_keybord.value != " ")
                {
                    // 1行目入力
                    let element = make_label(datas[0])
                    copy_text_style(element, input_keybord)
                    input_keybord.before(element)
                    element = input_keybord
                    let element_li
                    // 2行目以降は行作成　テキスト作成　改行作成
                    for(const data of datas.splice(1))
                    {
                        element_li = document.createElement("li")
                        element_li.onclick = click_row_text
                        element_li.classList.add("editor-row")
                        element.parentElement.after(element_li)
                        element = element.nextElementSibling
                        while(element.tagName != "BR")
                        {
                            const target = element
                            element = element.nextElementSibling
                            element_li.appendChild(target)
                        }
                        element_li.appendChild(document.createElement("br"))
                        synthesis_text(element_li.previousElementSibling)

                        element = make_label(data)
                        copy_text_style(element, input_keybord)
                        element_li.children[0].before(element)
                    }
                    // インプットの内容を消して、終了し、最後に作った要素にカーソルを持ってくる
                    input_keybord.value = ""
                    input_keybord.blur()

                    select.setStart(element.firstChild, element.firstChild.length)
                    select.setEnd(element.firstChild, element.firstChild.length)
                    document.getSelection().removeAllRanges();
                    document.getSelection().addRange(select);
                    element.click()
                    return
                }

                // 変換前でないなら前のラベルに文字追加
                if(input_keybord.previousElementSibling == null)
                {
                    // ラベルがないなら作成する
                    let element = make_label("")
                    copy_text_style(element, input_keybord)
                    input_keybord.before(element)
                }

                input_keybord.previousElementSibling.textContent +=  input_keybord.value
                input_keybord.value = ""
                input_keybord.style.width = "5px"
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
                copy_text_style(span ,input_keybord)

                span.style.whiteSpace = 'nowrap';
                span.innerHTML = input_keybord.value;
                document.body.appendChild(span);

                // 横幅を取得
                width = span.clientWidth;
                input_keybord.style.width = (width + 4) + "px";

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
            window.setTimeout(load_input_keybord,1)
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
        let str = event.target.textContent
        let point = selected.focusOffset
        if(event.target != selected.focusNode.parentElement)
        {
            point = 0
        }
        event.target.textContent = str.slice(0, point)
        // 後方ラベルを作成し選択部分以降を表示
        let text_after = make_label(str.slice(point))
        copy_text_style(text_after, event.target)
        input_keybord.after(text_after) 
        // input内に選択した文字を入れ、フォーカスとinput内全選択
        input_keybord.focus();
        input_keybord.setSelectionRange(0, 0);
        
        //初期のinputの長さを調整
        input_keybord.style.width = "5px";
    }
}

function click_row_text()
{
    if(selected.isCollapsed)
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
}

function reset_editor()
{
    // タイトルのリセット
    let input_block_title = document.getElementById("input-block-title");
    input_block_title.value = ""

    // タグリストの更新
    let select_tag_list = document.getElementById("select-tag-list")
    while(select_tag_list.childElementCount != 0)
    {
        select_tag_list.removeChild(select_tag_list.firstChild)
    }
    
    // コンテンツの削除
    let editor_content_list = document.getElementById("editor-content-list")
    while(editor_content_list.childElementCount != 0)
    {
        editor_content_list.removeChild(editor_content_list.firstChild)
    }
}

function import_data(data)
{
    reset_editor()
    // コンテンツ以外の読み込み
    let title = document.getElementById("input-block-title")
    title.value = data[3]
    
    tag_list = data[4]
    update_tag_list()

    let editor_content_list = document.getElementById("editor-content-list")
    let element_li = document.createElement("li")
    element_li.onclick = click_row_text
    element_li.classList.add("editor-row")

    // コンテンツの読み込み
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
            element_li.appendChild(make_label(content, status.slice(1)))
        }
        else if(status[0] == "break")
        {
            const element_br = document.createElement("br")
            element_li.appendChild(element_br)
            editor_content_list.appendChild(element_li)
            element_li = document.createElement("li")
            element_li.onclick = click_row_text
            element_li.classList.add("editor-row")
        }
        i++;
    }

    // 最後に改行がなければ
    if(element_li.childElementCount > 0)
    {
        const element_br = document.createElement("br")
        element_li.appendChild(element_br)
        editor_content_list.appendChild(element_li)
    }
}

function export_data()
{
    // コンテンツ以外を記録
    let data = []
    data.push(document.getElementById("input-block-title").value)
    data.push(tag_list)

    // 入力中の終了
    if(input_keybord != undefined)
    {
        input_keybord.blur()
    }
    // コンテンツを記録
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
            else if(element.tagName == "BR")
            {
                data.push("<break>")
            }
        }
    }
    return data
}

function make_label(str, styles)
{
    // 文字とスタイルを入れるとテキストを作成する
    let element_a = document.createElement("a")
    element_a.textContent = str
    element_a.onclick = edit_text
    // スタイルはある場合のみ処理(主にデータインポート時)
    if(styles != undefined)
    {
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
    }
    return element_a
}

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
                // 空白のテキストは行がそれしかない場合以外は削除
                let count_a = 0
                for(const element of element_li.children)
                {
                    if(element.tagName == "A")
                    {
                        count_a += 1
                    }
                }
                console.log(count_a)
                if(1 < count_a)
                {
                    element_li.removeChild(element_li.children[i])
                }
                else
                {
                    i ++
                }
            }
            else if(last != -1 && element_li.children[last].style.fontSize == element_li.children[i].style.fontSize && element_li.children[last].style.fontWeight == element_li.children[i].style.fontWeight && element_li.children[last].style.color == element_li.children[i].style.color)
            {
                // 最後のラベルとスタイルが同じなら合成する
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

function delete_select_text(select)
{
    const range = select.getRangeAt(0)
    if(!(document.getElementById("editor-content").contains(range.startContainer) && document.getElementById("editor-content").contains(selected.focusNode)))
    {
        // 削除範囲がコンテンツ外
        return
    }
    
    if(range.startContainer.parentElement == range.endContainer.parentElement && range.startContainer.tagName != "LI")
    {
        // 1つのテキスト内
        let element_a = range.startContainer.parentElement
        element_a.textContent = element_a.textContent.slice(0, range.startOffset) + element_a.textContent.slice(range.endOffset)
    }
    else
    {
        // 最初の要素の選択部分を削除
        let element = range.startContainer.parentElement
        if(element.tagName == "A")
        {
            element.textContent = element.textContent.slice(0, range.startOffset)
            element = element.nextElementSibling
        }
        else if(range.startContainer.tagName == "LI")
        {
            element = range.startContainer.children[range.startContainer.childElementCount - 1]
        }

        // 行末まで削除していく
        while(element.tagName != "BR")
        {
            element = element.nextElementSibling
            element.parentElement.removeChild(element.previousElementSibling)
        }

        // 最後の要素の行の前まで削除していく
        element = element.parentElement.nextElementSibling
        let end = range.endContainer.parentElement
        if(range.endContainer.tagName == "LI")
        {
            end = range.endContainer.children[0]
        }
        while(element != end.parentElement)
        {
            element = element.nextElementSibling
            element.parentElement.removeChild(element.previousElementSibling)
        }

        // 最後の要素まで削除していく
        element = element.children[0]
        while(element != end)
        {
            element = element.nextElementSibling
            element.parentElement.removeChild(element.previousElementSibling)
        }
        element.textContent = element.textContent.slice(range.endOffset)
        
        // 選択位置の調整と整形
        element = element.parentElement.previousElementSibling
        synthesis_text(element)
        element.removeChild(element.children[element.childElementCount - 1])
        cursor_element = element.children[element.childElementCount - 1]
        cursor_parent = cursor_element.parentElement
        cursor_offset = element.children[element.childElementCount - 1].textContent.length

        element = element.nextElementSibling
        for(let ele of element.children)
        {
            element.previousElementSibling.appendChild(ele)
        }
        element.parentElement.removeChild(element)

        synthesis_text(cursor_element.parentElement)
        let select = new Range();
        console.log(cursor_element,cursor_offset)
        if(cursor_parent.contains(cursor_element) == false && cursor_parent.firstChild.firstChild == null)
        {
            console.log(cursor_parent, cursor_parent.onclick)
            document.getSelection().removeAllRanges();
            cursor_parent.click()
        }
        else
        {
            if(cursor_parent.contains(cursor_element) == false)
            {
                cursor_element = cursor_parent.firstChild
                cursor_offset = 0
            }
            select.setStart(cursor_element.firstChild, cursor_offset)
            select.setEnd(cursor_element.firstChild, cursor_offset)
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(select);
    
            cursor_element.click();
        }
    }
}

$(document).keydown(function(event){
    // クリックされたキーのコード
    var keyCode = event.keyCode;
    // Ctrlキーがクリックされたか (true or false)
    var ctrlClick = event.ctrlKey;
    // Altキーがクリックされたか (true or false)
    var altClick = event.altKey;
    
    selected = window.getSelection();
    
    // キーを制御する
    if(input_keybord == undefined && selected.isCollapsed == false)
    {
        // 範囲選択されていてinput中でない
        if(!ctrlClick && !altClick)
        {
            // 通常文字入力、削除、スペースは範囲削除
            if(48 <= keyCode && keyCode <= 90)
            {
                delete_select_text(selected)
            }
            else if(keyCode == 8 || keyCode == 46)
            {
                delete_select_text(selected)
            }
            else if(keyCode == 32)
            {
                delete_select_text(selected)
            }
        }
    }
    else if(input_keybord != undefined && !composition)
    {
        if(keyCode == 8)
        {
            // 削除（back sapace）
            // 入力中でかつ、inputに文字が入っていない時
            if(input_keybord.previousElementSibling == null || input_keybord.previousElementSibling.textContent == "")
            {
                if(input_keybord.parentElement.previousElementSibling != null)
                {
                    //　前方にラベルがなく　前の行があるなら前の行と合成する
                    let before_li = input_keybord.parentElement.previousElementSibling
                    //　前の行の<br>を削除する
                    before_li.removeChild(before_li.children[before_li.childElementCount - 1])
                    //　クリック時のためのデータ収集
                    let cursor_element = before_li.children[before_li.childElementCount - 1]
                    let cursor_offset = before_li.children[before_li.childElementCount - 1].textContent.length
                    // ラベルを一度統合
                    input_keybord.blur()
                    //前の行に現在の行のラベルを追加する
                    let element = before_li.nextElementSibling.children[0]
                    while(element != undefined)
                    {
                        before_li.appendChild(element)
                        element = element.nextElementSibling
                    }
                    synthesis_text(before_li)
                    before_li.parentElement.removeChild(before_li.nextElementSibling)
                    //新しい行で入力状態にする
                    element_a = before_li.children[0]
                    select = new Range();
                    if(cursor_element != undefined && cursor_element.textContent != "")
                    {
                        select.setStart(cursor_element.firstChild, cursor_offset)
                        select.setEnd(cursor_element.firstChild, cursor_offset)
                        document.getSelection().removeAllRanges();
                        document.getSelection().addRange(select);
                        cursor_element.click();
                    }
                    else
                    {
                        select.setStart(before_li.children[0], 0)
                        select.setEnd(before_li.children[0], 0)
                        document.getSelection().removeAllRanges();
                        document.getSelection().addRange(select);
                        before_li.children[0].click();
                    }
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
        else if(keyCode == 46)
        {
            // 削除(Delete)
            // 入力中でかつ、inputに文字が入っていない時
            if(input_keybord.nextElementSibling == null || input_keybord.nextElementSibling.textContent == "")
            {
                if(input_keybord.parentElement.nextElementSibling != null)
                {
                    // 後ろにラベルがない、または空のラベルの場合　改行を削除する
                    // 後ろの行の取得、現在の行の<br>の削除、カーソルの位置を記憶、空のラベルは削除
                    let before_li = input_keybord.parentElement
                    input_keybord.blur()
                    before_li.removeChild(before_li.children[before_li.childElementCount - 1])
                    //　クリック時のためのデータ収集
                    let cursor_element = before_li.children[before_li.childElementCount - 1]
                    let cursor_offset = before_li.children[before_li.childElementCount - 1].textContent.length
                    //前の行に現在の行のラベルを追加する
                    let element = before_li.nextElementSibling.children[0]
                    while(element != undefined)
                    {
                        before_li.appendChild(element)
                        element = element.nextElementSibling
                    }
                    synthesis_text(before_li)
                    before_li.parentElement.removeChild(before_li.nextElementSibling)
                    //新しい行で入力状態にする
                    element_a = before_li.children[0]
                    select = new Range();
                    if(cursor_element != undefined && cursor_element.textContent != "")
                    {
                        select.setStart(cursor_element.firstChild, cursor_offset)
                        select.setEnd(cursor_element.firstChild, cursor_offset)
                        document.getSelection().removeAllRanges();
                        document.getSelection().addRange(select);
                        cursor_element.click();
                    }
                    else
                    {
                        select.setStart(before_li.children[0], 0)
                        select.setEnd(before_li.children[0], 0)
                        document.getSelection().removeAllRanges();
                        document.getSelection().addRange(select);
                        before_li.children[0].click();
                    }
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
        else if(keyCode == 13)
        {
            // 改行(Enter)
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
                let element = input_keybord.nextElementSibling
                while(element != undefined)
                {
                    const target = element
                    element = element.nextElementSibling
                    element_li.appendChild(target)
                }
                input_keybord.blur()

                // 新しい行で入力状態にする
                let select = new Range();
                select.setStart(element_li.children[0], 0)
                select.setEnd(element_li.children[0], 0)
                document.getSelection().removeAllRanges();
                document.getSelection().addRange(select);

                element_li.children[0].click();
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
                copy_text_style(element_a, input_keybord)
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
        else if(keyCode == 37)
        {
            // ←（左キー）// 入力中でかつ、inputに文字が入っていない時
            if((input_keybord.previousElementSibling == null && input_keybord == input_keybord.parentElement.children[0]) || (input_keybord.previousElementSibling == input_keybord.parentElement.children[0] && input_keybord.previousElementSibling.textContent == ""))
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
                let destination = input_keybord.previousElementSibling
                if(destination.textContent == "")
                {
                    destination = destination.previousElementSibling
                }
                let index = destination.textContent.length - 1
                input_keybord.blur()
                // 移動
                let select = new Range();
                select.setStart(destination.firstChild, index)
                select.setEnd(destination.firstChild, index)
                document.getSelection().removeAllRanges();
                document.getSelection().addRange(select);
                destination.click()
            }
        }
        else if(keyCode == 39)
        {
            // →（右キー）
            // 入力中でかつ、inputに文字が入っていない時
            if(input_keybord.nextElementSibling.tagName == "BR" || (input_keybord.nextElementSibling == input_keybord.parentElement.children[input_keybord.parentElement.childElementCount - 2] && input_keybord.nextElementSibling.textContent == ""))
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
                let destination = input_keybord.previousElementSibling
                if(input_keybord.nextElementSibling.textContent == "")
                {
                    // 同行で別ラベル
                    destination = input_keybord.nextElementSibling.nextElementSibling
                    index = 1
                    input_keybord.blur()
                }
                else if(destination == null)
                {
                    //前にラベルがない
                    index = 1
                    destination = input_keybord.nextElementSibling
                    input_keybord.blur()
                }
                else if(destination.textContent == "")
                {
                    // 行の最初
                    index = 1
                    destination = input_keybord.nextElementSibling
                    input_keybord.blur()
                }
                else
                {
                    // その他
                    index = destination.textContent.length + 1
                    input_keybord.blur()
                }

                
                // カーソルを移動する
                let select = new Range();
                select.setStart(destination.firstChild, index)
                select.setEnd(destination.firstChild, index)
                document.getSelection().removeAllRanges();
                document.getSelection().addRange(select);
                destination.click()
            }
        }
        else if(keyCode == 38)
        {
            // ↑（上キー）
            // 入力中でかつ、inputに文字が入っていない時
            if(input_keybord.parentElement.previousElementSibling != null)
            {
                // 上に要素があるならば上に移動
                // 移動先の設定
                let destination = input_keybord.parentElement.previousElementSibling
                // 元の位置のｘ軸を調べる
                let width = 0
                let element = input_keybord.previousElementSibling
                while(element != null)
                {
                    if(element.tagName == "A")
                    {
                        width += text_size(element)[0]
                    }
                    element = element.previousElementSibling
                }
                input_keybord.blur()
                // 移動
                let wid = 0
                let i = 0
                element = destination.children[0]
                while(element != null)
                {
                    // 同じ高さのエレメントを探す
                    if(element.tagName == "A")
                    {
                        if(width <= wid + text_size(element)[0])
                        {
                            //エレメント内の何文字目かを考える
                            while(width > wid + text_size(element, i)[0])
                            {
                                i ++
                            }
                            break
                        }
                        else
                        {
                            wid += text_size(element)[0]
                        }
                    }
                    element = element.nextElementSibling
                }
                if(element == null || element.firstChild == null)
                {
                    // 行の長さが満たないので末尾
                    destination.click()
                }
                else
                {
                    let select = new Range();
                    select.setStart(element.firstChild, i)
                    select.setEnd(element.firstChild, i)
                    document.getSelection().removeAllRanges();
                    document.getSelection().addRange(select);
                    element.click()
                }
            }
        }
        else if(keyCode == 40)
        {
            // ↓（下キー）
            // 入力中でかつ、inputに文字が入っていない時
            if(input_keybord.parentElement.nextElementSibling != null)
            {
                // 下に行があるなら移動
                // 移動先の設定
                let destination = input_keybord.parentElement.nextElementSibling
                // 元の位置のｘ軸を調べる
                let width = 0
                let element = input_keybord.previousElementSibling
                while(element != null)
                {
                    if(element.tagName == "A")
                    {
                        width += text_size(element)[0]
                    }
                    element = element.previousElementSibling
                }
                input_keybord.blur()
                // 移動
                let wid = 0
                let i = 0
                element = destination.children[0]
                while(element != null)
                {
                    // 同じ高さのエレメントを探す
                    if(element.tagName == "A")
                    {
                        if(width <= wid + text_size(element)[0])
                        {
                            //エレメント内の何文字目かを考える
                            while(width > wid + text_size(element, i)[0])
                            {
                                i ++
                            }
                            break
                        }
                        else
                        {
                            wid += text_size(element)[0]
                        }
                    }
                    element = element.nextElementSibling
                }
                if(element == null || element.firstChild == null)
                {
                    // 行の長さが満たないので末尾
                    destination.click()
                }
                else
                {
                    let select = new Range();
                    select.setStart(element.firstChild, i)
                    select.setEnd(element.firstChild, i)
                    document.getSelection().removeAllRanges();
                    document.getSelection().addRange(select);
                    element.click()
                }
            }
        }
    }
});