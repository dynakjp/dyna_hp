var file = document.getElementById('sheet');
// File APIに対応しているか確認
function loadLocalImage(e) {
    // ファイル情報を取得
    var fileData = e.target.files[0];

    // 画像ファイル以外は処理を止める
    if(!fileData.type.match('image.*')) {
        alert('画像を選択してください');
        return;
    }

    // FileReaderオブジェクトを使ってファイル読み込み
    var reader = new FileReader();
    // ファイル読み込みに成功したときの処理
    reader.onload = function() {
        document.getElementById('img_sheet').src=reader.result;
        console.log("sheetchenge")
    }
    reader.readAsDataURL(fileData);
}
file.addEventListener('change', loadLocalImage, false);