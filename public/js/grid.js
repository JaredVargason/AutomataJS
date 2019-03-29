var squareSize = 10

function createGrid(id) {
    let grid = document.getElementById(id);
    
    grid.addEventListener('mousedown', function() {
        addState();
    });
}

function addState() {
   // var stateSvg = 
}

$(document).ready(function() {
    createGrid('grid');
});