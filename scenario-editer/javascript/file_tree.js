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
    console.log(data_array)
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
            read_data(data)
        }

        element_li.appendChild(icon)
        element_li.appendChild(element_a)
        element_li.appendChild(block_no)
        tree.appendChild(element_li)
    }
}

document.getElementById("search-name-input").onchange = name_search
function name_search()
{
    const search_name = document.getElementById("search-name-input").value
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
                read_data(data)
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

document.getElementById("search-tag-input").onchange = tag_search
function tag_search()
{
    const search_tag = document.getElementById("search-tag-input").value
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
                read_data(data)
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
    data.push("<text> ")
    console.log(data)
    console.log(max_block_no)
    console.log(select_block_index)
    console.log(target_index)
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

document.getElementById("button-file-save").onclick = save_file
async function save_file()
{
    
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

document.getElementById("button-file-open").onclick = open_file
function open_file()
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

reset_tree()