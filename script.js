const body = document.querySelector("body");
const tables = document.querySelectorAll(".draggable-table");
let isDraggingBackground = false;
let isDraggingTable = null; 
let startX, startY; 
let bgPosX = 0, bgPosY = 0; 
let inputGraph;
//tables into objects and assigns starting relativeX and relativeY 
const tablePositions = Array.from(tables).map((table) => ({
    element: table,
    startLeft: parseInt(window.getComputedStyle(table).left),
    startTop: parseInt(window.getComputedStyle(table).top),
}));
//xPos and yPos of bg at start
body.addEventListener("mousedown", (e) => {
    if (!e.target.classList.contains("draggable-table")) {
        isDraggingBackground = true;
        startX = e.clientX;
        startY = e.clientY;
    }
});
//xPos and yPos of tables before and after movement
tables.forEach((table, index) => {
    table.addEventListener("mousedown", (e) => {
        isDraggingTable = table; 
        startX = e.clientX - parseInt(window.getComputedStyle(table).left); 
        startY = e.clientY - parseInt(window.getComputedStyle(table).top);

        e.stopPropagation();
    });

    table.addEventListener("mouseup", () => {
        if (isDraggingTable) {
            const currentLeft = parseInt(window.getComputedStyle(table).left);
            const currentTop = parseInt(window.getComputedStyle(table).top);

            tablePositions[index].relativeLeft = currentLeft - bgPosX; 
            tablePositions[index].relativeTop = currentTop - bgPosY; 

            isDraggingTable = null; 
        }
    });
});
//mouse movement
document.addEventListener("mousemove", (e) => {
    if (isDraggingBackground) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        bgPosX += deltaX;
        bgPosY += deltaY;
        body.style.backgroundPosition = `${bgPosX}px ${bgPosY}px`;

        tablePositions.forEach(({ element, relativeLeft, relativeTop }) => {
            element.style.left = `${relativeLeft + bgPosX}px`;
            element.style.top = `${relativeTop + bgPosY}px`;
        });

        startX = e.clientX;
        startY = e.clientY;
    }

    if (isDraggingTable) {
        const newLeft = e.clientX - startX;
        const newTop = e.clientY - startY;
        isDraggingTable.style.left = `${newLeft}px`;
        isDraggingTable.style.top = `${newTop}px`;
    }
});
//release
document.addEventListener("mouseup", () => {
    isDraggingBackground = false; 
    if (isDraggingTable) {
        isDraggingTable = null; 
    }
});

//Obtain object from inputted json
    document.getElementById("inputFile").addEventListener("change", function(event) {
      const file = event.target.files[0]; 
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const fileContent = e.target.result; 
          try {
            inputGraph = JSON.parse(fileContent);
            console.log("Parsed JS Object:", inputGraph);
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        };
        reader.readAsText(file); //reads file and adds to assigns to inputGraph
      } else {
        console.log("No file was selected.");
      }
    });
