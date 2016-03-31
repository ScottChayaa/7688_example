/**
 * Linkit 7688 example
 * 使用 GPIO 控制 8x8 LED Matrix (共陽)
 * 
 * @author Scott Lin 
 * @version 1.0
 * @update 2016-03-30
 *  
 */
 
//============================================================
var mraa = require('mraa');

var LightFlag=false;


// 腳位命名參考  
// GPIO  01  00  03  02  45  46  44  37
//       C8  C7  R2  C4  R4  C6  C4  R1
//      _ |__ |__ |__ |__ |__ |__ |__ |_  (Pin)
//     |                                |
//     |                                |
//     |                                |
//     |              8x8               |
//     |           LED Matrix           |
//     |                                |
//     |                                |
//     |_  __  __  __  __  __  __  __  _|
//        |   |   |   |   |   |   |   |
//       R5  R7  C2  C3  R8  C5  R6  R3
// GPIO  04  15  16  17  04  05  12  13
//                 ( TEXT ) 
//    
//
//     \Col 1   2   3   4   5   6   7   8
// Row  \ _02__16__17__44__05__46__00__01_  (GPIO)
//  1  37|                                |
//  2  03|                                |
//  3  13|                                |
//  4  45|              8x8               |
//  5  14|           LED Matrix           |
//  6  12|                                |
//  7  15|                                |
//  8  04|________________________________|
//   (GPIO)

// 設定GPIO 接腳
var col = [
        new mraa.Gpio(2)
      , new mraa.Gpio(16)
      , new mraa.Gpio(17)
      , new mraa.Gpio(44)
      , new mraa.Gpio(5)
      , new mraa.Gpio(46)
      , new mraa.Gpio(0)
      , new mraa.Gpio(1) 
    ],
    row = [
        new mraa.Gpio(37)
      , new mraa.Gpio(3)
      , new mraa.Gpio(13)
      , new mraa.Gpio(45)
      , new mraa.Gpio(14)
      , new mraa.Gpio(12)
      , new mraa.Gpio(15)
      , new mraa.Gpio(4)      
    ];

//============================================================

//**********************
// Description: 
//   Light down all point 
//**********************
function LightDown(){ 
  for(var idx=0; idx<8; idx++) col[idx].write(0);
  for(var idx=0; idx<8; idx++) row[idx].write(0);
  LightFlag=false;
}

//**********************
// Description: 
//   Light up all point 
//**********************
function LightUp(){ 
  for(var idx=0; idx<8; idx++) col[idx].write(0);
  for(var idx=0; idx<8; idx++) row[idx].write(1);
  LightFlag=true;
}

//**********************
// Description: 
//   Light up one point 
// input:
//   x = 1 ~ 8 
//   y = 1 ~ 8 
// output:
//
//**********************
function LightPoint(x, y){ 
  for(var i=0; i<8; i++) col[i].write(1);
  col[x-1].write(0);
  row[y-1].write(1); 
}


function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
//============================================================ 

/*
var _timer = setInterval(function(){
  if( LightFlag ) {
    LightDown();
  }
  else {
    LightUp();
  }
},250);
*/

// Change Gpio direction : GPIO初始化, 輸出mode
for(var idx=0; idx<8; idx++) col[idx].dir(mraa.DIR_OUT);
for(var idx=0; idx<8; idx++) row[idx].dir(mraa.DIR_OUT);


LightDown();
LightPoint(8,7);



