var file = document.getElementById('twitter');
// var sheet = document.getElementById('img_sheet');
// var sheet_c =sheet.getBoundingClientRect();
// const canvas = document.getElementById("exp");
// const ctx = canvas.getContext("2d");


function twitterImage() {
    // canvas.width = sheet.width;
    // canvas.height = sheet.height;

    // const img = new Image();
    // img.src = sheet.getAttribute('src');
    // ctx.drawImage(img, 0, 0, sheet.height, sheet.width);

    // var imgs = $('#app').find("img");
    // console.log(imgs.length)
    // for (let step = 0; step < imgs.length; step++){
    //     i = imgs[step]
    //     console.log(sheet_c)
    //     img.src = i.getAttribute('src');
    //     ctx.drawImage(img, parseInt(i.style.left)-sheet_c.left, parseInt(i.style.top)-sheet_c.top,  i.height, i.width);
    // }
    // ここから先をツイート用にする
    // let png = document.getElementById("exp");
    let link = document.createElement("a");
    link.href = "https://twitter.com/intent/tweet?hashtags=きゃらぐらふ！";
    link.target = "_blank"
    link.click();
    
    console.log("twitter");
}


file.addEventListener('click', twitterImage, false);