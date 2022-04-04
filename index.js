// Globals
const unity = 40; let theme = false;
var gameCanvas, gc;
var imageData, initial, imageZero; // Images of canvas

// Used by deplacerpolygone
let allshapes = [];
let objetDP = null;

// Used by dessein
let lowlaX, lowlaY, xlocate, ylocate,rasm;

// Used by Polylibre
let tab; 
let n, N;
let restore_array=[],redo_array=[],redoInd,index;
let polygons=[];
let deplacable = false,modeDeplac = false;


let polyInd,tabInd;






addEventListener("load", load);

function load() {
    document.getElementById("reset").addEventListener("click", load);
    createCanvas();
    setUP();
    
}
class Fill {
    static start() {
        gameCanvas.addEventListener("mousemove", Fill.select);
        gameCanvas.addEventListener("click", Fill.fill);
    }

    static select(e){
        gameCanvas.classList.remove("deplacer");
        gc.putImageData(imageData,0,0)

        let x= e.offsetX; let y= e.offsetY;
        for(let i=allshapes.length-1; i>=0;i--){
            if( Math.abs(allshapes[i].x-x)<=allshapes[i].u && Math.abs(allshapes[i].y-y)<= allshapes[i].u){
                gameCanvas.classList.add("deplacer");
                gc.strokeStyle = "purple";
                Polygone.polygone(allshapes[i]);
                gc.strokeStyle = ((theme == false) ? 'white' : 'black');
                return
            }
        }
    }
    static fill(e){
        let done = false
        let x= e.offsetX; let y= e.offsetY;
        gc.putImageData(imageZero, 0,0)
        for(let i=0; i<allshapes.length;i++){
            if( Math.abs(allshapes[i].x-x)<=allshapes[i].u && Math.abs(allshapes[i].y-y)<= allshapes[i].u && !done){
                allshapes[i].filled=!allshapes[i].filled
                done =true
            }
            Polygone.polygone(allshapes[i])
        }
        imageData=gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height);
    }

    static end(){
        gameCanvas.removeEventListener("mousemove", Fill.select);
        gameCanvas.removeEventListener("click", Fill.fill);        
    }
}
class Remove{
    static start() {
        gameCanvas.addEventListener("mousemove", Remove.select);
        gameCanvas.addEventListener("click", Remove.remove);
    }

    static select(e){
        gameCanvas.classList.remove("deplacer");
        gc.putImageData(imageData,0,0)

        let x= e.offsetX; let y= e.offsetY;
        for(let i=allshapes.length-1; i>=0;i--){
            if( Math.abs(allshapes[i].x-x)<=allshapes[i].u && Math.abs(allshapes[i].y-y)<= allshapes[i].u){
                gameCanvas.classList.add("deplacer");
                gc.strokeStyle = "red";
                Polygone.polygone(allshapes[i]);
                gc.strokeStyle = ((theme == false) ? 'white' : 'black');
                return
            }
        }
    }
    static remove(e){
        let done = false
        let x= e.offsetX; let y= e.offsetY;
        gc.putImageData(imageZero, 0,0)
        for(let i=0; i<allshapes.length;i++){
            if( Math.abs(allshapes[i].x-x)<=allshapes[i].u && Math.abs(allshapes[i].y-y)<= allshapes[i].u && !done){
                allshapes.splice(i,1)
                i--;done =true

            }else{ 
                Polygone.polygone(allshapes[i])
            }
        }
        imageData=gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height);
    }



    static end() {
        gameCanvas.removeEventListener("mousemove", Remove.select);
        gameCanvas.removeEventListener("click", Remove.remove);
    }

}

class PolygoneDeplacer {
    static start() {
        gameCanvas.addEventListener("mousemove", PolygoneDeplacer.move);
        gameCanvas.addEventListener("mouseup", PolygoneDeplacer.up);
        gameCanvas.addEventListener("mousedown", PolygoneDeplacer.down);
    }

    static move(e){
        
        if(objetDP==null){
        PolygoneDeplacer.select(e);
        }else{
        PolygoneDeplacer.animate(e);
        }
    }

    static animate(e){

        let x=e.offsetX,y= e.offsetY;
        let {u, type, filled} = objetDP;

        gc.putImageData(initial,0,0);
        for(let i=allshapes.length-1; i>=0;i--){
            
            if((allshapes[i])==(objetDP)){
                gc.strokeStyle = "blue";
                Polygone.polygone({x,y,u,type, filled})
                gc.strokeStyle = ((theme == false) ? 'white' : 'black');
            }
        } 
        
    }
    static up(e){
        
        if (objetDP == null) return;
        
        let {x , y} = proximate(e.offsetX, e.offsetY);
        let {u, type, filled} = objetDP;

        gc.putImageData(initial,0,0);
        for(let i=allshapes.length-1; i>=0;i--){
            
            if((allshapes[i])==(objetDP)){
                allshapes[i]={x, y, u, type, filled}
                Polygone.polygone(allshapes[i])
            
            }
        }
        objetDP=null;
        
        initial = gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height);
        
        imageData = gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height);
        restore_array.push(imageData)
        index++

        

    }



    static down(e){
        objetDP=null
        let x= e.offsetX; let y= e.offsetY;
        gc.putImageData(imageZero,0,0);
        for(let i=allshapes.length-1; i>=0;i--){
            if( Math.abs(allshapes[i].x-x)<=allshapes[i].u && Math.abs(allshapes[i].y-y)<= allshapes[i].u && objetDP==null){
                objetDP = allshapes[i]  
            }else{
                Polygone.polygone(allshapes[i])
            }
        }
        initial = gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height);
        if(allshapes.length!=0){
        gc.strokeStyle = "blue";Polygone.polygone(objetDP);gc.strokeStyle = ((theme == false) ? 'white' : 'black');
        }
    }
    
    
    static select(e){
        gameCanvas.classList.remove("deplacer");
        gc.putImageData(imageData,0,0)

        let x= e.offsetX; let y= e.offsetY;
        for(let i=allshapes.length-1; i>=0;i--){
            if( Math.abs(allshapes[i].x-x)<=allshapes[i].u && Math.abs(allshapes[i].y-y)<= allshapes[i].u){
                gameCanvas.classList.add("deplacer");
                gc.strokeStyle = "blue";
                Polygone.polygone(allshapes[i]);
                gc.strokeStyle = ((theme == false) ? 'white' : 'black');
                return
            }
        }
    }

    static end() {
        gameCanvas.removeEventListener("mousemove", PolygoneDeplacer.move);
        gameCanvas.removeEventListener("mouseup", PolygoneDeplacer.up);
        gameCanvas.removeEventListener("mousedown", PolygoneDeplacer.down);
    }

}


class Polygone {
    static start() {
        gameCanvas.addEventListener("mousemove", curseur);
        gameCanvas.addEventListener("click", Polygone.drawPolygone);
    }
    
    static drawPolygone(e){
        gc.putImageData(imageData, 0, 0);
        let {x, y} = proximate(e.offsetX, e.offsetY); // Centre
        
        //let u = (Math.floor(Math.random() * 2) +1)*unity; //taille
        //let type = Math.floor(Math.random() * 7)+1; //type
        let u = unity;
        let type = 4;
        let filled = false
        console.log({x, y, u, type});
        Polygone.polygone({x, y, u, type, filled})

        allshapes.push({x, y, u, type, filled}) // store the center and the type

        imageData = gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height);
        restore_array.push(imageData);
        index+=1;

        console.log(JSON.stringify(imageData));


    }

    static polygone({x, y, u, type, filled}) {   
        switch(type){
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
                //Polygone.three(x, y, u);
                Polygone.four_2_1(x, y, u);
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

        if(filled){
        gc.fillStyle="#359F00"
        gc.fill();
        gc.fillStyle="red"
        }   

        
        
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
        gameCanvas.removeEventListener("click", Polygone.drawPolygone);

    }
   
}


class PolylibreDeplacer{

    static start(){
        gameCanvas.addEventListener("mousedown",PolylibreDeplacer.down);
        // gameCanvas.addEventListener("mouseup",PolylibreDeplacer.up);
        gameCanvas.addEventListener("mousemove", PolylibreDeplacer.select);
    }

    

    static select(e){
        gameCanvas.classList.remove("deplacer");
        gc.putImageData(imageData,0,0)
        let {x , y} = proximate(e.offsetX,e.offsetY);
        
        if (!deplacable){
            for (const [ind,obj] of polygons.entries()) {
                for (const [index,coord] of obj.tab.entries()) {
                    if ( JSON.stringify({x,y}) == JSON.stringify(coord) ){
                        gameCanvas.classList.add("deplacer");
                        return;
                    }else{
                        // deplacable = false;
                        }
                }
            }
        }       
    } 

    static down(e){
        objetDP=null;
        let {x , y} = proximate(e.offsetX,e.offsetY);
        // gc.putImageData(imageZero,0,0);
        if (!deplacable){
            for (const [ind,obj] of polygons.entries()) {
                for (const [index,coord] of obj.tab.entries()) {
                    if ( JSON.stringify({x,y}) == JSON.stringify(coord) ){
                        objetDP = obj.tab[index];
                    }else{
                        // deplacable = false;
                        // console.log(obj);
                        Polylibre.polygone(obj);
                        // console.log(coord,{x,y});
                    }
                }
            }
        }       
        initial = gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height);
        // Polylibre.polygone(objetDP);
    }
    
    static up(e){
        console.log(objetDP,"khra");
        if (objetDP == null) return;
        
        let {x , y} = proximate(e.offsetX, e.offsetY);
        let  z = objetDP.y;
        let t =objetDP.x;
        gc.putImageData(initial,0,0);
        for (const [ind,obj] of polygons.entries()) {
            for (const [index,coord] of obj.tab.entries()) {
                if ( JSON.stringify(objetDP) == JSON.stringify(coord) ){
                    console.log(obj);
                    obj.tab[index] = {x,y};
                    console.log(obj);
                    Polylibre.polygone(obj);
                }
            }
        }
        objetDP=null;
        
        initial = gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height);
        imageData = gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height);
        restore_array.push(imageData)
        index++

    }

    static end(){
        gameCanvas.removeEventListener("mousemove",curseur);
        gameCanvas.removeEventListener("click",Polylibre.draw);
    }
}

class Polylibre{

    static start() {
        n= N = 5;// num of line/polygone/0forrond
        tab = [];

        gameCanvas.addEventListener("mousemove", curseur);
        gameCanvas.addEventListener("click", Polylibre.draw);
    }

    static polygone({tab,N}){
        // console.log(tab);
        switch (N) {
            case 0:
                
                break;
            
            
            default:
                for (let index = 0; index < N; index++) {
                    point(tab[index].x,tab[index].y,"green",5);
                    drawLine(tab[index].x,tab[index].y,tab[(index+1)%N].x,tab[(index+1)%N].y)
                    
                }
                break;
        }             
    }

    // static move(){
    //     gameCanvas.addEventListener("mousedown",Polylibre.down);
    //     gameCanvas.addEventListener("mouseup",Polylibre.up);
    //     gameCanvas.addEventListener("mousemove", deplacer);
    // }

    // static down(e){
    //     let {x , y} = proximate(e.offsetX,e.offsetY);
    //     if (!deplacable){
    //         for (const [ind,tab] of polygons.entries()) {
    //             for (const [index,coord] of tab.entries()) {
    //                 if ( JSON.stringify({x,y}) == JSON.stringify(coord) ){
    //                     deplacable = true;
    //                     tabInd = index;
    //                     polyInd = ind;
    //                     return;
    //                 }else{
    //                     deplacable = false;
    //                     console.log(coord,{x,y});
    //                 }
    //             }
    //         }
    //     }
        
    // }

    // static up(e){
    //     if (!deplacable) return;
    //     deplacable = false;

    //     gc.putImageData(imageData, 0, 0);
    //     let poly = polygons[polyInd];
    //     console.log(poly,tabInd);
    //     let realInd = (tabInd-1 <0)?poly.length-1:tabInd-1;
    //     let {x, y} = proximate(e.offsetX, e.offsetY);
    //     poly[tabInd] = proximate(e.offsetX, e.offsetY);
    //     drawLine(poly[(realInd)%poly.length].x, poly[(realInd)%poly.length].y, x, y);
    //     drawLine(poly[(tabInd+1)%poly.length].x, poly[(tabInd+1)%poly.length].y, x, y);


    //     point(x, y, "green", 5);

    //     imageData = gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height);
    //     restore_array.push(imageData)
    //     index+=1
    //     deplacable = false
    // }

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
            polygons.push({tab,N});
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
            gc.strokeStyle = ((theme == false) ? 'white' : 'black');
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

    static end(){
        gameCanvas.removeEventListener("mousemove", curseur);
        gameCanvas.removeEventListener("click", Polylibre.draw);
    }

}


class Dessein {
    static start() {
        gameCanvas.addEventListener("mouseup", Dessein.up);
        gameCanvas.addEventListener("mousedown", Dessein.down);
        gameCanvas.addEventListener("mousemove", Dessein.draw);
        
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
        gc.strokeStyle = ((theme == false) ? 'white' : 'black');
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
        gc.strokeStyle = ((theme == false) ? 'white' : 'black');
        gc.lineWidth = 4;

    }

    static down(e) {
        rasm = true;
        lowlaX = proximate(e.offsetX, e.offsetY).x;
        lowlaY = proximate(e.offsetX, e.offsetY).y;
        imageData = gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height);

    }
    static end() {
        gameCanvas.removeEventListener("mouseup", Dessein.up);
        gameCanvas.removeEventListener("mousedown", Dessein.down);
        gameCanvas.removeEventListener("mousemove", Dessein.draw);
        
    }

}


    


function createCanvas(){
    gameCanvas = document.getElementById("drawCanvas");
    gameCanvas.width = 1200;
    gameCanvas.height = 600;
    gc = gameCanvas.getContext("2d");
    gc.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    lines();
    imageZero = initial = imageData = gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height);

    gc.strokeStyle = ((theme == false) ? 'white' : 'black');
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
    gc.fillStyle = ((theme == false) ? 'black' : 'white');
    gc.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    gc.strokeStyle = ((theme == false) ? 'white' : 'black');

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
        load();
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

function setUP(){

    allshapes=[]
    
    if (index!=0 && index!=-1)
    redo_array=[];
    restore_array=[];
    index=-1;
    redoInd=-1;

    document.getElementById("undo").addEventListener("click", undo_last);
    document.getElementById("redo").addEventListener("click", redo_last);
    document.getElementById("deplacer").addEventListener("click" , function () {chooseEvent("deplacer")});
    document.getElementById("remove").addEventListener("click" , function () {chooseEvent("remove")});
    document.getElementById("polygone").addEventListener("click" , function () {chooseEvent("polygone")});
    document.getElementById("fill").addEventListener("click", function () {chooseEvent("fill")});
    document.getElementById("dark").addEventListener("click", function () {alert("Everything will be lost!"); theme = !theme; load()});
}



function endEvents(){
    Polygone.end();
    PolygoneDeplacer.end();
    Remove.end();
    Fill.end();

}

function chooseEvent(button){
    endEvents();
    switch(button){
        case "polygone":
            Polygone.start();
            break;
        case "deplacer":
            PolygoneDeplacer.start();
            break;
        case "remove":
            Remove.start();
            break;
        case "fill":
            Fill.start();
            break;
    }

}