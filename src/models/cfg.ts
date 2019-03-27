import {readFileSync, writeFileSync} from 'fs';
import { start } from 'repl';

class Cfg {
    terminals: string[];
    variables: string[];
    startVariable: string;
    rules: {[key:string]:string[][]};

    deserialize(contents: string) {
        let lines = contents.split('\n');
        this.terminals = lines[0].split(',');
        this.variables = lines[1].split(',');
        this.startVariable = lines[2];
        this.rules = {};

        let ruleRegex : RegExp = /([A-Z]*)->(?:([A-Za-z0-9]*),)*/; 
        let regex = ruleRegex.compile();
        for (let i = 3; i < lines.length; i++) {
            let matches : RegExpMatchArray = lines[i].match(regex);
            let leftSide = matches[0];
            let rightSide = matches.slice(1, matches.length);
            if (leftSide in this.rules) {
                this.rules[leftSide].push(rightSide);
            }
            else {
                this.rules[leftSide] = [rightSide];
            }
        }
    }

    serialize(): string {
        let lines: string[] = [];
        lines.push(this.terminals.join(','));
        lines.push(this.variables.join(','));
        lines.push(this.startVariable);
        for (let startVariable in this.rules) {
            for (let rightSide in this.rules[startVariable]) {
                let ruleString = startVariable + '->' + this.rules[startVariable][rightSide].join(',');
                lines.push(ruleString);
            }
        }
        return lines.join('\n');
    }

    readFromFile(filepath: string) {
        let contents: string = readFileSync(filepath, "utf8");
        this.deserialize(contents); 
    }

    writeToFile(filepath: string) {
        let contents: string = this.serialize();
        writeFileSync(filepath, contents);
    }

    /**
     * Returns a new grammar in Chomsky normal form. 
     * A grammar G is in CNF if its production rules are of the form:
     * A -> BC,
     * A -> a,
     * S -> empty string (allowed if the empty string is a member of the language)
     * 
     * see https://en.wikipedia.org/wiki/Chomsky_normal_form
     */
    toCNF(): Cfg {
        let cnf: Cfg = this.clone();
        cnf.START(); 
        cnf.TERM();
        cnf.BIN();
        cnf.DEL();
        cnf.UNIT();
        return cnf;
    }

    /**
     * Create new start variable and transition from new start rule to old start rule
     * This creates a new unit rule.
     */
    private START() {
        let startCount : number = 0;
        while (this.variables.includes('S' + startCount.toString())) {
            startCount++;
        }
        let oldStartVariable = this.startVariable;
        this.startVariable = 'S' + startCount.toString();
        this.rules[this.startVariable] = [[oldStartVariable]];
    }

    /**
     * Eliminate rules with nonsolitary terminals
     */
    private TERM() {

    }

    /**
     * Eliminate right-hand sides with more than two nonterminals.
     * Replace each rule A -> XYZ with
     * A -> XB
     * B -> YZ
     */
    private BIN() {
    }

    /**
     * Eliminate empty string rules.
     * If A -> empty string
     */
    private DEL() {

    }

    private UNIT() {
        for (let variable in this.rules) {
            for (let rightSide in this.rules[variable]) {
                if (rightSide.length == 1 && this.variables.includes(rightSide[0])) {
                    let replacedVar: string = rightSide[0];
                    //for (let )
                }
            }
        }
    }

    /**
     * Uses the CYK algorithm to determine if the string 
     * is part of the language defined by the CFG.
     * @param inputString The string to be tested
     */
    acceptsString(inputString: string): boolean { 
        return true;
    }

    clone(): Cfg {
        let cfg: Cfg = new Cfg();
        cfg.terminals = this.terminals.slice();
        cfg.variables = this.variables.slice();
        cfg.startVariable = this.startVariable;
        cfg.rules = {};

        for (let rule in this.rules) {
            cfg.rules[rule] = [];
            for (let rightSide of this.rules[rule]) {
                cfg.rules[rule].push(rightSide.slice());
            }
        }
        return cfg;
    }
}

export { Cfg };