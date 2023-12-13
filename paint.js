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

let currentTool = 1;

let fillX; 
let fillY;
let gettingData = true;

let previousColor;


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
            fillX = event.x - paintCanvasRect.left;
            fillY = event.y - paintCanvasRect.top;
            FloodFillAlgorithm();
            gettingData = false;
        }
            
    });
    paintCanvas.addEventListener("mouseup", () =>{
        gettingData = true;
    });
}

function FloodFillAlgorithm(){
    if(currentTool == 3){

    const colorData = paintCanvasContext.getImageData(fillX, fillY, 1, 1);

    

    const red = colorData.data[0];
    const green = colorData.data[1];
    const blue = colorData.data[2];

    console.log("R:" + red);
    console.log("G:" + green);
    console.log("B:" + blue);

    let newColor = colorPicker.value;
    previousColor = `rgb(${red}, ${green}, ${blue}`;

    
}
    

}

