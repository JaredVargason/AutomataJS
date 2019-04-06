require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dfa_1 = require("../models/dfa");
var State = (function () {
    function State(stateNum) {
    }
    return State;
}());
var dfa = new dfa_1.Dfa();
var execution = null;
var states = [];
function createDefaultDfa() {
    var alphabet = ['0', '1'];
    var numStates = 3;
    var startState = 0;
    var acceptingStates = [2];
    var transitions = {
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
    return new dfa_1.Dfa({
        alphabet: alphabet,
        numStates: numStates,
        startState: startState,
        acceptingStates: acceptingStates,
        transitions: transitions
    });
}
function saveDfaToFile() {
}
function loadDfaFromFile() {
    var input = document.getElementById('dfaFile');
    if (input.files.length == 1) {
        var reader_1 = new FileReader();
        reader_1.onload = function (e) {
            dfa.deserialize(reader_1.result);
            loadDfa(dfa);
        };
        reader_1.readAsText(input.files[0]);
    }
}
function loadDfa(newDfa) {
    clearAll();
    dfa = newDfa;
    updatePanel();
    updateSVG();
}
function updatePanel() {
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
function updateSVG() {
    createStates();
}
function addTransitionSVG(fromState, toState) {
}
function createState(event) {
    var svg = document.getElementById('dfaSvg');
    var domPoint = mouseEventToSVGCoord(svg, event);
    createStateAtPoint(domPoint.x, domPoint.y);
}
function addDrag(state, grid) {
    var selectedElement = null;
    var offset;
    state.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    state.addEventListener('mouseup', endDrag);
    function startDrag(event) {
        selectedElement = state;
        offset = mouseEventToSVGCoord(grid, event);
        offset.x -= parseFloat(selectedElement.getAttributeNS(null, "cx"));
        offset.y -= parseFloat(selectedElement.getAttributeNS(null, 'cy'));
    }
    function drag(event) {
        if (selectedElement) {
            event.preventDefault();
            var domPoint = mouseEventToSVGCoord(grid, event);
            state.setAttribute('cx', (domPoint.x - offset.x).toString());
            state.setAttribute('cy', (domPoint.y - offset.y).toString());
        }
    }
    function endDrag(event) {
        selectedElement = null;
    }
}
function mouseEventToSVGCoord(svg, mouseEvent) {
    return toSvgCoord(svg, mouseEvent.x, mouseEvent.y);
}
function toSvgCoord(svg, x, y) {
    var point = svg.createSVGPoint();
    point.x = x;
    point.y = y;
    return point.matrixTransform(svg.getScreenCTM().inverse());
}
function clearAll() {
    clearDefinition();
    clearTesting();
    clearSvg();
}
function clearDefinition() {
    var alphabetInput = document.getElementById('alphabetInput');
    alphabetInput.value = '';
    var numStatesInput = document.getElementById('numStatesInput');
    numStatesInput.value = '';
    var startStateInput = document.getElementById('startStateInput');
    startStateInput.value = '';
    var acceptingStatesInput = document.getElementById('acceptingStatesInput');
    acceptingStatesInput.value = '';
    clearTransitionsList();
}
function clearSvg() {
    clearStates();
    clearTransitions();
}
function clearStates() {
    var elements = document.getElementsByClassName('state');
    for (var i = elements.length - 1; i >= 0; i--) {
        elements[i].remove();
    }
}
function clearTransitions() {
    var transitionList = document.getElementById('transitionsList');
    var childNodes = transitionList.childNodes;
    for (var i = childNodes.length - 1; i >= 0; i--) {
        var child = childNodes[i];
        child.remove();
    }
}
function createStateAtPoint(svgX, svgY) {
    var svg = document.getElementById('dfaSvg');
    var group = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    var circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    circle.setAttribute('draggable', 'true');
    circle.setAttribute('r', '40');
    circle.setAttribute('cx', svgX.toString());
    circle.setAttribute('cy', svgY.toString());
    circle.style.stroke = 'black';
    circle.style.strokeWidth = '3';
    circle.style.fill = 'white';
    circle.style.position = 'absolute';
    circle.classList.add('state');
    circle.onmouseenter = function (event) {
        circle.style.fill = '#BBBBBB';
    };
    circle.onmouseleave = function (event) {
        circle.style.fill = '#FFFFFF';
    };
    addDrag(circle, svg);
    svg.appendChild(circle);
}
var stateSpacing = 200;
function createStates() {
    var svg = document.getElementById('dfaSvg');
    var middle = dfa.numStates / 2 - .5;
    var svgWidth = svg.getBBox().width;
    var svgHeight = svg.getBBox().height;
    for (var i = 0; i < dfa.numStates; i++) {
        var startX = svgWidth / 2 + (i - middle) * stateSpacing;
        var startY = svgHeight / 2 - middle * stateSpacing;
        createStateAtPoint(startX, startY);
    }
}
function addGridEvents() {
    document.getElementById('grid').addEventListener('click', function (event) {
        createState(event);
    });
}
function loadDefaultDfa() {
    loadDfa(createDefaultDfa());
}
function testString() {
    var inputElement = document.getElementById('testStringInput');
    var inputString = inputElement.value;
    var result = dfa.acceptsString(inputString);
    result ? resultSuccess(inputString) : resultFail(inputString);
}
function clearInput() {
    var inputElement = document.getElementById('testStringInput');
    inputElement.value = '';
}
function resultSuccess(inputString) {
    var resultElement = document.getElementById('resultBar');
    resultElement.style.background = 'green';
    var resultText = document.getElementById('resultText');
    resultText.innerText = '"' + inputString + '" yields SUCCESS';
}
function resultFail(inputString) {
    var resultElement = document.getElementById('resultBar');
    resultElement.style.background = 'red';
    var resultText = document.getElementById('resultText');
    resultText.innerText = '"' + inputString + '" yields FAIL';
}
function resultReset() {
    var resultElement = document.getElementById('resultBar');
    resultElement.style.background = '#444444';
    var resultText = document.getElementById('resultText');
    resultText.innerText = 'Result';
}
function beginStepThrough() {
    var inputElement = document.getElementById('testStringInput');
    execution = dfa.getExecution(inputElement.value);
    populateCharacters();
}
function clearTesting() {
    clearInput();
    resultReset();
    execution = dfa.getExecution('');
    populateCharacters();
}
function stepForward() {
    execution.step_forward();
    populateCharacters();
    updateIndexInput();
}
function stepBackward() {
    execution.step_backward();
    populateCharacters();
    updateIndexInput();
}
function resetStepThrough() {
    execution.reset();
    populateCharacters();
    updateIndexInput();
}
function finishStepThrough() {
    execution.finish();
    populateCharacters();
    updateIndexInput();
}
function populateCharacters() {
    var characterSlots = document.getElementById('characters');
    var numSlots = characterSlots.childElementCount;
    var middleIndex = Math.floor(numSlots / 2);
    var firstCharIndex = middleIndex - execution.currentCharIndex;
    var lastCharIndex = firstCharIndex + execution.inputString.length;
    for (var i = 0; i < numSlots; i++) {
        if (i >= firstCharIndex && i < lastCharIndex) {
            characterSlots.children[i].textContent = execution.inputString[i - firstCharIndex];
        }
        else {
            characterSlots.children[i].textContent = '';
        }
    }
}
function updateIndexInput() {
    var indexInput = document.getElementById('indexInput');
    indexInput.value = execution.currentCharIndex.toString();
}
$(document).ready(function () {
    document.getElementById('loadBtn').addEventListener('click', function () {
        loadDfaFromFile();
    });
    document.getElementById('loadExampleBtn').addEventListener('click', function () {
        loadDefaultDfa();
    });
    document.getElementById('testBtn').addEventListener('click', function () {
        testString();
    });
    document.getElementById('clearBtn').addEventListener('click', function () {
        clearAll();
    });
    document.getElementById('clearInputBtn').addEventListener('click', function () {
        clearTesting();
    });
    document.getElementById('testStringInput').addEventListener('input', function () {
        beginStepThrough();
        resultReset();
    });
    document.getElementById('forwardBtn').addEventListener('click', function () {
        stepForward();
    });
    document.getElementById('backBtn').addEventListener('click', function () {
        stepBackward();
    });
    document.getElementById('resetBtn').addEventListener('click', function () {
        resetStepThrough();
    });
    document.getElementById('finishBtn').addEventListener('click', function () {
        finishStepThrough();
    });
    loadDefaultDfa();
});
},{"../models/dfa":3}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var Dfa = (function () {
    function Dfa(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.alphabet, alphabet = _c === void 0 ? [] : _c, _d = _b.numStates, numStates = _d === void 0 ? 0 : _d, _e = _b.startState, startState = _e === void 0 ? 0 : _e, _f = _b.acceptingStates, acceptingStates = _f === void 0 ? [] : _f, _g = _b.transitions, transitions = _g === void 0 ? {} : _g;
        this.alphabet = alphabet;
        this.numStates = numStates;
        this.startState = startState;
        this.acceptingStates = acceptingStates;
        this.transitions = transitions;
    }
    Dfa.prototype.acceptsString = function (inputString) {
        var execution = this.getExecution(inputString);
        execution.finish();
        return this.acceptingStates.includes(execution.currentState);
    };
    Dfa.prototype.getExecution = function (inputString) {
        return new DfaExecution(this, inputString);
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
        this.inputString = inputString;
        this.reset();
    }
    DfaExecution.prototype.currentChar = function () {
        return this.inputString[this.currentCharIndex];
    };
    DfaExecution.prototype.reset = function () {
        this.path = [this.dfa.startState];
        this.currentState = this.dfa.startState;
        this.currentCharIndex = 0;
    };
    DfaExecution.prototype.finish = function () {
        while (this.currentCharIndex < this.inputString.length) {
            this.step_forward();
        }
    };
    DfaExecution.prototype.step_forward = function () {
        if (this.currentCharIndex >= this.inputString.length) {
            return;
        }
        var currentChar = this.currentChar();
        var nextState = this.dfa.transitions[this.currentState][currentChar];
        this.path.push(nextState);
        this.currentState = nextState;
        this.currentCharIndex++;
    };
    DfaExecution.prototype.step_backward = function () {
        if (this.currentCharIndex <= 0) {
            return;
        }
        this.currentState = this.path.pop();
        this.currentCharIndex--;
    };
    return DfaExecution;
}());
exports.DfaExecution = DfaExecution;
},{"fs":1}],1:[function(require,module,exports){

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9mYWN0b3ItYnVuZGxlL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZnJvbnRlbmQvZGZhX2NsaWVudC50cyIsInNyYy9tb2RlbHMvZGZhLnRzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbGliL19lbXB0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEscUNBQWtEO0FBTWxEO0lBSUksZUFBWSxRQUFnQjtJQUU1QixDQUFDO0lBQ0wsWUFBQztBQUFELENBUEEsQUFPQyxJQUFBO0FBRUQsSUFBSSxHQUFHLEdBQVEsSUFBSSxTQUFHLEVBQUUsQ0FBQztBQUN6QixJQUFJLFNBQVMsR0FBaUIsSUFBSSxDQUFDO0FBQ25DLElBQUksTUFBTSxHQUFrQixFQUFFLENBQUM7QUFFL0IsU0FBUyxnQkFBZ0I7SUFFckIsSUFBSSxRQUFRLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDMUIsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQ2xCLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztJQUNuQixJQUFJLGVBQWUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFCLElBQUksV0FBVyxHQUFHO1FBQ2QsQ0FBQyxFQUFFO1lBQ0MsR0FBRyxFQUFFLENBQUM7WUFDTixHQUFHLEVBQUUsQ0FBQztTQUNUO1FBQ0QsQ0FBQyxFQUFFO1lBQ0MsR0FBRyxFQUFFLENBQUM7WUFDTixHQUFHLEVBQUUsQ0FBQztTQUNUO1FBQ0QsQ0FBQyxFQUFFO1lBQ0MsR0FBRyxFQUFFLENBQUM7WUFDTixHQUFHLEVBQUUsQ0FBQztTQUNUO0tBQ0osQ0FBQztJQUNGLE9BQU8sSUFBSSxTQUFHLENBQUM7UUFDWCxRQUFRLFVBQUE7UUFDUixTQUFTLFdBQUE7UUFDVCxVQUFVLFlBQUE7UUFDVixlQUFlLGlCQUFBO1FBQ2YsV0FBVyxhQUFBO0tBQ2QsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztB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SUFDTCxtQkFBQztBQUFELENBakRBLEFBaURDLElBQUE7QUFFWSxvQ0FBWTs7QUN4SXpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7IERmYSwgRGZhRXhlY3V0aW9uIH0gZnJvbSAnLi4vbW9kZWxzL2RmYSc7XG5pbXBvcnQgeyByZWFkIH0gZnJvbSAnZnMnO1xuaW1wb3J0IHsgcGF0aFRvRmlsZVVSTCB9IGZyb20gJ3VybCc7XG5pbXBvcnQgeyBjcmVhdGUgfSBmcm9tICdkb21haW4nO1xuaW1wb3J0IHsgZXhlYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuXG5jbGFzcyBTdGF0ZSB7XG4gICAgc3RhdGVOdW06IG51bWJlcjtcbiAgICBzdmc6IFNWR1NWR0VsZW1lbnQ7IFxuXG4gICAgY29uc3RydWN0b3Ioc3RhdGVOdW06IG51bWJlcikge1xuXG4gICAgfVxufVxuXG5sZXQgZGZhOiBEZmEgPSBuZXcgRGZhKCk7XG5sZXQgZXhlY3V0aW9uOiBEZmFFeGVjdXRpb24gPSBudWxsO1xubGV0IHN0YXRlczogU1ZHR0VsZW1lbnRbXSA9IFtdO1xuXG5mdW5jdGlvbiBjcmVhdGVEZWZhdWx0RGZhKCk6IERmYSB7XG4gICAgLy9FbmRzIHdpdGggXCIwMFwiIERGQVxuICAgIGxldCBhbHBoYWJldCA9IFsnMCcsICcxJ107XG4gICAgbGV0IG51bVN0YXRlcyA9IDM7XG4gICAgbGV0IHN0YXJ0U3RhdGUgPSAwO1xuICAgIGxldCBhY2NlcHRpbmdTdGF0ZXMgPSBbMl07XG4gICAgbGV0IHRyYW5zaXRpb25zID0ge1xuICAgICAgICAwOiB7XG4gICAgICAgICAgICAnMCc6IDEsXG4gICAgICAgICAgICAnMSc6IDBcbiAgICAgICAgfSxcbiAgICAgICAgMToge1xuICAgICAgICAgICAgJzAnOiAyLFxuICAgICAgICAgICAgJzEnOiAwXG4gICAgICAgIH0sXG4gICAgICAgIDI6IHtcbiAgICAgICAgICAgICcwJzogMixcbiAgICAgICAgICAgICcxJzogMFxuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gbmV3IERmYSh7XG4gICAgICAgIGFscGhhYmV0LFxuICAgICAgICBudW1TdGF0ZXMsXG4gICAgICAgIHN0YXJ0U3RhdGUsXG4gICAgICAgIGFjY2VwdGluZ1N0YXRlcyxcbiAgICAgICAgdHJhbnNpdGlvbnNcbiAgICB9KTsgXG59XG5cbmZ1bmN0aW9uIHNhdmVEZmFUb0ZpbGUoKSB7XG5cbn1cblxuZnVuY3Rpb24gbG9hZERmYUZyb21GaWxlKCkge1xuICAgIHZhciBpbnB1dCA6IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGZhRmlsZScpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgaWYgKGlucHV0LmZpbGVzLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgIGxldCByZWFkZXI6IEZpbGVSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZGZhLmRlc2VyaWFsaXplKHJlYWRlci5yZXN1bHQgYXMgc3RyaW5nKTtcbiAgICAgICAgICAgIGxvYWREZmEoZGZhKTsgXG4gICAgICAgIH1cbiAgICAgICAgcmVhZGVyLnJlYWRBc1RleHQoaW5wdXQuZmlsZXNbMF0pO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gbG9hZERmYShuZXdEZmE6IERmYSkge1xuICAgIGNsZWFyQWxsKCk7XG4gICAgZGZhID0gbmV3RGZhO1xuICAgIHVwZGF0ZVBhbmVsKCk7XG4gICAgdXBkYXRlU1ZHKCk7XG59XG5cbi8vUGFuZWwgZnVuY3Rpb25zXG5mdW5jdGlvbiB1cGRhdGVQYW5lbCgpIHtcbiAgICB1cGRhdGVBbHBoYWJldCgpO1xuICAgIHVwZGF0ZU51bVN0YXRlcygpO1xuICAgIHVwZGF0ZVN0YXJ0U3RhdGUoKTtcbiAgICB1cGRhdGVBY2NlcHRTdGF0ZXMoKTtcbiAgICB1cGRhdGVUcmFuc2l0aW9ucygpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVBbHBoYWJldCgpIHtcbiAgICBsZXQgYWxwaGFiZXRJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhbHBoYWJldElucHV0JykgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICBhbHBoYWJldElucHV0LnZhbHVlID0gZGZhLmFscGhhYmV0LmpvaW4oJywnKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlTnVtU3RhdGVzKCkge1xuICAgIGxldCBudW1TdGF0ZXNJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdudW1TdGF0ZXNJbnB1dCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgbnVtU3RhdGVzSW5wdXQudmFsdWUgPSBkZmEubnVtU3RhdGVzLnRvU3RyaW5nKCk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVN0YXJ0U3RhdGUoKSB7XG4gICAgbGV0IHN0YXJ0U3RhdGVJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGFydFN0YXRlSW5wdXQnKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgIHN0YXJ0U3RhdGVJbnB1dC52YWx1ZSA9IGRmYS5zdGFydFN0YXRlLnRvU3RyaW5nKCk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUFjY2VwdFN0YXRlcygpIHtcbiAgICBsZXQgYWNjZXB0aW5nU3RhdGVzSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWNjZXB0aW5nU3RhdGVzSW5wdXQnKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgIGFjY2VwdGluZ1N0YXRlc0lucHV0LnZhbHVlID0gZGZhLmFjY2VwdGluZ1N0YXRlcy5qb2luKCcsJyk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVRyYW5zaXRpb25zKCkge1xuICAgIGNsZWFyVHJhbnNpdGlvbnNMaXN0KCk7XG4gICAgZm9yIChsZXQgZnJvbVN0YXRlID0gMDsgZnJvbVN0YXRlIDwgZGZhLm51bVN0YXRlczsgZnJvbVN0YXRlKyspIHtcbiAgICAgICAgZm9yIChsZXQgbGV0dGVyIG9mIGRmYS5hbHBoYWJldCkge1xuICAgICAgICAgICAgYWRkVHJhbnNpdGlvbihmcm9tU3RhdGUsIGxldHRlciwgZGZhLnRyYW5zaXRpb25zW2Zyb21TdGF0ZV1bbGV0dGVyXSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNsZWFyVHJhbnNpdGlvbnNMaXN0KCkge1xuICAgIGxldCB0cmFuc2l0aW9uc0xpc3QgOiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJhbnNpdGlvbnNMaXN0XCIpO1xuICAgIHdoaWxlICh0cmFuc2l0aW9uc0xpc3QuZmlyc3RDaGlsZCkge1xuICAgICAgICB0cmFuc2l0aW9uc0xpc3QucmVtb3ZlQ2hpbGQodHJhbnNpdGlvbnNMaXN0LmZpcnN0Q2hpbGQpO1xuICAgIH0gXG59XG5cbmZ1bmN0aW9uIGFkZFRyYW5zaXRpb24oZnJvbVN0YXRlOiBudW1iZXIsIGxldHRlcjogc3RyaW5nLCB0b1N0YXRlOiBudW1iZXIpIHtcbiAgICBsZXQgdHJhbnNpdGlvbkxpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHJhbnNpdGlvbnNMaXN0Jyk7XG4gICAgbGV0IHRleHQgPSBmcm9tU3RhdGUudG9TdHJpbmcoKSArICcgKyAnICsgbGV0dGVyICsgJyAmcmFycjsnXG4gICAgbGV0IGxpc3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICBsaXN0RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdsaXN0LWdyb3VwLWl0ZW0nKTtcblxuICAgIGxldCBsaXN0SXRlbVN0cmluZyA9IFxuICAgICc8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIj5cXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwLXByZXBlbmRcIj5cXFxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaW5wdXQtZ3JvdXAtdGV4dFwiPicgKyB0ZXh0ICsgJzwvc3Bhbj5cXFxuICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBwbGFjZWhvbGRlcj1cIlFcIiB2YWx1ZT1cIicgKyB0b1N0YXRlICsgJ1wiPlxcXG4gICAgICAgIDwvZGl2Pic7XG4gICAgbGlzdEVsZW1lbnQuaW5uZXJIVE1MID0gbGlzdEl0ZW1TdHJpbmc7XG4gICAgdHJhbnNpdGlvbkxpc3QuYXBwZW5kQ2hpbGQobGlzdEVsZW1lbnQpO1xufVxuXG4vL1NWR1xuZnVuY3Rpb24gdXBkYXRlU1ZHKCkge1xuICAgIGNyZWF0ZVN0YXRlcygpOyBcbn1cblxuZnVuY3Rpb24gYWRkVHJhbnNpdGlvblNWRyhmcm9tU3RhdGUsIHRvU3RhdGUpIHtcbiAgICBcbn1cblxuZnVuY3Rpb24gY3JlYXRlU3RhdGUoZXZlbnQgOiBNb3VzZUV2ZW50KSB7XG4gICAgdmFyIHN2ZyA6IFNWR1NWR0VsZW1lbnQgPSA8U1ZHU1ZHRWxlbWVudD48YW55PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZmFTdmcnKTtcbiAgICBsZXQgZG9tUG9pbnQgPSBtb3VzZUV2ZW50VG9TVkdDb29yZChzdmcsIGV2ZW50KTtcbiAgICBjcmVhdGVTdGF0ZUF0UG9pbnQoZG9tUG9pbnQueCwgZG9tUG9pbnQueSk7XG59XG5cbmZ1bmN0aW9uIGFkZERyYWcoc3RhdGU6IFNWR0NpcmNsZUVsZW1lbnQsIGdyaWQ6IFNWR1NWR0VsZW1lbnQpIHtcbiAgICBsZXQgc2VsZWN0ZWRFbGVtZW50OiBTVkdDaXJjbGVFbGVtZW50ID0gbnVsbDtcbiAgICBsZXQgb2Zmc2V0IDogRE9NUG9pbnQ7XG5cbiAgICBzdGF0ZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBzdGFydERyYWcpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGRyYWcpO1xuICAgIHN0YXRlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBlbmREcmFnKTtcblxuICAgIGZ1bmN0aW9uIHN0YXJ0RHJhZyhldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICBzZWxlY3RlZEVsZW1lbnQgPSBzdGF0ZTtcbiAgICAgICAgb2Zmc2V0ID0gbW91c2VFdmVudFRvU1ZHQ29vcmQoZ3JpZCwgZXZlbnQpO1xuICAgICAgICBvZmZzZXQueCAtPSBwYXJzZUZsb2F0KHNlbGVjdGVkRWxlbWVudC5nZXRBdHRyaWJ1dGVOUyhudWxsLCBcImN4XCIpKTtcbiAgICAgICAgb2Zmc2V0LnkgLT0gcGFyc2VGbG9hdChzZWxlY3RlZEVsZW1lbnQuZ2V0QXR0cmlidXRlTlMobnVsbCwgJ2N5JykpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBkcmFnKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgIGlmIChzZWxlY3RlZEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBsZXQgZG9tUG9pbnQ6IERPTVBvaW50ID0gbW91c2VFdmVudFRvU1ZHQ29vcmQoZ3JpZCwgZXZlbnQpO1xuICAgICAgICAgICAgc3RhdGUuc2V0QXR0cmlidXRlKCdjeCcsIChkb21Qb2ludC54IC0gb2Zmc2V0LngpLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgc3RhdGUuc2V0QXR0cmlidXRlKCdjeScsIChkb21Qb2ludC55IC0gb2Zmc2V0LnkpLnRvU3RyaW5nKCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZW5kRHJhZyhldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICBzZWxlY3RlZEVsZW1lbnQgPSBudWxsO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gbW91c2VFdmVudFRvU1ZHQ29vcmQoc3ZnOiBTVkdTVkdFbGVtZW50LCBtb3VzZUV2ZW50OiBNb3VzZUV2ZW50KTogRE9NUG9pbnQge1xuICAgIHJldHVybiB0b1N2Z0Nvb3JkKHN2ZywgbW91c2VFdmVudC54LCBtb3VzZUV2ZW50LnkpO1xufVxuXG5mdW5jdGlvbiB0b1N2Z0Nvb3JkKHN2ZzpTVkdTVkdFbGVtZW50LCB4OiBudW1iZXIsIHk6IG51bWJlcik6IERPTVBvaW50IHtcbiAgICBsZXQgcG9pbnQgOiBTVkdQb2ludCA9IHN2Zy5jcmVhdGVTVkdQb2ludCgpO1xuICAgIHBvaW50LnggPSB4O1xuICAgIHBvaW50LnkgPSB5O1xuICAgIFxuICAgIHJldHVybiBwb2ludC5tYXRyaXhUcmFuc2Zvcm0oc3ZnLmdldFNjcmVlbkNUTSgpLmludmVyc2UoKSk7XG59XG5cbmZ1bmN0aW9uIGNsZWFyQWxsKCkge1xuICAgIGNsZWFyRGVmaW5pdGlvbigpO1xuICAgIGNsZWFyVGVzdGluZygpO1xuICAgIGNsZWFyU3ZnKCk7XG59XG5cbmZ1bmN0aW9uIGNsZWFyRGVmaW5pdGlvbigpIHtcbiAgICBsZXQgYWxwaGFiZXRJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhbHBoYWJldElucHV0JykgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICBhbHBoYWJldElucHV0LnZhbHVlID0gJyc7XG5cbiAgICBsZXQgbnVtU3RhdGVzSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbnVtU3RhdGVzSW5wdXQnKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgIG51bVN0YXRlc0lucHV0LnZhbHVlID0gJyc7XG5cbiAgICBsZXQgc3RhcnRTdGF0ZUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXJ0U3RhdGVJbnB1dCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgc3RhcnRTdGF0ZUlucHV0LnZhbHVlID0gJyc7XG5cbiAgICBsZXQgYWNjZXB0aW5nU3RhdGVzSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWNjZXB0aW5nU3RhdGVzSW5wdXQnKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgIGFjY2VwdGluZ1N0YXRlc0lucHV0LnZhbHVlID0gJyc7XG5cbiAgICBjbGVhclRyYW5zaXRpb25zTGlzdCgpO1xufVxuXG5mdW5jdGlvbiBjbGVhclN2ZygpIHtcbiAgICBjbGVhclN0YXRlcygpO1xuICAgIGNsZWFyVHJhbnNpdGlvbnMoKTtcbn1cblxuZnVuY3Rpb24gY2xlYXJTdGF0ZXMoKSB7XG4gICAgbGV0IGVsZW1lbnRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc3RhdGUnKTtcbiAgICBmb3IgKGxldCBpID0gZWxlbWVudHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgZWxlbWVudHNbaV0ucmVtb3ZlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjbGVhclRyYW5zaXRpb25zKCkge1xuICAgIGxldCB0cmFuc2l0aW9uTGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0cmFuc2l0aW9uc0xpc3QnKTtcbiAgICBsZXQgY2hpbGROb2RlcyA9IHRyYW5zaXRpb25MaXN0LmNoaWxkTm9kZXM7XG4gICAgZm9yIChsZXQgaSA9IGNoaWxkTm9kZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgbGV0IGNoaWxkID0gY2hpbGROb2Rlc1tpXTtcbiAgICAgICAgY2hpbGQucmVtb3ZlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVTdGF0ZUF0UG9pbnQoc3ZnWDogbnVtYmVyLCBzdmdZOiBudW1iZXIpIHtcbiAgICB2YXIgc3ZnOiBTVkdTVkdFbGVtZW50ID0gPFNWR1NWR0VsZW1lbnQ+PGFueT5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGZhU3ZnJyk7XG4gICAgdmFyIGdyb3VwOiBTVkdHRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsICdnJyk7XG4gICAgdmFyIGNpcmNsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsJ2NpcmNsZScpO1xuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoJ2RyYWdnYWJsZScsICd0cnVlJyk7XG4gICAgY2lyY2xlLnNldEF0dHJpYnV0ZSgncicsICc0MCcpO1xuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoJ2N4Jywgc3ZnWC50b1N0cmluZygpKTtcbiAgICBjaXJjbGUuc2V0QXR0cmlidXRlKCdjeScsIHN2Z1kudG9TdHJpbmcoKSk7XG4gICAgY2lyY2xlLnN0eWxlLnN0cm9rZSA9ICdibGFjayc7XG4gICAgY2lyY2xlLnN0eWxlLnN0cm9rZVdpZHRoID0gJzMnO1xuICAgIGNpcmNsZS5zdHlsZS5maWxsID0gJ3doaXRlJztcbiAgICBjaXJjbGUuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgIGNpcmNsZS5jbGFzc0xpc3QuYWRkKCdzdGF0ZScpO1xuICAgIGNpcmNsZS5vbm1vdXNlZW50ZXIgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBjaXJjbGUuc3R5bGUuZmlsbCA9ICcjQkJCQkJCJztcbiAgICB9O1xuICAgIGNpcmNsZS5vbm1vdXNlbGVhdmUgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBjaXJjbGUuc3R5bGUuZmlsbCA9ICcjRkZGRkZGJztcbiAgICB9XG4gICAgYWRkRHJhZyhjaXJjbGUsIHN2Zyk7XG4gICAgc3ZnLmFwcGVuZENoaWxkKGNpcmNsZSk7XG59XG5cbmxldCBzdGF0ZVNwYWNpbmc6IG51bWJlciA9IDIwMDtcbmZ1bmN0aW9uIGNyZWF0ZVN0YXRlcygpIHtcbiAgICBsZXQgc3ZnID0gPFNWR1NWR0VsZW1lbnQ+PGFueT5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGZhU3ZnJyk7XG4gICAgbGV0IG1pZGRsZSA9IGRmYS5udW1TdGF0ZXMgLyAyIC0gLjU7XG4gICAgbGV0IHN2Z1dpZHRoID0gc3ZnLmdldEJCb3goKS53aWR0aDtcbiAgICBsZXQgc3ZnSGVpZ2h0ID0gc3ZnLmdldEJCb3goKS5oZWlnaHQ7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkZmEubnVtU3RhdGVzOyBpKyspIHtcbiAgICAgICAgbGV0IHN0YXJ0WCA9IHN2Z1dpZHRoIC8gMiArIChpIC0gbWlkZGxlKSAqIHN0YXRlU3BhY2luZztcbiAgICAgICAgbGV0IHN0YXJ0WSA9IHN2Z0hlaWdodCAvIDIgLSBtaWRkbGUgKiBzdGF0ZVNwYWNpbmc7XG4gICAgICAgIGNyZWF0ZVN0YXRlQXRQb2ludChzdGFydFgsIHN0YXJ0WSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBhZGRHcmlkRXZlbnRzKCkge1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmlkJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBjcmVhdGVTdGF0ZShldmVudCk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGxvYWREZWZhdWx0RGZhKCkge1xuICAgIGxvYWREZmEoY3JlYXRlRGVmYXVsdERmYSgpKTtcbn1cblxuLy9TdHJpbmcgdGVzdGluZ1xuZnVuY3Rpb24gdGVzdFN0cmluZygpIHtcbiAgICBsZXQgaW5wdXRFbGVtZW50ID0gPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rlc3RTdHJpbmdJbnB1dCcpO1xuICAgIGxldCBpbnB1dFN0cmluZyA6IHN0cmluZyA9IGlucHV0RWxlbWVudC52YWx1ZTtcbiAgICBsZXQgcmVzdWx0IDogYm9vbGVhbiA9IGRmYS5hY2NlcHRzU3RyaW5nKGlucHV0U3RyaW5nKTtcbiAgICByZXN1bHQgPyByZXN1bHRTdWNjZXNzKGlucHV0U3RyaW5nKSA6IHJlc3VsdEZhaWwoaW5wdXRTdHJpbmcpO1xufVxuXG5mdW5jdGlvbiBjbGVhcklucHV0KCkge1xuICAgIGxldCBpbnB1dEVsZW1lbnQgPSA8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGVzdFN0cmluZ0lucHV0Jyk7XG4gICAgaW5wdXRFbGVtZW50LnZhbHVlID0gJyc7XG59XG5cbmZ1bmN0aW9uIHJlc3VsdFN1Y2Nlc3MoaW5wdXRTdHJpbmcgOiBzdHJpbmcpIHtcbiAgICBsZXQgcmVzdWx0RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN1bHRCYXInKTtcbiAgICByZXN1bHRFbGVtZW50LnN0eWxlLmJhY2tncm91bmQgPSAnZ3JlZW4nO1xuICAgIGxldCByZXN1bHRUZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3VsdFRleHQnKTtcbiAgICByZXN1bHRUZXh0LmlubmVyVGV4dCA9ICdcIicgKyBpbnB1dFN0cmluZyArICdcIiB5aWVsZHMgU1VDQ0VTUyc7XG59XG5cbmZ1bmN0aW9uIHJlc3VsdEZhaWwoaW5wdXRTdHJpbmcgOiBzdHJpbmcpIHtcbiAgICBsZXQgcmVzdWx0RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN1bHRCYXInKTtcbiAgICByZXN1bHRFbGVtZW50LnN0eWxlLmJhY2tncm91bmQgPSAncmVkJztcbiAgICBsZXQgcmVzdWx0VGV4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN1bHRUZXh0Jyk7XG4gICAgcmVzdWx0VGV4dC5pbm5lclRleHQgPSAnXCInICsgaW5wdXRTdHJpbmcgKyAnXCIgeWllbGRzIEZBSUwnO1xufVxuXG5mdW5jdGlvbiByZXN1bHRSZXNldCgpIHtcbiAgICBsZXQgcmVzdWx0RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN1bHRCYXInKTtcbiAgICByZXN1bHRFbGVtZW50LnN0eWxlLmJhY2tncm91bmQgPSAnIzQ0NDQ0NCc7XG4gICAgbGV0IHJlc3VsdFRleHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdWx0VGV4dCcpO1xuICAgIHJlc3VsdFRleHQuaW5uZXJUZXh0ID0gJ1Jlc3VsdCc7XG59XG5cbi8vU3RlcCB0aHJvdWdoIHRlc3RpbmdcbmZ1bmN0aW9uIGJlZ2luU3RlcFRocm91Z2goKSB7XG4gICAgbGV0IGlucHV0RWxlbWVudCA9IDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZXN0U3RyaW5nSW5wdXQnKTtcbiAgICBleGVjdXRpb24gPSBkZmEuZ2V0RXhlY3V0aW9uKGlucHV0RWxlbWVudC52YWx1ZSk7XG4gICAgcG9wdWxhdGVDaGFyYWN0ZXJzKCk7XG59XG5cbmZ1bmN0aW9uIGNsZWFyVGVzdGluZygpIHtcbiAgICBjbGVhcklucHV0KCk7XG4gICAgcmVzdWx0UmVzZXQoKTtcbiAgICBleGVjdXRpb24gPSBkZmEuZ2V0RXhlY3V0aW9uKCcnKTtcbiAgICBwb3B1bGF0ZUNoYXJhY3RlcnMoKTtcbn1cblxuZnVuY3Rpb24gc3RlcEZvcndhcmQoKSB7XG4gICAgZXhlY3V0aW9uLnN0ZXBfZm9yd2FyZCgpO1xuICAgIHBvcHVsYXRlQ2hhcmFjdGVycygpO1xuICAgIHVwZGF0ZUluZGV4SW5wdXQoKTtcbn1cblxuZnVuY3Rpb24gc3RlcEJhY2t3YXJkKCkge1xuICAgIGV4ZWN1dGlvbi5zdGVwX2JhY2t3YXJkKCk7XG4gICAgcG9wdWxhdGVDaGFyYWN0ZXJzKCk7XG4gICAgdXBkYXRlSW5kZXhJbnB1dCgpO1xufVxuXG5mdW5jdGlvbiByZXNldFN0ZXBUaHJvdWdoKCkge1xuICAgIGV4ZWN1dGlvbi5yZXNldCgpO1xuICAgIHBvcHVsYXRlQ2hhcmFjdGVycygpO1xuICAgIHVwZGF0ZUluZGV4SW5wdXQoKTtcbn1cblxuZnVuY3Rpb24gZmluaXNoU3RlcFRocm91Z2goKSB7XG4gICAgZXhlY3V0aW9uLmZpbmlzaCgpO1xuICAgIHBvcHVsYXRlQ2hhcmFjdGVycygpO1xuICAgIHVwZGF0ZUluZGV4SW5wdXQoKTtcbn1cblxuZnVuY3Rpb24gcG9wdWxhdGVDaGFyYWN0ZXJzKCkge1xuICAgIGxldCBjaGFyYWN0ZXJTbG90cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaGFyYWN0ZXJzJyk7XG4gICAgbGV0IG51bVNsb3RzID0gY2hhcmFjdGVyU2xvdHMuY2hpbGRFbGVtZW50Q291bnQ7XG4gICAgbGV0IG1pZGRsZUluZGV4ID0gTWF0aC5mbG9vcihudW1TbG90cyAvIDIpO1xuICAgIGxldCBmaXJzdENoYXJJbmRleCA9IG1pZGRsZUluZGV4IC0gZXhlY3V0aW9uLmN1cnJlbnRDaGFySW5kZXhcbiAgICBsZXQgbGFzdENoYXJJbmRleCA9IGZpcnN0Q2hhckluZGV4ICsgZXhlY3V0aW9uLmlucHV0U3RyaW5nLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVNsb3RzOyBpKyspIHtcbiAgICAgICAgaWYgKGkgPj0gZmlyc3RDaGFySW5kZXggJiYgaSA8IGxhc3RDaGFySW5kZXgpIHtcbiAgICAgICAgICAgIGNoYXJhY3RlclNsb3RzLmNoaWxkcmVuW2ldLnRleHRDb250ZW50ID0gZXhlY3V0aW9uLmlucHV0U3RyaW5nW2kgLSBmaXJzdENoYXJJbmRleF07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjaGFyYWN0ZXJTbG90cy5jaGlsZHJlbltpXS50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiB1cGRhdGVJbmRleElucHV0KCkge1xuICAgIGxldCBpbmRleElucHV0ID0gPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luZGV4SW5wdXQnKTtcbiAgICBpbmRleElucHV0LnZhbHVlID0gZXhlY3V0aW9uLmN1cnJlbnRDaGFySW5kZXgudG9TdHJpbmcoKTtcbn1cblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgLy9hZGRHcmlkRXZlbnRzKCk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvYWRCdG4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBsb2FkRGZhRnJvbUZpbGUoKTtcbiAgICB9KTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hZEV4YW1wbGVCdG4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBsb2FkRGVmYXVsdERmYSgpO1xuICAgIH0pO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZXN0QnRuJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdGVzdFN0cmluZygpO1xuICAgIH0pO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbGVhckJ0bicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNsZWFyQWxsKCk7XG4gICAgfSk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NsZWFySW5wdXRCdG4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjbGVhclRlc3RpbmcoKTtcbiAgICB9KTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGVzdFN0cmluZ0lucHV0JykuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgYmVnaW5TdGVwVGhyb3VnaCgpO1xuICAgICAgICByZXN1bHRSZXNldCgpO1xuICAgIH0pO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmb3J3YXJkQnRuJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgc3RlcEZvcndhcmQoKTtcbiAgICB9KTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFja0J0bicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHN0ZXBCYWNrd2FyZCgpO1xuICAgIH0pO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXNldEJ0bicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKXtcbiAgICAgICAgcmVzZXRTdGVwVGhyb3VnaCgpO1xuICAgIH0pO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaW5pc2hCdG4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBmaW5pc2hTdGVwVGhyb3VnaCgpO1xuICAgIH0pO1xuICAgIGxvYWREZWZhdWx0RGZhKCk7XG59KTtcbiIsImltcG9ydCB7cmVhZEZpbGVTeW5jLCB3cml0ZUZpbGVTeW5jfSBmcm9tICdmcyc7XG5pbXBvcnQgeyBzdGFydCB9IGZyb20gJ3JlcGwnO1xuXG5jbGFzcyBEZmEge1xuICAgIGFscGhhYmV0OiBzdHJpbmdbXTtcbiAgICBudW1TdGF0ZXM6IG51bWJlcjtcbiAgICBzdGFydFN0YXRlOiBudW1iZXI7XG4gICAgYWNjZXB0aW5nU3RhdGVzOiBudW1iZXJbXTtcbiAgICB0cmFuc2l0aW9uczoge1trZXkgOiBudW1iZXJdOiB7W2tleTogc3RyaW5nXTogbnVtYmVyfX07XG5cbiAgICBjb25zdHJ1Y3Rvcih7XG4gICAgICAgIGFscGhhYmV0ID0gW10sXG4gICAgICAgIG51bVN0YXRlcyA9IDAsXG4gICAgICAgIHN0YXJ0U3RhdGUgPSAwLFxuICAgICAgICBhY2NlcHRpbmdTdGF0ZXMgPSBbXSxcbiAgICAgICAgdHJhbnNpdGlvbnMgPSB7fVxuICAgIH06IHthbHBoYWJldD86IHN0cmluZ1tdLCBudW1TdGF0ZXM/OiBudW1iZXIsIHN0YXJ0U3RhdGU/OiBudW1iZXIsIGFjY2VwdGluZ1N0YXRlcz86IG51bWJlcltdLCB0cmFuc2l0aW9ucz86IHtba2V5IDogbnVtYmVyXToge1trZXk6IHN0cmluZ106IG51bWJlcn19fSA9IHt9KSB7XG4gICAgICAgIHRoaXMuYWxwaGFiZXQgPSBhbHBoYWJldDsgXG4gICAgICAgIHRoaXMubnVtU3RhdGVzID0gbnVtU3RhdGVzO1xuICAgICAgICB0aGlzLnN0YXJ0U3RhdGUgPSBzdGFydFN0YXRlO1xuICAgICAgICB0aGlzLmFjY2VwdGluZ1N0YXRlcyA9IGFjY2VwdGluZ1N0YXRlcztcbiAgICAgICAgdGhpcy50cmFuc2l0aW9ucyA9IHRyYW5zaXRpb25zO1xuICAgIH1cblxuICAgIGFjY2VwdHNTdHJpbmcoaW5wdXRTdHJpbmc6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICBsZXQgZXhlY3V0aW9uOiBEZmFFeGVjdXRpb24gPSB0aGlzLmdldEV4ZWN1dGlvbihpbnB1dFN0cmluZyk7XG4gICAgICAgIGV4ZWN1dGlvbi5maW5pc2goKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWNjZXB0aW5nU3RhdGVzLmluY2x1ZGVzKGV4ZWN1dGlvbi5jdXJyZW50U3RhdGUpO1xuICAgIH1cblxuICAgIGdldEV4ZWN1dGlvbihpbnB1dFN0cmluZzogc3RyaW5nKSA6IERmYUV4ZWN1dGlvbiB7XG4gICAgICAgIHJldHVybiBuZXcgRGZhRXhlY3V0aW9uKHRoaXMsIGlucHV0U3RyaW5nKTtcbiAgICB9XG5cbiAgICBkZXNlcmlhbGl6ZShjb250ZW50czogc3RyaW5nKSB7XG4gICAgICAgIGxldCBsaW5lczogc3RyaW5nW10gPSBjb250ZW50cy5zcGxpdCgnXFxuJyk7XG4gICAgICAgIHRoaXMuYWxwaGFiZXQgPSBsaW5lc1swXS5zcGxpdCgnLCcpO1xuICAgICAgICB0aGlzLm51bVN0YXRlcyA9IHBhcnNlSW50KGxpbmVzWzFdKTtcbiAgICAgICAgdGhpcy5zdGFydFN0YXRlID0gcGFyc2VJbnQobGluZXNbMl0pO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5hY2NlcHRpbmdTdGF0ZXMgPSBsaW5lc1szXS5zcGxpdCgnLCcpLm1hcChmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQoaSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMudHJhbnNpdGlvbnMgPSB7fTtcbiAgICAgICAgZm9yIChsZXQgc3RhdGUgPSAwOyBzdGF0ZSA8IHRoaXMubnVtU3RhdGVzOyBzdGF0ZSsrKSB7XG4gICAgICAgICAgICB0aGlzLnRyYW5zaXRpb25zW3N0YXRlXSA9IHt9O1xuICAgICAgICAgICAgZm9yIChsZXQgY2hhciBvZiB0aGlzLmFscGhhYmV0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy50cmFuc2l0aW9uc1tzdGF0ZV1bY2hhcl0gPSAtMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBudW1UcmFuc2l0aW9uczogbnVtYmVyID0gdGhpcy5hbHBoYWJldC5sZW5ndGggKiB0aGlzLm51bVN0YXRlcztcbiAgICAgICAgZm9yIChsZXQgaSA9IDQ7IGkgPCA0ICsgbnVtVHJhbnNpdGlvbnM7IGkrKykge1xuICAgICAgICAgICAgbGV0IGxpbmU6IHN0cmluZ1tdID0gbGluZXNbaV0uc3BsaXQoJywnKTtcbiAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbnNbcGFyc2VJbnQobGluZVswXSldW2xpbmVbMV1dID0gcGFyc2VJbnQobGluZVsyXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXJpYWxpemUoKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IGNvbnRlbnRzOiBzdHJpbmdbXSA9IFtdOztcbiAgICAgICAgY29udGVudHMucHVzaCh0aGlzLmFscGhhYmV0LmpvaW4oJywnKSk7XG4gICAgICAgIGNvbnRlbnRzLnB1c2godGhpcy5udW1TdGF0ZXMudG9TdHJpbmcoKSk7XG4gICAgICAgIGNvbnRlbnRzLnB1c2godGhpcy5zdGFydFN0YXRlLnRvU3RyaW5nKCkpO1xuICAgICAgICBjb250ZW50cy5wdXNoKHRoaXMuYWNjZXB0aW5nU3RhdGVzLmpvaW4oJywnKSk7XG4gICAgICAgIGZvciAobGV0IHN0YXRlID0gMDsgc3RhdGUgPD0gdGhpcy5udW1TdGF0ZXM7IHN0YXRlKyspIHtcbiAgICAgICAgICAgIGZvcihsZXQgbGV0dGVyIG9mIHRoaXMuYWxwaGFiZXQpIHtcbiAgICAgICAgICAgICAgICBjb250ZW50cy5wdXNoKHN0YXRlLnRvU3RyaW5nKCkgKyAnLCcgKyBsZXR0ZXIgKyAnLCcgKyBcbiAgICAgICAgICAgICAgICB0aGlzLnRyYW5zaXRpb25zW3N0YXRlXVtsZXR0ZXJdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29udGVudHMuam9pbignXFxuJyk7XG4gICAgfVxuXG4gICAgcmVhZEZyb21GaWxlKGZpbGVwYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IGNvbnRlbnRzOiBzdHJpbmcgPSByZWFkRmlsZVN5bmMoZmlsZXBhdGgsIFwidXRmOFwiKTtcbiAgICAgICAgdGhpcy5kZXNlcmlhbGl6ZShjb250ZW50cyk7IFxuICAgIH1cblxuICAgIHdyaXRlVG9GaWxlKGZpbGVwYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IGNvbnRlbnRzOiBzdHJpbmcgPSB0aGlzLnNlcmlhbGl6ZSgpO1xuICAgICAgICB3cml0ZUZpbGVTeW5jKGZpbGVwYXRoLCBjb250ZW50cyk7XG4gICAgfVxufVxuXG5jbGFzcyBEZmFFeGVjdXRpb24ge1xuICAgIGRmYSA6IERmYTtcbiAgICBjdXJyZW50U3RhdGUgOiBudW1iZXI7IFxuICAgIGlucHV0U3RyaW5nIDogc3RyaW5nO1xuICAgIGN1cnJlbnRDaGFySW5kZXggOiBudW1iZXI7XG4gICAgcGF0aDogbnVtYmVyW107IFxuXG4gICAgY29uc3RydWN0b3IoZGZhOiBEZmEsIGlucHV0U3RyaW5nOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5kZmEgPSBkZmE7XG4gICAgICAgIHRoaXMuaW5wdXRTdHJpbmcgPSBpbnB1dFN0cmluZztcbiAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgIH1cblxuICAgIGN1cnJlbnRDaGFyKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmlucHV0U3RyaW5nW3RoaXMuY3VycmVudENoYXJJbmRleF07XG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMucGF0aCA9IFt0aGlzLmRmYS5zdGFydFN0YXRlXTtcbiAgICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSB0aGlzLmRmYS5zdGFydFN0YXRlO1xuICAgICAgICB0aGlzLmN1cnJlbnRDaGFySW5kZXggPSAwO1xuICAgIH1cblxuICAgIGZpbmlzaCgpIHtcbiAgICAgICAgd2hpbGUgKHRoaXMuY3VycmVudENoYXJJbmRleCA8IHRoaXMuaW5wdXRTdHJpbmcubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnN0ZXBfZm9yd2FyZCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RlcF9mb3J3YXJkKCkge1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50Q2hhckluZGV4ID49IHRoaXMuaW5wdXRTdHJpbmcubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY3VycmVudENoYXIgOiBzdHJpbmcgPSB0aGlzLmN1cnJlbnRDaGFyKCk7XG4gICAgICAgIGxldCBuZXh0U3RhdGUgOiBudW1iZXIgPSB0aGlzLmRmYS50cmFuc2l0aW9uc1t0aGlzLmN1cnJlbnRTdGF0ZV1bY3VycmVudENoYXJdO1xuICAgICAgICB0aGlzLnBhdGgucHVzaChuZXh0U3RhdGUpO1xuICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IG5leHRTdGF0ZTtcbiAgICAgICAgdGhpcy5jdXJyZW50Q2hhckluZGV4Kys7XG4gICAgfVxuXG4gICAgc3RlcF9iYWNrd2FyZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudENoYXJJbmRleCA8PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IHRoaXMucGF0aC5wb3AoKTtcbiAgICAgICAgdGhpcy5jdXJyZW50Q2hhckluZGV4LS07XG4gICAgfVxufVxuXG5leHBvcnQge0RmYSwgRGZhRXhlY3V0aW9ufTsiLG51bGxdfQ==
