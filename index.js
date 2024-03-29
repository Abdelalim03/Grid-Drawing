// Globals
const unity = 40; let theme = false;
var gameCanvas, gc;
var imageData, initial, imageZero; 

// Used by deplacerpolygone
let allshapes = [];
let objetDP = null;

// Used by dessein
let lowlaX, lowlaY, xlocate, ylocate,rasm;
let allLines = [];

let objetDes = null;

let pos;
let points=[];
let objetP=null;


// Used by Polylibre
let tab; 
let n, N;

let polygons=[];
let deplacable = false,modeDeplac = false;
let objetLib = null,pointDP = null;




let fillCol = "green";
let strokeCol = ((theme == false) ? 'white' : 'black');
let mode = null;
let mode_2 = null;
let tabInd;
let rotateDeg = 90;


// Used by Exercice
let imageSolution, imageReponse;

let question

let preLines= []; 
let preShapes= []; 
let preDashed= [];
let prePoints= [];

let solutionShapes= [];
let solutionLines = [];
let solutionPoints= [];



    // Stock the data of each exercice as strings ?
let preLinesString,preShapesString,solutionShapesString,solutionLinesString,allshapesString,preDashedString, prePointString, solutionPointString
let typeOfCheck,allowed_delta=0


addEventListener("load", load);

class Point {
    static start() {
        
        gameCanvas.addEventListener("mousemove",(e)=> curseur(e,strokeCol));
        gameCanvas.addEventListener("click", Point.click);
        
    }
    static click(e){
        gc.putImageData(imageData, 0, 0);

        let {x, y} = proximate(e.offsetX, e.offsetY);

        point(x,y,strokeCol,5);

        points.push({x,y,stroked:strokeCol});

        imageData = gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height);
        
        
    }


    static end() {
        gameCanvas.removeEventListener("click", Point.click);
        gameCanvas.removeEventListener("mousemove", Point.move);
        
    }
}

class Fill {
    static start() {
        gameCanvas.addEventListener("mousemove", Fill.select);
        gameCanvas.addEventListener("click", Fill.fill);
    }

    static select(e){
        gameCanvas.classList.remove("fill");
        gc.putImageData(imageData,0,0)

        let x= e.offsetX; let y= e.offsetY;
        for(let i=allshapes.length-1; i>=0;i--){
            if( Math.abs(allshapes[i].x-x)<=allshapes[i].u && Math.abs(allshapes[i].y-y)<= allshapes[i].u){
                gameCanvas.classList.add("fill");
                let {x,y,u,type,filled,stroked}=allshapes[i]
                stroked="Pink"
                Polygone.polygone({x,y,u,type,filled,stroked});
                
                return
            }
        }
    }
    static fill(e){
        let done = false
        let x= e.offsetX; let y= e.offsetY;
        gc.putImageData(imageZero, 0,0)
        for(let i=allshapes.length-1; i>=0;i--){
            if( Math.abs(allshapes[i].x-x)<=allshapes[i].u && Math.abs(allshapes[i].y-y)<= allshapes[i].u && !done){
                if(allshapes[i].filled==fillCol)
                allshapes[i].filled=false;
                else allshapes[i].filled=fillCol;
                done =true
            }
            
        }
        redrawAll();
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
        gameCanvas.classList.remove("remove");
        gc.putImageData(imageData,0,0)

        let x= e.offsetX; let y= e.offsetY;
        for(let i=allshapes.length-1; i>=0;i--){
            if( Math.abs(allshapes[i].x-x)<=allshapes[i].u && Math.abs(allshapes[i].y-y)<= allshapes[i].u){
                gameCanvas.classList.add("remove");
                let removedObj = JSON.parse(JSON.stringify(allshapes[i]));
                removedObj.stroked = "OrangeRed";
                Polygone.polygone(removedObj);
                gc.strokeStyle = strokeCol;
                return
            }
        }
        for(let i=allLines.length-1; i>=0;i--){
            if (Math.min(allLines[i].xd,allLines[i].xf)-10<=x && x<=Math.max(allLines[i].xd,allLines[i].xf)+10 && Math.min(allLines[i].yd,allLines[i].yf)-10<=y && y<=Math.max(allLines[i].yd,allLines[i].yf)+10 && belongToLine(allLines[i],x,y)){
                gameCanvas.classList.add("remove");
                let removedObj = JSON.parse(JSON.stringify(allLines[i]));
                removedObj.stroked = "OrangeRed";
                
                Dessein.drawline(removedObj);
                
                gc.strokeStyle = strokeCol;
                return
            }
        }
        for(let j=polygons.length-1; j>=0;j--){
            
            if (!polygons[j].N);
            else{
                let tmpTab=polygons[j].tab;
                for(let i=0; i<tmpTab.length-1;i++){
                    if (Math.min(tmpTab[i].x,tmpTab[i+1].x)<=x && x<=Math.max(tmpTab[i].x,tmpTab[i+1].x) && Math.min(tmpTab[i].y,tmpTab[i+1].y)<=y && y<=Math.max(tmpTab[i].y,tmpTab[i+1].y) && belongToLine({xd:tmpTab[i].x,xf:tmpTab[i+1].x,yd:tmpTab[i].y,yf:tmpTab[i+1].y},x,y)){
                        gameCanvas.classList.add("remove");
                        let removedObj = JSON.parse(JSON.stringify(polygons[j]));
                        removedObj.stroked = "OrangeRed";
                        Polylibre.polygone(polygons[j]);
                        gc.strokeStyle = strokeCol;
                        return
                    }
                }
                if (!polygons[j].lOnly) {
                    if (Math.min(tmpTab[tmpTab.length-1].x,tmpTab[0].x)<=x && x<=Math.max(tmpTab[tmpTab.length-1].x,tmpTab[0].x) && Math.min(tmpTab[tmpTab.length-1].y,tmpTab[0].y)<=y && y<=Math.max(tmpTab[tmpTab.length-1].y,tmpTab[0].y) && belongToLine({xd:tmpTab[tmpTab.length-1].x,xf:tmpTab[0].x,yd:tmpTab[tmpTab.length-1].y,yf:tmpTab[0].y},x,y)){
                        gameCanvas.classList.add("remove");
                        let removedObj = JSON.parse(JSON.stringify(polygons[j]));
                        removedObj.stroked = "OrangeRed";
                        Polylibre.polygone(polygons[j]);
                        gc.strokeStyle = strokeCol;
                        return
                    }
                }
            }
            
            
        }
        ({x,y} = proximate(e.offsetX,e.offsetY));
        for(let i=points.length-1; i>=0;i--){
            if (points[i].x==x && points[i].y==y){
                gameCanvas.classList.add("remove");
                point(points[i].x,points[i].y,"OrangeRed",5);
                return
            }
        }
    }
    static remove(e){
        
        let done = false
        let x= e.offsetX; let y= e.offsetY;
        gc.putImageData(imageZero, 0,0);
        for(let i=allshapes.length-1; i>=0;i--){
            if( Math.abs(allshapes[i].x-x)<=allshapes[i].u && Math.abs(allshapes[i].y-y)<= allshapes[i].u && !done){
                allshapes.splice(i,1)
                i--;done =true
            }else{ 
                // Polygone.polygone(allshapes[i]);
            }
        }
        for(let i=allLines.length-1; i>=0;i--){
            if (Math.min(allLines[i].xd,allLines[i].xf)-10<=x && x<=Math.max(allLines[i].xd,allLines[i].xf)+10 && Math.min(allLines[i].yd,allLines[i].yf)-10<=y && y<=Math.max(allLines[i].yd,allLines[i].yf)+10 && belongToLine(allLines[i],x,y) && !done){
                allLines.splice(i,1)
                i--;done =true
                
            }else{
                // Dessein.drawline(allLines[i]);
            }       

        }

        for(let j=polygons.length-1; j>=0;j--){
            if (!polygons[j].N){

            }
            else{
                let tmpTab=polygons[j].tab;
                for(let i=0; i<tmpTab.length-1;i++){
                    if (Math.min(tmpTab[i].x,tmpTab[i+1].x)<=x && x<=Math.max(tmpTab[i].x,tmpTab[i+1].x) && Math.min(tmpTab[i].y,tmpTab[i+1].y)<=y && y<=Math.max(tmpTab[i].y,tmpTab[i+1].y) && belongToLine({xd:tmpTab[i].x,xf:tmpTab[i+1].x,yd:tmpTab[i].y,yf:tmpTab[i+1].y},x,y) && !done){
                        polygons.splice(j,1)
                        j--;done =true
                        break;
                    }
                }
                if (done) break;
                if (!polygons[j].lOnly) {
                    if (Math.min(tmpTab[tmpTab.length-1].x,tmpTab[0].x)<=x && x<=Math.max(tmpTab[tmpTab.length-1].x,tmpTab[0].x) && Math.min(tmpTab[tmpTab.length-1].y,tmpTab[0].y)<=y && y<=Math.max(tmpTab[tmpTab.length-1].y,tmpTab[0].y) && belongToLine({xd:tmpTab[tmpTab.length-1].x,xf:tmpTab[0].x,yd:tmpTab[tmpTab.length-1].y,yf:tmpTab[0].y},x,y) && !done){
                        polygons.splice(j,1)
                        j--;done =true
                    }
                }
            }
               
        }
        ({x,y} = proximate(e.offsetX,e.offsetY));
        for (let i = 0; i < points.length; i++) {
            if (points[i].x===x && points[i].y===y && !done){
                points.splice(i,1);
                i--;
                done=true;
            }
        }
    
        redrawAll();
        imageData=gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height);
    }



    static end() {
        gameCanvas.removeEventListener("mousemove", Remove.select);
        gameCanvas.removeEventListener("click", Remove.remove);
    }

}



class Deplacer {
    static start() {
        gameCanvas.addEventListener("mousemove", Deplacer.move);
        gameCanvas.addEventListener("mouseup", Deplacer.up);
        gameCanvas.addEventListener("mousedown", Deplacer.down);
    }

    static move(e){
        
        if(objetDP==null && objetDes==null && objetLib==null && objetP==null){
        Deplacer.select(e);
        }else{
        Deplacer.animate(e);
        }
    }

    static animate(e){
        
        let x=e.offsetX,y= e.offsetY;
        let u, type, filled;
        gc.putImageData(initial,0,0);
        if (objetDP){
        ({u, type, filled} = objetDP);
        
        for(let i=allshapes.length-1; i>=0;i--){
            
            if((allshapes[i])==(objetDP)){
                gc.strokeStyle = "blue";
                Polygone.polygone({x,y,u,type, filled});
                gc.strokeStyle = ((theme == false) ? 'white' : 'black');
            }
        } 
        return;
        }

        if (objetLib){
            let newObj = JSON.parse(JSON.stringify(objetLib))
            for(let i=polygons.length-1; i>=0;i--){
                if((polygons[i])==(objetLib)){
                    newObj.tab[tabInd] = {x,y};
                    Polylibre.polygone(newObj);
                    gc.strokeStyle = ((theme == false) ? 'white' : 'black');
                }
            }
            return;
            }
        
        if (objetDes){
            let newObj = JSON.parse(JSON.stringify(objetDes))
        for(let i=allLines.length-1; i>=0;i--){
            
            if((allLines[i])==(objetDes)){
                if (pos=="d") {newObj.xd=x;newObj.yd =y;}
                else {newObj.xf=x;newObj.yf =y;}
                Dessein.drawline(newObj);
                gc.strokeStyle = ((theme == false) ? 'white' : 'black');
            }
        }
        }
        if (objetP){
            let newObj = JSON.parse(JSON.stringify(objetP))
        for(let i=points.length-1; i>=0;i--){
            
            if((points[i])==(objetP)){
                newObj.x=x;
                newObj.y =y;
                
                point(newObj.x,newObj.y,newObj.stroked,5);
                gc.strokeStyle = ((theme == false) ? 'white' : 'black');
            }
        }
        }
        
    }

    static up(e){
        
        if (objetDP==null && objetDes==null && objetLib==null && objetP==null) return;
        gc.putImageData(initial,0,0);
        if (objetDP){
            let {x , y} = proximate(e.offsetX, e.offsetY);
            let {u, type, filled, stroked} = objetDP;
    
            
            for(let i=allshapes.length-1; i>=0;i--){
                
                if((allshapes[i])==(objetDP)){
                    allshapes[i]={x, y, u, type, filled, stroked}
                    Polygone.polygone(allshapes[i])
                }
            }
        }
        let {x , y} = proximate(e.offsetX, e.offsetY);
        if (objetLib){        

        for (let obj of polygons) {
            
                if ( JSON.stringify(objetLib) == JSON.stringify(obj) ){     
                    obj.tab[tabInd] = {x,y};
                    Polylibre.polygone(obj);
            }
        }
        }

        if (objetDes){
        for (let i=0;i<allLines.length;i++) {
            
                if ( JSON.stringify(objetDes) == JSON.stringify(allLines[i]) ){     
                    if (pos=="d") {
                        if(allLines[i].xf!==x || allLines[i].yf!==y){
                            allLines[i].xd=x;allLines[i].yd =y;
                            Dessein.drawline(allLines[i]);
                        }else{
                            allLines.splice(i,1);
                            i--;
                        }
                        
                    }
                    else {
                        if(allLines[i].xd!==x || allLines[i].yd!==y){
                            allLines[i].xf=x;allLines[i].yf =y;
                            Dessein.drawline(allLines[i]);
                        }else{
                            allLines.splice(i,1);
                            i--;
                        }
                        }
                    
            }
        }
        }

        if (objetP){
        for (let obj of points) {    
                if ( JSON.stringify(objetP) == JSON.stringify(obj) ){     
                    obj.x=x;
                    obj.y=y;
                    point(obj.x,obj.y,obj.stroked,5)
            }
        }
        }
        objetDP=null;
        objetDes=null;
        objetLib=null;
        objetP=null;
        initial = gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height);
        
        imageData = gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height);       

    }



    static down(e){
        objetDP=null;
        objetLib=null;
        objetDes=null;
        objetP=null;
        let x= e.offsetX; let y= e.offsetY;
        gc.putImageData(imageZero,0,0);
        
        for(let i=allshapes.length-1; i>=0;i--){
            if( Math.abs(allshapes[i].x-x)<=allshapes[i].u && Math.abs(allshapes[i].y-y)<= allshapes[i].u && objetDP==null){
                objetDP = allshapes[i] 
                break; 
            }
        }
        
       if (!objetDP){
        ({x , y} = proximate(e.offsetX,e.offsetY));
        for (const obj of polygons) {
                for (const [index,coord] of obj.tab.entries()) {
                    if ( JSON.stringify({x,y}) == JSON.stringify(coord) ){
                        objetLib = obj;
                        pointDP = obj.tab[index];
                        tabInd = index;
                        break;
                    }
                }
                if (objetLib!==null) break;
            }
       
        if (!objetLib){
        for(let i=allLines.length-1; i>=0;i--){
            if( allLines[i].xd == x && allLines[i].yd == y ){
                objetDes = allLines[i];
                pos = "d";   
                break;         
            }else if (allLines[i].xf == x && allLines[i].yf == y){
                objetDes = allLines[i];
                pos = "f";
                break;
            }
            
        }
        if (!objetDes){
            for (let i = 0; i < points.length; i++) {
                if (points[i].x==x && points[i].y==y){
                    objetP = points[i];
                    break;
                }
            }
        }
        }
        }
        redrawAll("deplacer"); 
        initial = gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height);
        if (objetLib!==null)
        Polylibre.polygone(objetLib);
        if (objetDes!==null)
        Dessein.drawline(objetDes);
        if (objetP!==null)
        point(objetP.x,objetP.y,objetP.stroked,5);
        if(objetDP){
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
                
                let {x,y,u,type,filled,stroked}=allshapes[i]
                stroked="blue"
                Polygone.polygone({x,y,u,type,filled,stroked});
                
                return
            }
        }
         ({x , y} = proximate(e.offsetX,e.offsetY));
        for (const [ind,obj] of polygons.entries()) {
            for (const [index,coord] of obj.tab.entries()) {
                if ( JSON.stringify({x,y}) == JSON.stringify(coord) ){
                    gameCanvas.classList.add("deplacer");
                    return;
                }
            }
        }
        for(let i=allLines.length-1; i>=0;i--){
               
            if( (allLines[i].xd == x && allLines[i].yd == y) || (allLines[i].xf == x && allLines[i].yf == y) ){
                gameCanvas.classList.add("deplacer");
                return
            }
        }
        for (let i = 0; i < points.length; i++) {
            if (points[i].x==x && points[i].y==y){
                gameCanvas.classList.add("deplacer");
                return
            }
        }

    }

    static end() {
        gameCanvas.removeEventListener("mousemove", Deplacer.move);
        gameCanvas.removeEventListener("mouseup", Deplacer.up);
        gameCanvas.removeEventListener("mousedown", Deplacer.down);
    }
}

class Rotate{
    static start() {
        gameCanvas.addEventListener("mousemove", Rotate.select);
        gameCanvas.addEventListener("click", Rotate.rotate);
    }

    static select(e){
        gameCanvas.classList.remove("rotate");
        gc.putImageData(imageData,0,0)

        let x= e.offsetX; let y= e.offsetY;
        for(let i=allshapes.length-1; i>=0;i--){
            if( Math.abs(allshapes[i].x-x)<=allshapes[i].u && Math.abs(allshapes[i].y-y)<= allshapes[i].u){
                gameCanvas.classList.add("rotate");
                let {x,y,u,type,filled,stroked}=allshapes[i]
                stroked="Chocolate"
                Polygone.polygone({x,y,u,type,filled,stroked});
                return
            }
        }
    }

    static rotate(e){
        let done = false
        let x= e.offsetX; let y= e.offsetY;
        gc.putImageData(imageZero, 0,0)
        for(let i=0; i<allshapes.length;i++){
            if( Math.abs(allshapes[i].x-x)<=allshapes[i].u && Math.abs(allshapes[i].y-y)<= allshapes[i].u && !done){
                switch(allshapes[i].type){
                    case 2:
                        if(rotateDeg==90) allshapes[i].type = 7;
                        break;
                    case 7:
                        if(rotateDeg==90)  allshapes[i].type = 2;
                        break;
                    case 6:
                        if(rotateDeg==90)  allshapes[i].type = 11;
                        break;
                    case 5:
                        if(rotateDeg==90) allshapes[i].type = 9;
                        else if (rotateDeg==180) allshapes[i].type =8; 
                        break;
                    case 8:
                        if(rotateDeg==90) allshapes[i].type = 10;
                        else if (rotateDeg==180) allshapes[i].type =5; 
                        break;
                    case 9:
                        if(rotateDeg==90) allshapes[i].type = 8;
                        else if (rotateDeg==180) allshapes[i].type = 10; 
                        break;
                    case 10:
                        if(rotateDeg==90) allshapes[i].type = 5;
                        else if (rotateDeg==180) allshapes[i].type = 9;
                        break;
                    case 11:
                        if(rotateDeg==90)  allshapes[i].type = 6;
                        break;
                    case 3:
                        if(rotateDeg==90) allshapes[i].type = 13;
                        else if (rotateDeg==180) allshapes[i].type = 15; 
                        break;
                    case 13:
                        if(rotateDeg==90) allshapes[i].type = 15;
                        else if (rotateDeg==180) allshapes[i].type = 14;
                        break;
                    case 14:
                        if(rotateDeg==90) allshapes[i].type = 3;
                        else if (rotateDeg==180) allshapes[i].type =13; 
                        break;
                    case 15:
                        if(rotateDeg==90) allshapes[i].type = 14;
                        else if (rotateDeg==180) allshapes[i].type = 3; 
                        break;
                    case 12:
                        if(rotateDeg==90)  allshapes[i].type = 17;
                        break;
                    case 17:
                        if(rotateDeg==90)  allshapes[i].type = 12;
                        break;
                    default:
                        break;
                }
                done =true;
            }
            
        }
        redrawAll();
        imageData=gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height);
    }

    static end() {
        gameCanvas.removeEventListener("mousemove", Rotate.select);
        gameCanvas.removeEventListener("click", Rotate.rotate);
    }
}

class Polygone {
    static start() {
        gameCanvas.addEventListener("mousemove", (e)=> curseur(e,"red"));
        gameCanvas.addEventListener("click", Polygone.drawPolygone);
    }
    
    static drawPolygone(e){
        gc.putImageData(imageData, 0, 0);
        let {x, y} = proximate(e.offsetX, e.offsetY); // Centre
        
        //let u = (Math.floor(Math.random() * 2) +1)*unity; //taille
        //let type = Math.floor(Math.random() * 7)+1; //type
        let u = unity;
        
        let table = [4,7]
        let type =table[Math.floor(Math.random() * table.length) ] ;
        let filled = false;
        let stroked = strokeCol;
        Polygone.polygone({x, y, u, type, filled,stroked})

        allshapes.push({x, y, u, type, filled,stroked}) // store the center and the type

        imageData = gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height);

    }

    static polygone({x, y, u, type, filled, stroked}) {   
        
        gc.strokeStyle=stroked;
        
               
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
                Polygone.three(x, y, u);
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
                break;
            case 8:
                Polygone.five_2_1(x,y,u);
                break;
            case 9:
                Polygone.five_2_2(x,y,u);
                break;
            case 10:
                Polygone.five_2_3(x,y,u);
                break;
            case 11:
                Polygone.six_2(x, y, u);
                break;
            //mou3ayan
            case 12:
                Polygone.four_3_1(x, y, u);
                break;
            case 13:
                Polygone.three_2(x, y, u);
                break;
            case 14:
                Polygone.three_2_3(x, y, u);
                break;
            case 15:
                Polygone.three_2_4(x, y, u);
                break;
            case 17:
                Polygone.four_3_2(x, y, u);
                break;
            default:
                break;

        }

        if(filled){
        gc.fillStyle=filled;
        gc.fill();
        gc.fillStyle="red"
        }  
        
        gc.strokeStyle=strokeCol;

        
        
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
    static five_2_1(x,y,u){
        gc.beginPath();
        gc.moveTo(x - 2*u, y );
        gc.lineTo(x - u, y - 2*u);
        gc.lineTo(x + u, y - 2*u);
        gc.lineTo(x + 2*u, y); 
        gc.lineTo(x, y + 2*u);
        gc.closePath();
        gc.stroke();
    }
    static five_2_2(x,y,u){
        gc.beginPath();
        gc.moveTo(x + 2*u, y );
        gc.lineTo(x , y - 2*u);
        gc.lineTo(x - 2*u, y - u);
        gc.lineTo(x - 2*u, y + u); 
        gc.lineTo(x, y + 2*u);
        gc.closePath();
        gc.stroke();
    }
    static five_2_3(x,y,u){
        gc.beginPath();
        gc.moveTo(x - 2*u, y );
        gc.lineTo(x , y - 2*u);
        gc.lineTo(x + 2*u, y - u);
        gc.lineTo(x + 2*u, y + u); 
        gc.lineTo(x, y + 2*u);
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
    static six_2(x, y, u){
        gc.beginPath();
        gc.moveTo(x - 2*u, y - u );
        gc.lineTo(x , y - 2*u);
        gc.lineTo(x + 2*u, y - u); 
        gc.lineTo(x + 2*u, y + u); 
        gc.lineTo(x , y + 2*u);
        gc.lineTo(x - 2*u, y + u);  
        gc.closePath();
        gc.stroke();
    }

    static three(x, y, u){
        gc.beginPath();
        gc.moveTo(x , y - u );
        gc.lineTo(x - u , y + u);
        gc.lineTo(x + u, y + u); 
          
        gc.closePath();
        gc.stroke();
    }
    static three_2(x, y, u){
        gc.beginPath();
        gc.moveTo(x +u , y  );
        gc.lineTo(x - u , y + u);
        gc.lineTo(x - u, y - u); 
          
        gc.closePath();
        gc.stroke();
    }
    static three_2_3(x, y, u){
        gc.beginPath();
        gc.moveTo(x - u , y  );
        gc.lineTo(x + u , y + u);
        gc.lineTo(x + u, y - u); 
          
        gc.closePath();
        gc.stroke();
    }
    static three_2_4(x, y, u){
        gc.beginPath();
        gc.moveTo(x  , y + u );
        gc.lineTo(x - u , y - u);
        gc.lineTo(x + u, y - u); 
          
        gc.closePath();
        gc.stroke();
    }

    static four_3_1(x, y, u){
        gc.beginPath();
        gc.moveTo(x  , y - 2*u );
        gc.lineTo(x - u , y );
        gc.lineTo(x , y + 2*u); 
        gc.lineTo(x + u , y );
        gc.closePath();
        gc.stroke();
    }
    static four_3_2(x, y, u){
        gc.beginPath();
        gc.moveTo(x  , y - u );
        gc.lineTo(x - 2*u , y );
        gc.lineTo(x , y + u); 
        gc.lineTo(x + 2*u , y );
          
        gc.closePath();
        gc.stroke();
    }

    static end(){
        gameCanvas.removeEventListener("mousemove", curseur);
        gameCanvas.removeEventListener("click", Polygone.drawPolygone);

    }
   
}


class Polylibre{
    static start() {
        n= N = Math.floor(Math.random() * 5) +1;// num of line/polygone/0forrond
        tab = [];
        gameCanvas.addEventListener("mousemove", (e)=> curseur(e,"red"));
        gameCanvas.addEventListener("click", Polylibre.draw);
    }

    static polygone({tab,N,lOnly,stroked}){
        // console.log(tab);
        gc.strokeStyle=stroked;
        switch (N) {
            case 0:

                break;
            default:
                
                let index;
                
                for (index = 0; index < tab.length-1; index++) {
                    // point(tab[index].x,tab[index].y,"green",5);
                    drawLine(tab[index].x,tab[index].y,tab[index+1].x,tab[index+1].y)
                    
                }
                if (!lOnly) drawLine(tab[index].x,tab[index].y,tab[0].x,tab[0].y)
                break;

        }   
       gc.strokeStyle=strokeCol;          
    }

    static draw(e) {
        
        let lOnly =  Math.floor(Math.random() * 2);
        switch(1){
            case 1:
                Polylibre.cor(e,  lOnly);
                break;
            case 2:
                Polylibre.rond(e);
                break;
        }
    }
    

    static cor(e, lOnly) {
        let {x, y} = proximate(e.offsetX, e.offsetY);
        gc.putImageData(imageData,0,0)
        // point(x, y, "green", 5);
    
        // wahmi
        
        gc.strokeStyle="green"
        gc.lineWidth = 2;
        if (tab.length != 0) {
            drawLine(x, y, tab[tab.length - 1].x, tab[tab.length - 1].y)
        }
        tab.push({x, y});
        
        n -= 1;
        gc.strokeStyle = strokeCol;
        gc.lineWidth = 4;
        if (n == 0) {
            for (let i = 0; i < N - 1; i++) {
                drawLine(tab[i].x, tab[i].y, tab[i + 1].x, tab[i + 1].y)
            }
            if(!lOnly){
            drawLine(tab[0].x,tab[0].y,tab[N-1].x,tab[N-1].y)
            }
            n = N;
            polygons.push({tab,N,lOnly,stroked:strokeCol});
            // console.log(polygons);
            tab = []
            
            
        }
        imageData = gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height);
        
    }
    
    static rond(e) {
        let lOnly = Math.floor(Math.random() * 2); 
        gc.putImageData(imageData, 0, 0);
        if (n == 0) {
            let {x, y} = proximate(e.offsetX, e.offsetY);
            tab.push({x, y})
            // point(x, y, "green", 5);
            n += 1
        } else {
            let {x, y} = proximate(e.offsetX, e.offsetY);
            // point(x, y, "green", 5);
            gc.strokeStyle = ((theme == false) ? 'white' : 'black');
            gc.lineWidth = 4;
            gc.beginPath();
            gc.arc(tab[0].x, tab[0].y, Math.sqrt((x - tab[0].x) ** 2 + (y - tab[0].y) ** 2), 0, 2 * Math.PI);
            gc.stroke();
            polygons.push({tab,N,lOnly});
            n = 0;tab=[];
        }
        imageData = gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height);
        
        
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
    
    static drawline({xd,yd,xf,yf,stroked}, dashed=false){
        if(!dashed){
        gc.strokeStyle = stroked;
        gc.lineWidth = 4;
        drawLine(xd,yd,xf,yf);
        gc.strokeStyle = strokeCol;
        }else{
            gc.beginPath();
            gc.moveTo(xd, yd);
            gc.lineTo(xf, yf);
            gc.strokeStyle = "red";
            gc.lineWidth = 4;
            gc.setLineDash([20, 10]);
            gc.stroke();
            gc.setLineDash([]);
            gc.strokeStyle = strokeCol
        }
    }

    static up(e) {
        
        if (!rasm) return;
        rasm = false;


        gc.putImageData(imageData, 0, 0);

        let {x, y} = proximate(e.offsetX, e.offsetY);
        if (x!==lowlaX || y!==lowlaY){
            allLines.push({xd:lowlaX,yd:lowlaY,xf:x,yf:y,stroked:strokeCol});
        gc.strokeStyle = strokeCol;
        gc.lineWidth = 4;
        drawLine(lowlaX, lowlaY, x, y);
        imageData = gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height);
        }
        
    }

    static draw(e) {
        if (e.buttons!=1){
            rasm=false;
          }
        gc.putImageData(imageData, 0, 0);

        // curseur rouge dessein
        xlocate = proximate(e.offsetX, e.offsetY).x;
        ylocate = proximate(e.offsetX, e.offsetY).y;
        // point(xlocate, ylocate, "red", 5);
        gc.strokeStyle = ((theme == false) ? 'white' : 'black');
        gc.lineWidth = 0.8;
        gc.beginPath();
        gc.arc(xlocate, ylocate, 8, 0, 2 * Math.PI);
        gc.stroke();

        gc.lineWidth = 4;
        if (!rasm )   return;


        // tmp line
        gc.strokeStyle = strokeCol;
        gc.lineWidth = 4;

        let x = e.offsetX;
        let y = e.offsetY;

        gc.putImageData(imageData, 0, 0);
        drawLine(lowlaX, lowlaY, x, y);

        // curseur gris visuer 
        gc.strokeStyle = ((theme == false) ? 'white' : 'black');
        ({x, y} = proximate(x, y));
        gc.lineWidth = 0.8;
        gc.beginPath();
        gc.arc(x, y, 8, 0, 2 * Math.PI);
        gc.stroke();

        // yweli khel
        gc.strokeStyle = ((theme == false) ? 'white' : 'black');
        gc.lineWidth = 4;

    }

    static down(e) {
        rasm = true;
        lowlaX = proximate(e.offsetX, e.offsetY).x;
        lowlaY = proximate(e.offsetX, e.offsetY).y;
        // imageData = gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height);

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
   
    initial =imageZero = imageData = gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height);
    
    gc.strokeStyle = ((theme == false) ? 'white' : 'black');
    gc.lineWidth = 4;
}


function curseur(e,color) {
    gc.putImageData(imageData, 0, 0);

    // curseur rouge dessein
    
    let {x, y} = proximate(e.offsetX, e.offsetY);
    point(x, y, color, 5);
}




function lines() {
    gc.fillStyle = ((theme == false) ? '#172A53' : 'white');
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


function setUP(){
    allshapes=[]
    polygons=[]
    allLines=[]

    color_field = document.querySelectorAll(".color-field");

    color_field.forEach(element=>{
        element.addEventListener("click",function (el) {
           if (mode_2 == "fill") fillCol = this.style.background;
           else strokeCol = this.style.background;
         })
    })
    
    gameCanvas.addEventListener("mouseleave", function leave() {
        gc.putImageData(imageZero, 0,0);
        redrawAll();
    })
    
    document.getElementById("deplacer").addEventListener("click" , function () {chooseEvent("deplacer")});
    document.getElementById("remove").addEventListener("click" , function () {chooseEvent("remove")});
    document.getElementById("polygone").addEventListener("click" , function () {chooseEvent("polygone")});
    document.getElementById("polylibre").addEventListener("click" , function () {chooseEvent("polylibre")});
    document.getElementById("dessin").addEventListener("click" , function () {chooseEvent("dessin")});
    document.getElementById("rotate").addEventListener("click" , function () {chooseEvent("rotate")});
    document.getElementById("fill").addEventListener("click", function () {chooseEvent("fill")});
    document.getElementById("point").addEventListener("click" , function () {chooseEvent("point")});
    document.getElementById("reset").addEventListener("click", function () {reset();});
    document.getElementById("ds").addEventListener("click", function () { gc.putImageData(imageSolution,0,0) });
    document.getElementById("da").addEventListener("click", function () { gc.putImageData(imageReponse,0,0) });
    document.getElementById("logd").addEventListener("click", function () {
        console.log("Lines:");
        console.log(JSON.stringify(allLines));
        console.log("Shapes:");
        console.log(JSON.stringify(allshapes));
        console.log("Points:")
        console.log(JSON.stringify(points))
        
        
    });
    document.getElementById("submit").addEventListener("click", function () {
        if(Exercice.CompareSolution(typeOfCheck)){
            alert("Reponse Vrai")
        }else{
            alert("Reponse Fausse")
        }

    });
}


// }
    
    
    


function belongToLine({xd,xf,yd,yf},x,y){
    if (xd==xf || yd==yf) return true;
    let a = (yf-yd)/(xf-xd);
    if (Math.abs(y-(a*x+yf-a*xf))<=10) return true;
    else return false;
}

function endEvents(){
    Point.end();
    Dessein.end();
    Polygone.end();
    Polylibre.end();
    Deplacer.end();
    Rotate.end();
    Remove.end();
    Fill.end();
}

function chooseEvent(button){
    endEvents();
    mode_2=null;
    switch(button){
        case "polygone":
            Polygone.start();
            
            break;
        case "polylibre":
            Polylibre.start();
            break;
        case "deplacer":
            Deplacer.start();
            break;
        case "remove":
            mode_2 = "remove"
            Remove.start();
            break;
        case "rotate":
            Rotate.start();
            break;
        case "fill":
            mode_2="fill";
            Fill.start();
            break;
        case "dessin":
            Dessein.start();
            break;
        case "point":
            Point.start()
            break;
        }
        

}

function redrawAll(model="normal") {
    
    Exercice.drawPres();
    
    
    if (model=="deplacer"){
        
        for(let i=0; i<allshapes.length;i++){
            if( allshapes[i]!==objetDP)
                Polygone.polygone(allshapes[i])
        }
        
        for(let i=0; i<polygons.length;i++){
            if( polygons[i]!==objetLib)
                Polylibre.polygone(polygons[i])
            
        }
        for(let i=0; i<allLines.length;i++){
            if(allLines[i]!==objetDes)
                Dessein.drawline(allLines[i]);
            
        }
        for (let dot of points) {
            if (dot!==objetP)
            point(dot.x,dot.y,dot.stroked,5);
            
        }
    }else{
        
        
        for(let i=0; i<allshapes.length;i++){
                Polygone.polygone(allshapes[i])
        }
        for(let i=0; i<polygons.length;i++){
                Polylibre.polygone(polygons[i])
            
        }
        for(let i=0; i<allLines.length;i++){
            
                Dessein.drawline(allLines[i]);
            
        }
        for (let dot of points) {
            point(dot.x,dot.y,dot.stroked,5);
            
        }
    }
    
}

function rotator(type,rotateDeg){
    switch(type){
        case 2:
            if(rotateDeg==90) type = 7;
            break;
        case 7:
            if(rotateDeg==90)  type = 2;
            break;
        case 6:
            if(rotateDeg==90)  type = 11;
            break;
        case 5:
            if(rotateDeg==90) type = 9;
            else if (rotateDeg==180) type =8; 
            break;
        case 8:
            if(rotateDeg==90) type = 10;
            else if (rotateDeg==180) type =5; 
            break;
        case 9:
            if(rotateDeg==90) type = 8;
            else if (rotateDeg==180) type = 10; 
            break;
        case 10:
            if(rotateDeg==90) type = 5;
            else if (rotateDeg==180) type = 9;
            break;
        case 11:
            if(rotateDeg==90)  type = 6;
            break;
        case 3:
            if(rotateDeg==90) type = 13;
            else if (rotateDeg==180) type = 15; 
            break;
        case 13:
            if(rotateDeg==90) type = 15;
            else if (rotateDeg==180) type = 14;
            break;
        case 14:
            if(rotateDeg==90) type = 3;
            else if (rotateDeg==180) type =13; 
            break;
        case 15:
            if(rotateDeg==90) type = 14;
            else if (rotateDeg==180) type = 3; 
            break;
        case 12:
            if(rotateDeg==90)  type = 17;
            break;
        case 17:
            if(rotateDeg==90)  type = 12;
            break;
        default:
            break;
    }
    return type;
}

function reset(){
    gc.putImageData(imageZero, 0,0);
    imageData=gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height);
    allLines=[]
    allshapes=[]
    polygons=[]
    Exercice.initiateExo();
    Exercice.help();
}

function load() {
    
    createCanvas();
    setUP();
    Exercice.fetch();
    Exercice.initiateExo();
    Exercice.getSolution();
    reset();
}


class Exercice {

    static drawPres(){
        for(let i=0;i<preDashed.length;i++){
            Dessein.drawline(preDashed[i],true)
        }
        
        for(let i=0; i<preShapes.length;i++){
            Polygone.polygone(preShapes[i]);
        }
        for(let i=0; i<preLines.length;i++){
            Dessein.drawline(preLines[i]);
        }
        for (let dot of prePoints) {
            point(dot.x,dot.y,dot.stroked,5);
        }
    }

    
    static getSolution(){
        for(let i=0; i<solutionLines.length;i++){
            Dessein.drawline(solutionLines[i]);
        }
        for(let i=0; i<solutionShapes.length;i++){
            Polygone.polygone(solutionShapes[i]);
        }
        
        for(let dot of solutionPoints){
            point(dot.x,dot.y,dot.stroked,5);
        }
        imageSolution= gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height);
    
    }

    static CompareSolution(typeOfCheck){
    
        if(typeOfCheck=="imageData"){
            // Compare imageData
        imageReponse=gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height);
        return this.compareTwoImages(imageReponse, imageSolution);
        }else if (typeOfCheck=="Shapes"){
            // Compare shapes only
        return this.compareSolutionByShapes();
            
        }else if(typeOfCheck=="lines"){
            return this.CompareSolutionBylines();
        }
    }
    
    static compareSolutionByShapes(){
        if (allshapes.length != solutionShapes.length || points.length!=solutionPoints.length)
            return false
            let kayen
            for (let i=0;i<allshapes.length;i++){
                kayen=false
                for (let j=0;j<solutionShapes.length;j++){
                    if(this.compareTwoShapes(allshapes[i],solutionShapes[j])){
                        kayen=true
                    }
                } 
                if(!kayen){
                    return false
                }
            }
            
            for (let dotR of points){
                kayen=false
                for(let dotS of solutionPoints){
                    if(dotS.x==dotR.x && dotS.x==dotR.x && dotS.stroked==dotR.stroked){
                        kayen=true
                    }
                }
                if(!kayen){
                    return false
                }
            }
        
            return true
    }
    static compareTwoShapes(shape1,shape2){
        return shape1.u==shape2.u && shape1.type==shape2.type && shape1.x==shape2.x && shape1.y==shape2.y && shape1.filled==shape2.filled
    }
    static compareTwoImages(img1, img2) {
        if (img1.data.length != img2.data.length)
            return false;
        
        
        console.log('same length', img1.data.length);
        let c=0
        for (var i = 0; i < img1.data.length; ++i) {
            
            if (img1.data[i] != img2.data[i]){
                c++       
            }
        }
        console.log(c);
        if(c>allowed_delta){
            return false   
        }else{
            return true
        }
    }
    
    static CompareSolutionBylines(){

        if(allLines.length!=solutionLines.length)
            return false
        let kayen
        for (let i=0; i<allLines.length;i++){
            kayen=false
            for (let j=0; j<solutionLines.length; j++){
                if(this.compareTwoLines(allLines[i], solutionLines[j])){
                    kayen=true
                    break
                }  
    
            }
            if(!kayen){
                return false;
            }
    
        }
        
        return true
    }
    
    static compareTwoLines(line1, line2){
        let simple = ( (line1.xd==line2.xd) && (line1.yd==line2.yd) ) && ( (line1.xf==line2.xf) && (line1.yf==line2.yf) )
        let inverse = ( (line1.xd==line2.xf) && (line1.yd==line2.yf) ) && ( (line1.xf==line2.xd) && (line1.yf==line2.yd) )
        return (simple || inverse) && line1.stroked==line2.stroked ;
    
    }
    
    static initiateExo(){
        preLines=JSON.parse(preLinesString)
        preShapes=JSON.parse(preShapesString)
        solutionLines=JSON.parse(solutionLinesString)
        solutionShapes=JSON.parse(solutionShapesString)
        preDashed=JSON.parse(preDashedString)
        prePoints=JSON.parse(prePointString)
        solutionPoints=JSON.parse(solutionPointString)
        
        
        // We need one and only imagezero
        this.drawPres();
        imageZero = gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height);
        redrawAll();
    }

    static help(){
        //function to predefine some shapes
        allshapes=JSON.parse(allshapesString)
        //allLines=JSON.parse('[]')
        redrawAll();
        imageData=gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height);
    }

    static fetch(){
            // recuperer les données de la base de donnée de chaque exos
            typeOfCheck="Shapes"
            preDashedString='[{"xd":200,"yd":320,"xf":1120,"yf":320,"stroked":"white"}]'


            preLinesString='[]'
            preShapesString='[{"x":600,"y":240,"u":40,"type":4,"filled":"white","stroked":"black"},{"x":600,"y":160,"u":40,"type":4,"filled":"white","stroked":"black"}]'
            prePointString='[{"x":600,"y":160,"stroked":"black"},{"x":600,"y":240,"stroked":"black"}]'
            solutionPointString='[{"x":600,"y":400,"stroked":"black"},{"x":600,"y":480,"stroked":"black"}]'
            solutionLinesString='[]'
            solutionShapesString='[{"x":600,"y":400,"u":40,"type":4,"filled":"white","stroked":"black"},{"x":600,"y":480,"u":40,"type":4,"filled":"white","stroked":"black"}]'

            allshapesString='[]'


}
    
}