import {readFileSync, writeFileSync} from 'fs';

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
     */
    toCNF(): Cfg {
        let cnf: Cfg = new Cfg();
        return cnf;
    }

    /**
     * Uses the CYK algorithm to determine if the string 
     * is part of the language defined by the CFG.
     * @param inputString The string to be tested
     */
    acceptsString(inputString: string): boolean { 
        return true;
    }
}

export { Cfg};