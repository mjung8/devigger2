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
    console.time("CollectUserInputsAndUpdateObjects");

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
    console.timeEnd("CollectUserInputsAndUpdateObjects");

};

// TODO create function for doing calculations
const CalculateDeviggedOdds = () => {
    console.time("CalculateDeviggedOdds");

    // get all python functions

    // loop globalBoosts to get deviggedOdds
    globalDeviggedBoosts = [];

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
    const calculate_power_probability = pyscript.interpreter.globals.get("calculate_power_probability");
    for (let i = 0; i < deviggedBoost.decimalOdds.length; i++) {
        const powerResultPy = calculate_power_probability(deviggedBoost.decimalOdds[i]);
        deviggedBoost.power[i] = powerResultPy.toJs();
        powerResultPy.destroy();
    }

    const powerToAmericanPy = v_percent_to_american(deviggedBoost.power);
    deviggedBoost.powerAmerican = powerToAmericanPy.toJs();
    powerToAmericanPy.destroy();

    const powerProductPy = calculate_product(deviggedBoost.power);
    deviggedBoost.powerFV = powerProductPy;
    console.log(DecimalToAmerican(deviggedBoost.powerFV));

    // shin
    const calculate_shin_probability = pyscript.interpreter.globals.get("calculate_shin_probability");
    for (let i = 0; i < deviggedBoost.decimalOdds.length; i++) {
        const shinResultPy = calculate_shin_probability(deviggedBoost.decimalOdds[i]);
        deviggedBoost.shin[i] = shinResultPy.toJs();
        shinResultPy.destroy();
    }

    const shinToAmericanPy = v_percent_to_american(deviggedBoost.shin);
    deviggedBoost.shinAmerican = shinToAmericanPy.toJs();
    shinToAmericanPy.destroy();

    const shinProductPy = calculate_product(deviggedBoost.shin);
    deviggedBoost.shinFV = shinProductPy;
    console.log(DecimalToAmerican(deviggedBoost.shinFV));

    globalDeviggedBoosts.push(deviggedBoost);
    console.log(globalDeviggedBoosts);

    console.timeEnd("CalculateDeviggedOdds");

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
    console.time("testOddsButton");

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
    
    console.timeEnd("testOddsButton");
});

const testCalculationsButton = document.getElementById("testCalculationsButton");
testCalculationsButton.addEventListener("click", () => {
    console.log("testCalculationsButton clicked...");
    console.time("testCalculationsButton");

    globalDeviggedBoosts = [];
    const temp = [
        {
            "betId": "061220231",
            "originalOdds": [
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
            "originalBoosted": 650,
            "decimalOdds": [
                {
                    "0": 1.2450980392156863,
                    "1": 6.3,
                    "2": 13.29
                },
                {
                    "0": 2.49,
                    "1": 2.95,
                    "2": 3.56
                },
                {
                    "0": 2,
                    "1": 3.6,
                    "2": 4.07
                }
            ],
            "decimalBoosted": [
                {
                    "0": 7.5
                }
            ],
            "multiplicative": [
                {
                    "0": 0.7744005214323721,
                    "1": 0.15304834457191294,
                    "2": 0.07255113399571494
                },
                {
                    "0": 0.393158105563438,
                    "1": 0.3318520958823596,
                    "2": 0.27498979855420247
                },
                {
                    "0": 0.48853027473993066,
                    "1": 0.2714057081888504,
                    "2": 0.240064017071219
                }
            ],
            "multiAmerican": [
                {
                    "0": -343.2634358683724,
                    "1": 553.3883151739216,
                    "2": 1278.3382077240344
                },
                {
                    "0": 154.35059988573605,
                    "1": 201.33906412165513,
                    "2": 263.6498536518957
                },
                {
                    "0": 104.69560469560469,
                    "1": 268.4520884520884,
                    "2": 316.55555555555554
                }
            ],
            "multiFV": 6.723194058805563,
            "additive": [
                {
                    "0": 0.7907748363659208,
                    "1": 0.1463553887968669,
                    "2": 0.06286977483721232
                },
                {
                    "0": 0.3944436413845568,
                    "1": 0.3318202665292032,
                    "2": 0.27373609208624
                },
                {
                    "0": 0.4921739921739922,
                    "1": 0.26995176995177,
                    "2": 0.23787423787423786
                }
            ],
            "addiAmerican": [
                {
                    "0": -377.95398155306657,
                    "1": 583.2683157214963,
                    "2": 1490.58944077545
                },
                {
                    "0": 153.52164291198838,
                    "1": 201.36796961194378,
                    "2": 265.3153635600789
                },
                {
                    "0": 103.18017934732362,
                    "1": 270.4365413787291,
                    "2": 320.3902065799541
                }
            ],
            "addiFV": 6.513936775227642,
            "power": [
                {
                    "0": 0.7928812134815131,
                    "1": 0.14247517944539972,
                    "2": 0.06464360707362952
                },
                {
                    "0": 0.39436956894027564,
                    "1": 0.3317517637610316,
                    "2": 0.2738786672977336
                },
                {
                    "0": 0.4921922082816954,
                    "1": 0.2698149075903434,
                    "2": 0.23799288412740044
                }
            ],
            "powerAmerican": [
                {
                    "0": -382.8147252160258,
                    "1": 601.8766383678966,
                    "2": 1446.943379661647
                },
                {
                    "0": 153.569260601708,
                    "1": 201.43019849031546,
                    "2": 265.1251884152407
                },
                {
                    "0": 103.17265961830748,
                    "1": 270.6244435975671,
                    "2": 320.18063004971526
                }
            ],
            "powerFV": 6.497611520858406,
            "shin": [
                {
                    "0": 0.7866035761728085,
                    "1": 0.14791855259839481,
                    "2": 0.06547787122977276
                },
                {
                    "0": 0.39411744166243246,
                    "1": 0.3318274147179312,
                    "2": 0.2740551436199598
                },
                {
                    "0": 0.49125081791379815,
                    "1": 0.27031815899278094,
                    "2": 0.23843102309355182
                }
            ],
            "shinAmerican": [
                {
                    "0": -368.6114144114244,
                    "1": 576.0477184461388,
                    "2": 1427.2335236599756
                },
                {
                    "0": 153.73147551701484,
                    "1": 201.36147757714556,
                    "2": 264.89006803197566
                },
                {
                    "0": 103.56200204341933,
                    "1": 269.9344519532281,
                    "2": 319.4085094403322
                }
            ],
            "shinFV": 6.566215651977585,
            "juice": {
                "0": 1.0371243097998755,
                "1": 1.0214883529547631,
                "2": 1.0234780234780234
            },
            "testString": "-408/530/1229,149/195/256,100/260/307"
        }
    ];
    CalculateDeviggedOdds();
    //  TODO compare
    assert(globalDeviggedBoosts[0].betId === temp[0].betId, "betId match");
    assert(globalDeviggedBoosts[0].addiFV === temp[0].addiFV, "addiFV match");
    assert(globalDeviggedBoosts[0].multiFV === temp[0].multiFV, "multiFV match");
    assert(globalDeviggedBoosts[0].powerFV === temp[0].powerFV, "powerFV match");
    assert(globalDeviggedBoosts[0].shinFV === temp[0].shinFV, "shinFV match");

    console.timeEnd("testCalculationsButton");
});

const consoleLogBoost = (boost) => {
    console.log("id: " + boost.id);
    console.log("book: " + boost.book);
    console.log("description: " + boost.description);
    console.log("legs: " + boost.legs);
    console.log("odds: " + boost.odds);
    console.log("boosted: " + boost.boosted);
}

const assert = (condition, message) => {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    } else {
        console.log(message || "Assertion success");
    }
}


//#endregion