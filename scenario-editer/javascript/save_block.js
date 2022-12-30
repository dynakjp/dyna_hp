var tag_list = []

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