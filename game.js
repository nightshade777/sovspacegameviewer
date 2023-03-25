
//FOR GAVIN 11:25 PM
//global vars

let minX_true = Number.MAX_SAFE_INTEGER;
let maxX_true = -Infinity;
let minY_true = Number.MAX_SAFE_INTEGER;
let maxY_true = -Infinity;


//these are intended to store the area arrays into local arrays so we can do long for loops without calling external API
let areaIDs = []; 
let areaID;
let tileIDs = [];
let tileID;
let nftIDs = [];
let nftID;


let i_g = 0;
let chunksize = 1000;
let surfacewidth = 1000000;



let layer;
let camera;
let tileWidth = 300;
let tileHeight = 140;
let offsetX = tileWidth / 2;
let offsetY = tileHeight / 2;
let dragging = false;
let dragStart = new Phaser.Math.Vector2();
let pinchActive = false;
let initialPinchDistance;




const config = {
      type: Phaser.auto,
      autoRound: true, // Round pixel values to the nearest integer to save resources
      antialias: false, // Disable antialiasing to save resources
      backgroundColor: '#000000', // Set a solid background color
      width: 1920,
      height: 1080 ,
      scene: {
          preload: preload,
          create: create
      },
      contextCreationParams: {
          powerPreference: 'low-power' // save resources
      },
      render: {
          batchSize: 4000 // Increase the batchSize
      }

};

loadall() // preload all arrays locally first before creating game
console.log('code passed the loadall()');



/**

console.log('Starting...');

function delayedAreaInfo(count) {
    if (count === 0) {
        // Additional code to execute after all wait times are finished
        console.log('Executing additional code...');
        const game = new Phaser.Game(config);
        // Your additional code here
        return;
    }

    setTimeout(() => {
        areaInfo(chunksize);

        if (count === 8) {
            console.log('...1 second has passed.');
        }

        delayedAreaInfo(count - 1);
    }, 1000);
}

delayedAreaInfo(9);

console.log('Continuing...');
  
  **/
function preload() {

      //load all images here
    this.load.image('tile00', 'assets/tile00.png');
    this.load.image('tile01', 'assets/tile01.png');
    this.load.image('tile02', 'assets/tile02.png');
    this.load.image('tile03', 'assets/tile03.png');
    this.load.image('tile04', 'assets/tile04.png');

    //load terraforms
    this.load.image('tile12', 'assets/tile12.png');
    this.load.image('tile13', 'assets/tile13.png');
    this.load.image('tile14', 'assets/tile14.png');
    this.load.image('tile20', 'assets/tile20.png');
    this.load.image('tile21', 'assets/tile21.png');
    this.load.image('tile22', 'assets/tile22.png');
    this.load.image('tile25', 'assets/tile25.png');
    this.load.image('tile26', 'assets/tile26.png');
    this.load.image('tile27', 'assets/tile27.png');
    this.load.image('tile30', 'assets/tile30.png');
    this.load.image('tile31', 'assets/tile31.png');
    this.load.image('tile32', 'assets/tile32.png');
    this.load.image('tile35', 'assets/tile35.png');
    this.load.image('tile36', 'assets/tile36.png');
    this.load.image('tile37', 'assets/tile37.png');

  }
function create() {
    layer = this.add.layer(0, 0);
    camera = this.cameras.main;
    

    //let maxX_true = 1000; // pull coordinates from eos table
    //let maxY_true = 1000;
    //let minX_true = 950;
    //let minY_true = 950;

    let xmax_c = maxX_true - minX_true; //xmax corrected, using relative coordinates for sake of viewer box, true coordinates will still be included/tracked
    let ymax_c = maxY_true - minY_true; //ymax corrected


    let tileCounter = 0;

     // Calculate center of map
    const centerX = ((xmax_c * tileWidth) / 2 + (xmax_c * tileWidth) / 2) / 2;
    const centerY = ((ymax_c * tileHeight) / 2 - (ymax_c * tileHeight) / 2) / 2;

    // Center camera on map
    camera.centerOn(centerX, centerY);
    
    const hitArea = new Phaser.Geom.Polygon([
        0, tileHeight / 2,
        tileWidth / 2, 0,
        tileWidth, tileHeight / 2,
        tileWidth / 2, tileHeight
    ]);  // add hit area so that coordinates are correct regardless of tile overlap which is necessary because the buildings and other assets will overlap due to isometric view

    let x_true, y_true;
    //ymax_c & xmax_c replaced with number
    for (let y = 0; y < ymax_c; y++) {
        for (let x = 0; x < xmax_c; x++) {
            let tileX = x * tileWidth / 2 + y * tileWidth / 2; //pixel coordinates
            let tileY = y * tileHeight / 2 - x * tileHeight / 2; //pixel coordinates

            x_true = x + minX_true;// Calculate back EOS X coordinates
            y_true = y + minY_true;// Calculate back EOS Y coordinates

            //let tileImage = 'tile30';

            let tile_Num = getTileData(x_true, y_true);    //convert the x and y coordinates and find corresponding tile on the table,USES LOCAL ARRAY
            //let tile_Num = getTileData(499990, 500012);
            

           console.log('Tile num:', tile_Num);

           let tileImage = getTileImageKey(tile_Num); //convert tile number on table to file image name which were loaded above

            console.log('Tile image:', tileImage);

                


            //tileImage = getTileData(x_true, y_true);
            //console.log('Tile image:', tileImage);



            //fix offset
            //updateHitAreaPosition(hitArea, tileX + 2 * tileWidth / 2, tileY + 2 * tileHeight / 2); // Update hitArea coordinates with the current tile position and the desired offset

            //create tiles
           //if (tile_Num >4) {

                const tile = this.add.image(tileX, tileY, tileImage).setInteractive(hitArea, Phaser.Geom.Polygon.Contains)
                    .setData({ name: `mapTile${tileCounter}`, x_true, y_true });
                layer.add(tile);
            //}

            
            tileCounter++;
        }
    }  // drawing the map and setting the hitzones to be interactive and display coordinates in the console upon clicking

    
   

    // ...

      this.input.on('pointerdown', (pointer) => {
          if (this.input.pointer1.isDown && this.input.pointer2.isDown) {
              pinchActive = true;
              initialPinchDistance = Phaser.Math.Distance.Between(
                  this.input.pointer1.x, this.input.pointer1.y,
                  this.input.pointer2.x, this.input.pointer2.y
              );
          } else {
              dragging = true;
              dragStart.set(pointer.x, pointer.y);
          }
         
      });  // checking to see if user is pinching the map (mobile) or selecting the map to drag

      this.input.on('pointerup', (pointer) => {
          dragging = false;
          pinchActive = false;
          
      });  // making sure the dragging and pinch is stopped upon lifting fingers of the map or releasing the mouse button to stop dragging

      this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
          const zoomAmount = deltaY > 0 ? -0.05 : 0.05;
          camera.zoom = Phaser.Math.Clamp(camera.zoom + zoomAmount, 0.1, 2);
          
      }); // mouse zoom functionality and updating the map whenever this happens

      this.input.on('pointermove', _.throttle((pointer) => {
          if (dragging && !pinchActive) {
              const deltaX = pointer.x - dragStart.x;
              const deltaY = pointer.y - dragStart.y;

              camera.scrollX -= deltaX / camera.zoom;
              camera.scrollY -= deltaY / camera.zoom;

              dragStart.set(pointer.x, pointer.y);
          }

          if (pinchActive) {
              const pinchDistance = Phaser.Math.Distance.Between(
                  this.input.pointer1.x, this.input.pointer1.y,
                  this.input.pointer2.x, this.input.pointer2.y
              );

              const zoomAmount = (initialPinchDistance - pinchDistance) * 0.01;
              camera.zoom = Phaser.Math.Clamp(camera.zoom - zoomAmount, 0.1, 2);
              initialPinchDistance = pinchDistance;
          }
          
      }, 16)); // dragging / scrolling the map and updating the map upon the user event

      // Add the event listener for clicking on a tile
      this.input.on('gameobjectdown', (pointer, gameObject) => {
          console.log(`Tile clicked: ${gameObject.getData('name')}, Coordinates: {x: ${gameObject.getData('x_true')}, y: ${gameObject.getData('y_true')}}`);
      });
}




//--EOS JS -------------------------------------------------------------------------------------------------------------------------------------

function updateHitAreaPosition(hitArea, offsetX, offsetY) {
    for (const point of hitArea.points) {
        point.x += offsetX;
        point.y += offsetY;
    }
}



function getTileData(x, y) {
    let id = parseInt(y.toString() + x.toString() );
    let tileNumber = null;
    let l = nftIDs.length;
    

    for (let i = 0; i < l; i++) {
        if (i > 10000) {
            console.log('code got here :(', tileNumber); //correct
            break;
        }
        if (parseInt(areaIDs[i]) === id) {
            tileNumber = tileIDs[i];
            console.log('tileID[i] element :)', nftIDs[i]); //correct
            console.log('coordinate located :)', tileNumber); //correct
            return tileNumber;
        }
    }
    return 0; // Default return value
}

function getTileImageKey(tileNumber) {
    switch (tileNumber) {
        case 0:
            return 'tile00';
        case 1:
            return 'tile01';
        case 2:
            return 'tile02';
        case 3:
            return 'tile03';
        case 4:
            return 'tile04';
        case 12:
            return 'tile12';
        case 13:
            return 'tile13';
        case 14:
            return 'tile14';
        case 20:
            return 'tile20';
        case 21:
            return 'tile21';
        case 22:
            return 'tile22';
        case 25:
            return 'tile25';
        case 26:
            return 'tile26';
        case 27:
            return 'tile27';
        case 30:
            return 'tile30';
        case 31:
            return 'tile31';
        case 32:
            return 'tile32';
        case 35:
            return 'tile35';
        case 36:
            return 'tile36';
        case 37:
            return 'tile37';
        default:
            return 'tile00';
    }
}





function callback_markets(value) {
    if (value == undefined) return;
    if (value.rows.length == 0) return;
    markets = value;
    let marketNames = [];
    let marketName;
    let l = markets.rows.length;
    for (let i = 0; i < l; i++) {
        marketName = markets.rows[i].name + "<br>";
        marketNames.push(marketName);
    }
    document.getElementById('marketArray').innerHTML = marketNames;
} // callback_markets

function marketInfo() {
    getdata(callback_markets, "sovspacegame", "sovspacegame", "markets", "", "", "", 100);
} // marketInfo

function callback_area(value) {
    if (value == undefined) return;
    if (value.rows.length == 0) return;
    area = value; //global var getting set here
   // let areaIDs = [];
    //let areaID;
    //let tileIDs = [];
    //let tileID;
    //let nftIDs = [];
    //let nftID;

    
    
   /** for (let i = 0; i < l; i++) {
        areaID = area.rows[i].id; //"'.id' can be replaced with any of the table parameters
        areaIDs.push(areaID);
        
      
    }
    **/
    

    
   // let l = area.rows.length;

    for (i_g; i_g < (chunksize ); i_g++) {

        console.log('ig: ', i_g);
        const y = parseInt(area.rows[i_g].id / 1000000);
        console.log('Y: ', y);
        const x = parseInt(area.rows[i_g].id) - (y * 1000000);
        console.log('X: ', x);

        areaID = area.rows[i_g].id; 
        areaIDs.push(areaID);

        tileID = area.rows[i_g].tile
        tileIDs.push(tileID);

        nftID = area.rows[i_g].asset_id
        nftIDs.push(nftID);

        minY_true = Math.min(minY_true, y);
        maxY_true = Math.max(maxY_true, y);
        minX_true = Math.min(minX_true, x);
        maxX_true = Math.max(maxX_true, x);
    }



   // let coordinateArray = areaIDs;
    //let tileArray = areaIDs;
    
    //let nftArray = nftIDs;

    

    //maxX_true = findMaxX(areaIDs);  //global var getting set here
    //maxY_true = findMaxY(areaIDs); //global var getting set here
   // minX_true = findMinX(areaIDs);  //global var getting set here
    //minY_true = findMinY(areaIDs);  //global var getting set here


    console.log('maxX=', maxX_true);
    console.log('maxY=', maxY_true);
    console.log('minX=', minX_true);
    console.log('minY=', minY_true);


    //document.getElementById('areaArray').innerHTML = areaIDs;
    //document.getElementById('tileArray').innerHTML = tileIDs;
    //document.getElementById('nftArray').innerHTML = nftIDs;
} // callback_area

//ORIGINAL GETDATA CALL ----------------------------------------------------------------------------------------

function areaInfo(rowcount) {
    getdata(callback_area, "sovspacegame", "sovspacegame", "area", global_account, 2, "name", rowcount); //get entire table
} // areaInfo





// math functions---------------------------------------------------------------------------------------------------------------------------------------


/**
function updateMinMaxCoordinates(areaIDs) {
    minX_true = Number.MAX_SAFE_INTEGER;
    maxX_true = -Infinity;
    minY_true = Number.MAX_SAFE_INTEGER;
    maxY_true = -Infinity;

    for (let i = 0; i < areaIDs.length; i++) {
        const y = parseInt(areaIDs[i].substring(0, 6), 10);
        const x = parseInt(areaIDs[i].substring(6), 10);

        minY_true = Math.min(minY_true, y);
        maxY_true = Math.max(maxY_true, y);
        minX_true = Math.min(minX_true, x);
        maxX_true = Math.max(maxX_true, x);
    }
}
**/
//  SVEN'S ASYNC CODE----------------------------------------------------
async function loadall() {
    //alert("load");


    var lastid = "";
    url = "https://eos.greymass.com/v1/chain/get_table_rows";

    FINISH = 0;
    loadcnt = 0;

    while (FINISH == 0) {

        limit = 1000;
        jsonparam = '{"table":"area","scope":"sovspacegame","code":"sovspacegame","lower_bound": "' + lastid + '","limit":' + limit + ',"json":"true"}';
        retjson = readurl_simple(url, jsonparam);
        rows = JSON.parse(retjson);
        size = rows.rows.length;
        console.log("size: " + size);

        for (i = 0; i < size; i++) {
            coor = rows.rows[i].id;
            tile = rows.rows[i].tile;

            areaID = rows.rows[i].id;
            areaIDs.push(areaID);

            tileID = rows.rows[i].tile
            tileIDs.push(tileID);

            nftID = rows.rows[i].asset_id
            nftIDs.push(nftID);

            console.log('i: ', i);
            const y = parseInt(rows.rows[i].id / 1000000);
            console.log('Y: ', y);
            const x = parseInt(rows.rows[i].id) - (y * 1000000);
            console.log('X: ', x);

            minY_true = Math.min(minY_true, y);
            maxY_true = Math.max(maxY_true, y);
            minX_true = Math.min(minX_true, x);
            maxX_true = Math.max(maxX_true, x);

            i_g++;



            console.log("areaIDs[i_g]: " + areaIDs[i_g] + " areaIDs[i_g]:" + tileIDs[i_g]);

            //thex3 = thex2 +200  - 500000;
            //they3 = they2 +100  - 500000;

            //if (tile == 1) setpixel (thex3,they3, 200,200,255);
            //if (tile == 2) setpixel (thex3,they3, 200,255,255);
            //if (tile == 3) setpixel (thex3,they3, 255,200,255);
            //if (tile == 4) setpixel (thex3,they3, 200,255,200);

        } // for i...

        lastid = rows.next_key;
        await delay(2000);
        if (rows.more != 1) {
            FINISH = 1;
            const game = new Phaser.Game(config);
        }
        loadcnt++;
        console.log("L:" + loadcnt + " lastid:" + lastid + " ");

    } // while 



    console.log("FIN<br>");
} // loadall




function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}


function readurl_simple(url, jsonparam) {
    try {
        var xhr = new XMLHttpRequest();
        var fd = new FormData();
        xhr.open('POST', url, false);

        var data2 = jsonparam;

        xhr.send(data2);

        var response = xhr.responseText;

        return (response);
    } catch (e) {
        console.log("Connection failed, grabbing local");
        return '[]';
    }
} // readurl()


//
// getdata()
//
function getdata(callback, _code, _scope, _table, _lower, _index, _key_type, _limit) {


    var rows = null;

    //     var url = "https://jungle3.greymass.com/v1/chain/get_table_rows";
    // var url = "https://eos.greymass.com/v1/chain/get_table_rows";
    //     var url = "https://eos.api.eosnation.io/v1/chain/get_table_rows";

    var url = "https://" + thenode + "/v1/chain/get_table_rows";

    var xhr = new XMLHttpRequest();

    //var params = JSON.stringify(  {"code":"sovorderbook","scope":"sovorderbook","table":"token", "lower_bound":"12" ,  "json":true } );
    //var params = JSON.stringify(  {"code":"sovorderbook","scope":"sovorderbook","table":"asks", "lower_bound":"10", "index_position":2 , "key_type": "i64",  "json":true } );
    //var params = JSON.stringify(  {"code":_code,"scope":_scope,"table":_table, "lower_bound":_lower, "index_position":2 , "key_type": "i64",  "json":true } );
    var params = JSON.stringify({ "code": _code, "scope": _scope, "table": _table, "lower_bound": _lower, "index_position": _index, "key_type": _key_type, "limit": _limit, "json": true });

    xhr.open("POST", url);

    //xhr.setRequestHeader("Content-length", params.length);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");



    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            //      console.log("hic--2-");
            //    console.log(xhr.status);
            //   console.log(xhr.responseText);
            json = xhr.responseText;

            const rows = JSON.parse(json);

            callback(rows);
            //      document.getElementById('backdata').innerHTML = "XXX:"+xhr.responseText+"AA";
        }
    };

    //var mydata = {"code":"sovorderbook","scope":"sovorderbook","table":"token", "lower_bound":"10" ,  "json":true };

    xhr.send(params);


    // console.log("back");
} // getdata