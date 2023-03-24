# phaser3Demo
Demo of Phaser3 js engine with desired functionality for SOV INVADERS

currently is set to only update the game / map upon user interactions with the standard 'update' phaser function ommited and a custom function to gets triggered to update the game / map only upon user interactions.  

it does have some issues that need resolved. we are seeing some resource spikes at time and even spiked an Intel i9 processor to 100% on single core.  other machines tested cpu usage is typically around 10% and gpu around 15% average but with spikes above 30% at times, but i have since optimized it and getting much better readings, though it is still spiking at times.  one other thing to note that is unexpected behaviour, is if you open two instances of the game at once, i.e., (two local webservers with duplicate files or one hosted and one local web server etc..) the resource usage actually goes down considerably.  so maybe something to do with garbage collection efficiency being triggered when more than one instance is running and visual simultaenously.  if the game / map is running but not in view, i.e., the user is in another browser tab and not accessing the game, the resource usage drops to basically nothing, which is good.  

on mobile currently the pinch zoom does not work, so that needs to be resolved as well, but it seems everything esle as far as fucntionality is working correctly.   

the map is built and the tile dimensions are set to interactive hitzones that provides coordinate upon user input.  it is done this way to ensure wrong coordinates are not given when clicking on a tile or asset that overlaps with another.  many of the games assets include units and buildings that will overlap the tiles for the isometric effect, and also even with the single tile asset like it is now, without the hitzones it can give some unexpected coordinates at times when clicking close to the edge of the tiles.  the hitzones fixes this though.  

the games map will be built from an array that will say which tiles to use, that is called from a smartcontract on EOS, though it is currently just set to a single tile with random color tints for the demo / testing.    
