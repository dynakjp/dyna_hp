window.onload=()=>{
    var file = document.getElementById('save');
    var sheet = document.getElementById('img_sheet');
    var sheet_c =sheet.getBoundingClientRect();
    const canvas = document.getElementById("exp");
    const ctx = canvas.getContext("2d");

    function saveImage() {
        canvas.width = sheet.width;
        canvas.height = sheet.height;

        const img = new Image();
        img.src = sheet.getAttribute('src');
        ctx.drawImage(img, 0, 0, sheet.height, sheet.width);

        var imgs = $('#app').find("img");
        console.log(imgs.length)
        for (let step = 0; step < imgs.length; step++){
            i = imgs[step]
            console.log(i.height,i.width)
            img.src = i.getAttribute('src');
            ctx.drawImage(img, parseInt(i.style.left)-sheet_c.left, parseInt(i.style.top)-sheet_c.top, i.width, i.height);
        }

        let png = document.getElementById("exp");
        let link = document.createElement("a");
        link.href = png.toDataURL("image/png");
        link.download = "charagraph.png";
        link.click();
        
        console.log(png)
        console.log("save");
    }


    file.addEventListener('click', saveImage, false);
    console.log(file);
}