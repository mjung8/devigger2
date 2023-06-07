const helloWorldButton = document.getElementById('helloWorldButton');
helloWorldButton.addEventListener("click", () => {
    console.log("helloworldclicked");
    yello_world = pyscript.interpreter.globals.get("hello_world");
    yello_world();
})

const gridBuilderTextArea = document.getElementById("gridBuilderTextArea");

const buildTableButton = document.getElementById("buildTableButton");

buildTableButton.addEventListener("click", () => {
    const lines = gridBuilderTextArea.value.split('\n');
    console.log(lines);

    //for each line, split by commas - this shows how many legs
    // the value of each split is how many sides there are to each event. 
    // e. g. 2, 2, 2 for a 3 legs made of 2 sides each (simple 2-way moneylines)

    // build the grid
    // count commas for legs...number is sides
    // 4 is just a 4-way devig
    // 2, 2, 2, is a 3-leg 2-way devig

    // first need a datastructure to keep track of this stuff
    // object:
    // id, book, boostDescription, 
    // LegsArray [e.g. 4 > 1; or 2, 2, 2 > 1, 1, 1; or 2, 3, 2 > 1, 1, 1] just placeholder...
    // SidesArray[e.g. 4 > 4; or 2, 2, 2 > 2, 2, 2; or 2, 3, 2 > 2, 3, 2]
    // 

});