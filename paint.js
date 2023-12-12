const paintCanvas = document.getElementById("paint-canvas");
const paintCanvasContext = paintCanvas.getContext('2d');
const paintCanvasWidth = paintCanvas.clientWidth;
const paintCanvasHeight = paintCanvas.clientHeight;

const pennTool = document.getElementById("penn");
const eraserTool = document.getElementById("eraser");
const fillTool = document.getElementById("fill-tool");
const colorPicker = document.getElementById("color-picker");
const sizePicker = document.getElementById("size-picker");


paintCanvas.addEventListener("mousedown", BeginDrawing);
paintCanvas.addEventListener("mouseup", StopDrawing);
document.addEventListener("keydown", SwitchTool);

let currentTool = 1;



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
    if(key.key == '2'){
        currentTool = 2;
    }
    
}

function MovePaintBrush(event){
    const paintCanvasRect = paintCanvas.getBoundingClientRect();

    let courserX = event.x - paintCanvasRect.left;
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

