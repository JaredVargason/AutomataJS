import {readFileSync, writeFileSync} from 'fs';
import { start } from 'repl';

class Cfg {
    terminals: string[];
    variables: string[];
    startVariable: string;
    //rules: {[key:string]:string[][]};
    rules: CfgRule[];

    deserialize(contents: string) {
        let lines = contents.split('\n');
        this.terminals = lines[0].split(',');
        this.variables = lines[1].split(',');
        this.startVariable = lines[2];
        this.rules = [];

        let ruleRegex : RegExp = /([A-Z]*)->(?:([A-Za-z0-9]*),)*/; 
        for (let i = 3; i < lines.length; i++) {
            let matches : RegExpMatchArray = lines[i].match(ruleRegex);
            if (matches.length < 2) {
                continue;
            }
            let rule: CfgRule = {
                variable: matches[0],
                product: matches.slice(1, matchMedia.length)
            }
            this.rules.push(rule);
        }
    }

    serialize(): string {
        let lines: string[] = [];
        lines.push(this.terminals.join(','));
        lines.push(this.variables.join(','));
        lines.push(this.startVariable);
        for (let rule of this.rules) {
            let ruleString = rule.variable + '->' + rule.product.join(',');
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
        let oldStartVariable = this.startVariable;
        this.startVariable = this.suggestVariableName();
        this.rules.push(new CfgRule(this.startVariable, [oldStartVariable]));
    }

    /**
     * Eliminate rules with nonsolitary terminals.
     * A -> XaY
     * yields a new rule
     * B -> XaY
     * and changes the old rule to
     * A -> XBY
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
     * If A -> empty string, then A is nullable.
     */
    private DEL() {

    }

    /**
     * Unit rules are of the form A -> B.
     * To remove a unit rule, find all rules of type B -> XYZ
     * and add rules A -> XYZ.
     */
    private UNIT() {
        let oldRules = this.rules;
        let removedRules : CfgRule[] = [];
        for (let rule of this.rules) {
            if (rule.product.length == 1 && this.variables.includes(rule.product[0])) {
                
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
        cfg.rules = [];

        for (let rule of this.rules) {
            let newRule: CfgRule = new CfgRule(
                rule.variable, 
                rule.product.slice()
            );
            cfg.rules.push(newRule);
        }
        return cfg;
    }

    private suggestVariableName(): string {
        let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (let letter of alphabet) {
            if (!alphabet.includes(letter)) {
                return letter;
            }
        }
        return '';
    }
}

class CfgRule {
    variable: string;
    product: string[]

    constructor(variable: string, product: string[]) {
        this.variable = variable;
        this.product = product;
    }

}

export { Cfg };