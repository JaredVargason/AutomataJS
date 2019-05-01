import { readFileSync, writeFileSync, stat } from 'fs';

export class Nfa {

    static emptyStringChar = '#';

    alphabet: string[];
    numStates: number;
    startState: number;
    acceptingStates: number[];
    transitions: {[key: number]: {[key:string]: number[]}}

    constructor() {
        
    }

    acceptsString(inputString: string): boolean {
        let execution : NfaExecution = new NfaExecution(this, inputString);
        return execution.run(); 
    }

    serialize(): string {
        let contents: string = ''; 
        contents += this.alphabet.join(',') + '\n';
        contents += this.numStates.toString() + '\n';
        contents += this.startState.toString() + '\n';
        contents += this.acceptingStates.toString() + '\n';
        for (let state in this.transitions) {
            for (let letter of state) {
                contents += state + ',' + letter + ',' + this.transitions[state][letter] + '\n'
            }
        }
        return contents;
    }

    deserialize(contents: string) {
        let lines : string[] = contents.split('\n');
        this.alphabet = lines[0].split(',');
        this.numStates = parseInt(lines[1]);
        this.startState = parseInt(lines[2]);
        this.acceptingStates = lines[3].split(',').map(function (i) {
            return parseInt(i);
        });
        this.transitions = {};
        for (let state = 0; state < this.numStates; state++) {
            this.transitions[state] = {};
            for (let letter of this.alphabet) {
                this.transitions[state][letter] = [];
            }
            this.transitions[state][Nfa.emptyStringChar] = [];
        }
        for(let i = 4; i < lines.length; i++) {
            if (lines[i] != '') {
                this.createRule(lines[i]);
            }
        }
    }

    private createRule(line: string) {
        let split = line.split(',');
        let fromState: number = parseInt(split[0]);
        let letter = split[1];
        let toState : number = parseInt(split[2]);
        this.transitions[fromState][letter].push(toState);
    }

    readFromFile(filepath: string) {
        let contents : string = readFileSync(filepath, "utf8");
        this.deserialize(contents);
    }

    writeToFile(filepath: string) {
        let contents: string = this.serialize();
        writeFileSync(filepath, contents);
    }
}

export class NfaExecution {
    nfa: Nfa;
    currentState: number;
    inputString: string;

    constructor(nfa: Nfa, inputString: string) {
        this.nfa = nfa;
        this.currentState = nfa.startState;
        this.inputString = inputString;
    }

    run(): boolean {
        return this.simulate(this.inputString, this.currentState);
    }

    private simulate(inputString: string, currentState: number): boolean {
        for (let i = 0; i < this.nfa.transitions[currentState][Nfa.emptyStringChar].length; i++) {
            if (this.simulate(inputString, this.nfa.transitions[currentState][Nfa.emptyStringChar][i])) {
                return true;
            }
        }

        if (inputString == '') {
            return this.nfa.acceptingStates.includes(currentState);
        }

        let currentChar: string = inputString[0];
        inputString = inputString.substring(1, inputString.length);
        for (let i = 0; i < this.nfa.transitions[currentState][currentChar].length; i++) {
            if (this.simulate(inputString, this.nfa.transitions[currentState][currentChar][i])) {
                return true;
            }
        }

        return false;
    }
}
