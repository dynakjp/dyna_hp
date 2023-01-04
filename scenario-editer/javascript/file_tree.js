let file = ""
let data_array = []

function import_file()
{
    file = ""
    file += "World Overlap,3\n"
    file += "0,0,text,最初の部屋\n"
    file += "stage\n"
    file += "<text>探索者が目覚める部屋。よく探すと意外と情報がある。\n"
    file += "1,1,text,導入\n"
    file += "event,main\n"
    file += "<text>瞼がゆっくりと持ち上がる。\n"
    file += "<text>体のけだるさに対し以外にもそれは容易ににできた。\n"
    file += "<text>知らない天上。少し硬いベッドは病院のそれを感じさせる。\n"
    file += "4,1,text,探索\n"
    file += "event,main\n"
    file += "<text>瞼がゆっくりと持ち上がる。\n"
    file += "<text>体のけだるさに対し以外にもそれは容易ににできた。\n"
    file += "<text>知らない天上。少し硬いベッドは病院のそれを感じさせる。\n"
    file += "2,2,text,小瓶\n"
    file += "item\n"
    file += "<text>棚の下を覗き込むと何か落ちている。\n"
    file += "<text>それは手の中に納まるほどの小さな小瓶だ\n"
    file += "<text>聞き耳　匂いを嗅ぐ　＞　甘いリンゴのような匂いがする\n"
    file += "3,2,text,手紙\n"
    file += "item\n"
    file += "<text>棚の上には1枚の便箋があった。\n"
    file += "<text>表面には金色でお客様へと書かれている\n"
    file += "<text>中を見る　＞　中の手紙には禁断の果実は真実を映し出すと書かれている"   
    let file_array = file.split("\n")
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
            let own = event.target.parentElement
            const block_no = Number(own.children[2].textContent)
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
                let own = event.target.parentElement
                const block_no = Number(own.children[2].textContent)
                const data = get_data(block_no)
                read_data(data)
            }
    
            element_li.appendChild(icon)
            element_li.appendChild(element_a)
            element_li.appendChild(block_no)
            tree.appendChild(element_li)
        }

    }
    
}

import_file()
make_tree()