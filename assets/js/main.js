const helloWorldButton = document.getElementById('helloWorldButton');
helloWorldButton.addEventListener("click", () => {
    console.log("helloworldclicked");
    yello_world = pyscript.interpreter.globals.get("hello_world");
    yello_world();
});

const GetDate = () => {
    const currentDate = new Date();

    // Specify the desired format options
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    };

    // Format the current date using the specified options
    const formattedDate = currentDate.toLocaleDateString('en-US', options).replace(/[^0-9]/g, '');

    return formattedDate;
};

const gridBuilderTextArea = document.getElementById("gridBuilderTextArea");
const buildTableButton = document.getElementById("buildTableButton");
const allContainerDiv = document.getElementById("allContainer");

buildTableButton.addEventListener("click", () => {
    if (gridBuilderTextArea.value.trim()) {
        const lines = gridBuilderTextArea.value.split('\n');
        console.log(lines);

        //for each line, split by commas - this shows how many legs
        // the value of each split is how many sides there are to each event. 
        // e. g. 2, 2, 2 for a 3 legs made of 2 sides each (simple 2-way moneylines)

        // build the grid
        // count commas for legs...number is sides
        // 4 is just a 4-way devig
        // 2, 2, 2, is a 3-leg 2-way devig
        // 3, 3, 3, 3 is a 4-leg 3-way devig
        // 2, 3 is a 2-leg combo devig (football/soccer cfl/mls)

        // first need a datastructure to keep track of this stuff
        // for each line, create an object:
        // id, book, boostDescription, 
        // inputsArray[e.g. 4; 2, 2, 2; 2, 3, 2]
        // number of eventContainers = lines.Count;
        // number of legGroupings = inputsArray.Count
        // number of userInputs in each legGrouping is mapped by inputsArray
        // for each i in inputsArray[]
        // var splits = inputsArray[i]
        // for each splits, create a leg grouping, and the value of the array for number of user inputs

        // date needed for id;
        const dateString = GetDate();
        const numEventContainers = lines.length;

        // TODO create list of objects; create object

        for (let i = 0; i < numEventContainers; i++) {
            if (lines[i].trim()) {
                
                
                const id = dateString + (i + 1).toString();
                console.log(id);

                const mainDiv = document.createElement("div");
                mainDiv.className = "eventContainer";
                mainDiv.id = id;

                const emptyDiv1 = document.createElement("div");

                const bookDiv = document.createElement("div");
                bookDiv.className = "userInputs fst-italic";
                bookDiv.setAttribute("contenteditable", "true");
                bookDiv.textContent = "Book";

                const boostDescDiv = document.createElement("div");
                boostDescDiv.className = "userInputs fst-italic";
                boostDescDiv.setAttribute("contenteditable", "true");
                boostDescDiv.textContent = "Boost Description...";

                emptyDiv1.appendChild(bookDiv);
                emptyDiv1.appendChild(boostDescDiv);

                mainDiv.appendChild(emptyDiv1);

                const emptyDiv2 = document.createElement("div");
                
                const oddsLabelDiv = document.createElement("div");
                oddsLabelDiv.className = "fw-bold mx-2";
                oddsLabelDiv.textContent = "Odds"

                emptyDiv2.appendChild(oddsLabelDiv);

                // legGroupings for split count...
                const splits = lines[i].split(",");

                for (let i = 0; i < splits.length; i++) {
                    const legGroupingDiv = document.createElement("div");
                    legGroupingDiv.className = "legGrouping";

                    const sides = splits[i];
                    for (let j = 0; j < sides; j++) {
                        const userInputDiv = document.createElement("div");
                        userInputDiv.className = "userInputs";
                        userInputDiv.setAttribute("contenteditable", "true");

                        legGroupingDiv.appendChild(userInputDiv);
                    }

                    emptyDiv2.appendChild(legGroupingDiv);
                }

                const finalOddsLegGroupingDiv = document.createElement("div");

                const finalLabelDiv = document.createElement("div");
                finalLabelDiv.className = "fw-bold";
                finalLabelDiv.textContent = "Final"

                const boostedUserInput = document.createElement("div");
                boostedUserInput.className = "userInputs";
                boostedUserInput.setAttribute("contenteditable", "true");

                finalOddsLegGroupingDiv.appendChild(finalLabelDiv);
                finalOddsLegGroupingDiv.appendChild(boostedUserInput);

                emptyDiv2.appendChild(finalOddsLegGroupingDiv);

                mainDiv.appendChild(emptyDiv2);

                allContainerDiv.appendChild(mainDiv);
            }
        }
    }


});