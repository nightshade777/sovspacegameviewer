

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
  const game = new Phaser.Game(config);
 

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

function preload() {

      //load all images here
    this.load.image('tile000', 'assets/tile000.png');
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
    

    let maxX_true = 1000; // pull coordinates from eos table
    let maxY_true = 1000;
    let minX_true = 950;
    let minY_true = 950;

    let xmax_c = maxX_true - minX_true; //xmax corrected
    let ymax_c = maxY_true - minY_true; //ymax corrected


    const mapWidth = xmax_c;
    const mapHeight = ymax_c;

    let tileCounter = 0;

     // Calculate center of map
    const centerX = ((xmax_c * tileWidth) / 2 + (ymax_c * tileWidth) / 2) / 2;
    const centerY = ((ymax_c * tileHeight) / 2 - (xmax_c * tileHeight) / 2) / 2;

    // Center camera on map
    camera.centerOn(centerX, centerY);

    
    

    const hitArea = new Phaser.Geom.Polygon([
        0, tileHeight / 2,
        tileWidth / 2, 0,
        tileWidth, tileHeight / 2,
        tileWidth / 2, tileHeight
    ]);  // add hit area so that coordinates are correct regardless of tile overlap which is necessary because the buildings and other assets will overlap due to isometric view

    let x_true, y_true;

    for (let y = 0; y < ymax_c; y++) {
        for (let x = 0; x < xmax_c; x++) {
            const tileX = x * tileWidth / 2 + y * tileWidth / 2;
            const tileY = y * tileHeight / 2 - x * tileHeight / 2;

            x_true = x + minX_true;
            y_true = y + minY_true;

            const tile = this.add.image(tileX, tileY, 'tile000').setInteractive(hitArea, Phaser.Geom.Polygon.Contains)
                .setData({ name: `mapTile${tileCounter}`, x_true, y_true });

            layer.add(tile);
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
