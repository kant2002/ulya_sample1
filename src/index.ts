/// <reference types="howler" />

async function dressGame() {
    class DrawinContext {
        constructor(public ctx: CanvasRenderingContext2D) {}
        clear() {
            this.ctx.clearRect(0, 0, c.width, c.height);
        }
        drawImage(name: string) {
            const imageDescriptor = images[name];
            var srcWorldCoordinates = {
                x: imageDescriptor.x,
                y: imageDescriptor.y,
            }
            
            this.ctx.drawImage(imageDescriptor.img, 
                0, 0, 
                imageDescriptor.img.naturalWidth, imageDescriptor.img.naturalHeight, 
                imageDescriptor.x * scale, imageDescriptor.y * scale, 
                imageDescriptor.img.width * scale, imageDescriptor.img.height * scale);
        }
        drawThumb(name: string, x: number, y: number) {
            const imageDescriptor = images[name];
            var srcWorldCoordinates = {
                x: imageDescriptor.x,
                y: imageDescriptor.y,
            }
            
            const thumbScale = 0.6;
            this.ctx.drawImage(imageDescriptor.img, 
                0, 0, 
                imageDescriptor.img.naturalWidth, imageDescriptor.img.naturalHeight, 
                x, y, 
                imageDescriptor.img.width * scale * thumbScale, imageDescriptor.img.height * scale * thumbScale);
        }
    }
    var c = document.getElementsByTagName('canvas')[0];
    c.width = c.clientWidth;
    c.height = c.clientHeight;
    let ctx = c.getContext("2d");
    if (ctx === null) {
        throw new Error("Cannot obtain 2D context");
    }
    const context = new DrawinContext(ctx);
    const xhttp = new XMLHttpRequest();
    xhttp.overrideMimeType('text/xml');
    
    xhttp.open("GET", "assets/dress/stack.xml", false);
    xhttp.send(null);
    const xmlDoc = xhttp.responseXML!;
    var image = xmlDoc.getElementsByTagName("image")[0];
    var canvasHeight = parseInt(image.getAttribute("h")!);
    var canvasWeight = parseInt(image.getAttribute("w")!);
    var scale = Math.min(c.height / canvasHeight, c.width / canvasWeight);
    const images : Record<string, {imagePath:string, img: HTMLImageElement, x: number, y: number}> = {};
    var layers = xmlDoc.getElementsByTagName("layer");
    let promises = [];
    for (const layer of layers) {
        const name = layer.getAttribute("name")!;
        const imagePath = layer.getAttribute("src")!;
        const img = new Image();
        img.src = "assets/dress/" + imagePath;
        promises.push(new Promise(function (resolve, reject) {
            img.onload = resolve;
            img.onerror = reject;
        }));
        images[name] = {
            imagePath,
            img,
            x: parseInt(layer.getAttribute("x")!),
            y: parseInt(layer.getAttribute("y")!),
        };
    }
    await Promise.all(promises);
    context.drawImage("Девочка");

    //context.drawImage("Сумочка");
    context.drawThumb("Сумочка", 200, 0);
    //context.drawImage("Pasted Layer #1");
    context.drawThumb("Pasted Layer #1", 200, 20);
    //context.drawImage("Футболка 1");
    context.drawThumb("Футболка 1", 300, 20);
    //context.drawImage("Блузка 1");
    context.drawThumb("Блузка 1", 200, 80);
    //context.drawImage("юбка 1");
    context.drawThumb("юбка 1", 200, 150);
    //context.drawImage("юбка 2");
    context.drawThumb("юбка 2", 300, 150);
    //context.drawImage("Брюки 1");
    context.drawThumb("Брюки 1", 200, 190);
    //context.drawImage("Туфли 1");
    context.drawThumb("Туфли 1", 200, 320);
    //context.drawImage("Туфли 2");
    context.drawThumb("Туфли 2", 320, 320);
    //context.drawImage("Перчатки");
    context.drawThumb("Перчатки", 300, 80);
    //context.drawImage("Вечернее платье");
    context.drawThumb("Вечернее платье", 250, 190);
    //context.drawImage("Пальто");
    context.drawThumb("Пальто", 320, 190);
}
document.addEventListener("DOMContentLoaded", function() {
    dressGame()
})
