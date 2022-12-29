var file = document.getElementById('chara');
var result = document.getElementById('app');
 
function addchara(fileData){
    // 画像ファイル以外は処理を止める
    if(!fileData.type.match('image.*')) {
        alert('画像を選択してください');
        return;
    }

    // FileReaderオブジェクトを使ってファイル読み込み
    var reader = new FileReader();
    // ファイル読み込みに成功したときの処理
    reader.onload = function() {
        var img = document.createElement('img');
        img.src = reader.result;
        img.style.position = "absolute";
        img.style.cursor = "pointer";
        img.style.zIndex = "2"
        img.style.top="325px"
        img.style.left="325px"
        if(img.width/100>img.height/150){
            img.width="100px"
        }else{
            img.style.height="150px"
        }
        img.ondragstart = function(e){
            return false;
        }
        function onMouseMove(event){
            var x = event.clientX;
            var y = event.clientY;
            var width = img.offsetWidth;
            var height = img.offsetHeight;
            img.style.top = (y-height/2) + "px";
            img.style.left = (x-width/2) + "px";
        }
    
        img.onmousedown = function(event){
            document.addEventListener("mousemove",onMouseMove);
        }
    
        img.onmouseup = function(event){
            var x = event.clientX;
            var y = event.clientY;
            var width = img.offsetWidth;
            var height = img.offsetHeight;
            document.removeEventListener("mousemove",onMouseMove);
        }
        result.appendChild(img);
        console.log("chara_add")
    }
    // ファイル読み込みを実行
    reader.readAsDataURL(fileData);
}

// File APIに対応しているか確認
if(window.File && window.FileReader && window.FileList && window.Blob) {
    function loadLocalImage(e) {
        // ファイル情報を取得
        var fileData = e.target.files;
        for(var i of fileData){
            addchara(i)
        }        
    }
    file.addEventListener('change', loadLocalImage, false);
 
} else {
    file.style.display = 'none';
    result.innerHTML = 'File APIに対応したブラウザでご確認ください';
}