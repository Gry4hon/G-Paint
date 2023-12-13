const paintCanvas = document.getElementById("paint-canvas");
const paintCanvasContext = paintCanvas.getContext('2d');
const paintCanvasWidth = paintCanvas.clientWidth;
const paintCanvasHeight = paintCanvas.clientHeight;

const pennTool = document.getElementById("penn");
const eraserTool = document.getElementById("eraser");
const fillTool = document.getElementById("fill-bucket");
const colorPicker = document.getElementById("color-picker");
const sizePicker = document.getElementById("size-picker");


paintCanvas.addEventListener("mousedown", BeginDrawing);
paintCanvas.addEventListener("mouseup", StopDrawing);
document.addEventListener("keydown", SwitchTool);

sizePicker.value = 30;

let currentTool = 1;


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

let gettingData = true;

function BeginDrawing(mousedown){
    if(mousedown){
        paintCanvas.addEventListener("mousemove", MovePaintBrush);
    }
}

function StopDrawing(mouseup){
    if(mouseup){
        paintCanvas.removeEventListener("mousemove", MovePaintBrush);
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
    
}

function MovePaintBrush(event){
    const paintCanvasRect = paintCanvas.getBoundingClientRect();

    let courserX  = event.x - paintCanvasRect.left;
    let courserY = event.y - paintCanvasRect.top;

    switch(currentTool){
        case 1:
            paintCanvasContext.fillStyle = colorPicker.value;
            paintCanvasContext.fillRect(courserX, courserY, sizePicker.value,sizePicker.value);
        break;

        case 2:
            paintCanvasContext.clearRect(courserX, courserY, sizePicker.value, sizePicker.value);
        break;

    }
    

    
}

function SelectFillTool(){
    
    paintCanvas.addEventListener("mousedown", (event) =>{
        if(gettingData){
            const paintCanvasRect = paintCanvas.getBoundingClientRect();
            let fillX = event.x - paintCanvasRect.left;
            let fillY = event.y - paintCanvasRect.top;
            FloodFillAlgorithm(Math.floor(fillX), Math.floor(fillY));
            gettingData = false;
        }
            
    });
    paintCanvas.addEventListener("mouseup", () =>{
        gettingData = true;
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

//This is checking to see if the current pixel is either outside the bounds of the screen, if it is the previous color, and if it is the new color
//If ANY of those are true, move on to the next comparision (return false)
//Else, it is a pixel that needs to be painted! (return true)
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

        //Check Right Pixel

        if(isValid(posX + 1, posY, previousColor, newColor)){
            paintCanvasContext.fillStyle = newColor;
            paintCanvasContext.fillRect(posX + 1, posY, 1, 1);
            fillQueue.push([posX+1, posY]);
        }

        //Check Left Pixel

        if(isValid(posX - 1, posY, previousColor, newColor)){

            //change the pixel to the left to be the new color
            paintCanvasContext.fillStyle = newColor;
            paintCanvasContext.fillRect(posX - 1, posY, 1, 1);
            fillQueue.push([posX-1, posY]);
        }

        //Check Top Pixel

        if(isValid(posX, posY + 1, previousColor, newColor)){
            //change the pixel to the top to be the new color
            paintCanvasContext.fillStyle = newColor;
            paintCanvasContext.fillRect(posX, posY + 1, 1, 1);
            fillQueue.push([posX, posY + 1]);
        }

        //Check Bottom Pixel

        if(isValid(posX, posY - 1, previousColor, newColor)){
            //change the pixel to the bottom to be the new color
            paintCanvasContext.fillStyle = newColor;
            paintCanvasContext.fillRect(posX, posY - 1, 1, 1);
            fillQueue.push([posX, posY - 1]);
        }
    


    }
}
    

}

