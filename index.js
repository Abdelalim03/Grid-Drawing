
// Globals
const unity = 40,theme = "dark";
var gameCanvas, gc;
var imageData, imageDataSaint;

// Used by dessein
let lowlaX, lowlaY, xlocate, ylocate,rasm;

// Used by Polylibre
let tab; 
let n, N;




addEventListener("load", function load() {
    document.getElementById("reset").addEventListener("click", load);
    createCanvas();

    //Dessein.start();
    Polygone.start();
    //Polylibre.start();
});




class Polygone {
    static start() {
        gameCanvas.addEventListener("mousemove", curseur);
        gameCanvas.addEventListener("click", Polygone.polygone);
    
    }
    
    static polygone(e) {
        gc.putImageData(imageData, 0, 0);
        let [x, y] = proximate(e.offsetX, e.offsetY);
        //point(x, y, "green", 5);
        let u = 1*unity; //taille
        

        switch(6){
            // Daira
            case 1:
                Polygone.rond(x, y, u);
                break;
            // Moustatil ra9ed
            case 2:
                Polygone.four_2_1(x, y, u);
                break;
            // mothalath
            case 3:
                Polygone.three(x, y);
                break;
            // Mouraba3
            case 4:
                Polygone.four(x, y,u);
                break;
            // khoumassi
            case 5:
                Polygone.five(x, y, u);
                break;
            // soudassi
            case 6:
                Polygone.six(x, y, u);
                break;
            // moustatil nayed
            case 7:
                Polygone.four_2_2(x, y, u);
            default:
                break;

        }
        


        //allshapes.push([x, y, type]) // store the center and the type
        imageData = gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height);
    }

    static rond(x, y, u){
        gc.beginPath();
        gc.arc(x, y, u, 0, 2 * Math.PI);
        gc.stroke();
    }
    static four(x, y,u){
        gc.beginPath();
        gc.moveTo(x - u, y - u);
        gc.lineTo(x - u, y + u);
        gc.lineTo(x + u, y + u);
        gc.lineTo(x + u, y - u);
        gc.closePath();
        gc.stroke();
    }
    static four_2_1(x, y, u){
        gc.beginPath();
        gc.moveTo(x - 2*u, y - u);
        gc.lineTo(x - 2*u, y + u);
        gc.lineTo(x + 2*u, y + u);
        gc.lineTo(x + 2*u, y - u);
        gc.closePath();
        gc.stroke();
    }
    static four_2_2(x, y, u){
        gc.beginPath();
        gc.moveTo(x - u, y - 2*u);
        gc.lineTo(x - u, y + 2*u);
        gc.lineTo(x + u, y + 2*u);
        gc.lineTo(x + u, y - 2*u);
        gc.closePath();
        gc.stroke();
    }
    static five(x, y, u){
        gc.beginPath();
        gc.moveTo(x - 2*u, y );
        gc.lineTo(x - u, y + 2*u);
        gc.lineTo(x + u, y + 2*u);
        gc.lineTo(x + 2*u, y); 
        gc.lineTo(x, y-2*u);
        gc.closePath();
        gc.stroke();
    }
    static six(x, y, u){
        gc.beginPath();
        gc.moveTo(x - 2*u, y );
        gc.lineTo(x - u, y + 2*u);
        gc.lineTo(x + u, y + 2*u); 
        gc.lineTo(x + 2*u, y); 
        gc.lineTo(x + u, y - 2*u);
        gc.lineTo(x -u, y - 2*u);  
        gc.closePath();
        gc.stroke();
    }

    static end(){
        gameCanvas.removeEventListener("mousemove", curseur);
        gameCanvas.removeEventListener("click", Poly.polygone);

    }
   
}


class Polylibre{

    static start() {
        n= N = 0;// num of line/polygone/0forrond
        tab = [];
        gameCanvas.addEventListener("mousemove", curseur);
        gameCanvas.addEventListener("click", Polylibre.draw);
    }

    static draw(e) {
        
        switch(2){
            case 1:
                Polylibre.cor(e, false);
                break;
            case 2:
                Polylibre.rond(e);
                break;
        }
    }

    static cor(e, lOnly) {
        let [x, y] = proximate(e.offsetX, e.offsetY);
        point(x, y, "green", 5);
    
        // wahmi
        gc.lineWidth = 1;
        if (tab.length != 0) {
            drawLine(x, y, tab[tab.length - 1][0], tab[tab.length - 1][1])
        }
        tab.push([x, y]);
        n -= 1;
        gc.lineWidth = 3;
        if (n == 0) {
            for (let i = 0; i < N - 1; i++) {
                drawLine(tab[i][0], tab[i][1], tab[i + 1][0], tab[i + 1][1])
            }
            if(!lOnly){
            drawLine(tab[0][0],tab[0][1],tab[N-1][0],tab[N-1][1])
        }
            n = N;
            tab = []
        }
        imageData = gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height);
    }
    
    static rond(e) {
        gc.putImageData(imageData, 0, 0);
        if (n == 0) {
            let [x, y] = proximate(e.offsetX, e.offsetY);
            tab.push([x, y])
            point(x, y, "green", 5);
            n += 1
        } else {
            let [x, y] = proximate(e.offsetX, e.offsetY);
            point(x, y, "green", 5);
            gc.strokeStyle = ((theme == "dark") ? 'white' : 'black');
            gc.lineWidth = 3;
            gc.beginPath();
            gc.arc(tab[0][0], tab[0][1], Math.sqrt((x - tab[0][0]) ** 2 + (y - tab[0][1]) ** 2), 0, 2 * Math.PI);
            gc.stroke();
            n = 0;tab=[];
    
        }
        imageData = gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height);
    }

}


class Dessein {
    static start() {
        gameCanvas.addEventListener("mouseup", Dessein.up);
        gameCanvas.addEventListener("mousedown", Dessein.down);
        gameCanvas.addEventListener("mousemove", Dessein.draw);
        gameCanvas.addEventListener("mouseleave", Dessein.leave);
    }
    static up(e) {
        if (!rasm) return;
        rasm = false;


        gc.putImageData(imageData, 0, 0);

        let [x, y] = proximate(e.offsetX, e.offsetY);
        drawLine(lowlaX, lowlaY, x, y);

        //drawLine((sX - lowlaX) + sX, (sY - lowlaY) + sY, (sX - x) + sX, (sY - y) + sY);

        point(x, y, "red", 5);


        imageData = gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height);

    }

    static draw(e) {
        gc.putImageData(imageData, 0, 0);

        // curseur rouge dessein
        [xlocate, ylocate] = proximate(e.offsetX, e.offsetY);
        point(xlocate, ylocate, "red", 5);


        if (!rasm) return;


        // tmp line
        gc.strokeStyle = ((theme == "dark") ? 'white' : 'black');
        gc.lineWidth = 4;

        let x = e.offsetX;
        let y = e.offsetY;

        gc.putImageData(imageData, 0, 0);
        drawLine(lowlaX, lowlaY, x, y);


        // curseur red tmp
        point(x, y, "red", 5);


        // curseur gris visuer 
        [x, y] = proximate(x, y);
        gc.lineWidth = 0.8;
        gc.beginPath();
        gc.arc(x, y, 8, 0, 2 * Math.PI);
        gc.stroke();
        gc.closePath()

        // yweli khel
        gc.strokeStyle = ((theme == "dark") ? 'white' : 'black');
        gc.lineWidth = 4;

    }

    static down(e) {
        imageDataSaint = gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height);
        rasm = true;
        [lowlaX, lowlaY] = proximate(e.offsetX, e.offsetY);
        imageData = gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height);

    }

    static leave(e) {
        if (e.buttons) {
            gc.putImageData(imageDataSaint, 0, 0);
            rasm = false;
        }
    }
}

function createCanvas(){
    gameCanvas = document.getElementById("drawCanvas");
    gameCanvas.width = 1200;
    gameCanvas.height = 600;
    gc = gameCanvas.getContext("2d");
    gc.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    lines();
    imageData = gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height);

    gc.strokeStyle = ((theme == "dark") ? 'white' : 'black');
    gc.lineWidth = 4;
}


function curseur(e) {
    gc.putImageData(imageData, 0, 0);

    // curseur rouge dessein
    
    let [x, y] = proximate(e.offsetX, e.offsetY);
    point(x, y, "red", 5);
}


function lines() {
    gc.fillStyle = ((theme == "dark") ? 'black' : 'white');
    gc.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    gc.strokeStyle = ((theme == "dark") ? 'white' : 'black');

    for (let i = 0; i < gameCanvas.width; i += unity) {
        drawLine(i, 0, i, gameCanvas.height);
    }

    for (let i = 0; i < gameCanvas.height; i += unity) {
        drawLine(0, i, gameCanvas.width, i);
    }
}


function point(x, y, color, w) {
    gc.beginPath();
    gc.fillStyle = color;
    gc.arc(x, y, w, 0, 2 * Math.PI);
    gc.fill();
}



function drawLine(x1, y1, x2, y2) {

    gc.beginPath();
    gc.moveTo(x1, y1);
    gc.lineTo(x2, y2);
    gc.stroke();
}

function proximate(xlocate, ylocate) {
    let pfx = xlocate % unity;
    xlocate = ((pfx > unity/2) ? xlocate - pfx + unity : xlocate - pfx);
    let pfy = ylocate % unity;
    ylocate = ((pfy > unity/2) ? ylocate - pfy + unity : ylocate - pfy);
    return [xlocate, ylocate]
}
