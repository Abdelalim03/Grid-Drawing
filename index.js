
// Globals
const unity = 50,theme = "dark";
var gameCanvas, gc;
var imageData, imageDataSaint;

// Used by dessein
let lowlaX, lowlaY, xlocate, ylocate,rasm;

// Used by Polylibre
let tab; 
let n, N;
let restore_array=[],redo_array=[],redoInd,index;
let undo,redo,deplac;
let polygons=[];
let deplacable = false,modeDeplac = false;
// let leave=false;

let polyInd,tabInd;

addEventListener("load", load);

function load() {
    document.getElementById("reset").addEventListener("click", load);
    createCanvas();
    undo = document.getElementById("undo");
    redo = document.getElementById("redo");
    deplac = document.getElementById("deplac");
    restore_array=[];
    index=-1;
    redoInd=-1;
    undo.addEventListener("click",undo_last);
    redo.addEventListener("click",redo_last);
    deplac.addEventListener("click",function () {
        if (!modeDeplac){
            Polylibre.move();
            gameCanvas.classList.add("deplacer");
            modeDeplac = true;
        }else {
            Polylibre.start();
            gameCanvas.classList.remove("deplacer");
            modeDeplac = false;
        }
    }
)
    // Dessein.start();
    // Polygone.start();
    if (!modeDeplac){
        Polylibre.start();
    }else {
        Polylibre.move();
    }
}


class Polygone {
    static start() {
        gameCanvas.addEventListener("mousemove", curseur);
        gameCanvas.addEventListener("click", Polygone.polygone);
    
    }
    
    static polygone(e) {
        gc.putImageData(imageData, 0, 0);
        let {x, y} = proximate(e.offsetX, e.offsetY);
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
        restore_array.push(imageData);
        index+=1;
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
        n= N = 5;// num of line/polygone/0forrond
        tab = [];
        gameCanvas.removeEventListener("mouseup",Polylibre.up);
        gameCanvas.removeEventListener("mousemove",curseur);
        gameCanvas.removeEventListener("mousedown",Polylibre.down);
        gameCanvas.addEventListener("mousemove", curseur);
        gameCanvas.addEventListener("click", Polylibre.draw);
    }

    static move(){
        gameCanvas.removeEventListener("mousemove",curseur);
        gameCanvas.removeEventListener("click",Polylibre.draw);
        gameCanvas.addEventListener("mousedown",Polylibre.down);
        gameCanvas.addEventListener("mouseup",Polylibre.up);
        // gameCanvas.addEventListener("mousemove", deplacer);

    }

    static down(e){
        
        let {x , y} = proximate(e.offsetX,e.offsetY);
        if (!deplacable){
            for (const [ind,tab] of polygons.entries()) {
                for (const [index,coord] of tab.entries()) {
                    if ( JSON.stringify({x,y}) == JSON.stringify(coord) ){
                        console.log('djanitou');
                        deplacable = true;
                        tabInd = index;
                        polyInd = ind;
                        return;
                    }else{
                        deplacable = false;
                        console.log(coord,{x,y});
                    }
                }
            }
        }
        console.log(tabInd,polyInd,deplacable);
        
    }

    static up(e){
        console.log('yaaw');
        if (!deplacable) return;
        deplacable = false;
        console.log('aaw');

        gc.putImageData(imageData, 0, 0);
        let poly = polygons[polyInd];
        console.log(poly,tabInd);
        let realInd = (tabInd-1 <0)?poly.length-1:tabInd-1;
        let {x, y} = proximate(e.offsetX, e.offsetY);
        poly[tabInd] = proximate(e.offsetX, e.offsetY);
        drawLine(poly[(realInd)%poly.length].x, poly[(realInd)%poly.length].y, x, y);
        drawLine(poly[(tabInd+1)%poly.length].x, poly[(tabInd+1)%poly.length].y, x, y);

        //drawLine((sX - lowlaX) + sX, (sY - lowlaY) + sY, (sX - x) + sX, (sY - y) + sY); tanador lmi7wari

        point(x, y, "green", 5);

        imageData = gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height);
        restore_array.push(imageData)
        index+=1
        deplacable = false
    }

    static draw(e) {
        
        switch(1){
            case 1:
                Polylibre.cor(e, false);
                break;
            case 2:
                Polylibre.rond(e);
                break;
        }
    }
    

    static cor(e, lOnly) {
        let {x, y} = proximate(e.offsetX, e.offsetY);
        point(x, y, "green", 5);
    
        // wahmi
        gc.lineWidth = 1;
        if (tab.length != 0) {
            drawLine(x, y, tab[tab.length - 1].x, tab[tab.length - 1].y)
        }
        tab.push({x, y});
        n -= 1;
        gc.lineWidth = 3;
        if (n == 0) {
            for (let i = 0; i < N - 1; i++) {
                drawLine(tab[i].x, tab[i].y, tab[i + 1].x, tab[i + 1].y)
            }
            if(!lOnly){
            drawLine(tab[0].x,tab[0].y,tab[N-1].x,tab[N-1].y)
        }
            n = N;
            polygons.push(tab);
            tab = []
        }
        imageData = gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height);
        restore_array.push(imageData)
        index+=1
    }
    
    static rond(e) {
        gc.putImageData(imageData, 0, 0);
        if (n == 0) {
            let {x, y} = proximate(e.offsetX, e.offsetY);
            tab.push({x, y})
            point(x, y, "green", 5);
            n += 1
        } else {
            let {x, y} = proximate(e.offsetX, e.offsetY);
            point(x, y, "green", 5);
            gc.strokeStyle = ((theme == "dark") ? 'white' : 'black');
            gc.lineWidth = 3;
            gc.beginPath();
            gc.arc(tab[0].x, tab[0].y, Math.sqrt((x - tab[0].x) ** 2 + (y - tab[0].y) ** 2), 0, 2 * Math.PI);
            gc.stroke();
            n = 0;tab=[];
    
        }
        imageData = gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height);
        restore_array.push(imageData)
        index+=1
    }

}


class Dessein {
    static start() {
        gameCanvas.addEventListener("mouseup", Dessein.up);
        gameCanvas.addEventListener("mousedown", Dessein.down);
        gameCanvas.addEventListener("mousemove", Dessein.draw);
        // gameCanvas.addEventListener("mouseleave", Dessein.leave);
    }
    static up(e) {
        
        if (!rasm) return;
        rasm = false;


        gc.putImageData(imageData, 0, 0);

        let {x, y} = proximate(e.offsetX, e.offsetY);
        drawLine(lowlaX, lowlaY, x, y);

        //drawLine((sX - lowlaX) + sX, (sY - lowlaY) + sY, (sX - x) + sX, (sY - y) + sY); tanador lmi7wari

        point(x, y, "red", 5);


        imageData = gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height);
        restore_array.push(imageData)
        index+=1
    }

    static draw(e) {
        if (e.buttons!=1){
            rasm=false;
          }
        gc.putImageData(imageData, 0, 0);

        // curseur rouge dessein
        xlocate = proximate(e.offsetX, e.offsetY).x;
        ylocate = proximate(e.offsetX, e.offsetY).y;
        point(xlocate, ylocate, "red", 5);


        if (!rasm ) {
            // if (leave) undo_last();
            return;
        };


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
        ({x, y} = proximate(x, y));
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
        lowlaX = proximate(e.offsetX, e.offsetY).x;
        lowlaY = proximate(e.offsetX, e.offsetY).y;
        imageData = gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height);

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
    
    let {x, y} = proximate(e.offsetX, e.offsetY);
    point(x, y, "red", 5);
}

function deplacer(e) {
    if (!deplacable) return;
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

function proximate(x, y) {
    let pfx = x % unity;
    x = ((pfx > unity/2) ? x - pfx + unity : x - pfx);
    let pfy = y % unity;
    y = ((pfy > unity/2) ? y - pfy + unity : y - pfy);
    return {x, y}
}

function undo_last() {
    if (index<=0){
        load()
    }else{
        console.log(redo_array);
        redo_array.push(restore_array.pop())
        index-=1
        imageData=restore_array[index]
        gc.putImageData(imageData,0,0) 
    }
    
  }

  function redo_last() {
        if(redo_array.length>0){
            restore_array.push(redo_array.pop())
            index+=1
            imageData=restore_array[restore_array.length-1]
            gc.putImageData(imageData,0,0)
        }
  }
