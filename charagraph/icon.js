var head = document.getElementById('icon');
var select="none"

var howto_doc=['キャラの追加　：キャラ画像を選択し、盤面に追加できる。','背景画像選択　：背景となっている画像を変更できる。' , '保存　　　　　：盤面を画像化してダウンロードする。' , 'ツイッター　　：現在準備中(今は#きゃらぐらふ！でツイートを作るリンクになってる)','キャラは背景画像の外に置けば出力されません。','問題や要望は制作者のメール、ツイッターへ'];
var atention_doc=["・このサイトを使用したことによる、どんな不利益も制作者は保証しません。","・サイトの再読み込みをすると盤面が全てリセットされます。","・悪意のある使用、他者に悪影響を及ぼすような使用はご遠慮下さい。","・このサイトは表記等を必要としませんが使用する画像等の権利には注意してください。"]

var file = document.getElementById('howto');
function Pushhowto() {
    if(select=="howto") {
        console.log("howto");
        var info_div = document.getElementById('info');
        info_div.remove(); 
        select="none"
        var ht = document.getElementById('howto_text');
        ht.style.borderBottom="2px solid rgb(251, 201, 145)";
    }else{
        if(select!="none"){
            var info_div = document.getElementById('info');
            info_div.remove(); 
        }
        var ht = document.getElementById('howto_text');
        ht.style.borderBottom="4px solid rgb(251, 201, 145)";
        var ht = document.getElementById('atention_text');
        ht.style.borderBottom="2px solid rgb(251, 201, 145)";
        var ht = document.getElementById('maker_text');
        ht.style.borderBottom="2px solid rgb(251, 201, 145)";

        select="howto"
        var info = document.createElement('div');
        info.id="info"
        info.classList.add("info");
        for(const i of howto_doc){
            var ap=document.createElement('p');
            ap.textContent=i
            ap.classList.add("infop");
            info.appendChild(ap)
        }        
        head.after(info);
        console.log("howto info");

    }
}
file.addEventListener('click', Pushhowto, false);        


var file = document.getElementById('maker');
function Pushmaker() {
    if(select=="maker") {
        console.log("maker");
        var info_div = document.getElementById('info');
        info_div.remove(); 
        select="none"
        var ht = document.getElementById('maker_text');
        ht.style.borderBottom="2px solid rgb(251, 201, 145)";
    }else{
        if(select!="none"){
            var info_div = document.getElementById('info');
            info_div.remove(); 
        }
        var ht = document.getElementById('howto_text');
        ht.style.borderBottom="2px solid rgb(251, 201, 145)";
        var ht = document.getElementById('atention_text');
        ht.style.borderBottom="2px solid rgb(251, 201, 145)";
        var ht = document.getElementById('maker_text');
        ht.style.borderBottom="4px solid rgb(251, 201, 145)";

        select="maker"
        var info = document.createElement('div');
        info.id="info"
        info.classList.add("info");

        var ap=document.createElement('p');
        ap.textContent="企画・制作 ： ダイナ"
        ap.classList.add("infop");
        info.appendChild(ap)

        var ap=document.createElement('p');
        ap.textContent="mail : dynamite.ttnk@gmail.com"
        ap.classList.add("infop");
        info.appendChild(ap)

        var ap=document.createElement('a');
        ap.textContent="twitter : @dynamite321bomb"
        ap.classList.add("infop");
        ap.href = "https://twitter.com/dynamite321bomb";
        ap.target = "_blank"
        
        info.appendChild(ap)

        head.after(info);
        console.log("howto info");
    }
}
file.addEventListener('click', Pushmaker, false);


var file = document.getElementById('atention');
function Pushatention() {
    if(select=="atention") {
        console.log("atention");
        var info_div = document.getElementById('info');
        info_div.remove(); 
        select="none"
        var ht = document.getElementById('atention_text');
        ht.style.borderBottom="2px solid rgb(251, 201, 145)";
    }else{
        if(select!="none"){
            var info_div = document.getElementById('info');
            info_div.remove(); 
        }
        var ht = document.getElementById('howto_text');
        ht.style.borderBottom="2px solid rgb(251, 201, 145)";
        var ht = document.getElementById('atention_text');
        ht.style.borderBottom="4px solid rgb(251, 201, 145)";
        var ht = document.getElementById('maker_text');
        ht.style.borderBottom="2px solid rgb(251, 201, 145)";

        select="atention"
        var info = document.createElement('div');
        info.id="info"
        info.classList.add("info");
        for(const i of atention_doc){
            var ap=document.createElement('p');
            ap.textContent=i
            ap.classList.add("infop");
            info.appendChild(ap)
        }        
        head.after(info);
        console.log("howto info");
    }
}
file.addEventListener('click', Pushatention, false);     