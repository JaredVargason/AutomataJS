import {readFileSync, writeFileSync} from 'fs';

class Dfa {
    alphabet: string[];
    numStates: number;
    startState: number;
    acceptingStates: number[];
    transitions: DfaTransitionMatrix;

    acceptsString(inputString: string): boolean {
        let execution = new DfaExecution(this, inputString);
        execution.finish();
        return this.acceptingStates.includes(execution.currentState);
    }

    readFromFile(filepath: string) {
        let contents: string[] = readFileSync(filepath, "utf8").split('\n');
        this.alphabet = contents[0].split(',');
        this.numStates = parseInt(contents[1]);
        this.startState = parseInt(contents[2]);
        
        this.acceptingStates = contents[3].split(',').map(function(i) {
            return parseInt(i);
        });

        this.transitions = new DfaTransitionMatrix(this.alphabet, this.numStates);
        let numTransitions: number = this.alphabet.length * this.numStates;
        for (let i = 4; i < 4 + numTransitions; i++) {
            let line: string[] = contents[i].split(',');
            this.transitions.setTransition(parseInt(line[0]), line[1], parseInt(line[2]));
        }
    }

    writeToFile(filepath: string) {
        let contents: string = '';
        contents += this.alphabet.join(',') + '\n';
        contents += this.numStates.toString() + '\n'; 
        contents += this.startState.toString() + '\n';
        contents += this.acceptingStates.join(',') + '\n';
        for (let state = 0; state <= this.numStates; state++) {
            for(let letter of this.alphabet) {
                contents += state.toString() + ',' + letter + ',' + 
                this.transitions.store[state][letter] + '\n';
            }
        }
        writeFileSync(filepath, contents);
    }
}

class DfaTransitionMatrix {
    store : {[key : number]: {[key: string]: number}};

    constructor(alphabet: string[], numStates: number) {
        this.store = {};
        for (let state = 0; state < numStates; state++) {
            this.store[state] = {};
            for (let char of alphabet) {
                this.store[state][char] = -1;
            }
        }
    }

    next(currentState: number, letter: string): number {
        return this.store[currentState][letter];
    }

    setTransition(currentState: number, letter: string, nextState: number) {
        this.store[currentState][letter] = nextState;
    }
}

class DfaExecution {
    dfa : Dfa;
    currentState : number; 
    inputString : string;
    currentCharIndex : number;

    constructor(dfa: Dfa, inputString: string) {
        this.dfa = dfa;
        this.currentState = dfa.startState;
        this.inputString = inputString;
        this.currentCharIndex = 0;
    }

    finish() {
        while (this.currentCharIndex < this.inputString.length) {
            this.step();
        }
    }

    step() {
        if (this.currentCharIndex >= this.inputString.length) {
            return;
        }
        let currentChar : string = this.inputString[this.currentCharIndex++];
        let nextState : number = this.dfa.transitions.next(this.currentState, currentChar);
        this.currentState = nextState;
    }
}

export {Dfa, DfaExecution};