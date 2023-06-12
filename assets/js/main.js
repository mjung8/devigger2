class Boost {
    constructor(id, book, description, legs, odds, boosted) {
        this.id = id;
        this.book = book;
        this.description = description;
        this.legs = legs;
        this.odds = odds;
        this.boosted = boosted;
    }
};

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
        console.log("buildTableButton clicked...");
        console.log(lines);

        // date needed for id;
        const dateString = GetDate();
        const numEventContainers = lines.length;

        // TODO create list of objects; create object

        const boosts = [];
        for (let i = 0; i < numEventContainers; i++) {
            if (lines[i].trim()) {

                const id = dateString + (i + 1).toString();

                // TODO build an object here
                // id, book, boostDescrption
                // legsArray (below's splits), oddsArray should be parallel
                // then generate html based off the object
                const boost = new Boost(id, "", "", lines[i].split(","), [], 0);
                console.log(boost.id);
                console.log(boost.book);
                console.log(boost.description);
                console.log(boost.legs);
                console.log(boost.odds);
                console.log(boost.boosted);

                boosts.push(boost);

                const mainDiv = document.createElement("div");
                mainDiv.className = "eventContainer";
                mainDiv.id = id;

                const emptyDiv1 = document.createElement("div");

                const bookDiv = document.createElement("div");
                bookDiv.className = "userInputs fst-italic";
                bookDiv.setAttribute("contenteditable", "true");
                bookDiv.setAttribute("data-text", "Book");

                const boostDescDiv = document.createElement("div");
                boostDescDiv.className = "userInputs fst-italic";
                boostDescDiv.setAttribute("contenteditable", "true");
                boostDescDiv.setAttribute("data-text", "Boost Description...");

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

                const finalGroupingDiv = document.createElement("div");
                finalGroupingDiv.className = "finalGrouping";

                const finalLabelDiv = document.createElement("div");
                finalLabelDiv.className = "fw-bold";
                finalLabelDiv.textContent = "Final"

                const boostedUserInput = document.createElement("div");
                boostedUserInput.className = "userInputs";
                boostedUserInput.setAttribute("contenteditable", "true");

                finalGroupingDiv.appendChild(finalLabelDiv);
                finalGroupingDiv.appendChild(boostedUserInput);

                emptyDiv2.appendChild(finalGroupingDiv);

                mainDiv.appendChild(emptyDiv2);

                allContainerDiv.appendChild(mainDiv);
            }
        }

        console.log(boosts.length);
        console.log(boosts);
    }

});



//#region testing
const testTextAreaButton = document.getElementById("testTextAreaButton");
testTextAreaButton.addEventListener("click", () => {
    gridBuilderTextArea.value = "2, 2, 2\n4\n3, 3,3, 3\n2,3";
});

//#endregion