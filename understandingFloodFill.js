const paintCanvas = document.getElementById("paint-canvas");
const paintCanvasContext = paintCanvas.getContext('2d');
const paintCanvasWidth = paintCanvas.clientWidth;
const paintCanvasHeight = paintCanvas.clientHeight;

paintCanvasContext.fillStyle = "blue";
paintCanvasContext.fillRect(0, 0, 700, 500);

let amountOfPixels = 0;


document.addEventListener("keydown", (event) =>{
    if(event.key == 'f'){
        FloodFillAlgorithm();

    }

});




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
  //if ANY of those are true, move on to the next comparision (return false)
  //Else, it is a pixel that needs to be painted! (return true)
function isValid(x, y)
{
      if(CheckIfPixelIsColor(x, y) != "#0000ff" || CheckIfPixelIsColor(x, y) === "#ff0000"){
        return false;
      }
      return true;
}





function FloodFillAlgorithm(){

    /* 
        Variables needed:

        -Reference to the screen
        -Width of screen
        -Height of screen
        -X of clicked on space
        -Y of clicked on space
        -Previous color
        -New color
    */
    

    
    let newColor = "#FF0000";
    
    let fillQueue = [];
    fillQueue.push([250, 250]);


    paintCanvasContext.fillStyle = newColor;
    paintCanvasContext.fillRect(250, 250, 1, 1);



    while(fillQueue.length > 0){
        amountOfPixels++;
        currentPixel = fillQueue[fillQueue.length-1];
        fillQueue.pop();
    
        let posX = currentPixel[0];
        let posY = currentPixel[1];

        //Check Right Pixel

        if(isValid(posX + 1, posY)){

            paintCanvasContext.fillStyle = newColor;
            paintCanvasContext.fillRect(posX + 1, posY, 1, 1);
            fillQueue.push([posX+1, posY]);
        }

        //Check Left Pixel

        if(isValid(posX - 1, posY)){

            //change the pixel to the left to be the new color
            paintCanvasContext.fillStyle = newColor;
            paintCanvasContext.fillRect(posX - 1, posY, 1, 1);
            fillQueue.push([posX-1, posY]);
        }

        //Check Top Pixel

        if(isValid(posX, posY + 1)){

            //change the pixel to the top to be the new color
            paintCanvasContext.fillStyle = newColor;
            paintCanvasContext.fillRect(posX, posY + 1, 1, 1);
            fillQueue.push([posX, posY + 1]);
        }

        //Check Bottom Pixel

        if(isValid(posX, posY - 1)){

            //change the pixel to the bottom to be the new color
            paintCanvasContext.fillStyle = newColor;
            paintCanvasContext.fillRect(posX, posY - 1, 1, 1);
            fillQueue.push([posX, posY - 1]);
        }
    


    }

    console.log(amountOfPixels);

}