/**
 * Linkit 7688 example
 * 使用 GPIO 控制 8x8 LED Matrix 顯示文字、數字
 * 
 * @author Scott Lin 
 * @version 1.0
 * @update 2016-03-30
 *  
 */

//============================================================
var mraa = require('mraa');

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


// Words (ALL)
// http://www.instructables.com/id/LED-Scolling-Dot-Matrix-Font-Graphics-Generator-/
var textTable = [
[0x7F,0x88,0x88,0x88,0x7F,0x00,0x00,0x00],
[0xFF,0x91,0x91,0x91,0x6E,0x00,0x00,0x00],
[0x7E,0x81,0x81,0x81,0x42,0x00,0x00,0x00],
[0xFF,0x81,0x81,0x42,0x3C,0x00,0x00,0x00],
[0xFF,0x91,0x91,0x91,0x81,0x00,0x00,0x00],
[0xFF,0x90,0x90,0x90,0x80,0x00,0x00,0x00],
[0x7E,0x81,0x89,0x89,0x4E,0x00,0x00,0x00],
[0xFF,0x10,0x10,0x10,0xFF,0x00,0x00,0x00],
[0x81,0x81,0xFF,0x81,0x81,0x00,0x00,0x00],
[0x06,0x01,0x01,0x01,0xFE,0x00,0x00,0x00],
[0xFF,0x18,0x24,0x42,0x81,0x00,0x00,0x00],
[0xFF,0x01,0x01,0x01,0x01,0x00,0x00,0x00],
[0xFF,0x40,0x30,0x40,0xFF,0x00,0x00,0x00],
[0xFF,0x40,0x30,0x08,0xFF,0x00,0x00,0x00],
[0x7E,0x81,0x81,0x81,0x7E,0x00,0x00,0x00],
[0xFF,0x88,0x88,0x88,0x70,0x00,0x00,0x00],
[0x7E,0x81,0x85,0x82,0x7D,0x00,0x00,0x00],
[0xFF,0x88,0x8C,0x8A,0x71,0x00,0x00,0x00],
[0x61,0x91,0x91,0x91,0x8E,0x00,0x00,0x00],
[0x80,0x80,0xFF,0x80,0x80,0x00,0x00,0x00],
[0xFE,0x01,0x01,0x01,0xFE,0x00,0x00,0x00],
[0xF0,0x0C,0x03,0x0C,0xF0,0x00,0x00,0x00],
[0xFF,0x02,0x0C,0x02,0xFF,0x00,0x00,0x00],
[0xC3,0x24,0x18,0x24,0xC3,0x00,0x00,0x00],
[0xE0,0x10,0x0F,0x10,0xE0,0x00,0x00,0x00],
[0x83,0x85,0x99,0xA1,0xC1,0x00,0x00,0x00],
[0x06,0x29,0x29,0x29,0x1F,0x00,0x00,0x00],
[0xFF,0x09,0x11,0x11,0x0E,0x00,0x00,0x00],
[0x1E,0x21,0x21,0x21,0x12,0x00,0x00,0x00],
[0x0E,0x11,0x11,0x09,0xFF,0x00,0x00,0x00],
[0x0E,0x15,0x15,0x15,0x0C,0x00,0x00,0x00],
[0x08,0x7F,0x88,0x80,0x40,0x00,0x00,0x00],
[0x30,0x49,0x49,0x49,0x7E,0x00,0x00,0x00],
[0xFF,0x08,0x10,0x10,0x0F,0x00,0x00,0x00],
[0x00,0x00,0x5F,0x00,0x00,0x00,0x00,0x00],
[0x02,0x01,0x21,0xBE,0x00,0x00,0x00,0x00],
[0xFF,0x04,0x0A,0x11,0x00,0x00,0x00,0x00],
[0x00,0x81,0xFF,0x01,0x00,0x00,0x00,0x00],
[0x3F,0x20,0x18,0x20,0x1F,0x00,0x00,0x00],
[0x3F,0x10,0x20,0x20,0x1F,0x00,0x00,0x00],
[0x0E,0x11,0x11,0x11,0x0E,0x00,0x00,0x00],
[0x3F,0x24,0x24,0x24,0x18,0x00,0x00,0x00],
[0x10,0x28,0x28,0x18,0x3F,0x00,0x00,0x00],
[0x1F,0x08,0x10,0x10,0x08,0x00,0x00,0x00],
[0x09,0x15,0x15,0x15,0x02,0x00,0x00,0x00],
[0x20,0xFE,0x21,0x01,0x02,0x00,0x00,0x00],
[0x1E,0x01,0x01,0x02,0x1F,0x00,0x00,0x00],
[0x1C,0x02,0x01,0x02,0x1C,0x00,0x00,0x00],
[0x1E,0x01,0x0E,0x01,0x1E,0x00,0x00,0x00],
[0x11,0x0A,0x04,0x0A,0x11,0x00,0x00,0x00],
[0x00,0x39,0x05,0x05,0x3E,0x00,0x00,0x00],
[0x11,0x13,0x15,0x19,0x11,0x00,0x00,0x00],
[0x00,0x41,0xFF,0x01,0x00,0x00,0x00,0x00],
[0x43,0x85,0x89,0x91,0x61,0x00,0x00,0x00],
[0x42,0x81,0x91,0x91,0x6E,0x00,0x00,0x00],
[0x18,0x28,0x48,0xFF,0x08,0x00,0x00,0x00],
[0xF2,0x91,0x91,0x91,0x8E,0x00,0x00,0x00],
[0x1E,0x29,0x49,0x89,0x86,0x00,0x00,0x00],
[0x80,0x8F,0x90,0xA0,0xC0,0x00,0x00,0x00],
[0x6E,0x91,0x91,0x91,0x6E,0x00,0x00,0x00],
[0x70,0x89,0x89,0x8A,0x7C,0x00,0x00,0x00],
[0x60,0x80,0x8D,0x90,0x60,0x00,0x00,0x00],
[0x00,0x00,0xFD,0x00,0x00,0x00,0x00,0x00],
[0x7E,0x89,0x91,0xA1,0x7E,0x00,0x00,0x00],
[0x66,0x89,0x8F,0x81,0x7E,0x00,0x00,0x00],
[0x24,0xFF,0x24,0xFF,0x24,0x00,0x00,0x00],
[0x76,0x89,0x95,0x62,0x05,0x00,0x00,0x00],
[0x00,0x3C,0x42,0x81,0x00,0x00,0x00,0x00],
[0x00,0x81,0x42,0x3C,0x00,0x00,0x00,0x00],
[0x08,0x08,0x3E,0x08,0x08,0x00,0x00,0x00],
[0x08,0x08,0x08,0x08,0x08,0x00,0x00,0x00],
[0x14,0x14,0x14,0x14,0x14,0x00,0x00,0x00],
[0x10,0x10,0x54,0x38,0x10,0x00,0x00,0x00],
[0x08,0x1C,0x2A,0x08,0x08,0x00,0x00,0x00],
[0x12,0x2A,0x7F,0x2A,0x24,0x00,0x00,0x00],
[0x44,0x02,0x12,0x02,0x44,0x00,0x00,0x00],
[0xFF,0xFF,0xFF,0xFF,0xFF,0x00,0x00,0x00],
[0x08,0x04,0x02,0x01,0x01,0x01,0x01,0x01],
[0x10,0x20,0x40,0x80,0x80,0x02,0x02,0x02],
[0x99,0x24,0x42,0x99,0x99,0x42,0x24,0x99],
[0xFF,0x81,0xBD,0xA5,0xA5,0xBD,0x81,0xFF],
[0x55,0xAA,0x55,0xAA,0x55,0xAA,0x55,0xAA],
[0x33,0x33,0xCC,0xCC,0x33,0x33,0xCC,0xCC],
[0x42,0xC3,0x24,0x18,0x18,0x24,0xC3,0x42],
[0xFD,0x85,0xB5,0xA5,0xA5,0xBD,0x81,0xFF],
[0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF],
[0xFF,0x7E,0x7E,0x7E,0x7E,0x42,0x24,0x18],
[0x18,0x18,0x3C,0x66,0x66,0x3C,0x18,0x18],
[0x78,0x78,0x18,0xFF,0xFF,0x0C,0x3C,0x3C],
[0xF2,0x82,0x12,0x3A,0x10,0xC0,0xC4,0x0E],
[0x7F,0x84,0xA7,0x84,0xA7,0x84,0x7F,0x00],
[0x3C,0x42,0x81,0xA1,0x89,0x95,0xA5,0x42],
[0x07,0x2F,0x1C,0x3E,0x3C,0x30,0x30,0x30],
[0x5A,0x99,0x00,0x18,0x18,0x00,0x18,0x18],
[0x82,0x41,0x82,0x41,0x82,0x41,0x82,0x41],
[0x00,0x01,0x06,0x7E,0xDF,0x7E,0x06,0x01],
[0x04,0x0F,0x1F,0x3C,0x3C,0x1F,0x0F,0x04],
[0xFF,0x00,0xFF,0x00,0xFF,0x00,0xFF,0x00],
[0x55,0x55,0x55,0x55,0x55,0x55,0x55,0x55],
[0x49,0x92,0x24,0x49,0x92,0x24,0x49,0x92],
[0x92,0x49,0x24,0x92,0x49,0x24,0x92,0x49],
[0x18,0x18,0x18,0x18,0x18,0x18,0x18,0x18],
[0x18,0x18,0x3C,0x5A,0x99,0x3C,0x42,0x81],
[0x18,0x3C,0x7E,0xFF,0x18,0x18,0x18,0x18],
[0x81,0x42,0x24,0x18,0x81,0x42,0x24,0x18],
[0x18,0x24,0x42,0x81,0x18,0x24,0x42,0x81],
[0x81,0x42,0x24,0x99,0x5A,0x3C,0x18,0x18],
[0x18,0x18,0x18,0x18,0xFF,0x7E,0x3C,0x18]];

var mask = [0x80,0x40,0x20,0x10,0x08,0x04,0x02,0x01];

var fontInterval;

//============================================================
//**********************
// Description: 
//   Light down all point 
//**********************
function LightDown(){ 
  for(var idx=0; idx<8; idx++) col[idx].write(1);  // => *** key point ***
  for(var idx=0; idx<8; idx++) row[idx].write(0);
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
//   Simple sleep function
//   @link http://www.sitepoint.com/delay-sleep-pause-wait/
//**********************
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

//**********************
// Description: 
//   Show words
//**********************
function showFont(font,milliseconds){
	var start = new Date().getTime();

  var c=0;
  while(1){
    // 計時器
    if ((new Date().getTime() - start) > milliseconds) break;
    // 回到 Col1 重新開始
    if (c>=8) c=0;
    
    // 熄燈
    LightDown();
      
    // 啟用目前指定的 Column
    col[c].write(0);
      
    // 啟用指定的 Row 使用 mask
    // ex: 1000 0000 & 1100 1100 => 1000 0000
    for(var r=0; r<8; r++) 
      row[r].write( (mask[r]&font[c])>0?1:0  );
      
    c++;
  }
  
}

//============================================================

// 預設全亮測試
for(var idx=0; idx<8; idx++) col[idx].dir(mraa.DIR_OUT_HIGH);
for(var idx=0; idx<8; idx++) row[idx].dir(mraa.DIR_OUT_LOW);

LightUp();
sleep(1000);
LightDown();

for(var i=0; i<textTable.length; i++){
	showFont(textTable[i], 500);   
} 

//Finished
LightDown();




