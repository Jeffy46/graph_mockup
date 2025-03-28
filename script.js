const body = document.querySelector("body");
let tables = document.querySelectorAll(".draggable-table");
let tablePositions=[];
let isDraggingBackground = false;
let isDraggingTable = null; 
let startX, startY; 
let bgPosX = 0, bgPosY = 0; 
let inputGraph;
let operations=[];

//press, xPos and yPos of bg at start
body.addEventListener("mousedown", (e) => {
    if (!e.target.classList.contains("draggable-table")) {
        isDraggingBackground = true;
        startX = e.clientX;
        startY = e.clientY;
    }
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

//Obtain object from last inputted json inputted json
document.getElementById("inputFile").addEventListener("change", function(event) {
    const file = event.target.files[event.target.files.length - 1]; 
    if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const fileContent = e.target.result; 
        try {
        inputGraph = JSON.parse(fileContent);
        createDivs();
        } catch (error) {
        console.error("Error parsing JSON:", error);
        }
    };
    reader.readAsText(file); //reads file and adds to assigns to inputGraph
    } else {
    console.log("No file was selected.");
    }
});
//sending operations from obj into div
let createDivs=()=>{
    operations = Array.from(inputGraph.operations)
    operations.forEach(o => {
        const div = document.createElement("div");
        div.classList.add("draggable-table");
        div.textContent = "Name " + o.name;
        div.style.left=o.position.x+"px";
        div.style.top=o.position.y+"px";
        body.append(div);
        tablePositions.push({
            element: div,
            relativeLeft: parseInt(o.position.x),
            relativeTop: parseInt(o.position.y)
        });
        
    })
    initializeOperations();
};
//adds events to new operations
let initializeOperations = () =>{
    tables = document.querySelectorAll(".draggable-table");
    tables.forEach((table, index) => {
        table.addEventListener("mousedown", (e) => {
            isDraggingTable = table; 
            startX = e.clientX - parseInt(window.getComputedStyle(table).left); 
            startY = e.clientY - parseInt(window.getComputedStyle(table).top);

            e.stopPropagation(); //idk, doesn't work without this
        });
        //tables into objects and assigns starting relativeX and relativeY 
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
};

let resetFunction = () =>{
    document.querySelectorAll(".draggable-table").forEach(e => e.remove());
    bgPosX=0;
    bgPosY=0;
}
