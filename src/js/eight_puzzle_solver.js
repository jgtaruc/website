// (function(){

// })();

function Puzzle(el) {
    this.puzzle = el;
    this.puzzleWidth = el.clientWidth;
    this.puzzleHeight = el.clientHeight;

    this.movementX = this.puzzleWidth/3 + "px";
    this.movementY = this.puzzleHeight/3 + "px";

    this.blankTile = el.querySelector("#tile0");
}

Puzzle.prototype.solve = function() {
    var response = this.getSolution();
    
    var solution = response["moves"],
        cost = response["cost"],
        expanded = response["expanded"],
        time = response["time"];

    solution = solution.split("|");
    for(let i=0; i<solution.length; i++) {
        this.moveTile(this.blankTile, solution[i]);
    }
}

Puzzle.prototype.getSolution = function() {
    try {
        return {moves: "left", cost: 1, expanded: 1, time: 0};
    } catch(e) {
        console.warn(e);
    }
}

Puzzle.prototype.moveTile = function(tile, direction) {
    var state = this.findNeighbor(this.blankTile, direction);

    switch(direction) {
        case "top":
            tile.style.transform = "translateY(-" + this.movementY + ")";
            state.neighborTile.style.transform = "translateY(" + this.movementY + ")";
        break;
        case "right":
            tile.style.transform = "translateX(" + this.movementX + ")";
            state.neighborTile.style.transform = "translateX(-" + this.movementX + ")";
        break;
        case "bottom":
            tile.style.transform = "translateY(" + this.movementY + ")";
            state.neighborTile.style.transform = "translateY(-" + this.movementY + ")";
        break;
        case "left":
            tile.style.transform = "translateX(-" + this.movementX + ")";
            state.neighborTile.style.transform = "translateX(" + this.movementX + ")";
        break;
        default: break;
    }
    
    // setTimeout(function(){
    var tiles = Array.prototype.slice.call(this.puzzle.querySelectorAll(".puzzle-tile")),
        temp = tiles[state.tileIndex];
        tiles[state.tileIndex] = tiles[state.neighborIndex];
        tiles[state.neighborIndex] = temp;

    tiles[state.neighborIndex].removeAttribute("style");
    tiles[state.tileIndex].removeAttribute("style");
    for(let i=0; i<tiles.length; i++) {
        this.puzzle.appendChild(tiles[i]);
    }
    // }, 1000);
}

Puzzle.prototype.findNeighbor = function(tile, direction) {
    var tiles = Array.prototype.slice.call(this.puzzle.querySelectorAll(".puzzle-tile")),
        tileIndex = tiles.indexOf(tile);
    
    switch(direction) {
        case "up":
        if(tileIndex === 0 || tileIndex === 1 || tileIndex === 2) {
            throw new Error("Cannot move up. Tile is on top edge");
            return;
        }
        break;
        case "right":
            if(tileIndex === 2 || tileIndex === 5 || tileIndex === 8) {
                throw new Error("Cannot move right. Tile is on right edge");
                return;
            }
        break;
        case "down":
            if(tileIndex === 6 || tileIndex === 7 || tileIndex === 8) {
                throw new Error("Cannot move down. Tile is on bottom edge");
                return;        
            }
        break;
        case "left":
            if(tileIndex === 0 || tileIndex === 3 || tileIndex === 6) {
                throw new Error("Cannot move left. Tile is on left edge");
                return;
            }
            var neighborIndex = tileIndex - 1;
            return {tileIndex: tileIndex, neighborIndex: neighborIndex, neighborTile: tiles[neighborIndex]};
        break;
        default: break;
    }
}

Puzzle.prototype.generateRandom = function() {
    
}

Puzzle.prototype.generatePreDetermined = function(initial_state) {
    
}

var p = new Puzzle(document.querySelector("#puzzle"));
p.solve();