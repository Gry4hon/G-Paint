const paintCanvas = document.getElementById("paint-canvas");
const paintCanvasContext = paintCanvas.getContext('2d');
const paintCanvasWidth = paintCanvas.clientWidth;
const paintCanvasHeight = paintCanvas.clientHeight;

const pennTool = document.getElementById("penn");
const eraserTool = document.getElementById("eraser");
const fillTool = document.getElementById("fill-bucket");
const undoButton = document.getElementById("undo");
const redoButton = document.getElementById("redo");
const saveButton = document.getElementById("save");

const colorPicker = document.getElementById("color-picker");
const sizePicker = document.getElementById("size-picker");

document.addEventListener("keydown", SwitchTool);

paintCanvas.addEventListener("mousedown", BeginDrawing);
paintCanvas.addEventListener("mousemove", MovePennTool);
paintCanvas.addEventListener("mouseup", ()=>{
    pennToCanvas = false;
    AddToSteps();
});
paintCanvas.addEventListener("mouseleave", ()=>{
    pennToCanvas = false;
    AddToSteps();
});

EstablishBackground();

pennToCanvas = false;
let canGetData = true;
let lastX;
let lastY;

let currentTool = 1;
sizePicker.value = 5;
colorPicker.value = "#000001"

let stepsOfDrawing = [];
let currentNumberOfSteps = -1;

pennTool.onclick = ()=>{
    currentTool = 1;
}
eraserTool.onclick = ()=>{
    currentTool = 2;
}
fillTool.onclick = ()=>{
    currentTool = 3;
    SelectFillTool();
}
undoButton.onclick = ()=>{
    StepBackwards();
}
redoButton.onclick = ()=>{
    StepForwards();
}

saveButton.onclick = ()=>{
    SaveDrawing();
}

function EstablishBackground(){
    let background = new Image();
    background.src = "./whitebackground.png";
    background.onload = () =>{
        paintCanvasContext.drawImage(background, 0, 0, 700, 500);
    }
}

function BeginDrawing(mousedown){
    pennToCanvas = true;
    const paintCanvasRect = paintCanvas.getBoundingClientRect();

    let courserX  = mousedown.x - paintCanvasRect.left;
    let courserY = mousedown.y - paintCanvasRect.top;

    DrawWithPenn(courserX, courserY, false);
}

function MovePennTool(event){
    const paintCanvasRect = paintCanvas.getBoundingClientRect();

    let courserX  = event.x - paintCanvasRect.left;
    let courserY = event.y - paintCanvasRect.top;

    switch(currentTool){
        case 1:
            if(pennToCanvas){
                DrawWithPenn(courserX, courserY, true);
            }
        break;

        case 2:
            if(pennToCanvas){
                paintCanvasContext.clearRect(courserX, courserY, sizePicker.value, sizePicker.value);1
            }
        break;

    }
}

function SwitchTool(key){
    if(key.key == '1'){
        currentTool = 1;
    }
    else if(key.key == '2'){
        currentTool = 2;
    }
    else if(key.key == '3'){
        currentTool = 3;
        SelectFillTool();
    }
    else if(key.ctrlKey && key.key == 'z'){
        StepBackwards();
    }
    else if(key.ctrlKey && key.key == 'x'){
        StepForwards();
    }
    
}

function DrawWithPenn(courserX, courserY, isDrawing){
    if(isDrawing){
        paintCanvasContext.beginPath();
        paintCanvasContext.strokeStyle = colorPicker.value;
        paintCanvasContext.lineWidth = sizePicker.value;
        paintCanvasContext.lineJoin = "round";
        paintCanvasContext.moveTo(lastX, lastY);
        paintCanvasContext.lineTo(courserX, courserY)
        paintCanvasContext.closePath();
        paintCanvasContext.stroke();
    }
    lastX = courserX;
    lastY = courserY;
}


function SelectFillTool(){   
    paintCanvas.addEventListener("mousedown", (event) =>{
        if(canGetData){
            const paintCanvasRect = paintCanvas.getBoundingClientRect();
            let fillX = event.x - paintCanvasRect.left;
            let fillY = event.y - paintCanvasRect.top;
            FloodFillAlgorithm(Math.floor(fillX), Math.floor(fillY));
            canGetData = false;
        }
            
    });
    paintCanvas.addEventListener("mouseup", () =>{
        canGetData = true;
    });
}

function rgbValueToHex(colorValue) {
    let hexVersionOfColorValue = colorValue.toString(16);
    return hexVersionOfColorValue.length == 1 ? "0" + hexVersionOfColorValue : hexVersionOfColorValue;
}
  
function CheckIfPixelIsColor(colorX, colorY){
    let colorToReturn;

    const colorData = paintCanvasContext.getImageData(colorX, colorY, 1, 1);

    const red = colorData.data[0];
    const green = colorData.data[1];
    const blue = colorData.data[2];
    
    colorToReturn = "#" + rgbValueToHex(red) + rgbValueToHex(green) + rgbValueToHex(blue);

    return colorToReturn;
}

function isValid(x, y, previousColor, newColor)
{
    if(x<0 || x>= paintCanvasWidth || y<0 || y>= paintCanvasHeight || CheckIfPixelIsColor(x, y) != previousColor || CheckIfPixelIsColor(x, y) === newColor){
        return false;
    }
    return true;
}

function FloodFillAlgorithm(fillX, fillY){

    if(currentTool == 3){

    let fillQueue = [];
        
    const colorData = paintCanvasContext.getImageData(fillX, fillY, 1, 1);

    const red = colorData.data[0];
    const green = colorData.data[1];
    const blue = colorData.data[2];
    
    let newColor = colorPicker.value;
    let previousColor = "#" + rgbValueToHex(red) + rgbValueToHex(green) + rgbValueToHex(blue);

    fillQueue.push([fillX, fillY]);

    paintCanvasContext.fillStyle = newColor;
    paintCanvasContext.fillRect(fillX, fillY, 1, 1);

    while(fillQueue.length > 0){
        currentPixel = fillQueue[fillQueue.length-1];
        fillQueue.pop();
    
        let posX = currentPixel[0];
        let posY = currentPixel[1];

        if(isValid(posX + 1, posY, previousColor, newColor)){
            paintCanvasContext.fillStyle = newColor;
            paintCanvasContext.fillRect(posX + 1, posY, 1, 1);
            fillQueue.push([posX+1, posY]);
        }

        if(isValid(posX - 1, posY, previousColor, newColor)){
            paintCanvasContext.fillStyle = newColor;
            paintCanvasContext.fillRect(posX - 1, posY, 1, 1);
            fillQueue.push([posX-1, posY]);
        }

        if(isValid(posX, posY + 1, previousColor, newColor)){
            paintCanvasContext.fillStyle = newColor;
            paintCanvasContext.fillRect(posX, posY + 1, 1, 1);
            fillQueue.push([posX, posY + 1]);
        }

        if(isValid(posX, posY - 1, previousColor, newColor)){
            paintCanvasContext.fillStyle = newColor;
            paintCanvasContext.fillRect(posX, posY - 1, 1, 1);
            fillQueue.push([posX, posY - 1]);
        }
    }
    }
}


function SaveDrawing(){
    let drawingToSave = paintCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    window.location.href = drawingToSave;

}


function AddToSteps(){
    currentNumberOfSteps++;
    if(currentNumberOfSteps < stepsOfDrawing.length){
        stepsOfDrawing.length = currentNumberOfSteps;
    }
    stepsOfDrawing.push(paintCanvas.toDataURL());
}

function StepBackwards(){
    if(currentNumberOfSteps > 0){
        currentNumberOfSteps--;
        let previousCanvas = new Image();
        previousCanvas.src = stepsOfDrawing[currentNumberOfSteps];
        previousCanvas.onload = function(){
            paintCanvasContext.drawImage(previousCanvas, 0, 0);
        }
    }
}

function StepForwards(){
    if(currentNumberOfSteps < stepsOfDrawing.length-1){
        currentNumberOfSteps++;
        let previousCanvas = new Image();
        previousCanvas.src = stepsOfDrawing[currentNumberOfSteps];
        previousCanvas.onload = function(){
            paintCanvasContext.drawImage(previousCanvas, 0, 0);
        }
    }
}


