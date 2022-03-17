const morseCode = {
    a: ".-", 
    b: "-...", 
    c: "-.-.", 
    d: "-..", 
    e: ".", 
    f: "..-.", 
    g: "--.", 
    h: "....", 
    i: "..", 
    j: ".---", 
    k: "-.-", 
    l: ".-..", 
    m: "--", 
    n: "-.", 
    o: "---", 
    p: ".--.", 
    q: "--.-", 
    r: ".-.", 
    s: "...", 
    t: "-", 
    u: "..-", 
    v: "...-", 
    w: ".--", 
    x: "-..-", 
    y: "-.--", 
    z: "--..", 
    zero: { code: "-----", value: 0 },
    one: { code: ".----", value: 1 },
    two: { code: "..---", value: 2 },
    three: { code: "...--", value: 3 },
    four: { code: "....-", value: 4 },
    five: { code: ".....", value: 5 },
    six: { code: "-....", value: 6 },
    seven: { code: "--...", value: 7 },
    eight: { code: "---..", value: 8 },
    nine: { code: "----.", value: 9 }
};



































console.log(morseCode.two.key)

function stringToMorseCode(string) {
    for (let i = 0; i >= string.length; i++) {

    }
}


const code = {
    a: ".-",    b: "-...",  c: "-.-.",  d: "-..",   e: ".",     f: "..-.",
    g: "--.",   h: "....",  i: "..",    j: ".---",  k: "-.-",   l: ".-..",
    m: "--",    n: "-.",    o: "---",   p: ".--.",  q: "--.-",  r: ".-.",
    s: "...",   t: "-",     u: "..-",   v: "...-",  w: ".--",   x: "-..-",
    y: "-.--",  z: "--..",  0: "-----", 1: ".----", 2: "..---", 3: "...--",
    4: "....-", 5: ".....", 6: "-....", 7: "--...", 8: "---..", 9: "----."
};

const getMorseCodeFromString = async (userInput) => {

    let morseOutput = "";

    for (const userInputChar of Array.from(userInput.toLowerCase())) {
        for (const key of Object.keys(code)) {
            if (userInputChar == key) {
                morseOutput += code[key] + " ";
                // morseOutput += `${code[key]} `;
            }
        }
    }

    return morseOutput;
};



async function getStringFromMorseCode (userInput) {

    let strOutput = "";

    for (const userInputChar of userInput.split(" ")) {
        strOutput += Object.keys(code).find(key => code[key] === userInputChar);
    }

    return strOutput;
};




console.log("String to Morse", await getMorseCodeFromString("test"));
console.log("Morse to String", await getStringFromMorseCode("- . ... -"));


/* Old */

/*
const code = {
    a: ".-",    b: "-...",  c: "-.-.",  d: "-..",   e: ".",     f: "..-.",
    g: "--.",   h: "....",  i: "..",    j: ".---",  k: "-.-",   l: ".-..",
    m: "--",    n: "-.",    o: "---",   p: ".--.",  q: "--.-",  r: ".-.",
    s: "...",   t: "-",     u: "..-",   v: "...-",  w: ".--",   x: "-..-",
    y: "-.--",  z: "--..",  0: "-----", 1: ".----", 2: "..---", 3: "...--",
    4: "....-", 5: ".....", 6: "-....", 7: "--...", 8: "---..", 9: "----."
};

const getMorseCodeFromString = async (userInput) => {

    let morseOutput = "";

    for (const userInputChar of Array.from(userInput.toLowerCase())) {
        for (const key of Object.keys(code)) {
            if (userInputChar == key) {
                morseOutput += code[key] + " ";
                // morseOutput += `${code[key]} `;
            }
        }
    }

    return morseOutput;
};



const getStringFromMorseCode = async (userInput) => {

    let strOutput = "";

    for (const userInputChar of userInput.split(" ")) {
        strOutput += Object.keys(code).find(key => code[key] === userInputChar) + " ";
        // strOutput += `${codeKeys.find(key => code[key] === userInputChar)} `;
    }

    return strOutput.replace(/\s/g, "");
};




console.log("String to Morse", await getMorseCodeFromString(";"));
console.log("Morse to String", await getStringFromMorseCode("- . ... -"));
*/