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

const PercentToAmerican = (percent) => {
    let decimal = 1 / percent;
    return DecimalToAmerican(decimal);
}

const Capitlize = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1)
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

        // create button
        let button = document.createElement("button");
        button.className = "calculateButton";
        button.innerText = "Calculate";
        button.addEventListener("click", () => { AllCalculations(); });
        emptyDiv2.appendChild(button);

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

            boost.book = eventContainer.childNodes[0].childNodes[0].innerText;
            boost.description = eventContainer.childNodes[0].childNodes[1].innerText;

            // populate odds
            const legGroupings = eventContainer.querySelectorAll(".legGrouping");
            let allOdds = [];

            for (let j = 0; j < legGroupings.length; j++) {
                const legGrouping = legGroupings[j];
                const sides = legGrouping.querySelectorAll(".userInput");

                let odds = [];
                for (let k = 0; k < sides.length; k++) {
                    odds.push(parseInt(sides[k].innerText));
                }
                allOdds.push(odds);
            }

            boost.odds = allOdds;

            // populate boosted (final) odds
            const finalOddsValue = parseInt(eventContainer.querySelector("div.finalGrouping>div.userInput").innerText);
            boost.boosted = finalOddsValue;
        }
        else {
            alert("Event doesn't exist for some reason...");
        }
    }
    console.timeEnd("CollectUserInputsAndUpdateObjects");
};


const CalculateDeviggedOdds = () => {
    console.time("CalculateDeviggedOdds");

    // get all python functions
    const v_american_to_decimal = pyscript.interpreter.globals.get("v_american_to_decimal");
    const calculate_juice = pyscript.interpreter.globals.get("calculate_juice");
    const calculate_multiplicative_probability = pyscript.interpreter.globals.get("calculate_multiplicative_probability");
    const v_percent_to_american = pyscript.interpreter.globals.get("v_percent_to_american");
    const calculate_product = pyscript.interpreter.globals.get("calculate_product");
    const calculate_additive_probability = pyscript.interpreter.globals.get("calculate_additive_probability");
    const calculate_power_probability = pyscript.interpreter.globals.get("calculate_power_probability");
    const calculate_shin_probability = pyscript.interpreter.globals.get("calculate_shin_probability");

    // loop globalBoosts to create and push to deviggedOdds
    globalDeviggedBoosts = [];

    for (let i = 0; i < globalBoosts.length; i++) {
        const boost = globalBoosts[i];

        const deviggedBoost = new DeviggedBoost(boost.id, boost.odds, boost.boosted);

        const americanToDecimalResultsPy = v_american_to_decimal(boost.odds);
        deviggedBoost.decimalOdds = americanToDecimalResultsPy.toJs();
        americanToDecimalResultsPy.destroy();

        const juiceResultPy = calculate_juice(deviggedBoost.decimalOdds);
        deviggedBoost.juice = juiceResultPy.toJs();
        juiceResultPy.destroy();

        const boostedConverstionResultPy = v_american_to_decimal([[deviggedBoost.originalBoosted]]);
        const boostedConverstionResultJs = boostedConverstionResultPy.toJs();
        deviggedBoost.decimalBoosted = boostedConverstionResultJs;
        boostedConverstionResultPy.destroy();

        // multiplicative
        const multiplicativeResultPy = calculate_multiplicative_probability(deviggedBoost.decimalOdds);
        deviggedBoost.multiplicative = multiplicativeResultPy.toJs();
        multiplicativeResultPy.destroy();

        const multToAmericanPy = v_percent_to_american(deviggedBoost.multiplicative);
        deviggedBoost.multiAmerican = multToAmericanPy.toJs();
        multToAmericanPy.destroy();

        const multProductPy = calculate_product(deviggedBoost.multiplicative);
        deviggedBoost.multiFV = 1 / multProductPy;

        // additive
        const additiveResultPy = calculate_additive_probability(deviggedBoost.decimalOdds);
        deviggedBoost.additive = additiveResultPy.toJs();
        additiveResultPy.destroy();

        const addiToAmericanPy = v_percent_to_american(deviggedBoost.additive);
        deviggedBoost.addiAmerican = addiToAmericanPy.toJs();
        addiToAmericanPy.destroy();

        const addiProductPy = calculate_product(deviggedBoost.additive);
        deviggedBoost.addiFV = 1 / addiProductPy;

        // power
        for (let i = 0; i < deviggedBoost.decimalOdds.length; i++) {
            const powerResultPy = calculate_power_probability(deviggedBoost.decimalOdds[i]);
            deviggedBoost.power[i] = powerResultPy.toJs();
            powerResultPy.destroy();
        }

        const powerToAmericanPy = v_percent_to_american(deviggedBoost.power);
        deviggedBoost.powerAmerican = powerToAmericanPy.toJs();
        powerToAmericanPy.destroy();

        const powerProductPy = calculate_product(deviggedBoost.power);
        deviggedBoost.powerFV = 1 / powerProductPy;

        // shin
        for (let i = 0; i < deviggedBoost.decimalOdds.length; i++) {
            const shinResultPy = calculate_shin_probability(deviggedBoost.decimalOdds[i]);
            deviggedBoost.shin[i] = shinResultPy.toJs();
            shinResultPy.destroy();
        }

        const shinToAmericanPy = v_percent_to_american(deviggedBoost.shin);
        deviggedBoost.shinAmerican = shinToAmericanPy.toJs();
        shinToAmericanPy.destroy();

        const shinProductPy = calculate_product(deviggedBoost.shin);
        deviggedBoost.shinFV = 1 / shinProductPy;

        globalDeviggedBoosts.push(deviggedBoost);
    }

    console.log(globalDeviggedBoosts);

    console.timeEnd("CalculateDeviggedOdds");
};


const CalculateAndDisplayEV = () => {
    console.time("CalculateAndDisplayEV");

    // TODO create function for displaying calculations
    for (let i = 0; i < globalDeviggedBoosts.length; i++) {
        const deviggedBoost = globalDeviggedBoosts[i];

        const target = document.getElementById(deviggedBoost.betId);
        let targetPs = target.querySelectorAll("p");
        targetPs.forEach(p => p.remove());
        // for each deviggedBoost, target its id element, for each type of devig, create a <p>, change its html
        // using info from each deviggedBoost, append to target
        // methods...multiplicative multiAmerican multiFV
        //           additive addiAmerican addiFV
        //           power powerAmerican powerFV
        //           shin shinAmerican shinFV

        DevigMethodCalcAndDisplay(deviggedBoost, "multiplicative", "multi");
        DevigMethodCalcAndDisplay(deviggedBoost, "additive", "addi");
        DevigMethodCalcAndDisplay(deviggedBoost, "power", "power");
        DevigMethodCalcAndDisplay(deviggedBoost, "shin", "shin");
    }

    console.timeEnd("CalculateAndDisplayEV");
}


const EVAndKellyCalcAndDisplay = (deviggedBoost, EV) => {
    const fullKelly = (EV / (deviggedBoost.decimalBoosted - 1)) * 100;
    const halfKelly = fullKelly / 2;
    const quarterKelly = fullKelly / 4;
    const targetKellyDollars = fullKelly / 100 * document.getElementById("kelly").value * document.getElementById("bankroll").value;

    let symbol = "❌";
    if (targetKellyDollars > 0) symbol = "✅";

    return `Summary; EV% = ${(EV * 100).toFixed(1)} %, Kelly Wager = $${targetKellyDollars.toFixed(2)} (Full=${fullKelly.toFixed(2)}u, 1/2=${halfKelly.toFixed(2)}, 1/4=${quarterKelly.toFixed(2)}u) ${symbol}`;
}


const DevigMethodCalcAndDisplay = (deviggedBoost, methodName, methodNameShort) => {
    console.time(`${methodName}CalcAndDisplay`);

    const pElement = Calculate(deviggedBoost, methodName, methodNameShort);

    const target = document.getElementById(deviggedBoost.betId);
    target.append(pElement);

    console.timeEnd(`${methodName}CalcAndDisplay`);
}


const Calculate = (deviggedBoost, methodName, methodNameShort) => {
    let pElement = document.createElement("p");
    let pHtml = [];
    pHtml.push(`<strong>${Capitlize(methodName)}:</strong><br/>`);
    const legCount = deviggedBoost.originalOdds.length;
    let juiceSum = 0;
    for (let j = 0; j < legCount; j++) {
        const juice = ((deviggedBoost.juice[j] - 1) * 100);
        juiceSum += parseFloat(juice);
        const american = deviggedBoost[`${methodNameShort}American`][j][0];
        let sign = "";
        if (american > 0) sign = "+"
        pHtml.push(`Leg#${j + 1} (${deviggedBoost.originalOdds[j][0]}); Market Juice = ${juice.toFixed(1)} %; Fair Value = ${sign}${Math.round(american)} (${(deviggedBoost[methodName][j][0] * 100).toFixed(1)} %)<br/>`);
    }
    let sign = "";
    const originalBoosted = deviggedBoost.originalBoosted;
    if (originalBoosted > 0) sign = "+";
    const methodFV = deviggedBoost[`${methodNameShort}FV`];
    const methodFVAmerican = Math.round(PercentToAmerican(methodFV));
    let sign2 = "";
    if (methodFVAmerican > 0) sign2 = "+";
    pHtml.push(`Final Odds (${sign}${deviggedBoost.originalBoosted}); Σ(Market Juice) = ${juiceSum.toFixed(2)} %; Fair Value = ${sign2}${methodFVAmerican} (${(methodFV * 100).toFixed(1)} %)<br/>`);

    //EV = (globalDeviggedBoosts[i].decimalBoosted - 1) * methodFV - (1 - methodFV)
    const EV = (deviggedBoost.decimalBoosted - 1) * methodFV - (1 - methodFV);

    pHtml.push(EVAndKellyCalcAndDisplay(deviggedBoost, EV));

    pElement.innerHTML = pHtml.join("");

    return pElement;
}


const ShowTestStrings = () => {
    for (let i = 0; i < globalDeviggedBoosts.length; i++) {
        const boost = globalDeviggedBoosts[i];
        const target = document.getElementById(boost.betId);
        const target2 = target.children[0];
        let targetPs = target2.querySelectorAll("span");
        targetPs.forEach(p => p.remove());
        let span = document.createElement("span");
        span.className = "text-body-tertiary";
        span.innerText = boost.testString;
        target2.append(span);
    }
}

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

const AllCalculations = () => {
    CollectUserInputsAndUpdateObjects();
    CalculateDeviggedOdds();
    CalculateAndDisplayEV();
    ShowTestStrings();
}

const fileLoaderInput = document.getElementById("fileLoaderInput");
fileLoaderInput.addEventListener("change", () => {
    const [file] = fileLoaderInput.files;
    const reader = new FileReader();

    reader.addEventListener(
        "load",
        () => {
            document.getElementById("allContainer").innerHTML = "";
            globalBoosts = JSON.parse(reader.result);
            CreateHtmlFromBoosts(globalBoosts, document.getElementById("allContainer"));
        },
        false
    );

    if (file) {
        reader.readAsText(file);
    }
});

const fileSaverButton = document.getElementById("saveFileButton");
fileSaverButton.addEventListener("click", () => {
    if (globalBoosts.length <= 0) {
        alert("No data to save!")
    } else {

        let filename = document.getElementById("fileNameInput").value;
        if (!filename) filename = "boosts.json";

        let blob = new Blob([JSON.stringify(globalBoosts, undefined, 4)], { type: 'text/json' });
        let a = document.createElement('a');

        a.download = filename;
        if (!filename.endsWith(".json")) a.download = filename + ".json";
        a.href = window.URL.createObjectURL(blob)
        a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')

        document.body.append(a);
        a.click();

        document.body.removeChild(a);
        window.URL.revokeObjectURL(a.href);
    }
});

//#endregion


//#region testing
const TESTING = false;
if (TESTING) {
    // TODO change these to create
    const targetButtonHolder = document.getElementById("buttonHolderDiv");

    const testTextAreaButton = document.createElement("button");
    testTextAreaButton.innerText = "Test TextArea Input";
    targetButtonHolder.append(testTextAreaButton);
    testTextAreaButton.addEventListener("click", () => {
        console.log("testTextAreaButton clicked...");
        document.getElementById("gridBuilderTextArea").value = "2, 2, 2\n4\n3, 3,3, 3\n2,3";
    });

    const testOddsButton = document.createElement("button");
    testOddsButton.innerText = "Test Odds Data";
    targetButtonHolder.append(testOddsButton);
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

    const testCalculationsButton = document.createElement("button");
    testCalculationsButton.innerText = "Test Calculations";
    targetButtonHolder.append(testCalculationsButton);
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
                "multiFV": 0.14873882729746152,
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
                "addiFV": 0.153516995099335,
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
                "powerFV": 0.15390270667765144,
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
                "shinFV": 0.15229472393262383,
                "juice": {
                    "0": 1.0371243097998755,
                    "1": 1.0214883529547631,
                    "2": 1.0234780234780234
                },
                "testString": "-408/530/1229,149/195/256,100/260/307"
            },
            {
                "betId": "061220232",
                "originalOdds": [
                    [
                        423,
                        336,
                        225,
                        173
                    ]
                ],
                "originalBoosted": 530,
                "decimalOdds": [
                    {
                        "0": 5.23,
                        "1": 4.359999999999999,
                        "2": 3.25,
                        "3": 2.73
                    }
                ],
                "decimalBoosted": [
                    {
                        "0": 6.3
                    }
                ],
                "multiplicative": [
                    {
                        "0": 0.17468704472809032,
                        "1": 0.2095443220018148,
                        "2": 0.2811117673624346,
                        "3": 0.3346568659076602
                    }
                ],
                "multiAmerican": [
                    {
                        "0": 472.45229693853554,
                        "1": 377.22600662562417,
                        "2": 255.7303948470823,
                        "3": 198.81353167154919
                    }
                ],
                "multiFV": 0.17468704472809032,
                "additive": [
                    {
                        "0": 0.16756582364314745,
                        "1": 0.20571903289815127,
                        "2": 0.2840535424253213,
                        "3": 0.3426616010333799
                    }
                ],
                "addiAmerican": [
                    {
                        "0": 496.7804044156559,
                        "1": 386.0998935840256,
                        "2": 252.04630488384194,
                        "3": 191.8331079363008
                    }
                ],
                "addiFV": 0.16756582364314745,
                "power": [
                    {
                        "0": 0.16986103534357583,
                        "1": 0.20642487793570036,
                        "2": 0.2828097731958212,
                        "3": 0.3409043135232147
                    }
                ],
                "powerAmerican": [
                    {
                        "0": 488.71653406404374,
                        "1": 384.43773347488263,
                        "2": 253.5945694873801,
                        "3": 193.3374440660759
                    }
                ],
                "powerFV": 0.16986103534357583,
                "shin": [
                    {
                        "0": 0.1701139630637048,
                        "1": 0.20705365832986578,
                        "2": 0.2829886255466716,
                        "3": 0.3398437530594678
                    }
                ],
                "shinAmerican": [
                    {
                        "0": 487.84122243129264,
                        "1": 382.9665933295699,
                        "2": 253.37109329684915,
                        "3": 194.25287091418573
                    }
                ],
                "shinFV": 0.1701139630637048,
                "juice": {
                    "0": 1.0945550610679455
                },
                "testString": "423/336/225/173"
            },
            {
                "betId": "061220233",
                "originalOdds": [
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
                "originalBoosted": 685,
                "decimalOdds": [
                    {
                        "0": 2.09,
                        "1": 1.8547008547008548
                    },
                    {
                        "0": 2.17,
                        "1": 1.7874015748031495
                    },
                    {
                        "0": 1.5128205128205128,
                        "1": 2.7800000000000002
                    }
                ],
                "decimalBoosted": [
                    {
                        "0": 7.85
                    }
                ],
                "multiplicative": [
                    {
                        "0": 0.47017528654692003,
                        "1": 0.5298247134530799
                    },
                    {
                        "0": 0.45166039913249373,
                        "1": 0.5483396008675064
                    },
                    {
                        "0": 0.6475928801815792,
                        "1": 0.3524071198184207
                    }
                ],
                "multiAmerican": [
                    {
                        "0": 112.68663594470047,
                        "1": -112.68663594470044
                    },
                    {
                        "0": 121.40528634361232,
                        "1": -121.40528634361239
                    },
                    {
                        "0": -183.76271186440678,
                        "1": 183.76271186440678
                    }
                ],
                "multiFV": 0.13752253752991916,
                "additive": [
                    {
                        "0": 0.4696491963045444,
                        "1": 0.5303508036954556
                    },
                    {
                        "0": 0.4506790637243956,
                        "1": 0.5493209362756045
                    },
                    {
                        "0": 0.6506523594683575,
                        "1": 0.34934764053164247
                    }
                ],
                "addiAmerican": [
                    {
                        "0": 112.92488262910796,
                        "1": -112.92488262910797
                    },
                    {
                        "0": 121.88738738738736,
                        "1": -121.8873873873874
                    },
                    {
                        "0": -186.2478184991274,
                        "1": 186.24781849912742
                    }
                ],
                "addiFV": 0.1377177681417594,
                "power": [
                    {
                        "0": 0.46940326157094464,
                        "1": 0.5305967384290452
                    },
                    {
                        "0": 0.45021603270460664,
                        "1": 0.5497839672951951
                    },
                    {
                        "0": 0.6521232519718494,
                        "1": 0.34787674802860663
                    }
                ],
                "powerAmerican": [
                    {
                        "0": 113.0364404911281,
                        "1": -113.03644049112351
                    },
                    {
                        "0": 122.11559059606275,
                        "1": -122.1155905959649
                    },
                    {
                        "0": -187.4581315561449,
                        "1": 187.4581315557681
                    }
                ],
                "powerFV": 0.13781508114778107,
                "shin": [
                    {
                        "0": 0.4696491963043588,
                        "1": 0.530350803695291
                    },
                    {
                        "0": 0.45067906372410765,
                        "1": 0.5493209362753674
                    },
                    {
                        "0": 0.6506523594683127,
                        "1": 0.3493476405315602
                    }
                ],
                "shinAmerican": [
                    {
                        "0": 112.92488262919211,
                        "1": -112.92488262903333
                    },
                    {
                        "0": 121.88738738752912,
                        "1": -121.88738738727066
                    },
                    {
                        "0": -186.24781849909064,
                        "1": 186.24781849919484
                    }
                ],
                "shinFV": 0.1377177681416075,
                "juice": {
                    "0": 1.0176394064339735,
                    "1": 1.020300858726324,
                    "2": 1.0207291793683697
                },
                "testString": "109/-117,117/-127,-195/178"
            },
            {
                "betId": "061220234",
                "originalOdds": [
                    [
                        141,
                        -191
                    ]
                ],
                "originalBoosted": 185,
                "decimalOdds": [
                    {
                        "0": 2.41,
                        "1": 1.5235602094240837
                    }
                ],
                "decimalBoosted": [
                    {
                        "0": 2.85
                    }
                ],
                "multiplicative": [
                    {
                        "0": 0.3873234749970052,
                        "1": 0.6126765250029947
                    }
                ],
                "multiAmerican": [
                    {
                        "0": 158.18213058419244,
                        "1": -158.1821305841924
                    }
                ],
                "multiFV": 0.38732347499700526,
                "additive": [
                    {
                        "0": 0.3792901855099742,
                        "1": 0.6207098144900258
                    }
                ],
                "addiAmerican": [
                    {
                        "0": 163.65037593984962,
                        "1": -163.65037593984965
                    }
                ],
                "addiFV": 0.3792901855099742,
                "power": [
                    {
                        "0": 0.3748222463251534,
                        "1": 0.6251777536755183
                    }
                ],
                "powerAmerican": [
                    {
                        "0": 166.7931292243826,
                        "1": -166.79312922486065
                    }
                ],
                "powerFV": 0.3748222463251534,
                "shin": [
                    {
                        "0": 0.37929018551018595,
                        "1": 0.62070981449016
                    }
                ],
                "shinAmerican": [
                    {
                        "0": 163.65037593970243,
                        "1": -163.65037593994296
                    }
                ],
                "shinFV": 0.37929018551018595,
                "juice": {
                    "0": 1.0712951476522508
                },
                "testString": "141/-191"
            }
        ];
        CalculateDeviggedOdds();

        assert(globalDeviggedBoosts[0].betId === temp[0].betId, "betId match");
        assert(globalDeviggedBoosts[0].addiFV === temp[0].addiFV, "addiFV match");
        assert(globalDeviggedBoosts[0].multiFV === temp[0].multiFV, "multiFV match");
        assert(globalDeviggedBoosts[0].powerFV === temp[0].powerFV, "powerFV match");
        assert(globalDeviggedBoosts[0].shinFV === temp[0].shinFV, "shinFV match");

        let testPElement = document.createElement("p");
        testPElement.innerHTML = "<strong>Multiplicative:</strong><br>Leg#1 (-408); Market Juice = 3.7 %; Fair Value = -343 (77.4 %)<br>Leg#2 (149); Market Juice = 2.1 %; Fair Value = +154 (39.3 %)<br>Leg#3 (100); Market Juice = 2.3 %; Fair Value = +105 (48.9 %)<br>Final Odds (+650); Σ(Market Juice) = 8.21 %; Fair Value = +572 (14.9 %)<br>Summary; EV% = 11.6 %, Kelly Wager = $4.44 (Full=1.78u, 1/2=0.89, 1/4=0.44u) ✅";
        let pElement = Calculate(globalDeviggedBoosts[0], "multiplicative", "multi");
        assert(testPElement.innerHTML === pElement.innerHTML, "multi pElement match");
        testPElement.innerHTML = "<strong>Additive:</strong><br>Leg#1 (-408); Market Juice = 3.7 %; Fair Value = -378 (79.1 %)<br>Leg#2 (149); Market Juice = 2.1 %; Fair Value = +154 (39.4 %)<br>Leg#3 (100); Market Juice = 2.3 %; Fair Value = +103 (49.2 %)<br>Final Odds (+650); Σ(Market Juice) = 8.21 %; Fair Value = +551 (15.4 %)<br>Summary; EV% = 15.1 %, Kelly Wager = $5.82 (Full=2.33u, 1/2=1.16, 1/4=0.58u) ✅";
        pElement = Calculate(globalDeviggedBoosts[0], "additive", "addi");
        assert(testPElement.innerHTML === pElement.innerHTML, "addi pElement match");
        testPElement.innerHTML = "<strong>Power:</strong><br>Leg#1 (-408); Market Juice = 3.7 %; Fair Value = -383 (79.3 %)<br>Leg#2 (149); Market Juice = 2.1 %; Fair Value = +154 (39.4 %)<br>Leg#3 (100); Market Juice = 2.3 %; Fair Value = +103 (49.2 %)<br>Final Odds (+650); Σ(Market Juice) = 8.21 %; Fair Value = +550 (15.4 %)<br>Summary; EV% = 15.4 %, Kelly Wager = $5.93 (Full=2.37u, 1/2=1.19, 1/4=0.59u) ✅";
        pElement = Calculate(globalDeviggedBoosts[0], "power", "power");
        assert(testPElement.innerHTML === pElement.innerHTML, "power pElement match");
        testPElement.innerHTML = "<strong>Shin:</strong><br>Leg#1 (-408); Market Juice = 3.7 %; Fair Value = -369 (78.7 %)<br>Leg#2 (149); Market Juice = 2.1 %; Fair Value = +154 (39.4 %)<br>Leg#3 (100); Market Juice = 2.3 %; Fair Value = +104 (49.1 %)<br>Final Odds (+650); Σ(Market Juice) = 8.21 %; Fair Value = +557 (15.2 %)<br>Summary; EV% = 14.2 %, Kelly Wager = $5.47 (Full=2.19u, 1/2=1.09, 1/4=0.55u) ✅";
        pElement = Calculate(globalDeviggedBoosts[0], "shin", "shin");
        assert(testPElement.innerHTML === pElement.innerHTML, "shin pElement match");

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

}
//#endregion