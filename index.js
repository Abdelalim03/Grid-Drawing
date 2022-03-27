var gameCanvas, gc, prevX, prevY;
var pnewX, pnewY;
addEventListener("load", load);

var unity =50;
const sX = 500; // eno9ta
const sY = 100; // 
const theme="white";
let rasm=false;
let lowlaX, lowlaY;
var imageData;
let restore_array,index;
let undo;

function load(e) {
  document.getElementById("reset").addEventListener("click", load);
  restore_array=[];
  index=-1;
  gameCanvas = document.getElementById("drawCanvas");
  undo = document.getElementById("undo");
  gameCanvas.width = 1000;
  gameCanvas.height = 600;
  
  gc = gameCanvas.getContext("2d");
  

  lines();
  gc.strokeStyle = ((theme=="dark") ? 'white' : 'black');
  gc.lineWidth = 4;

  gameCanvas.addEventListener("mouseup", up);
  gameCanvas.addEventListener("mousedown", down);
  gameCanvas.addEventListener("mousemove", drawHebla);
  undo.addEventListener("click",undo_last);
  // gameCanvas.addEventListener("mouseout", leave);

  imageData = gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height); 

  
  
}





function drawHebla(e){
  if (e.buttons!=1){
    rasm=false 
  }
  // to remove the previous red point
  gc.putImageData(imageData, 0, 0);
  // curseur rouge dessein
  let xlocate = e.offsetX;
  let ylocate = e.offsetY;
  let pfx= xlocate%unity; xlocate=((pfx>25) ? xlocate-pfx + unity : xlocate-pfx);
  let pfy= ylocate%unity; ylocate=((pfy>25) ? ylocate-pfy + unity : ylocate-pfy);

  gc.beginPath();
  gc.fillStyle = "red"
  gc.arc(xlocate, ylocate, 5, 0, 2 * Math.PI);
  gc.fill();
  gc.closePath()
    
  if(!rasm) return;


  // tmp line
  gc.strokeStyle = ((theme=="dark") ? 'white' : 'black');
  gc.lineWidth = 4;

  let x = e.offsetX;
  let y = e.offsetY;

  gc.putImageData(imageData, 0, 0);
  drawLine(lowlaX,lowlaY, x,y);
  

  // curseur red tmp
  gc.beginPath();
  gc.fillStyle = "red"
  gc.arc(x, y, 5, 0, 2 * Math.PI);
  gc.fill();
  gc.closePath()


  // curseur gris visuer
  gc.beginPath();
  gc.fillStyle = "black"
  gc.lineWidth = 0.8;

  gc.arc(xlocate, ylocate, 8, 0, 2 * Math.PI);
  gc.stroke();
  gc.closePath()


  // yweli khel
  gc.strokeStyle = ((theme=="dark") ? 'white' : 'black');
  gc.lineWidth = 4;

}




function up(e){
  rasm=false;

  let x = e.offsetX;
  let y = e.offsetY;

  gc.putImageData(imageData, 0, 0);

  let pfx  = x%unity; x=((pfx>25) ? x-pfx + unity : x-pfx);
  let pfy= y%unity; y=((pfy>25) ? y-pfy + unity : y-pfy);
  
  drawLine(lowlaX,lowlaY, x,y);

  gc.beginPath();
  gc.fillStyle = "red"
  gc.arc(x, y, 5, 0, 2 * Math.PI);
  gc.fill();
  gc.closePath()
  
  imageData = gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height); 
  restore_array.push(imageData)
  index+=1
}

function down(e){
  rasm=true;
  lowlaX=e.offsetX;
  lowlaY=e.offsetY;

  let px= lowlaX%unity; lowlaX=((px>25) ? lowlaX-px + unity : lowlaX-px);
  let py= lowlaY%unity; lowlaY=((py>25) ? lowlaY-py + unity : lowlaY-py);
  
  // imageData = gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height); 

}


function undo_last() {
  if (index<=0){
      load()
  }else{
    
      restore_array.pop()
      index-=1
      imageData=restore_array[index]
      gc.putImageData(imageData,0,0) 
  }
  
}

// function leave(e){
//   console.log(e);
//   if (e.buttons !=1){
//     rasm=false
//     gc.getImageData(0, 0, gameCanvas.width, gameCanvas.height); 
//   }
// }


function drawLine(x1, y1, x2, y2) {
  gc.beginPath();
  gc.moveTo(x1, y1);
  gc.lineTo(x2, y2);
  gc.stroke();
}

function lines(){
  gc.fillStyle = ((theme=="dark") ? 'black' : 'white');
  gc.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
  gc.strokeStyle = ((theme=="dark") ? 'white' : 'black');

  for (let i =0; i<gameCanvas.width; i +=unity){
    drawLine(i, 0,i, gameCanvas.height);
  }
  
  for (let i =0; i<gameCanvas.height; i +=unity){
    drawLine(0, i, gameCanvas.width, i);
  }
}


function rounding(prevX,prevY){
  if ((prevX%50<=20  && prevY%50<=20 )|| (prevX%50>=30 && prevY%50>=30 ) || (prevX%50<=20  && prevY%50>=30 ) ||(prevX%50>=30  && prevY%50<=20 ) ){
    if (prevX%50<=15) prevX-=prevX%50
    else prevX+=(50-prevX%50)
    if (prevY%50<=15) prevY-=prevY%50
    else prevY+=(50-prevY%50)
}
return [prevX,prevY]
}

// function complete(lowlaX,lowlaY){
//   let px= lowlaX%unity; lowlaX=((px>25) ? lowlaX-px + unity : lowlaX-px);
//   let py= lowlaY%unity; lowlaY=((py>25) ? lowlaY-py + unity : lowlaY-py);
//   return lowlaX, lowlaY;
// }