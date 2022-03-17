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
    zero: { code: "-----", key: 0 },
    one: { code: ".----", key: 1 },
    two: { code: "..---", key: 2 },
    three: { code: "...--", key: 3 },
    four: { code: "....-", key: 4 },
    five: { code: ".....", key: 5 },
    six: { code: "-....", key: 6 },
    seven: { code: "--...", key: 7 },
    eight: { code: "---..", key: 8 },
    nine: { code: "----.", key: 9 }
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