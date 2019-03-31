require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dfa_1 = require("../models/dfa");
var dfa = new dfa_1.Dfa();
function createState() {
    var svg = document.getElementById('grid');
    var stateSvg = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    stateSvg.setAttribute('r', '40');
    stateSvg.setAttribute('cx', '50');
    stateSvg.setAttribute('cy', '50');
    stateSvg.style.stroke = 'black';
    stateSvg.style.strokeWidth = '3';
    stateSvg.style.fill = 'white';
}
function loadDfa() {
    var input = document.getElementById('dfaFile');
    if (input.files.length == 1) {
        var reader_1 = new FileReader();
        reader_1.onload = function (e) {
            dfa.deserialize(reader_1.result);
            updateUI();
        };
        reader_1.readAsText(input.files[0]);
    }
}
function updateUI() {
    updateAlphabet();
    updateNumStates();
    updateStartState();
    updateAcceptStates();
    updateTransitions();
}
function updateAlphabet() {
    var alphabetInput = document.getElementById('alphabetInput');
    alphabetInput.value = dfa.alphabet.join(',');
}
function updateNumStates() {
    var numStatesInput = document.getElementById('numStatesInput');
    numStatesInput.value = dfa.numStates.toString();
}
function updateStartState() {
    var startStateInput = document.getElementById('startStateInput');
    startStateInput.value = dfa.startState.toString();
}
function updateAcceptStates() {
    var acceptingStatesInput = document.getElementById('acceptingStatesInput');
    acceptingStatesInput.value = dfa.acceptingStates.join(',');
}
function updateTransitions() {
    clearTransitionsList();
    for (var fromState = 0; fromState < dfa.numStates; fromState++) {
        for (var _i = 0, _a = dfa.alphabet; _i < _a.length; _i++) {
            var letter = _a[_i];
            addTransition(fromState, letter, dfa.transitions[fromState][letter]);
        }
    }
}
function clearTransitionsList() {
    var transitionsList = document.getElementById("transitionsList");
    while (transitionsList.firstChild) {
        transitionsList.removeChild(transitionsList.firstChild);
    }
}
function addTransition(fromState, letter, toState) {
    var transitionList = document.getElementById('transitionsList');
    var text = fromState.toString() + ' + ' + letter + ' &rarr;';
    var listElement = document.createElement('li');
    listElement.classList.add('list-group-item');
    var listItemString = '<div class="input-group">\
            <div class="input-group-prepend">\
                <span class="input-group-text">' + text + '</span>\
            </div>\
            <input type="number" class="form-control" placeholder="Q" value="' + toState + '">\
        </div>';
    listElement.innerHTML = listItemString;
    transitionList.appendChild(listElement);
}
function addGridEvents() {
    document.getElementById('grid').addEventListener('click', function () {
        createState();
    });
}
$(document).ready(function () {
    addGridEvents();
    document.getElementById('loadBtn').addEventListener('click', function () {
        loadDfa();
    });
});

},{"../models/dfa":3}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var Dfa = (function () {
    function Dfa() {
    }
    Dfa.prototype.acceptsString = function (inputString) {
        var execution = new DfaExecution(this, inputString);
        execution.finish();
        return this.acceptingStates.includes(execution.currentState);
    };
    Dfa.prototype.deserialize = function (contents) {
        var lines = contents.split('\n');
        this.alphabet = lines[0].split(',');
        this.numStates = parseInt(lines[1]);
        this.startState = parseInt(lines[2]);
        this.acceptingStates = lines[3].split(',').map(function (i) {
            return parseInt(i);
        });
        this.transitions = {};
        for (var state = 0; state < this.numStates; state++) {
            this.transitions[state] = {};
            for (var _i = 0, _a = this.alphabet; _i < _a.length; _i++) {
                var char = _a[_i];
                this.transitions[state][char] = -1;
            }
        }
        var numTransitions = this.alphabet.length * this.numStates;
        for (var i = 4; i < 4 + numTransitions; i++) {
            var line = lines[i].split(',');
            this.transitions[parseInt(line[0])][line[1]] = parseInt(line[2]);
        }
    };
    Dfa.prototype.serialize = function () {
        var contents = [];
        ;
        contents.push(this.alphabet.join(','));
        contents.push(this.numStates.toString());
        contents.push(this.startState.toString());
        contents.push(this.acceptingStates.join(','));
        for (var state = 0; state <= this.numStates; state++) {
            for (var _i = 0, _a = this.alphabet; _i < _a.length; _i++) {
                var letter = _a[_i];
                contents.push(state.toString() + ',' + letter + ',' +
                    this.transitions[state][letter]);
            }
        }
        return contents.join('\n');
    };
    Dfa.prototype.readFromFile = function (filepath) {
        var contents = fs_1.readFileSync(filepath, "utf8");
        this.deserialize(contents);
    };
    Dfa.prototype.writeToFile = function (filepath) {
        var contents = this.serialize();
        fs_1.writeFileSync(filepath, contents);
    };
    return Dfa;
}());
exports.Dfa = Dfa;
var DfaExecution = (function () {
    function DfaExecution(dfa, inputString) {
        this.dfa = dfa;
        this.currentState = dfa.startState;
        this.inputString = inputString;
        this.currentCharIndex = 0;
    }
    DfaExecution.prototype.finish = function () {
        while (this.currentCharIndex < this.inputString.length) {
            this.step();
        }
    };
    DfaExecution.prototype.step = function () {
        if (this.currentCharIndex >= this.inputString.length) {
            return;
        }
        var currentChar = this.inputString[this.currentCharIndex++];
        var nextState = this.dfa.transitions[this.currentState][currentChar];
        this.currentState = nextState;
    };
    return DfaExecution;
}());
exports.DfaExecution = DfaExecution;

},{"fs":1}],1:[function(require,module,exports){

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9mYWN0b3ItYnVuZGxlL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZnJvbnRlbmQvZGZhX2NsaWVudC50cyIsInNyYy9tb2RlbHMvZGZhLnRzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbGliL19lbXB0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEscUNBQW9DO0FBR3BDLElBQUksR0FBRyxHQUFRLElBQUksU0FBRyxFQUFFLENBQUM7QUFFekIsU0FBUyxXQUFXO0lBQ2hCLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDMUMsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyw0QkFBNEIsRUFBQyxRQUFRLENBQUMsQ0FBQztJQUMvRSxRQUFRLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNqQyxRQUFRLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNsQyxRQUFRLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNsQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUM7SUFDaEMsUUFBUSxDQUFDLEtBQUssQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDO0lBQ2pDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztBQUNsQyxDQUFDO0FBRUQsU0FBUyxPQUFPO0lBQ1osSUFBSSxLQUFLLEdBQXNCLFFBQVEsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFxQixDQUFDO0lBQ3RGLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1FBQ3pCLElBQUksUUFBTSxHQUFlLElBQUksVUFBVSxFQUFFLENBQUM7UUFDMUMsUUFBTSxDQUFDLE1BQU0sR0FBRyxVQUFT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Q0FBQztRQUN4QyxrQkFBYSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBQ0wsVUFBQztBQUFELENBOURBLEFBOERDLElBQUE7QUErQk8sa0JBQUc7QUE3Qlg7SUFNSSxzQkFBWSxHQUFRLEVBQUUsV0FBbUI7UUFDckMsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDZixJQUFJLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUM7UUFDbkMsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsSUFBSSxDQUFDLGdCQUFnQixHQUFHLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQsNkJBQU0sR0FBTjtRQUNJLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFO1lBQ3BELElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNmO0lBQ0wsQ0FBQztJQUVELDJCQUFJLEdBQUo7UUFDSSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRTtZQUNsRCxPQUFPO1NBQ1Y7UUFDRCxJQUFJLFdBQVcsR0FBWSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7UUFDckUsSUFBSSxTQUFTLEdBQVksSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzlFLElBQUksQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUFDO0lBQ2xDLENBQUM7SUFDTCxtQkFBQztBQUFELENBM0JBLEFBMkJDLElBQUE7QUFFWSxvQ0FBWTs7O0FDL0Z6QiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgeyBEZmEgfSBmcm9tICcuLi9tb2RlbHMvZGZhJztcbmltcG9ydCB7IHJlYWQgfSBmcm9tICdmcyc7XG5cbmxldCBkZmE6IERmYSA9IG5ldyBEZmEoKTtcblxuZnVuY3Rpb24gY3JlYXRlU3RhdGUoKSB7XG4gICAgdmFyIHN2ZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmlkJyk7XG4gICAgdmFyIHN0YXRlU3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwnY2lyY2xlJyk7XG4gICAgc3RhdGVTdmcuc2V0QXR0cmlidXRlKCdyJywgJzQwJyk7XG4gICAgc3RhdGVTdmcuc2V0QXR0cmlidXRlKCdjeCcsICc1MCcpO1xuICAgIHN0YXRlU3ZnLnNldEF0dHJpYnV0ZSgnY3knLCAnNTAnKTtcbiAgICBzdGF0ZVN2Zy5zdHlsZS5zdHJva2UgPSAnYmxhY2snO1xuICAgIHN0YXRlU3ZnLnN0eWxlLnN0cm9rZVdpZHRoID0gJzMnO1xuICAgIHN0YXRlU3ZnLnN0eWxlLmZpbGwgPSAnd2hpdGUnO1xufVxuXG5mdW5jdGlvbiBsb2FkRGZhKCkge1xuICAgIHZhciBpbnB1dCA6IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGZhRmlsZScpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgaWYgKGlucHV0LmZpbGVzLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgIGxldCByZWFkZXI6IEZpbGVSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZGZhLmRlc2VyaWFsaXplKHJlYWRlci5yZXN1bHQgYXMgc3RyaW5nKTtcbiAgICAgICAgICAgIHVwZGF0ZVVJKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmVhZGVyLnJlYWRBc1RleHQoaW5wdXQuZmlsZXNbMF0pO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlVUkoKSB7XG4gICAgdXBkYXRlQWxwaGFiZXQoKTtcbiAgICB1cGRhdGVOdW1TdGF0ZXMoKTtcbiAgICB1cGRhdGVTdGFydFN0YXRlKCk7XG4gICAgdXBkYXRlQWNjZXB0U3RhdGVzKCk7XG4gICAgdXBkYXRlVHJhbnNpdGlvbnMoKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlQWxwaGFiZXQoKSB7XG4gICAgbGV0IGFscGhhYmV0SW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWxwaGFiZXRJbnB1dCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgYWxwaGFiZXRJbnB1dC52YWx1ZSA9IGRmYS5hbHBoYWJldC5qb2luKCcsJyk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZU51bVN0YXRlcygpIHtcbiAgICBsZXQgbnVtU3RhdGVzSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbnVtU3RhdGVzSW5wdXQnKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgIG51bVN0YXRlc0lucHV0LnZhbHVlID0gZGZhLm51bVN0YXRlcy50b1N0cmluZygpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVTdGFydFN0YXRlKCkge1xuICAgIGxldCBzdGFydFN0YXRlSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhcnRTdGF0ZUlucHV0JykgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICBzdGFydFN0YXRlSW5wdXQudmFsdWUgPSBkZmEuc3RhcnRTdGF0ZS50b1N0cmluZygpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVBY2NlcHRTdGF0ZXMoKSB7XG4gICAgbGV0IGFjY2VwdGluZ1N0YXRlc0lucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FjY2VwdGluZ1N0YXRlc0lucHV0JykgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICBhY2NlcHRpbmdTdGF0ZXNJbnB1dC52YWx1ZSA9IGRmYS5hY2NlcHRpbmdTdGF0ZXMuam9pbignLCcpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVUcmFuc2l0aW9ucygpIHtcbiAgICBjbGVhclRyYW5zaXRpb25zTGlzdCgpO1xuICAgIGZvciAobGV0IGZyb21TdGF0ZSA9IDA7IGZyb21TdGF0ZSA8IGRmYS5udW1TdGF0ZXM7IGZyb21TdGF0ZSsrKSB7XG4gICAgICAgIGZvciAobGV0IGxldHRlciBvZiBkZmEuYWxwaGFiZXQpIHtcbiAgICAgICAgICAgIGFkZFRyYW5zaXRpb24oZnJvbVN0YXRlLCBsZXR0ZXIsIGRmYS50cmFuc2l0aW9uc1tmcm9tU3RhdGVdW2xldHRlcl0pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjbGVhclRyYW5zaXRpb25zTGlzdCgpIHtcbiAgICBsZXQgdHJhbnNpdGlvbnNMaXN0IDogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRyYW5zaXRpb25zTGlzdFwiKTtcbiAgICB3aGlsZSAodHJhbnNpdGlvbnNMaXN0LmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgdHJhbnNpdGlvbnNMaXN0LnJlbW92ZUNoaWxkKHRyYW5zaXRpb25zTGlzdC5maXJzdENoaWxkKTtcbiAgICB9IFxufVxuXG5mdW5jdGlvbiBhZGRUcmFuc2l0aW9uKGZyb21TdGF0ZTogbnVtYmVyLCBsZXR0ZXI6IHN0cmluZywgdG9TdGF0ZTogbnVtYmVyKSB7XG4gICAgbGV0IHRyYW5zaXRpb25MaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RyYW5zaXRpb25zTGlzdCcpO1xuICAgIGxldCB0ZXh0ID0gZnJvbVN0YXRlLnRvU3RyaW5nKCkgKyAnICsgJyArIGxldHRlciArICcgJnJhcnI7J1xuICAgIGxldCBsaXN0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgbGlzdEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbGlzdC1ncm91cC1pdGVtJyk7XG5cbiAgICBsZXQgbGlzdEl0ZW1TdHJpbmcgPSBcbiAgICAnPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwXCI+XFxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cC1wcmVwZW5kXCI+XFxcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImlucHV0LWdyb3VwLXRleHRcIj4nICsgdGV4dCArICc8L3NwYW4+XFxcbiAgICAgICAgICAgIDwvZGl2PlxcXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cIm51bWJlclwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgcGxhY2Vob2xkZXI9XCJRXCIgdmFsdWU9XCInICsgdG9TdGF0ZSArICdcIj5cXFxuICAgICAgICA8L2Rpdj4nO1xuICAgIGxpc3RFbGVtZW50LmlubmVySFRNTCA9IGxpc3RJdGVtU3RyaW5nO1xuICAgIHRyYW5zaXRpb25MaXN0LmFwcGVuZENoaWxkKGxpc3RFbGVtZW50KTtcbn1cblxuZnVuY3Rpb24gYWRkR3JpZEV2ZW50cygpIHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JpZCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNyZWF0ZVN0YXRlKCk7XG4gICAgfSk7XG59XG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgIGFkZEdyaWRFdmVudHMoKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hZEJ0bicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxvYWREZmEoKTtcbiAgICB9KTtcbn0pOyIsImltcG9ydCB7cmVhZEZpbGVTeW5jLCB3cml0ZUZpbGVTeW5jfSBmcm9tICdmcyc7XG5cbmNsYXNzIERmYSB7XG4gICAgYWxwaGFiZXQ6IHN0cmluZ1tdO1xuICAgIG51bVN0YXRlczogbnVtYmVyO1xuICAgIHN0YXJ0U3RhdGU6IG51bWJlcjtcbiAgICBhY2NlcHRpbmdTdGF0ZXM6IG51bWJlcltdO1xuICAgIHRyYW5zaXRpb25zOiB7W2tleSA6IG51bWJlcl06IHtba2V5OiBzdHJpbmddOiBudW1iZXJ9fTtcblxuICAgIGFjY2VwdHNTdHJpbmcoaW5wdXRTdHJpbmc6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICBsZXQgZXhlY3V0aW9uID0gbmV3IERmYUV4ZWN1dGlvbih0aGlzLCBpbnB1dFN0cmluZyk7XG4gICAgICAgIGV4ZWN1dGlvbi5maW5pc2goKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWNjZXB0aW5nU3RhdGVzLmluY2x1ZGVzKGV4ZWN1dGlvbi5jdXJyZW50U3RhdGUpO1xuICAgIH1cblxuICAgIGRlc2VyaWFsaXplKGNvbnRlbnRzOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IGxpbmVzOiBzdHJpbmdbXSA9IGNvbnRlbnRzLnNwbGl0KCdcXG4nKTtcbiAgICAgICAgdGhpcy5hbHBoYWJldCA9IGxpbmVzWzBdLnNwbGl0KCcsJyk7XG4gICAgICAgIHRoaXMubnVtU3RhdGVzID0gcGFyc2VJbnQobGluZXNbMV0pO1xuICAgICAgICB0aGlzLnN0YXJ0U3RhdGUgPSBwYXJzZUludChsaW5lc1syXSk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmFjY2VwdGluZ1N0YXRlcyA9IGxpbmVzWzNdLnNwbGl0KCcsJykubWFwKGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUludChpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy50cmFuc2l0aW9ucyA9IHt9O1xuICAgICAgICBmb3IgKGxldCBzdGF0ZSA9IDA7IHN0YXRlIDwgdGhpcy5udW1TdGF0ZXM7IHN0YXRlKyspIHtcbiAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbnNbc3RhdGVdID0ge307XG4gICAgICAgICAgICBmb3IgKGxldCBjaGFyIG9mIHRoaXMuYWxwaGFiZXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRyYW5zaXRpb25zW3N0YXRlXVtjaGFyXSA9IC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG51bVRyYW5zaXRpb25zOiBudW1iZXIgPSB0aGlzLmFscGhhYmV0Lmxlbmd0aCAqIHRoaXMubnVtU3RhdGVzO1xuICAgICAgICBmb3IgKGxldCBpID0gNDsgaSA8IDQgKyBudW1UcmFuc2l0aW9uczsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgbGluZTogc3RyaW5nW10gPSBsaW5lc1tpXS5zcGxpdCgnLCcpO1xuICAgICAgICAgICAgdGhpcy50cmFuc2l0aW9uc1twYXJzZUludChsaW5lWzBdKV1bbGluZVsxXV0gPSBwYXJzZUludChsaW5lWzJdKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNlcmlhbGl6ZSgpOiBzdHJpbmcge1xuICAgICAgICBsZXQgY29udGVudHM6IHN0cmluZ1tdID0gW107O1xuICAgICAgICBjb250ZW50cy5wdXNoKHRoaXMuYWxwaGFiZXQuam9pbignLCcpKTtcbiAgICAgICAgY29udGVudHMucHVzaCh0aGlzLm51bVN0YXRlcy50b1N0cmluZygpKTtcbiAgICAgICAgY29udGVudHMucHVzaCh0aGlzLnN0YXJ0U3RhdGUudG9TdHJpbmcoKSk7XG4gICAgICAgIGNvbnRlbnRzLnB1c2godGhpcy5hY2NlcHRpbmdTdGF0ZXMuam9pbignLCcpKTtcbiAgICAgICAgZm9yIChsZXQgc3RhdGUgPSAwOyBzdGF0ZSA8PSB0aGlzLm51bVN0YXRlczsgc3RhdGUrKykge1xuICAgICAgICAgICAgZm9yKGxldCBsZXR0ZXIgb2YgdGhpcy5hbHBoYWJldCkge1xuICAgICAgICAgICAgICAgIGNvbnRlbnRzLnB1c2goc3RhdGUudG9TdHJpbmcoKSArICcsJyArIGxldHRlciArICcsJyArIFxuICAgICAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbnNbc3RhdGVdW2xldHRlcl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb250ZW50cy5qb2luKCdcXG4nKTtcbiAgICB9XG5cbiAgICByZWFkRnJvbUZpbGUoZmlsZXBhdGg6IHN0cmluZykge1xuICAgICAgICBsZXQgY29udGVudHM6IHN0cmluZyA9IHJlYWRGaWxlU3luYyhmaWxlcGF0aCwgXCJ1dGY4XCIpO1xuICAgICAgICB0aGlzLmRlc2VyaWFsaXplKGNvbnRlbnRzKTsgXG4gICAgfVxuXG4gICAgd3JpdGVUb0ZpbGUoZmlsZXBhdGg6IHN0cmluZykge1xuICAgICAgICBsZXQgY29udGVudHM6IHN0cmluZyA9IHRoaXMuc2VyaWFsaXplKCk7XG4gICAgICAgIHdyaXRlRmlsZVN5bmMoZmlsZXBhdGgsIGNvbnRlbnRzKTtcbiAgICB9XG59XG5cbmNsYXNzIERmYUV4ZWN1dGlvbiB7XG4gICAgZGZhIDogRGZhO1xuICAgIGN1cnJlbnRTdGF0ZSA6IG51bWJlcjsgXG4gICAgaW5wdXRTdHJpbmcgOiBzdHJpbmc7XG4gICAgY3VycmVudENoYXJJbmRleCA6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKGRmYTogRGZhLCBpbnB1dFN0cmluZzogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuZGZhID0gZGZhO1xuICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IGRmYS5zdGFydFN0YXRlO1xuICAgICAgICB0aGlzLmlucHV0U3RyaW5nID0gaW5wdXRTdHJpbmc7XG4gICAgICAgIHRoaXMuY3VycmVudENoYXJJbmRleCA9IDA7XG4gICAgfVxuXG4gICAgZmluaXNoKCkge1xuICAgICAgICB3aGlsZSAodGhpcy5jdXJyZW50Q2hhckluZGV4IDwgdGhpcy5pbnB1dFN0cmluZy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuc3RlcCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RlcCgpIHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudENoYXJJbmRleCA+PSB0aGlzLmlucHV0U3RyaW5nLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjdXJyZW50Q2hhciA6IHN0cmluZyA9IHRoaXMuaW5wdXRTdHJpbmdbdGhpcy5jdXJyZW50Q2hhckluZGV4KytdO1xuICAgICAgICBsZXQgbmV4dFN0YXRlIDogbnVtYmVyID0gdGhpcy5kZmEudHJhbnNpdGlvbnNbdGhpcy5jdXJyZW50U3RhdGVdW2N1cnJlbnRDaGFyXTtcbiAgICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSBuZXh0U3RhdGU7XG4gICAgfVxufVxuXG5leHBvcnQge0RmYSwgRGZhRXhlY3V0aW9ufTsiLG51bGxdfQ==