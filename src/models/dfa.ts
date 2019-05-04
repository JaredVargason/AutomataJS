import {readFileSync, writeFileSync} from 'fs';
import { start } from 'repl';

export class Dfa {
    alphabet: string[];
    numStates: number;
    startState: number;
    acceptingStates: number[];
    transitions: {[key : number]: {[key: string]: number}};

    constructor({
        alphabet = [],
        numStates = 0,
        startState = 0,
        acceptingStates = [],
        transitions = {}
    }: {alphabet?: string[], numStates?: number, startState?: number, acceptingStates?: number[], transitions?: {[key : number]: {[key: string]: number}}} = {}) {
        this.alphabet = alphabet; 
        this.numStates = numStates;
        this.startState = startState;
        this.acceptingStates = acceptingStates;
        this.transitions = transitions;
    }

    acceptsString(inputString: string): boolean {
        let execution: DfaExecution = this.getExecution(inputString);
        execution.finish();
        return this.acceptingStates.includes(execution.currentState);
    }

    getExecution(inputString: string) : DfaExecution {
        return new DfaExecution(this, inputString);
    }

    deserialize(contents: string) {
        let lines: string[] = contents.split('\n');
        this.alphabet = lines[0].split(',');
        this.numStates = parseInt(lines[1]);
        this.startState = parseInt(lines[2]);
        
        this.acceptingStates = lines[3].split(',').map(function(i) {
            return parseInt(i);
        });

        this.transitions = {};
        for (let state = 0; state < this.numStates; state++) {
            this.transitions[state] = {};
            for (let char of this.alphabet) {
                this.transitions[state][char] = -1;
            }
        }

        let numTransitions: number = this.alphabet.length * this.numStates;
        for (let i = 4; i < 4 + numTransitions; i++) {
            let line: string[] = lines[i].split(',');
            this.transitions[parseInt(line[0])][line[1]] = parseInt(line[2]);
        }
    }

    serialize(): string {
        let contents: string[] = [];;
        contents.push(this.alphabet.join(','));
        contents.push(this.numStates.toString());
        contents.push(this.startState.toString());
        contents.push(this.acceptingStates.join(','));
        for (let state = 0; state <= this.numStates; state++) {
            for(let letter of this.alphabet) {
                contents.push(state.toString() + ',' + letter + ',' + 
                this.transitions[state][letter]);
            }
        }
        return contents.join('\n');
    }

    readFromFile(filepath: string) {
        let contents: string = readFileSync(filepath, "utf8");
        this.deserialize(contents); 
    }

    writeToFile(filepath: string) {
        let contents: string = this.serialize();
        writeFileSync(filepath, contents);
    }

    static createExampleDfa(): Dfa {
        //Ends with "00" DFA
        let alphabet = ['0', '1'];
        let numStates = 3;
        let startState = 0;
        let acceptingStates = [2];
        let transitions = {
            0: {
                '0': 1,
                '1': 0
            },
            1: {
                '0': 2,
                '1': 0
            },
            2: {
                '0': 2,
                '1': 0
            }
        };
        return new Dfa({
            alphabet,
            numStates,
            startState,
            acceptingStates,
            transitions
        }); 
    }
}

export class DfaConnection {
    
}

export class DfaExecution {
    dfa : Dfa;
    currentState : number; 
    inputString : string;
    currentCharIndex : number;
    path: number[]; 

    constructor(dfa: Dfa, inputString: string) {
        this.dfa = dfa;
        this.inputString = inputString;
        this.reset();
    }

    currentChar(): string {
        return this.inputString[this.currentCharIndex];
    }

    reset() {
        this.path = [this.dfa.startState];
        this.currentState = this.dfa.startState;
        this.currentCharIndex = 0;
    }

    finish() {
        while (this.currentCharIndex < this.inputString.length) {
            this.stepForward();
        }
    }

    stepForward() {
        if (this.currentCharIndex >= this.inputString.length) {
            return;
        }

        let currentChar : string = this.currentChar();
        let nextState : number = this.dfa.transitions[this.currentState][currentChar];
        this.path.push(nextState);
        this.currentState = nextState;
        this.currentCharIndex++;
    }

    stepBackward() {
        if (this.currentCharIndex <= 0) {
            return;
        }

        this.currentState = this.path.pop();
        this.currentCharIndex--;
    }
}