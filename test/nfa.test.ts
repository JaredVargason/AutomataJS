import { expect } from 'chai';
import { Nfa } from '../src/models/nfa';
import { join } from 'path';

describe('Nfa', function() {
    describe('Ends with "d"', function() {
        let nfa : Nfa = new Nfa();
        let filepath = join(__dirname, '../examples/nfa/endsWithD.nfa');
        nfa.readFromFile(filepath);

        it('should have an alphabet consisting of "a", "b", "c", and "d"', function() {
            expect(nfa.alphabet).to.have.length(4);
            expect(nfa.alphabet).to.include.members(['a', 'b', 'c', 'd']);
        });
        it('should have two states', function () {
            expect(nfa.numStates).to.equal(2);
        });
        it('should have a starting state of 0', function () {
            expect(nfa.startState).to.equal(0);
        });
        it('should have one accepting state of value 1', function() {
            expect(nfa.acceptingStates).to.have.length(1);
            expect(nfa.acceptingStates).to.contain(1);
        });
        it('should have 5 transitions', function() {
            let count: number = 0;
            for (let state in nfa.transitions) {
                for (let letter in nfa.transitions[state]) {
                    count += nfa.transitions[state][letter].length;
                }
            }
            expect(count).to.equal(5);
        });
        it('should accept the string "bad"', function () {
            expect(nfa.acceptsString('bad')).to.be.true;
        })
        it('should accept the string "d"', function () {
            expect(nfa.acceptsString('d')).to.be.true;
        });
        it('should accept the string "dd"', function() {
            expect(nfa.acceptsString('dd')).to.be.true;
        });
        it('should accept the string "dad"', function() {
            expect(nfa.acceptsString('dad')).to.be.true;
        })
        it('should not accept the empty string', function () {
            expect(nfa.acceptsString('')).to.be.false;
        });
        it('should not accept the string "dab"', function () {
            expect(nfa.acceptsString('dab')).to.be.false;
        });
        it('should not accept the string "acdc"', function () {
            expect(nfa.acceptsString('acdc')).to.be.false;
        });
    });
    describe('Starts with "11"', function() {
        let nfa: Nfa = new Nfa();
        let filepath : string = join(__dirname, '../examples/nfa/startsWith11.nfa');
        nfa.readFromFile(filepath);
        it('should have a binary alphabet', function() {
            expect(nfa.alphabet).to.have.members(['0','1']);
            expect(nfa.alphabet).to.have.length(2);
        });
        it('should have three states', function() {
            expect(nfa.numStates).to.equal(3);
        });
        it('should have a starting state of 0', function () {
            expect(nfa.startState).to.equal(0);
        });
        it('should have one accepting state of value 2', function () {
            expect(nfa.acceptingStates).to.have.length(1);
            expect(nfa.acceptingStates).to.contain(2);
        });
        it('should have four transitions', function () {
            let count: number = 0;
            for (let state in nfa.transitions) {
                for (let letter in nfa.transitions[state]) {
                    count += nfa.transitions[state][letter].length;
                }
            }
            expect(count).to.equal(4);
        });
        it('should accept the string "11"', function() {
            expect(nfa.acceptsString('11')).to.be.true;
        });
        it('should accept the string "1111"', function() {
            expect(nfa.acceptsString('1111')).to.be.true;
        })
        it('should accept the string "11001100"', function() {
            expect(nfa.acceptsString('11001100')).to.be.true;
        });
        it('should not accept the empty string', function() {
            expect(nfa.acceptsString('')).to.be.false;
        });
        it('should not accept the string "010101"', function() {
            expect(nfa.acceptsString('010101')).to.be.false;
        });
        it('should not accept the string "10011', function () {
            expect(nfa.acceptsString('10011')).to.be.false;
        });
        it('should not accept the string "00110011"', function () {
            expect(nfa.acceptsString('00110011')).to.be.false;
        });
    });
});
