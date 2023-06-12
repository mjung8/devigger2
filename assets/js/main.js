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

const CreateHtmlFromBoosts = (boosts, target) => {
    for (let i = 0; i < boosts.length; i++) {
        const boost = boosts[i];

        const mainDiv = document.createElement("div");
        mainDiv.className = "eventContainer";
        mainDiv.id = boost.id;

        const emptyDiv1 = document.createElement("div");

        const bookDiv = document.createElement("div");
        bookDiv.className = "userInputs fst-italic";
        bookDiv.setAttribute("contenteditable", "true");
        if (boost.book) {
            bookDiv.textContent = boost.book;
        } else {
            bookDiv.setAttribute("data-text", "Book");
        }

        const boostDescDiv = document.createElement("div");
        boostDescDiv.className = "userInputs fst-italic";
        boostDescDiv.setAttribute("contenteditable", "true");
        if (boost.book) {
            boostDescDiv.textContent = boost.description;
        } else {
            boostDescDiv.setAttribute("data-text", "Boost Description...");
        }

        emptyDiv1.appendChild(bookDiv);
        emptyDiv1.appendChild(boostDescDiv);

        mainDiv.appendChild(emptyDiv1);

        const emptyDiv2 = document.createElement("div");

        const oddsLabelDiv = document.createElement("div");
        oddsLabelDiv.className = "fw-bold mx-2";
        oddsLabelDiv.textContent = "Odds"

        emptyDiv2.appendChild(oddsLabelDiv);

        for (let i = 0; i < boost.legs.length; i++) {
            const legGroupingDiv = document.createElement("div");
            legGroupingDiv.className = "legGrouping";

            const sides = boost.legs[i];
            for (let j = 0; j < sides; j++) {
                const userInputDiv = document.createElement("div");
                userInputDiv.className = "userInputs";
                userInputDiv.setAttribute("contenteditable", "true");
                if (boost.odds[j]) {
                    userInputDiv.textContent = boost.odds[j].toString();
                }

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

        if (boost.boosted > 0) {
            boostedUserInput.textContent = boost.boosted.toString();
        }

        finalGroupingDiv.appendChild(finalLabelDiv);
        finalGroupingDiv.appendChild(boostedUserInput);

        emptyDiv2.appendChild(finalGroupingDiv);

        mainDiv.appendChild(emptyDiv2);

        target.appendChild(mainDiv);
    }
};

const CreateBoostsFromTextArea = () => {
    const gridBuilderTextArea = document.getElementById("gridBuilderTextArea");
    if (gridBuilderTextArea.value.trim()) {
        const lines = gridBuilderTextArea.value.split('\n');
        console.log("buildTableButton clicked...");
        console.log(lines);

        // date needed for id;
        const dateString = GetDate();
        const numEventContainers = lines.length;

        const boosts = [];
        for (let i = 0; i < numEventContainers; i++) {
            if (lines[i].trim()) {

                const id = dateString + (i + 1).toString();
                const boost = new Boost(id, "", "", lines[i].split(","), [], 0);
                
                consoleLogBoost(boost);

                boosts.push(boost);
            }
        }
        console.log(boosts.length);
        console.log(boosts);

        return boosts;
    }
};

let globalBoosts = [];

const buildTableButton = document.getElementById("buildTableButton");
buildTableButton.addEventListener("click", () => {
    globalBoosts = CreateBoostsFromTextArea();
    CreateHtmlFromBoosts(globalBoosts, document.getElementById("allContainer"));
});

// TODO create odds collection button
// collect odds for each eventContainer
// find the boost object in globalBoosts and populate it with odds

// TODO create function for doing calculations

// TODO create function for displaying calculations

// TODO create function for saving objects to file

// TODO create function for loading objects from file



//#region testing
const helloWorldButton = document.getElementById('helloWorldButton');
helloWorldButton.addEventListener("click", () => {
    console.log("helloworldclicked");
    yello_world = pyscript.interpreter.globals.get("hello_world");
    yello_world();
});

const testTextAreaButton = document.getElementById("testTextAreaButton");
testTextAreaButton.addEventListener("click", () => {
    document.getElementById("gridBuilderTextArea").value = "2, 2, 2\n4\n3, 3,3, 3\n2,3";
});

const consoleLogBoost = (boost) => {
    console.log("id: " + boost.id);
    console.log("book: " + boost.book);
    console.log("description: " + boost.description);
    console.log("legs: " + boost.legs);
    console.log("odds: " + boost.odds);
    console.log("boosted: " + boost.boosted);
}

//#endregion