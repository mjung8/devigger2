//#region classes
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

class DeviggedBoost {
    betId;
    originalOdds = [[]];
    originalBoosted;
    decimalOdds = [[]];
    decimalBoosted;
    multiplicative = [[]];
    multiAmerican = [[]];
    multiFV;
    additive = [[]];
    addiAmerican = [[]];
    addiFV;
    power = [[]];
    powerAmerican = [[]];
    powerFV;
    shin = [[]];
    shinAmerican = [[]];
    shinFV;
    juice = [[]];
    testString;
    constructor(betId, originalOdds, originalBoosted) {
        this.betId = betId;
        this.originalOdds = originalOdds;
        this.originalBoosted = originalBoosted;

        let tempString = [];
        originalOdds.forEach(odds => tempString.push(odds.join("/")));
        this.testString = tempString.join(",");
    }
}
//#endregion

//#region functions
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

const DecimalToAmerican = (decimal) => {
    if (decimal <= 2) {
        return (-100 / (decimal - 1)).toFixed(2);
    } else {
        return (100 * (decimal - 1)).toFixed(2);
    }
}

const AmericanToDecimal = (americanOdds) => {
    if (americanOdds > 0) {
        return (americanOdds / 100) + 1;
    } else {
        return 100 / (-americanOdds) + 1;
    }
}

const FindBoostById = (id) => {
    return globalBoosts.find(boost => boost.id === id);
}

const CreateHtmlFromBoosts = (boosts, target) => {
    for (let i = 0; i < boosts.length; i++) {
        const boost = boosts[i];

        const mainDiv = document.createElement("div");
        mainDiv.className = "eventContainer";
        mainDiv.id = boost.id;

        const emptyDiv1 = document.createElement("div");

        const bookDiv = document.createElement("div");
        bookDiv.className = "userInput fst-italic";
        bookDiv.setAttribute("contenteditable", "true");
        if (boost.book) {
            bookDiv.textContent = boost.book;
        } else {
            bookDiv.setAttribute("data-text", "Book");
        }

        const boostDescDiv = document.createElement("div");
        boostDescDiv.className = "userInput fst-italic";
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
                userInputDiv.className = "userInput";
                userInputDiv.setAttribute("contenteditable", "true");
                if (boost.odds[i]) {
                    if (boost.odds[i][j]) {
                        userInputDiv.textContent = boost.odds[i][j].toString();
                    }
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
        boostedUserInput.className = "userInput";
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

const CollectUserInputsAndUpdateObjects = () => {
    const eventContainers = document.getElementsByClassName("eventContainer");
    for (let i = 0; i < eventContainers.length; i++) {
        const eventContainer = eventContainers[i];
        let boost = FindBoostById(eventContainer.id);

        if (boost) {
            console.log("Found eventContainer id: " + boost.id);

            boost.book = eventContainer.childNodes[0].childNodes[0].innerText;
            boost.description = eventContainer.childNodes[0].childNodes[1].innerText;

            // populate odds
            const legGroupings = eventContainer.querySelectorAll(".legGrouping");
            console.log(legGroupings)
            let allOdds = [];

            for (let j = 0; j < legGroupings.length; j++) {
                const legGrouping = legGroupings[j];
                const sides = legGrouping.querySelectorAll(".userInput");
                console.log(sides);

                let odds = [];
                for (let k = 0; k < sides.length; k++) {
                    odds.push(parseInt(sides[k].innerText));
                    console.log(sides[k]);
                }
                allOdds.push(odds);
            }
            console.log(allOdds);
            console.log(allOdds.length);

            boost.odds = allOdds;

            // populate boosted (final) odds
            const finalOddsValue = parseInt(eventContainer.querySelector("div.finalGrouping>div.userInput").innerText);
            console.log(finalOddsValue);
            boost.boosted = finalOddsValue;
        }
        else {
            alert("Event doesn't exist for some reason...");
        }
    }
};

// TODO create function for doing calculations
const CalculateDeviggedOdds = () => {
    const temp = globalBoosts[0];
    console.log(temp.odds);
    
    const deviggedBoost = new DeviggedBoost(temp.id, temp.odds, temp.boosted);

    const v_american_to_decimal = pyscript.interpreter.globals.get("v_american_to_decimal");
    const americanToDecimalResultsPy = v_american_to_decimal(temp.odds);
    console.log(americanToDecimalResultsPy.toJs());
    deviggedBoost.decimalOdds = americanToDecimalResultsPy.toJs();
    americanToDecimalResultsPy.destroy();

    const calculate_juice = pyscript.interpreter.globals.get("calculate_juice");
    const juiceResultPy = calculate_juice(deviggedBoost.decimalOdds);
    deviggedBoost.juice = juiceResultPy.toJs();
    juiceResultPy.destroy();

    const boostedConverstionResultPy = v_american_to_decimal([[deviggedBoost.originalBoosted]]);
    const boostedConverstionResultJs = boostedConverstionResultPy.toJs();
    deviggedBoost.decimalBoosted = boostedConverstionResultJs;
    boostedConverstionResultPy.destroy();

    // multiplicative
    const calculate_multiplicative_probability = pyscript.interpreter.globals.get("calculate_multiplicative_probability");
    const multiplicativeResultPy = calculate_multiplicative_probability(deviggedBoost.decimalOdds);
    deviggedBoost.multiplicative = multiplicativeResultPy.toJs();
    multiplicativeResultPy.destroy();

    const v_percent_to_american = pyscript.interpreter.globals.get("v_percent_to_american");
    const multToAmericanPy = v_percent_to_american(deviggedBoost.multiplicative);
    deviggedBoost.multiAmerican = multToAmericanPy.toJs();
    multToAmericanPy.destroy();

    const calculate_product = pyscript.interpreter.globals.get("calculate_product");
    const multProductPy = calculate_product(deviggedBoost.multiplicative);
    deviggedBoost.multiFV = multProductPy;
    console.log(DecimalToAmerican(deviggedBoost.multiFV));

    // additive
    const calculate_additive_probability = pyscript.interpreter.globals.get("calculate_additive_probability");
    const additiveResultPy = calculate_additive_probability(deviggedBoost.decimalOdds);
    deviggedBoost.additive = additiveResultPy.toJs();
    additiveResultPy.destroy();

    const addiToAmericanPy = v_percent_to_american(deviggedBoost.additive);
    deviggedBoost.addiAmerican = addiToAmericanPy.toJs();
    addiToAmericanPy.destroy();

    const addiProductPy = calculate_product(deviggedBoost.additive);
    deviggedBoost.addiFV = addiProductPy;
    console.log(DecimalToAmerican(deviggedBoost.addiFV));

    // power
    // for (let i = 0; i < deviggedBoost.decimalOdds.length)
        // const calculate_power_probability = pyscript.interpreter.globals.get("calculate_power_probability");
        // const powerResultPy = calculate_power_probability(deviggedBoost.decimalOdds[i]);
        // deviggedBoost.power[i] = powerResultPy.toJs();
        // powerResultPy.destroy();

    // const powerToAmericanPy = v_percent_to_american(deviggedBoost.power);
    // deviggedBoost.powerAmerican = powerToAmericanPy.toJs();
    // powerToAmericanPy.destroy();

    // const powerProductPy = calculate_product(deviggedBoost.power);
    // deviggedBoost.powerFV = powerProductPy;
    // console.log(DecimalToAmerican(deviggedBoost.powerFV));
    
    globalDeviggedBoosts.push(deviggedBoost);
    console.log(globalDeviggedBoosts);
};

//#endregion

//#region app entry
let globalBoosts = [];
let globalDeviggedBoosts = [];

const buildTableButton = document.getElementById("buildTableButton");
buildTableButton.addEventListener("click", () => {
    document.getElementById("allContainer").innerHTML = "";
    globalBoosts = CreateBoostsFromTextArea();
    CreateHtmlFromBoosts(globalBoosts, document.getElementById("allContainer"));
});

// collect odds and other data for each eventContainer
const calculateButton = document.getElementById("calculateButton");
calculateButton.addEventListener("click", () => {
    CollectUserInputsAndUpdateObjects();
    CalculateDeviggedOdds();
});



// TODO create function for displaying calculations

// TODO create function for saving objects to file

// TODO create function for loading objects from file
//#endregion


//#region testing
const pythonHelloWorld = () => {
    yello_world = pyscript.interpreter.globals.get("hello_world");
    yello_world();
};

const pythonDataTransferTest = (args) => {
    data_test = pyscript.interpreter.globals.get("data_test");
    data_test(args);
}

const helloWorldButton = document.getElementById('helloWorldButton');
helloWorldButton.addEventListener("click", () => {
    console.log("helloWorldButton clicked...");
    pythonHelloWorld();
});

const testTextAreaButton = document.getElementById("testTextAreaButton");
testTextAreaButton.addEventListener("click", () => {
    console.log("testTextAreaButton clicked...");
    document.getElementById("gridBuilderTextArea").value = "2, 2, 2\n4\n3, 3,3, 3\n2,3";
});

// TODO do tests by creating globalBoosts objects...
const testOddsButton = document.getElementById("testOddsButton");
testOddsButton.addEventListener("click", () => {
    console.log("testOddsButton clicked...");
    globalBoosts = [];
    const testBoosts = [
        {
            "id": "061220231",
            "book": "B99",
            "description": "Barca, Getafe, Girona all to win!",
            "legs": [
                "3",
                "3",
                "3"
            ],
            "odds": [
                [
                    -408,
                    530,
                    1229
                ],
                [
                    149,
                    195,
                    256
                ],
                [
                    100,
                    260,
                    307
                ]
            ],
            "boosted": 650
        },
        {
            "id": "061220232",
            "book": "NSB",
            "description": "Berrios/Valdez 6+ Ks vs TSB",
            "legs": [
                "4"
            ],
            "odds": [
                [
                    423,
                    336,
                    225,
                    173
                ]
            ],
            "boosted": 530
        },
        {
            "id": "061220233",
            "book": "B99",
            "description": "HOU, NYM, TOR all to win!",
            "legs": [
                "2",
                "2",
                "2"
            ],
            "odds": [
                [
                    109,
                    -117
                ],
                [
                    117,
                    -127
                ],
                [
                    -195,
                    178
                ]
            ],
            "boosted": 685
        },
        {
            "id": "061220234",
            "book": "B99",
            "description": "Murray 4+ 3s vs FD/TSB/BR",
            "legs": [
                "2"
            ],
            "odds": [
                [
                    141,
                    -191
                ]
            ],
            "boosted": 185
        }
    ];
    testBoosts.forEach(testBoost => globalBoosts.push(Object.assign(new Boost, testBoost)));
    document.getElementById("allContainer").innerHTML = "";
    CreateHtmlFromBoosts(globalBoosts, document.getElementById("allContainer"));
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