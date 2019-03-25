import { Dfa } from '../src/models/dfa';

import  { join } from 'path';
import { expect } from 'chai';

describe('Dfa', function() {
    describe('Ends with "d"', function() {
        let dfa : Dfa = new Dfa();
        let testFilePath = join(__dirname, '../examples/dfa/endsWithD.dfa');

        dfa.readFromFile(testFilePath);

        it('should have an alphabet length of 4', function() {
            expect(dfa.alphabet).to.have.length(4);
            expect(dfa.alphabet).to.have.members(['a','b','c','d']);
        });
        it('should have two states', function() {
            expect(dfa.numStates).to.equal(2);
        });
        it('should have a starting state of 0', function() {
            expect(dfa.startState).to.equal(0);
        });
        it('should have one accepting state of value 1', function() {
            expect(dfa.acceptingStates).to.have.length(1);
            expect(dfa.acceptingStates).to.contain(1);
        });
        it('should have eight transitions', function() {
            for (let i = 0; i < dfa.numStates; i++) {
                expect(dfa.transitions.store[i]).to.have.keys(['a','b','c','d']);
            }
        });
        it('should accept the string "bad"', function() {
            expect(dfa.acceptsString('bad')).to.be.true;
        });
        it('should accept the string "dddd"', function() {
            expect(dfa.acceptsString('dddd')).to.be.true;
        });
        it('should not accept the empty string', function() {
            expect(dfa.acceptsString('')).to.be.false;
        });
        it('should not accept the string "dab"', function() {
            expect(dfa.acceptsString('dab')).to.be.false;
        });
        it('should not accept the string "abba"', function() {
            expect(dfa.acceptsString('abba')).to.be.false;
        });
    });
    describe('Starts with "11"', function() {
        let dfa: Dfa = new Dfa();
        let testFilePath = join(__dirname, '../examples/dfa/startsWith11.dfa');
        dfa.readFromFile(testFilePath);
        it('should have an alphabet length of 2', function() {
            expect(dfa.alphabet).to.have.length(2);
        });
        it('should have four states', function() {
            expect(dfa.numStates).to.equal(4);
        })
        it('should have a starting state of 0', function() {
            expect(dfa.startState).to.equal(0);
        });
        it('should have one accepting state of value 2', function() {
            expect(dfa.acceptingStates).to.have.length(1);
            expect(dfa.acceptingStates).to.contain(2);
        });
        it('states should have a transition for each letter', function() {
            for (let i = 0; i < dfa.numStates; i++) {
                expect(dfa.transitions.store[i]).to.have.keys(['0', '1']);
            }
        });
        it('should accept the string "110"', function() {
            expect(dfa.acceptsString('110')).to.be.true;
        });
        it('should accept the string "11"', function() {
            expect(dfa.acceptsString('11')).to.be.true;
        });
        it('should not accept the empty string', function() {
            expect(dfa.acceptsString('')).to.be.false;
        });
        it('should not accept the string "0011', function() {
            expect(dfa.acceptsString('0011')).to.be.false;
        });
        it('should not accept the string "10011"', function() {
            expect(dfa.acceptsString('10011')).to.be.false;
        });
    });
});