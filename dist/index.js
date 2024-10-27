"use strict";
/// <reference types="howler" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function dressGame() {
    return __awaiter(this, void 0, void 0, function* () {
        class DrawinContext {
            constructor(ctx) {
                this.ctx = ctx;
            }
            drawImage(name) {
                const imageDescriptor = images[name];
                var srcWorldCoordinates = {
                    x: imageDescriptor.x,
                    y: imageDescriptor.y,
                };
                console.log(imageDescriptor.img.naturalWidth, imageDescriptor.img.naturalHeight);
                console.log(srcWorldCoordinates.x * scale, srcWorldCoordinates.y * scale);
                console.log(imageDescriptor.img.width * scale, imageDescriptor.img.height * scale);
                console.log(c.width, c.height);
                this.ctx.drawImage(imageDescriptor.img, 0, 0, imageDescriptor.img.naturalWidth, imageDescriptor.img.naturalHeight, 0, 0, Math.round(imageDescriptor.img.width * scale), imageDescriptor.img.height * scale);
                // var factor  = Math.min ( c.width / imageDescriptor.img.width, c.height / imageDescriptor.img.height );
                // this.ctx.scale(factor, factor);
                // this.ctx.drawImage(imageDescriptor.img, 0, 0);
                // this.ctx.scale(1 / factor, 1 / factor);
                // var ratio = imageDescriptor.img.naturalWidth / imageDescriptor.img.naturalHeight;
                // var width = this.ctx.canvas.width;
                // var height = width / ratio;
                // this.ctx.drawImage(imageDescriptor.img, 0, 0, width, height);
            }
        }
        var c = document.getElementsByTagName('canvas')[0];
        let ctx = c.getContext("2d");
        if (ctx === null) {
            throw new Error("Cannot obtain 2D context");
        }
        const context = new DrawinContext(ctx);
        const xhttp = new XMLHttpRequest();
        xhttp.overrideMimeType('text/xml');
        xhttp.open("GET", "assets/dress/stack.xml", false);
        xhttp.send(null);
        const xmlDoc = xhttp.responseXML;
        var image = xmlDoc.getElementsByTagName("image")[0];
        var canvasHeight = parseInt(image.getAttribute("h"));
        var canvasWeight = parseInt(image.getAttribute("w"));
        var scale = Math.min(c.height / canvasHeight, c.width / canvasWeight);
        console.log(c.clientHeight / canvasHeight, c.clientWidth / canvasWeight, scale);
        const images = {};
        var layers = xmlDoc.getElementsByTagName("layer");
        let promises = [];
        for (const layer of layers) {
            const name = layer.getAttribute("name");
            const imagePath = layer.getAttribute("src");
            const img = new Image();
            img.src = "assets/dress/" + imagePath;
            promises.push(new Promise(function (resolve, reject) {
                img.onload = resolve;
                img.onerror = reject;
            }));
            images[name] = {
                imagePath,
                img,
                x: parseInt(layer.getAttribute("x")),
                y: parseInt(layer.getAttribute("y")),
            };
        }
        yield Promise.all(promises);
        console.log("Девочка");
        context.drawImage("Девочка");
    });
}
document.addEventListener("DOMContentLoaded", function () {
    dressGame();
});
