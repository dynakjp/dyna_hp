let file = ""
let data_array = []
let max_block_no = 0
let select_block_no = -1

function import_file()
{
    let file_array = file.split("\n")
    const file_status = file_array[0].split(",")
    document.getElementById("file-title").textContent = file_status[0]
    max_block_no = Number(file_status[1])
    let i = 1
    data_array = []
    while(i < file_array.length)
    {
        let data = []
        let data_status = file_array[i].split(",")
        data.push(Number(data_status[0]))
        data.push(Number(data_status[1]))
        data.push(data_status[2])
        data.push(data_status[3])
        i++
        data.push(file_array[i].split(","))
        i++
        while( i < file_array.length && file_array[i][0] == "<")
        {
            data.push(file_array[i])
            i++
        }
        data_array.push(data)
    }
    console.log("import")
}

function get_hierarchy(icon)
{
    return Number(icon.style.marginLeft.slice(0, icon.style.marginLeft.length -2)) / 10
}

function get_data(block_no)
{
    let i
    for(i = 0; i < data_array.length; i++)
    {
        if(block_no == data_array[i][0])
        {
            break
        }
    }
    if(i == data_array.length)
    {
        return undefined
    }
    return data_array[i]
}

function get_data_index(block_no)
{
    let i
    for(i = 0; i < data_array.length; i++)
    {
        if(block_no == data_array[i][0])
        {
            break
        }
    }
    if(i == data_array.length)
    {
        return undefined
    }
    return i
}

function save_data()
{
    let i
    for(i = 0; i < data_array.length; i++)
    {
        if(select_block_no == data_array[i][0])
        {
            break
        }
    }
    if(i == data_array.length)
    {
        console.log("dont select error!")
        return
    }

    let data = export_data()
    data.unshift(...data_array[i].slice(0, 3))
    data_array[i] = data
}

function reset_tree()
{
    let tree = document.getElementById("tree").children[0]
    while(tree.childElementCount > 0)
    {
        tree.removeChild(tree.children[0])
    }
}

function make_tree()
{
    //ツリーを取得　リセット
    let tree = document.getElementById("tree").children[0]
    reset_tree()
    for(let i = 0; i < data_array.length; i++)
    {
        let data = data_array[i]
        let element_li = document.createElement("li")
        let icon = document.createElement("a")
        let element_a = document.createElement("a")
        let block_no = document.createElement("a")

        icon.style.marginLeft = 10 * data[1] + "px"
        element_a.textContent = data[3]
        element_li.classList.add("can-push")
        block_no.textContent = data[0]
        block_no.style.display = "none"

        // アイコンは一定幅で中央ぞろえにする
        icon.style.display  = "inline-block"
        icon.style.width = "25px"
        icon.style.textAlign = "center"

        if(i + 1 < data_array.length && data[1] < data_array[i + 1][1])
        {
            // 子要素を持つなら展開用の関数を与える
            icon.textContent = "∨"
            icon.onclick = function(event){
                let own = event.target.parentElement
                const hierarchy = get_hierarchy(event.target)
                let element_li = own.nextElementSibling
                let display
                // 閉じるか開けるかを特定
                if(element_li != null && element_li.style.display == "none")
                {
                    display = "block"
                    own.children[0].textContent = "∨"
                }
                else
                {
                    display = "none"
                    own.children[0].textContent = "＞"
                }
                // 1つ下の階層の要素を表示する
                while(element_li != null && get_hierarchy(element_li.children[0]) > hierarchy)
                {
                    if(get_hierarchy(element_li.children[0]) == hierarchy + 1)
                    {
                        element_li.style.display = display
                        if(element_li.children[0].textContent == "∨")
                        {
                            element_li.children[0].textContent = "＞"
                        }
                    }
                    else if(display == "none")
                    {
                        element_li.style.display = "none"
                    }
                    element_li = element_li.nextElementSibling
                }
            }
        }
        else
        {
            icon.textContent = "・"
        }

        
        // treeタイトルを押すと右のエディタに内容を表示する
        element_a.onclick = function(event){
            save_data()
            let own = event.target.parentElement
            const block_no = Number(own.children[2].textContent)
            select_block_no = block_no
            const data = get_data(block_no)
            import_data(data)
        }

        element_li.draggable = "true"
        move_tree(element_li)

        element_li.appendChild(icon)
        element_li.appendChild(element_a)
        element_li.appendChild(block_no)
        tree.appendChild(element_li)
    }
}

function move_tree(element)
{
    element.style.boxSizing = "border-box"

    element.ondragstart = function (event) {
        console.log("tree drag start")
        event.dataTransfer.setData('text/plain', event.target.children[2].textContent);
    };
    
    element.ondragover = function (event) {
        event.preventDefault();
		let rect = this.getBoundingClientRect();
        let li = event.target
        while(li.tagName != "LI")
        {
            li = li.parentElement
        }
        let ul = document.getElementById("tree").children[0]
        for(let i = 0; i < ul.childElementCount; i++)
        {
            ul.children[i].style.border = '';
        }
        let index = 0
        if ((event.clientY - rect.top) < (this.clientHeight / 3)) 
        {
            this.style.borderTop = '2px solid blue';
        } 
        else if ((event.clientY - rect.top) < (this.clientHeight * 2 / 3)) 
        {
            this.style.border = '2px solid blue';
        } 
        else 
        {
            let li = event.target
            while(li.tagName != "LI")
            {
                li = li.parentElement
            }
            index = 0
            while(index < ul.childElementCount - 1 && li != ul.children[index])
            {
                index ++
            }
            while(index < ul.childElementCount - 1 && get_hierarchy(li.children[0]) < get_hierarchy(ul.children[index + 1].children[0]))
            {
                index ++
            }
            ul.children[index].style.borderBottom = '2px solid blue';
        }
    };

    element.ondragleave = function (event) {
        let ul = document.getElementById("tree").children[0]
        for(let i = 0; i < ul.childElementCount; i++)
        {
            ul.children[i].style.border = '';
        }
    };

    element.ondrop = function (event) {
        event.preventDefault();
		let rect = this.getBoundingClientRect();
        let li = event.target
        while(li.tagName != "LI")
        {
            li = li.parentElement
        }
        if(li.children[2].textContent == event.dataTransfer.getData('text'))
        {
            let ul = document.getElementById("tree").children[0]
            for(let i = 0; i < ul.childElementCount; i++)
            {
                ul.children[i].style.border = '';
            }
            return
        }
        let index = get_data_index(Number(li.children[2].textContent))
        let hierarchy = get_hierarchy(li.children[0])
        if ((event.clientY - rect.top) < (this.clientHeight / 3)) 
        {
            // 同じ階層で1つ前
        } 
        else if ((event.clientY - rect.top) < (this.clientHeight * 2 / 3)) 
        {
            // 新規作成の処理同様 一つ下の階層の最後尾
            index ++
            while(index < data_array.length && get_hierarchy(li.children[0]) < data_array[index][1])
            {
                index ++
            }
            hierarchy ++
        } 
        else 
        {
            // 同じ階層で子要素を飛ばした1つ後ろ
            index ++
            while(index < data_array.length && get_hierarchy(li.children[0]) < data_array[index][1])
            {
                index ++
            }
        }
        let origin = get_data_index(Number(event.dataTransfer.getData('text')))
        if(index > origin)
        {
            index --
        }
        let length = 1
        while(data_array.length > origin + length && data_array[origin][1] < data_array[origin + length][1])
        {
            data_array[origin + length][1] = data_array[origin + length][1] - data_array[origin][1] + hierarchy
            length ++
        }
        data_array[origin][1] = hierarchy
        const move_data = data_array.slice(origin, origin + length)
        data_array.splice(origin, length)
        data_array.splice(index, 0, ...move_data)
        optimize_data_hierarchy()
        make_tree()
    };
}

function optimize_data_hierarchy()
{
    let last = -1
    for(let i = 0; i < data_array.length; i++)
    {
        if(data_array[i][1] - last > 1)
        {
            const difference = data_array[i][1] - last - 1
            for(let l = i; l < data_array.length && data_array[l][1] - last > 1; l++)
            {
                data_array[l][1] -= difference
            }
        }
        last = data_array[i][1]
    }
}

document.getElementById("input-search-name").onchange = search_name
function search_name()
{
    const search_name = document.getElementById("input-search-name").value
    let tree = document.getElementById("tree").children[0]
    reset_tree()
    if(search_name == "")
    {
        make_tree()
        return
    }
    for(i = 0; i < data_array.length; i++)
    {
        let data = data_array[i]
        if(data[3].indexOf(search_name) != -1)
        {
            let element_li = document.createElement("li")
            let icon = document.createElement("a")
            let element_a = document.createElement("a")
            let block_no = document.createElement("a")
            let parent = document.createElement("a")
    
            icon.style.marginLeft = 10 * data[1] + "px"
            element_a.textContent = data[3]
            element_li.classList.add("can-push")
            block_no.textContent = data[0]
            block_no.style.display = "none"
    
            // アイコンは一定幅で中央ぞろえにする
            icon.style.display  = "inline-block"
            icon.style.width = "25px"
            icon.style.textAlign = "center"
    
            icon.textContent = "・"
            
            // treeタイトルを押すと右のエディタに内容を表示する
            element_a.onclick = function(event){
                save_data()
                let own = event.target.parentElement
                const block_no = Number(own.children[2].textContent)
                select_block_no = block_no
                const data = get_data(block_no)
                import_data(data)
            }

            if(data[1] != 0)
            {
                let index = i
                while(data_array[index][1] >= data[1])
                {
                    index--
                }
                parent.textContent = "(" + data_array[index][3] + ")"
                parent.style.color = "gray"
                parent.style.fontSize = "14px"
            }
    
            element_li.appendChild(icon)
            element_li.appendChild(element_a)
            element_li.appendChild(block_no)
            element_li.appendChild(parent)
            tree.appendChild(element_li)
        }

    }
    
}

document.getElementById("input-search-tag").onchange = search_tag
function search_tag()
{
    const search_tag = document.getElementById("input-search-tag").value
    let tree = document.getElementById("tree").children[0]
    reset_tree()
    if(search_tag == "")
    {
        make_tree()
        return
    }
    for(i = 0; i < data_array.length; i++)
    {
        let data = data_array[i]
        if(data[4].includes(search_tag))
        {
            let element_li = document.createElement("li")
            let icon = document.createElement("a")
            let element_a = document.createElement("a")
            let block_no = document.createElement("a")
            let parent = document.createElement("a")
    
            icon.style.marginLeft = 10 * data[1] + "px"
            element_a.textContent = data[3]
            element_li.classList.add("can-push")
            block_no.textContent = data[0]
            block_no.style.display = "none"
    
            // アイコンは一定幅で中央ぞろえにする
            icon.style.display  = "inline-block"
            icon.style.width = "25px"
            icon.style.textAlign = "center"
    
            icon.textContent = "・"
            
            // treeタイトルを押すと右のエディタに内容を表示する
            element_a.onclick = function(event){
                save_data()
                let own = event.target.parentElement
                const block_no = Number(own.children[2].textContent)
                select_block_no = block_no
                const data = get_data(block_no)
                import_data(data)
            }

            if(data[1] != 0)
            {
                let index = i
                while(data_array[index][1] >= data[1])
                {
                    index--
                }
                parent.textContent = "(" + data_array[index][3] + ")"
                parent.style.color = "gray"
                parent.style.fontSize = "14px"
            }
    
            element_li.appendChild(icon)
            element_li.appendChild(element_a)
            element_li.appendChild(block_no)
            element_li.appendChild(parent)
            tree.appendChild(element_li)
        }

    }
    
}

document.getElementById("button-make-text").onclick = make_text
function make_text()
{
    let select_block_index = 0
    while(data_array[select_block_index][0] != select_block_no)
    {
        select_block_index++
    }
    const select_block_layer = data_array[select_block_index][1]
    let target_index = select_block_index + 1
    while(target_index < data_array.length && select_block_layer < data_array[target_index][1])
    {
        target_index++
    }
    let data = []
    data.push(++max_block_no)
    data.push(select_block_layer + 1)
    data.push("text")
    data.push(document.getElementById("new-block-input").value)
    data.push([])
    data.push("<text>")
    data.push("<break>")
    data_array.splice(target_index, 0, data)
    make_tree()
}

function array_to_string(array, separator)
{
    let string = ""
    string += array[0]
    i = 1
    while(i < array.length)
    {
        string += separator
        string += array[i]
        i++
    }
    return string
}

document.getElementById("button-save-file").onclick = save_file
async function save_file()
{
    save_data()
    const opts = {
        suggestedName: 'example',
        types: [{
        description: 'Text file',
        accept: {'text/plain': ['.txt']},
        }],
    };
    let file = document.getElementById("file-title").textContent + "," + max_block_no
    for(const data of data_array)
    {
        file += "\n"
        file += data[0] + "," + data[1] + "," + data[2] + "," + data[3] + "\n"
        file += array_to_string(data[4], ",")
        file += "\n"
        file += array_to_string(data.slice(5), "\n")
    }
    const handle = await window.showSaveFilePicker(opts);
    const writable = await handle.createWritable()
    await writable.write(file)
    await writable.close()
    await console.log("saved")
}

document.getElementById("button-open-file").onclick = open_file
function open_file()
{
    if(confirm("保存していないデータは消去されます。\n問題がある場合はキャンセルし保存してください"))
    {
        const showOpenFileDialog = () => {
            return new Promise(resolve => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.txt, text/plain';
                input.onchange = event => { resolve(event.target.files[0]); };
                input.click();
            });
        };
        
        const readAsText = file => {
            return new Promise(resolve => {
                const reader = new FileReader();
                reader.readAsText(file);
                reader.onload = () => { resolve(reader.result); };
            });
        };
        
        (async () => {
            const file_data = await showOpenFileDialog();
            file = await readAsText(file_data);
            // 内容表示
            // console.log(file);
            import_file()
            make_tree()
        })();
    }
}

document.getElementById("button-new-file").onclick = new_file
function new_file()
{
    if(confirm("保存していないデータは消去されます。\n問題がある場合はキャンセルし保存してください"))
    {
        const file_name = window.prompt("プロジェクト名を入力してください\n※　保存名とは別です　※", "");
        if(file_name == null || file_name == "")
        {
            window.alert('キャンセルしました')
        }
        else if(file_name.indexOf(",") != -1)
        {
            window.alert('ファイル名に,は使えません')
        }
        else
        {
            file = file_name + ",0\n0,0,text,初期作成\n\n<text>\n<break>"
            console.log(file)
            import_file()
            make_tree()
        }
    }
}

window.addEventListener('beforeunload', function (e) 
{
    // イベントをキャンセルする
    e.preventDefault();
    // Chrome では returnValue を設定する必要がある
    e.returnValue = '';
});

reset_tree()