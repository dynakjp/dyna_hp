var head = document.getElementById('icon');
var select="none"

var howto_doc=['1. スペース区切りで"材料　分量"をまとめて入力、または一個ずつ入力して追加する(併用可)','2. 人数を入力する','3. 取得ボタンを押す（最大10数秒くらいかかります）','4. 訂正したい部分があれば訂正して再計算ボタンを押す','(CookPad様の材料欄ならばコピペでまとめ入力可)'];
var atention_doc=["・このサイトを使用したことによる、どんな不利益も制作者は保証しません。","・悪意のある使用、他者に悪影響を及ぼすような使用はご遠慮下さい。"]

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