import { Cfg } from '../src/models/cfg';
import { join } from 'path';
import { expect } from 'chai';

describe('Cfg', function () {
    describe('Only 1s', function() {
        let cfg: Cfg = new Cfg();
        let filepath = join(__dirname, '../examples/cfg/1n.cfg');
        cfg.readFromFile(filepath);
        
        it('should have 0 and 1 as terminals', function() {
            expect(cfg.terminals).to.have.length(2);
            expect(cfg.terminals).to.have.members(['0', '1']);
        })
        it('should have two terminals, S and A', function() {
            expect(cfg.variables).to.have.length(2);
            expect(cfg.variables).to.have.members(['S', 'A']);
        });
        it('should have a starting variable of S', function() {
            expect(cfg.startVariable).to.equal('S');
        });
        it('should have three transitions', function() {
            let count = 0;
            for (let variable in cfg.rules) {
                for (let rightHandSide of cfg.rules[variable]) {
                    count++;
                }
            }
            expect(count).to.equal(3);
        });
        it('should accept the empty string', function() {
            expect(cfg.acceptsString('')).to.be.true;
        });
        it('should accept strings of the form "1n"', function() {
            let inputString: string = '';
            for (let i = 0; i < 5; i++) {
                inputString += '1';
                expect(cfg.acceptsString(inputString)).to.be.true;
            }
        });
        it('should not accept the string "01111"', function () {
            expect(cfg.acceptsString('01111')).to.be.false;
        });
        it('should not accept the string "cheese"', function() {
            expect(cfg.acceptsString('cheese')).to.be.false;
        });
    });
    describe('anbman', function() {
        let cfg: Cfg = new Cfg();
        let filepath = join(__dirname, '../examples/cfg/abba.cfg');
        cfg.readFromFile(filepath);
        it('should have two terminals, a and b', function() {
            expect(cfg.terminals).to.have.length(2);
            expect(cfg.terminals).to.have.members(['a','b']);
        });
        it('should have three variables', function() {
            expect(cfg.variables).to.have.length(3);
            expect(cfg.variables).to.have.members(['S', 'X', 'Y']);
        });
        it('should have a starting variable of S', function() {
            expect(cfg.startVariable).to.equal('S');
        });
        it('should have five rules', function() {
            let count = 0;
            for (let variable in cfg.rules) {
                for (let rightSide in cfg.rules[variable]) {
                    count++;
                }
            }  
            expect(count).to.equal(5);  
        });
        it('should contain a rule Y->bb', function () {
            expect(cfg.rules).to.have.key('Y');
            expect(cfg.rules['Y']).to.have.length(2);
        });
        it('should accept the string "aa"', function() {
            expect(cfg.acceptsString('aa')).to.be.true;
        });
        it('should accept the empty string', function() {
            expect(cfg.acceptsString('')).to.be.true;
        });
        it('should accept the string "abba"', function() {
            expect(cfg.acceptsString('abba')).to.be.true; 
        });
        it('should accept the string "bb"', function() {
            expect(cfg.acceptsString('bb')).to.be.true;
        });
        it('should accept the string "aaaaabbbbaaaaa"', function() {
            expect(cfg.acceptsString('aaaaabbbbaaaaa')).to.be.true;
        });
        it('should not accept the string "baab"', function() {
            expect(cfg.acceptsString('baab')).to.be.false;
        });
        it('should not accept the string "aabbaaa"', function() {
            expect(cfg.acceptsString('aabbaaa')).to.be.false;
        });
        it('should not accept the string "aabaa"', function() {
            expect(cfg.acceptsString('aabaa')).to.be.false;
        });
        it('should not acccept the string "aabbbaa"', function() {
            expect(cfg.acceptsString('aabbbaa')).to.be.false;
        });
    });
});