# phaser3Demo
Demo of Phaser3 js engine with desired functionality for SOV INVADERS

chatGPT4: Your code seems to be a mix of a game using the Phaser.js library to display an isometric map with tiles and some EOSIO smart contract interaction. The game renders an isometric map of tiles, where each tile is retrieved from the EOSIO chain using the getdata function. The map has draggable, pinch-zoom, and mouse wheel zoom functionality. The code also logs the x and y coordinates of a clicked tile.

The game is initialized with some global variables and configuration for Phaser. Then, the main functions preload and create are defined. preload loads tile images, and create sets up the game scene with the isometric map and the input handling for dragging, pinching, and zooming the map.

The code also includes some callback functions for handling the data retrieved from the EOSIO chain, such as callback_markets and callback_area. The callback_area function is used to get tile data from the EOSIO chain and store it in the global variable area. The areaInfo function uses the getdata function to fetch the tile data from the EOSIO chain.

At the bottom of the code, some math functions are defined to find the maximum and minimum x and y coordinates of the tiles in the areaIDs array. These values are then used to calculate the corrected xmax and ymax of the map, which will be used to draw the map.
