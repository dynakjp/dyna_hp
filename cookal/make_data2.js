var datas = document.getElementById('datas');
var log_lab = document.getElementById('log');
var fd
var fk
var dic
var ing=[["お米","1杯"],["鶏もも","200g"],["卵","2個"]]
getCSV();

function kataToHira(str) {
    return str.replace(/[\u30a1-\u30f6]/g, function(match) {
        var chr = match.charCodeAt(0) - 0x60;
        return String.fromCharCode(chr);
    });
}

function str_remake(S){
    delmozi=["◆","◎","★","☆","●"];
    chenge=[["醬","醤"]];
    allc=[["酒","料理酒"],["みりん","本みりん"]];
    for(a of allc){
        if(a[0]==S){
            S=a[1];
        }
    }

    for(c of chenge){
        while(-1!=S.indexOf(c[0])){
            S=S.replace(c[0],c[1]);
        }
    }

    for(d of delmozi){
        while(-1!=S.indexOf(d)){
            S=S.replace(d,"");
        }
    }

    kakko=0;
    A="";
    for(s of S){
        if(-1!="(（".indexOf(s)){
            kakko=1;
        }
        else if(-1!=")）".indexOf(s)){
            kakko=0;
        }
        else if(kakko==0){
            A+=s;
        }
    }
    return A;
}

function get_url() {
    log_lab.innerHTML="材料情報取得中";
    let element = document.getElementById('url_input');
    let url=element.value;
    let word=url.split(" ");
    i=0
    ing=[]
    while(i+1<word.length){
        ing.push([str_remake(word[i]),str_remake(word[i+1])])
        i+=2
    }
    console.log(ing)
    get_name();
    log_lab.innerHTML="材料名処理完了";
    get_kalml();
    log_lab.innerHTML="材料情報検索完了";
    read_ing();
    log_lab.innerHTML="表示完了";
}

function get_name(){
    ing_name=[]
    for (const i of [...Array(ing.length).keys()]){
        dic_ind=0;
        s=ing[i][0].replace("^"," ");
        ans=[];
        ct=0;
        while(dic_ind<dic.length){
            while(dic_ind<dic.length){
                if(-1!=s.indexOf(dic[dic_ind][0])){
                    break;
                }
                dic_ind+=1;
            }
            if(dic_ind<dic.length){
                ans.push(dic[dic_ind]);
                s=s.replace(dic[dic_ind][0],"^"+String(ct)+"^");
                ct+=1;
            }
            dic_ind+=1;
        }
        
        ing_name.push([]);
        now="";
        ind=0;
        while(ind<s.length){
            if(s[ind]=="^"){
                if(now.length>0){
                    if(now==kataToHira(now)){
                        ing_name[i].push([now]);
                    }else{
                        ing_name[i].push([now,kataToHira(now)]);
                    }
                    now="";
                }
                ind+=1;
                ing_name[i].push(ans[Number(s[ind])]);
                ind+=2;
            }else{
                now+=s[ind];
                ind+=1;
            }
        }
        if(now.length>0){
            ing_name[i].push([now]);
        }
    }
    console.log(ing_name)
}

function push_but(){
    // console.log(ing_name);
    // get_kalml();
    // read_ing();
    // str_check("abcd","aceacdffefc");s
    inputChange()
    read_ing()
}

function ing_num(S){
    //分数に対応出来る
    //00~00みたいなのも対応可
    ans=0;
    if (-1!=S.indexOf("/")){
        i = S.indexOf("/");
        ans=str_num(S.substr(0,i))/str_num(S.substr(i+1,S.length-i-1));
    }
    else if (-1!=S.indexOf("／")){
        i = S.indexOf("／");
        ans=str_num(S.substr(0,i))/str_num(S.substr(i+1,S.length-i-1));
    }
    else if (-1!=S.indexOf("~")){
        i = S.indexOf("~");
        ans=(str_num(S.substr(0,i))+str_num(S.substr(i+1,S.length-i-1)))/2;
    }
    else if (-1!=S.indexOf("-")){
        i = S.indexOf("-");
        ans=(str_num(S.substr(0,i))+str_num(S.substr(i+1,S.length-i-1)))/2;
    }
    else if (-1!=S.indexOf("～")){
        i = S.indexOf("～");
        ans=(str_num(S.substr(0,i))+str_num(S.substr(i+1,S.length-i-1)))/2;
    }
    else if (-1!=S.indexOf("ー")){
        i = S.indexOf("ー");
        ans=(str_num(S.substr(0,i))+str_num(S.substr(i+1,S.length-i-1)))/2;
    }
    else{
        ans=str_num(S);
    }
    return ans;
}

function str_check(A,B){
    L=[];
    for(a of [...Array(A.length).keys()]){
        l=[];
        for(b of [...Array(B.length).keys()]){
            if(A[a]==B[b]){
                l.push(b);
            }
        }
        L.push(l);
    }
    let ans=[]
    let con=[]
    for(a of [...Array(L.length).keys()]){
        c=0;
        for(b of [...Array(L[a].length).keys()]){
            if(c<con.length){
                while(c<con.length && con[c][0]<L[a][b]){
                    ans.push(con[c][1]);
                    con.splice(c,1);
                }
                if(c<con.length){
                    if(con[c][0]==L[a][b]){
                        con[c][0]+=1;
                        con[c][1]+=1;
                        c+=1;
                    }else{
                        con.splice(c,0,[L[a][b]+1,1]);
                        c+=1;
                    }
                }
            }else{
                x=[L[a][b]+1,1]
                con.push(x);
                c+=1;
            }
        }
        if(L[a].length==0){
            while(con.length!=0){
                ans.push(con[0][1]);
                con.splice(0,1);
            }
        }
    }
    for(c of [...Array(con.length).keys()]){
        ans.push(con[c][1]);
    }
    ret=[[],0,0]
    i=0
    for(a of L){
        if(a.length!=0){
            ret[0].push(1)
            i+=1
        }
        else{
            ret[0].push(0)
        }
    }
    ret[1]=i
    for(a of ans){
        if(ret[2]<a){
            ret[2]=a
        }
    }
    return ret;
}

function str_num(S){
    ans=""
    for(s of S){
        if(-1!="1234567890１２３４５６７８９０.".indexOf(s)){
            ans+=s
        }
    }
    return parseFloat(ans);
}

function get_kalml(){
    for (const ind of [...Array(ing.length).keys()]) {
        if(ing[ind].length>2){
            ing[ind]=ing[ind].slice(0,2)
        }
        ok_max=1;
        ans=[];
        console.log(ing_name[ind]);
        for (const i of [...Array(fd.length).keys()]) {
            fd_l=fd[i][3].split("　")
            if (-1 != fd_l[0].indexOf('<')){
                fd_l[0]=fd_l[0].replace("＜","").replace("＞","").replace("類","");
                fd_l.push(fd_l[0]);
                fd_l.shift();
            }
            if (fd_l.length>1 && -1 != fd_l[0].indexOf('(')){
                fd_l[0]=fd_l[0].replace("（","").replace("）","").replace("類","");
                fd_l.push(fd_l[0]);
                fd_l.shift();
            }
            if (fd_l.length>1 && -1 != fd_l[0].indexOf('［')){
                fd_l[1]=fd_l[1].replace("［","").replace("］","").replace("類","");
            }

            ok=0;
            poi=0;
            for (i1 of [...Array(ing_name[ind].length).keys()]){
                x=0
                for (i2 of [...Array(ing_name[ind][i1].length).keys()]){
                    n=ing_name[ind][i1][i2]
                    s="";
                    for (const a of fd_l.slice(0,fd_l.length)){
                        s+=a;
                        s+=" ";
                    }
                    strans=str_check(n,s);
                    if(n.length==strans[1]){
                        ok+=10;
                        ok+=(strans[2]/n.length)*10;
                        break;
                    }
                }
            }

            if (ok_max<ok){
                ans=[i];
                ok_max=ok;
            }
            else if (ok_max==ok){
                ans.push(i);
            }
            
        }

        
        l=[];
        for (a of ans){
            if (-1!=fd[a][3].indexOf("生")){
                l.push(a);
            }
        }
        if (l.length>0){
            ans=l;
        }
        
        
        console.log(ans.length)
        for(a of ans){
            console.log(fd[a][3]);
        }

        // カロリーの平均値を求める
        kal=0;
        i=0;
        for (a of ans){
            i+=1;
            kal+=str_num(fd[a][6]);
        }
        kal=kal/i;
        ing[ind].push(kal);
        
        surch=""
        for (i1 of [...Array(ing_name[ind].length).keys()]){
            for (i2 of [...Array(ing_name[ind][i1]).keys()]){
                surch+=ing_name[ind][i1][i2];
            }
        }

        console.log(surch);
        fkn=0
        while(fkn < fk_name.length){
            if(fk_name[fkn].length==str_check(fk_name[fkn],surch)[1]){
                if(-1!=ing[ind][1].indexOf(fk[fkn][1])){
                    console.log(fk_name[fkn]);
                    break;
                }
            }
            fkn+=1
        }
        //分量を求める
        if(fkn!=fk.length){
            console.log("fk");
            ing[ind].push(ing_num(ing[ind][1])*ing_num(fk[fkn][2]));
        }else if(-1!=(ing[ind][1].indexOf("g"))){
            console.log("g");
            ing[ind].push(ing_num(ing[ind][1]));
        }else if(-1!=(ing[ind][1].indexOf("大さじ")) || -1!=(ing[ind][1].indexOf("大匙")) || -1!=(ing[ind][1].indexOf("おおさじ"))){
            console.log("大");
            ing[ind].push(ing_num(ing[ind][1])*15*1.1);
        }else if(-1!=(ing[ind][1].indexOf("小さじ")) || -1!=(ing[ind][1].indexOf("小匙")) || -1!=(ing[ind][1].indexOf("こさじ"))){
            console.log("小");
            ing[ind].push(ing_num(ing[ind][1])*5*1.1);
        }else if(-1!=(ing[ind][1].indexOf("ml"))){
            console.log("ml");
            ing[ind].push(ing_num(ing[ind][1])*1.1);
        }else{
            console.log("no");
            ing[ind].push(ing_num(ing[ind][1]));
        }


        //カロリーを出す
        if(ing[ind].length==4){
            ing[ind].push(ing[ind][2]*ing[ind][3]/100)
        }
    }

    console.log(ing);
}

function getCSV(){
    var req1 = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
    req1.open("get", "food_data1.csv", true); // アクセスするファイルを指定
    req1.send(null); // HTTPリクエストの発行
	
    // レスポンスが返ってきたらconvertCSVtoArray()を呼ぶ	
    req1.onload = function(){
	fd=convertCSVtoArray(req1.responseText).slice(2); // 渡されるのは読み込んだCSVデータ
    console.log(fd)
    }

    var req2 = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
    req2.open("get", "food_ko00.csv", true); // アクセスするファイルを指定
    req2.send(null); // HTTPリクエストの発行
	
    // レスポンスが返ってきたらconvertCSVtoArray()を呼ぶ	
    req2.onload = function(){
	fk=convertCSVtoArray(req2.responseText); // 渡されるのは読み込んだCSVデータ
    fk_name=[];
    for(i of fk){
        fk_name.push(i[0]);
    }
    console.log(fk)
    }
    
    var req3 = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
    req3.open("get", "food_dict5.csv", true); // アクセスするファイルを指定
    req3.send(null); // HTTPリクエストの発行
	
    // レスポンスが返ってきたらconvertCSVtoArray()を呼ぶ	
    req3.onload = function(){
	dic=convertCSVtoArray(req3.responseText); // 渡されるのは読み込んだCSVデータ
    for(i of [...Array(dic.length).keys()]){
        dic[i][1]=dic[i][1].replace("\r","")
    }
    console.log(dic)
    }
}
 
// 読み込んだCSVデータを二次元配列に変換する関数convertCSVtoArray()の定義
function convertCSVtoArray(str){ // 読み込んだCSVデータが文字列として渡される
    var result = []; // 最終的な二次元配列を入れるための配列
    var tmp = str.split("\n"); // 改行を区切り文字として行を要素とした配列を生成
 
    // 各行ごとにカンマで区切った文字列を要素とした二次元配列を生成
    for(var i=0;i<tmp.length;++i){
        result[i] = tmp[i].split(',');
    }
 
    return result;
}

function make_data(ind){
    info=ing[ind]
    var data = document.createElement('div');
    data.id="data"+String(ind)
    data.classList.add("dat_group");

    var ap=document.createElement('br');
    data.appendChild(ap)

    var ap=document.createElement('p');
    ap.textContent=info[0]
    ap.id="dat_ing"+String(ind);
    ap.classList.add("dat_ing");
    data.appendChild(ap)

    var ap=document.createElement('p');
    ap.textContent=info[1]
    ap.id="dat_amo"+String(ind);
    ap.classList.add("dat_amo");
    data.appendChild(ap)

    var ap=document.createElement('input');
    ap.type="text"
    ap.size=5
    ap.id="dat_kal"+String(ind);
    ap.value=info[2].toFixed(2);
    ap.classList.add("dat_kal");
    data.appendChild(ap)

    var ap=document.createElement('input');
    ap.type="text"
    ap.size=5
    ap.id="dat_gra"+String(ind);
    ap.value=info[3].toFixed(2);
    ap.classList.add("dat_gra");
    data.appendChild(ap)

    var ap=document.createElement('p');
    ap.textContent=info[4].toFixed(2);
    ap.id="dat_sum"+String(ind);
    ap.classList.add("dat_sum");
    data.appendChild(ap)

    datas.appendChild(data)
}

function read_ing(){
    datas.innerHTML=""
    sum_kal=0
    for(i of [...Array(ing.length).keys()]){
        if(!isNaN(ing[i][4])){
            console.log(ing[i][4])
            sum_kal+=ing[i][4]
        }
        make_data(i);
    }
    var data = document.createElement('div');
    data.id="data"
    
    var ap=document.createElement('br');
    data.appendChild(ap)

    var ap=document.createElement('br');
    data.appendChild(ap)
    
    var ap=document.createElement('p');
    ap.textContent="合計カロリー"
    ap.classList.add("dat_ing");
    data.appendChild(ap)
    
    
    var ap=document.createElement('p');
    ap.textContent=sum_kal.toFixed(2);
    ap.classList.add("dat_amo");
    data.appendChild(ap)

    var ap=document.createElement('p');
    ap.textContent="1人分カロリー"
    ap.classList.add("dat_kal");
    data.appendChild(ap)

    let element = document.getElementById('pep_input');
    let pep=element.value;

    var ap=document.createElement('p');
    ap.textContent=(sum_kal/ing_num(pep)).toFixed(2);
    ap.classList.add("dat_sum");
    data.appendChild(ap)

    data.appendChild(ap)
    datas.appendChild(data)
}

function inputChange(){
    for(i of [...Array(ing.length).keys()]){
        var kal = document.getElementById("dat_kal"+String(i));
        console.log(kal.value)
        ing[i][2]=str_num(kal.value);
        var gra = document.getElementById("dat_gra"+String(i));
        console.log(gra.value)
        ing[i][3]=str_num(gra.value);
        ing[i][4]=(ing[i][2]*ing[i][3]/100)
    }
}

function add_ing(){
    let name_in=document.getElementById('name_input');
    let amount_in=document.getElementById('amount_input');
    let element = document.getElementById('url_input');
    element.value+=" "+name_in.value+" "+amount_in.value;
    name_in.value="";
    amount_in.value="";
    get_url();
}