(function(){
function Puzzle(el) {
    this.puzzle = el;
    this.puzzleWidth = el.clientWidth;
    this.puzzleHeight = el.clientHeight;

    this.movementX = this.puzzleWidth/3 + "px";
    this.movementY = this.puzzleHeight/3 + "px";
}

Puzzle.prototype.solve = async function(form) {
    this.blankTile = this.puzzle.querySelector("#tile0");

    var tiles = document.querySelectorAll(".puzzle-tile");
    this.state = [
                    [ parseInt(tiles[0].getAttribute("data-value")), parseInt(tiles[1].getAttribute("data-value")), parseInt(tiles[2].getAttribute("data-value")) ],
                    [ parseInt(tiles[3].getAttribute("data-value")), parseInt(tiles[4].getAttribute("data-value")), parseInt(tiles[5].getAttribute("data-value")) ],
                    [ parseInt(tiles[6].getAttribute("data-value")), parseInt(tiles[7].getAttribute("data-value")), parseInt(tiles[8].getAttribute("data-value")) ]
                ];

    document.querySelector("#solutionLoader").classList.remove("hidden");
    var response = await this.getSolution(form);
    document.querySelector("#solutionLoader").classList.add("hidden");
    
    var solution = response["moves"],
        cost = response["cost"],
        expanded = response["expanded"],
        time = response["time"];

    solution = solution.split("|");
    if(cost === 0) {
        alert("Puzzle already solved!");
        return;
    }
    for(let i=0; i<solution.length; i++) {
        await this.moveTile(this.blankTile, solution[i]);
    }
}

Puzzle.prototype.getSolution = async function(form) {
    try {
        // TODO: testing
        var req = {
            method: "POST",
            body: JSON.stringify({"Algorithm": parseInt(form["algorithm"].value), "State": this.state}),
            mode: "cors"
        };
        var response = await fetch("https://jgprojects-1281.appspot.com/api/eight_puzzle_solver", req);
        return await response.json();
    } catch(e) {
        console.warn(e);
    }
}

Puzzle.prototype.moveTile = async function(tile, direction) {
    var state = this.findNeighbor(this.blankTile, direction);
    switch(direction) {
        case "up":
            tile.style.top = "-"+this.movementY;
            state.neighborTile.style.top = this.movementY;
        break;
        case "right":
            tile.style.right = "-"+this.movementX;
            state.neighborTile.style.right = this.movementX;
        break;
        case "down":
            tile.style.top = this.movementY;
            state.neighborTile.style.top = "-"+this.movementY;
        break;
        case "left":
        tile.style.right = this.movementX;
        state.neighborTile.style.right = "-"+this.movementX;
        break;
        default: break;
    }

    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    await timeout(150);    

    var tiles = Array.prototype.slice.call(this.puzzle.querySelectorAll(".puzzle-tile")),
        temp = tiles[state.tileIndex];
        tiles[state.tileIndex] = tiles[state.neighborIndex];
        tiles[state.neighborIndex] = temp;

    tiles[state.neighborIndex].removeAttribute("style");
    tiles[state.tileIndex].removeAttribute("style");
    for(let i=0; i<tiles.length; i++) {
        this.puzzle.appendChild(tiles[i]);
    }
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
        var neighborIndex = tileIndex - 3;
        return {tileIndex: tileIndex, neighborIndex: neighborIndex, neighborTile: tiles[neighborIndex]};
        break;
        case "right":
            if(tileIndex === 2 || tileIndex === 5 || tileIndex === 8) {
                throw new Error("Cannot move right. Tile is on right edge");
                return;
            }
            var neighborIndex = tileIndex + 1;
            return {tileIndex: tileIndex, neighborIndex: neighborIndex, neighborTile: tiles[neighborIndex]};
        break;
        case "down":
            if(tileIndex === 6 || tileIndex === 7 || tileIndex === 8) {
                throw new Error("Cannot move down. Tile is on bottom edge");
                return;        
            }
            var neighborIndex = tileIndex + 3;
            return {tileIndex: tileIndex, neighborIndex: neighborIndex, neighborTile: tiles[neighborIndex]};
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

Puzzle.prototype.generateRandom = async function() {
    // var array = [0,1,2,3,4,5,6,7,8];

    //TODO: check if solvable
    try {
        var response = await fetch("https://jgprojects-1281.appspot.com/api/eight_puzzle_solver/generate_random", {method: "GET"});
        var array = await response.json();
    } catch(e) {
        console.warn(e);
        return;
    }
    this.puzzle.innerHTML = "";
    
    for(var i=0; i<array.length; i++) {
        for(var j=0; j<array[i].length; j++) {
            this.puzzle.innerHTML += '<div id="tile'+array[i][j]+ '" data-value=' +  array[i][j] + ' class="puzzle-tile jg-grid-item jg-grid-1/3"><div>'+array[i][j]+'</div></div>'
        }
    }    
}

var p = new Puzzle(document.querySelector("#puzzle"));
p.generateRandom();

document.querySelector("#generateRandom_btn").addEventListener("click", function(){
    p.generateRandom();
});
document.querySelector("#puzzle-form").addEventListener("submit", function(evt){
    evt.preventDefault();
    p.solve(evt.target);
});
})();