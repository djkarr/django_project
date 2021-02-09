// ---------------------- Global Variables -----------------------------------
// How many rows
const Y = 25;

// How many columns
const X = 40;

// Three dimensional array tracking every cell
// Alive/dead represented by a bool at index cells[i][ii][0]
// Living neighbor count for each cell at index cells[i][ii][1]
let cells = [Y];

// 3D array containing mapping of all possible neighbors of each cell
let neighborMap = [Y];

let genCount = 0;
const gameSpeed = 200;
let keepAdvancing;
// ---------------------------------------------------------------------------

window.onload = function() {
  initCells();
  initControls();
}

/**
 * Turn cells array into three dimensions.
 * Add a unique id to every cell's div.
 * Add a click listener to every cell div.
 */
function initCells(){
  for(let i=0; i<Y; i++){
    cells[i] = new Array(X);
    neighborMap[i] = new Array(X);
    $("#gol").append($("<div class='row flex-nowrap' id='row" + i + "'></div>"));
    for(let ii=0; ii<X; ii++){
      neighborMap[i][ii] = getAdjacentCoordinates([i,ii]);
      cells[i][ii] = [false,0];
      $("#row" + i).append($("<div class='square' id='squareR" + i + "C" + ii + "'></div>"));
      $("#squareR" + i + "C" + ii).click(function(){
        $(this).toggleClass("living-cell");
        updateGridArray($(this).attr("id"));
      });
    }
  }
}

/**
 * Get all possible adjacent coordinates. Then loop through and delete the invalid ones.
 * @param {Array} id Coordinate array of a single cell
 * Returns an array of 3 to 8 possible coordinate pairs.
 */
function getAdjacentCoordinates(id){
  console.log("Starting getAdjacentCoordinates");
  let y = id[0];
  let x = id[1];
  // All possible 8 adjacent coordinates
  let coordinates = [[y-1,x-1],[y-1,x],[y-1,x+1],[y,x-1],[y,x+1],[y+1,x-1],[y+1,x],[y+1,x+1]];
  let c = [];

  for(let i=0; i<coordinates.length; i++){
    c = coordinates[i];
  
    if(c[0] < 0 || c[0] > Y-1 || c[1] < 0 || c[1] > X-1){
      coordinates.splice(i,1);
      // Move index back one after splice to account for shift.
      i -= 1;
    }
  }
  return coordinates;
}

/**
 * Add click listeners to the simulation control buttons.
 */
function initControls(){
  $("#advance_generation_button").click(function(){
    advanceGeneration();
    incGenCount();
  });
  $("#auto_advance_button").click(function(){
    (function(){
      advanceGeneration();
      incGenCount();
      keepAdvancing = setTimeout(arguments.callee, gameSpeed);
  })();
  });
  $("#stop_button").click(function(){
    stop();
  });
  $("#clear_button").click(function(){
    clear();
  });
  $("#randomize_button").click(function(){
    randomizeStart();
  });
  $("#preset_button").click(function(){
    preset();
  });
}

/**
 * Currently creates starting pattern that evolves into the 'pulsar' pattern.
 * Calls auto advance. 
 */
function preset(){
  clear();
  let cx = Math.floor(X / 2);
  let cy = Math.ceil(Y / 3);
  for(let i=0; i<7; i++){
    $("#squareR" + (cy+i) + "C" + cx).click();
    if(i == 3){
      $("#squareR" + (cy+i) + "C" + (cx-1)).click();
      $("#squareR" + (cy+i) + "C" + (cx+1)).click();
    }
  }
  $("#auto_advance_button").click();
}

/**
 * Stops the auto advance and pauses the simulation.
 */
function stop(){
  clearInterval(keepAdvancing);
}

/**
 * Randomly sets cells to lving. Currently set at 20% chance.
 */
function randomizeStart(){
  console.log("Starting randomize");
  clear();
  for(let i=0; i<Y; i++){
    for(let ii=0; ii<X; ii++){
      let chance = Math.random();
      if(chance <= 0.2){
        cells[i][ii][0] = true;
        $("#squareR" + i + "C" + ii).toggleClass("living-cell");
      }
    }
  }
}

/**
 * Clear the display, cell array, and generation count.
 */
function clear(){
  stop();
  for(let i=0; i<Y; i++){
    for(let ii=0; ii<X; ii++){
      $("#squareR" + i + "C" + ii).removeClass("living-cell");
      cells[i][ii] = [false, 0];
    }
  }
  genCount = 0;
  $("#genCounter").html("Generation Count: " + genCount);
}

/**
 * Increment the generation counter and update the display.
 */
function incGenCount(){
  genCount++;
  $("#genCounter").html("Generation Count: " + genCount);
}

/**
 * Decides whether a cell will live, die, or be born. Then updates the display.
 */
function displayNewGeneration(){
  for(let i=0; i<Y; i++){
    for(let ii=0; ii<X; ii++){
      if(cells[i][ii][1] == 3 && cells[i][ii][0] == false){
        cells[i][ii][0] = true;
        $("#squareR" + i + "C" + ii).addClass("living-cell");
      } else if((cells[i][ii][1] < 2 && cells[i][ii][0] == true) || (cells[i][ii][1] > 3 && cells[i][ii][0] == true)) {
        cells[i][ii][0] = false;
        $("#squareR" + i + "C" + ii).removeClass("living-cell");
      }
    }
  }
}

/**
 * Update the two dimensional array after a cell toggle.
 * @param {string} squareID the string id of cell's HTML tag
 */
function updateGridArray(squareID){
  let indexes = parseID(squareID);
  lifeToggleGrid(indexes);
}

/**
 * Changes the boolean at given coordinates to it's opposite.
 * @param {Array} id single set of cell coordinates
 */
function lifeToggleGrid(id){
  cells[id[0]][id[1]][0] = !cells[id[0]][id[1]][0];
}

/**
 * Advance a single generation of cells.
 */
function advanceGeneration(){
  updateNeighborCount();
  displayNewGeneration();
  updateNeighborCount();
}

/**
 * Updates each cell's living neighbor count. 
 * That count is stored in cells[i][ii][1]
 */
function updateNeighborCount(){
  for(let i=0; i<Y; i++){
    for(let ii=0; ii<X; ii++){
      let id = [i,ii];
      let adjacents = neighborMap[i][ii];
      cells[i][ii][1] = getNeighborCount(adjacents);
    }
  }
}

/**
 * Get a count of living neighbors.
 * Return int count.
 * @param {Array} neighbors Array of neighbor coordinates from getAdjacentCoordinates
 */
function getNeighborCount(neighbors){
  console.log("Starting getneighborCount");
  let count = 0;
  for(i=0; i<neighbors.length; i++){
    let y = neighbors[i][0];
    let x = neighbors[i][1];
    if(cells[y][x][0]){
      console.log("cells[y][x][0]): " + y,x + " " + cells[y][x][0]);
      count++;
    }
  }
  console.log("Ending getNeighborCount");
  return count;
}

/**
 * Parse square ID's into indexes. Return array of  both indexes.
 * @param {string} squareID string of HTML id tag
 */
function parseID(squareID){
  // id tags for the cell squares are done in this format: id='squareR{i}C{ii}
  let strings = squareID.split("C");
  return [parseInt(strings[0].slice(7)), parseInt(strings[1])];
}



