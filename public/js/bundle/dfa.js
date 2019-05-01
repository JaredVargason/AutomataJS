require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dfa_1 = require("../models/dfa");
var stateView_1 = require("../views/stateView");
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
    createTransitionSVGs();
}
var stateSpacing = 200;
function createStates() {
    var svg = document.getElementById('dfaSvg');
    var middle = dfa.numStates / 2 - .5;
    var svgWidth = svg.getBBox().width;
    var svgHeight = svg.getBBox().height;
    for (var i = 0; i < dfa.numStates; i++) {
        var startX = svgWidth / 2 + (i - middle) * stateSpacing;
        var startY = svgHeight / 2 + (i - middle) * stateSpacing;
        createStateAtPoint(i, startX, startY);
    }
}
function createState(state, event) {
    var svg = document.getElementById('dfaSvg');
    var domPoint = mouseEventToSVGCoord(svg, event);
    createStateAtPoint(state, domPoint.x, domPoint.y);
}
function createTransitionSVGs() {
    for (var state = 0; state < dfa.numStates; state++) {
        for (var _i = 0, _a = dfa.alphabet; _i < _a.length; _i++) {
            var letter = _a[_i];
            if (state != dfa.transitions[state][letter]) {
                createTransitionSVG(state, letter, dfa.transitions[state][letter]);
            }
        }
    }
}
function createTransitionSVG(fromState, letter, toState) {
    console.log(fromState, letter, toState);
    var fromStateSVG = states[fromState].el;
    var toStateSVG = states[toState].el;
    var fromPointX = fromStateSVG.x.baseVal.value;
    var fromPointY = fromStateSVG.y.baseVal.value;
    var toPointX = toStateSVG.x.baseVal.value;
    var toPointY = toStateSVG.y.baseVal.value;
    console.log(fromPointX, fromPointY, toPointX, toPointY);
    var xDiff = toPointX - fromPointX;
    var yDiff = toPointY - fromPointY;
    var angle;
    if (xDiff == 0) {
        angle = 0;
    }
    else {
        angle = Math.tan(yDiff / xDiff);
    }
    var fromPointConnectionOffsetX = Math.cos(angle) * stateRadius;
    var fromPointConnectionOffsetY = Math.sin(angle) * stateRadius;
    var toPointConnectionOffsetX = -fromPointConnectionOffsetX;
    var toPointConnectionOffsetY = -fromPointConnectionOffsetY;
    var fromPointConnectionX = fromPointConnectionOffsetX + fromPointX + stateView_1.StateView.halfStateWidth;
    var fromPointConnectionY = fromPointConnectionOffsetY + fromPointY + stateView_1.StateView.halfStateWidth;
    var toPointConnectionX = toPointConnectionOffsetX + toPointX + stateView_1.StateView.halfStateWidth;
    var toPointConnectionY = toPointConnectionOffsetY + toPointY + stateView_1.StateView.halfStateWidth;
    var transitionGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    var lineSvg = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    lineSvg.setAttributeNS(null, 'd', 'M ' + fromPointConnectionX.toString() + ' ' + fromPointConnectionY.toString()
        + ' L ' + toPointConnectionX.toString() + ' ' + toPointConnectionY.toString());
    lineSvg.setAttributeNS(null, 'stroke', 'white');
    lineSvg.setAttributeNS(null, 'stroke-width', '3');
    var dfaSvg = document.getElementById('dfaSvg');
    dfaSvg.appendChild(lineSvg);
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
var stateRadius = 40;
var strokeWidth = 4;
var halfStateWidth = (stateRadius + strokeWidth);
var stateWidth = 2 * halfStateWidth;
function createStateAtPoint(state, svgX, svgY) {
    var svg = document.getElementById('dfaSvg');
    var stateView = new stateView_1.StateView(state);
    svg.appendChild(stateView.el);
    states.push(stateView);
    stateView.setPosition(svgX, svgY);
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
        offset.x -= parseFloat(selectedElement.getAttributeNS(null, "x"));
        offset.y -= parseFloat(selectedElement.getAttributeNS(null, 'y'));
    }
    function drag(event) {
        if (selectedElement) {
            event.preventDefault();
            var domPoint = mouseEventToSVGCoord(grid, event);
            state.setAttribute('x', (domPoint.x - offset.x).toString());
            state.setAttribute('y', (domPoint.y - offset.y).toString());
        }
    }
    function endDrag(event) {
        selectedElement = null;
    }
}
function addGridEvents() {
    document.getElementById('grid').addEventListener('click', function (event) {
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
function stepForward(steps) {
    if (steps === void 0) { steps = 1; }
    for (var i = 0; i < steps; i++) {
        execution.step_forward();
    }
    populateCharacters();
    updateIndexInput();
}
function stepBackward(steps) {
    if (steps === void 0) { steps = 1; }
    for (var i = 0; i < steps; i++) {
        execution.step_backward();
    }
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
function addSaveLoadEvents() {
    document.getElementById('loadBtn').addEventListener('click', function () {
        loadDfaFromFile();
    });
    document.getElementById('loadExampleBtn').addEventListener('click', function () {
        loadDefaultDfa();
    });
    document.getElementById('clearBtn').addEventListener('click', function () {
        clearAll();
    });
}
function addTestingEvents() {
    document.getElementById('testBtn').addEventListener('click', function () {
        testString();
    });
    document.getElementById('testStringInput').addEventListener('input', function () {
        beginStepThrough();
        resultReset();
    });
    document.getElementById('clearInputBtn').addEventListener('click', function () {
        clearTesting();
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
    addCharacterButtonEvents();
}
function addCharacterButtonEvents() {
    var characterSlots = document.getElementById('characters');
    var numSlots = characterSlots.childElementCount;
    var middleIndex = Math.floor(numSlots / 2);
    var _loop_1 = function (i) {
        characterSlots.children[i].addEventListener('click', function () {
            stepBackward(middleIndex - i - 1);
        });
    };
    for (var i = 0; i < middleIndex; i++) {
        _loop_1(i);
    }
    var _loop_2 = function (i) {
        characterSlots.children[i].addEventListener('click', function () {
            stepForward(i - middleIndex);
        });
    };
    for (var i = middleIndex + 1; i < numSlots; i++) {
        _loop_2(i);
    }
}
$(document).ready(function () {
    addTestingEvents();
    addSaveLoadEvents();
    loadDefaultDfa();
});
},{"../models/dfa":3,"../views/stateView":4}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StateView = (function () {
    function StateView(state) {
        this.state = state;
        this.createElement();
    }
    StateView.prototype.createElement = function () {
        var el = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        var circleElement = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        var textElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        el.appendChild(circleElement);
        el.appendChild(textElement);
        el.setAttributeNS(null, 'width', StateView.stateWidth.toString());
        el.setAttributeNS(null, 'height', StateView.stateWidth.toString());
        el.style.position = 'absolute';
        el.classList.add('state');
        circleElement.setAttributeNS(null, 'r', StateView.stateRadius.toString());
        circleElement.style.stroke = 'black';
        circleElement.style.strokeWidth = StateView.strokeWidth.toString();
        circleElement.style.fill = 'white';
        circleElement.setAttributeNS(null, 'cx', StateView.halfStateWidth.toString());
        circleElement.setAttributeNS(null, 'cy', StateView.halfStateWidth.toString());
        circleElement.onmouseenter = function (event) {
            circleElement.style.fill = '#BBBBBB';
        };
        circleElement.onmouseleave = function (event) {
            circleElement.style.fill = '#FFFFFF';
        };
        textElement.setAttributeNS(null, 'width', '50');
        textElement.setAttributeNS(null, 'height', '50');
        textElement.setAttributeNS(null, 'x', StateView.halfStateWidth.toString());
        textElement.setAttributeNS(null, 'y', StateView.halfStateWidth.toString());
        textElement.setAttributeNS(null, 'dominant-baseline', 'middle');
        textElement.textContent = this.state.toString();
        textElement.classList.add('state-text');
        this.el = el;
        this.circleElement = circleElement;
        this.textElement = textElement;
    };
    StateView.prototype.setPosition = function (x, y) {
        this.el.setAttribute('x', x.toString());
        this.el.setAttribute('y', y.toString());
    };
    StateView.stateRadius = 40;
    StateView.strokeWidth = 4;
    StateView.halfStateWidth = StateView.stateRadius + StateView.strokeWidth;
    StateView.stateWidth = 2 * StateView.halfStateWidth;
    return StateView;
}());
exports.StateView = StateView;
},{}],3:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9mYWN0b3ItYnVuZGxlL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZnJvbnRlbmQvZGZhX2NsaWVudC50cyIsInNyYy92aWV3cy9zdGF0ZVZpZXcudHMiLCJzcmMvbW9kZWxzL2RmYS50cyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L2xpYi9fZW1wdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLHFDQUFrRDtBQUNsRCxnREFBNkM7QUFFN0MsSUFBSSxHQUFHLEdBQVEsSUFBSSxTQUFHLEVBQUUsQ0FBQztBQUN6QixJQUFJLFNBQVMsR0FBaUIsSUFBSSxDQUFDO0FBQ25DLElBQUksTUFBTSxHQUFnQixFQUFFLENBQUM7QUFFN0IsU0FBUyxnQkFBZ0I7SUFFckIsSUFBSSxRQUFRLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDMUIsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQ2xCLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztJQUNuQixJQUFJLGVBQWUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFCLElBQUksV0FBVyxHQUFHO1FBQ2QsQ0FBQyxFQUFFO1lBQ0MsR0FBRyxFQUFFLENBQUM7WUFDTixHQUFHLEVBQUUsQ0FBQztTQUNUO1FBQ0QsQ0FBQyxFQUFFO1lBQ0MsR0FBRyxFQUFFLENBQUM7WUFDTixHQUFHLEVBQUUsQ0FBQztTQUNUO1FBQ0QsQ0FBQyxFQUFFO1lBQ0MsR0FBRyxFQUFFLENBQUM7WUFDTixHQUFHLEVBQUUsQ0FBQztTQUNUO0tBQ0osQ0FBQztJQUNGLE9BQU8sSUFBSSxTQUFHLENBQUM7UUFDWCxRQUFRLFVBQUE7UUFDUixTQUFTLFdBQUE7UUFDVCxVQUFVLFlBQUE7UUFDVixlQUFlLGlCQUFBO1FBQ2YsV0FBVyxhQUFBO0tBQ2QsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQUVELFNBQVMsYUFBYTtBQUV0QixDQUFD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LElBQUksV0FBVyxHQUFZLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUM5QyxJQUFJLFNBQVMsR0FBWSxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDOUUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDMUIsSUFBSSxDQUFDLFlBQVksR0FBRyxTQUFTLENBQUM7UUFDOUIsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDNUIsQ0FBQztJQUVELG9DQUFhLEdBQWI7UUFDSSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxDQUFDLEVBQUU7WUFDNUIsT0FBTztTQUNWO1FBRUQsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQzVCLENBQUM7SUFDTCxtQkFBQztBQUFELENBakRBLEFBaURDLElBQUE7QUFqRFksb0NBQVk7O0FDckZ6QiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgeyBEZmEsIERmYUV4ZWN1dGlvbiB9IGZyb20gJy4uL21vZGVscy9kZmEnO1xuaW1wb3J0IHtTdGF0ZVZpZXd9IGZyb20gJy4uL3ZpZXdzL3N0YXRlVmlldyc7XG5cbmxldCBkZmE6IERmYSA9IG5ldyBEZmEoKTtcbmxldCBleGVjdXRpb246IERmYUV4ZWN1dGlvbiA9IG51bGw7XG5sZXQgc3RhdGVzOiBTdGF0ZVZpZXdbXSA9IFtdO1xuXG5mdW5jdGlvbiBjcmVhdGVEZWZhdWx0RGZhKCk6IERmYSB7XG4gICAgLy9FbmRzIHdpdGggXCIwMFwiIERGQVxuICAgIGxldCBhbHBoYWJldCA9IFsnMCcsICcxJ107XG4gICAgbGV0IG51bVN0YXRlcyA9IDM7XG4gICAgbGV0IHN0YXJ0U3RhdGUgPSAwO1xuICAgIGxldCBhY2NlcHRpbmdTdGF0ZXMgPSBbMl07XG4gICAgbGV0IHRyYW5zaXRpb25zID0ge1xuICAgICAgICAwOiB7XG4gICAgICAgICAgICAnMCc6IDEsXG4gICAgICAgICAgICAnMSc6IDBcbiAgICAgICAgfSxcbiAgICAgICAgMToge1xuICAgICAgICAgICAgJzAnOiAyLFxuICAgICAgICAgICAgJzEnOiAwXG4gICAgICAgIH0sXG4gICAgICAgIDI6IHtcbiAgICAgICAgICAgICcwJzogMixcbiAgICAgICAgICAgICcxJzogMFxuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gbmV3IERmYSh7XG4gICAgICAgIGFscGhhYmV0LFxuICAgICAgICBudW1TdGF0ZXMsXG4gICAgICAgIHN0YXJ0U3RhdGUsXG4gICAgICAgIGFjY2VwdGluZ1N0YXRlcyxcbiAgICAgICAgdHJhbnNpdGlvbnNcbiAgICB9KTsgXG59XG5cbmZ1bmN0aW9uIHNhdmVEZmFUb0ZpbGUoKSB7XG5cbn1cblxuZnVuY3Rpb24gbG9hZERmYUZyb21GaWxlKCkge1xuICAgIHZhciBpbnB1dCA6IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGZhRmlsZScpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgaWYgKGlucHV0LmZpbGVzLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgIGxldCByZWFkZXI6IEZpbGVSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZGZhLmRlc2VyaWFsaXplKHJlYWRlci5yZXN1bHQgYXMgc3RyaW5nKTtcbiAgICAgICAgICAgIGxvYWREZmEoZGZhKTsgXG4gICAgICAgIH1cbiAgICAgICAgcmVhZGVyLnJlYWRBc1RleHQoaW5wdXQuZmlsZXNbMF0pO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gbG9hZERmYShuZXdEZmE6IERmYSkge1xuICAgIGNsZWFyQWxsKCk7XG4gICAgZGZhID0gbmV3RGZhO1xuICAgIHVwZGF0ZVBhbmVsKCk7XG4gICAgdXBkYXRlU1ZHKCk7XG59XG5cbi8vUGFuZWwgZnVuY3Rpb25zXG5mdW5jdGlvbiB1cGRhdGVQYW5lbCgpIHtcbiAgICB1cGRhdGVBbHBoYWJldCgpO1xuICAgIHVwZGF0ZU51bVN0YXRlcygpO1xuICAgIHVwZGF0ZVN0YXJ0U3RhdGUoKTtcbiAgICB1cGRhdGVBY2NlcHRTdGF0ZXMoKTtcbiAgICB1cGRhdGVUcmFuc2l0aW9ucygpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVBbHBoYWJldCgpIHtcbiAgICBsZXQgYWxwaGFiZXRJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhbHBoYWJldElucHV0JykgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICBhbHBoYWJldElucHV0LnZhbHVlID0gZGZhLmFscGhhYmV0LmpvaW4oJywnKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlTnVtU3RhdGVzKCkge1xuICAgIGxldCBudW1TdGF0ZXNJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdudW1TdGF0ZXNJbnB1dCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgbnVtU3RhdGVzSW5wdXQudmFsdWUgPSBkZmEubnVtU3RhdGVzLnRvU3RyaW5nKCk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVN0YXJ0U3RhdGUoKSB7XG4gICAgbGV0IHN0YXJ0U3RhdGVJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGFydFN0YXRlSW5wdXQnKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgIHN0YXJ0U3RhdGVJbnB1dC52YWx1ZSA9IGRmYS5zdGFydFN0YXRlLnRvU3RyaW5nKCk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUFjY2VwdFN0YXRlcygpIHtcbiAgICBsZXQgYWNjZXB0aW5nU3RhdGVzSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWNjZXB0aW5nU3RhdGVzSW5wdXQnKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgIGFjY2VwdGluZ1N0YXRlc0lucHV0LnZhbHVlID0gZGZhLmFjY2VwdGluZ1N0YXRlcy5qb2luKCcsJyk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVRyYW5zaXRpb25zKCkge1xuICAgIGNsZWFyVHJhbnNpdGlvbnNMaXN0KCk7XG4gICAgZm9yIChsZXQgZnJvbVN0YXRlID0gMDsgZnJvbVN0YXRlIDwgZGZhLm51bVN0YXRlczsgZnJvbVN0YXRlKyspIHtcbiAgICAgICAgZm9yIChsZXQgbGV0dGVyIG9mIGRmYS5hbHBoYWJldCkge1xuICAgICAgICAgICAgYWRkVHJhbnNpdGlvbihmcm9tU3RhdGUsIGxldHRlciwgZGZhLnRyYW5zaXRpb25zW2Zyb21TdGF0ZV1bbGV0dGVyXSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNsZWFyVHJhbnNpdGlvbnNMaXN0KCkge1xuICAgIGxldCB0cmFuc2l0aW9uc0xpc3QgOiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJhbnNpdGlvbnNMaXN0XCIpO1xuICAgIHdoaWxlICh0cmFuc2l0aW9uc0xpc3QuZmlyc3RDaGlsZCkge1xuICAgICAgICB0cmFuc2l0aW9uc0xpc3QucmVtb3ZlQ2hpbGQodHJhbnNpdGlvbnNMaXN0LmZpcnN0Q2hpbGQpO1xuICAgIH0gXG59XG5cbmZ1bmN0aW9uIGFkZFRyYW5zaXRpb24oZnJvbVN0YXRlOiBudW1iZXIsIGxldHRlcjogc3RyaW5nLCB0b1N0YXRlOiBudW1iZXIpIHtcbiAgICBsZXQgdHJhbnNpdGlvbkxpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHJhbnNpdGlvbnNMaXN0Jyk7XG4gICAgbGV0IHRleHQgPSBmcm9tU3RhdGUudG9TdHJpbmcoKSArICcgKyAnICsgbGV0dGVyICsgJyAmcmFycjsnXG4gICAgbGV0IGxpc3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICBsaXN0RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdsaXN0LWdyb3VwLWl0ZW0nKTtcblxuICAgIGxldCBsaXN0SXRlbVN0cmluZyA9IFxuICAgICc8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIj5cXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwLXByZXBlbmRcIj5cXFxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaW5wdXQtZ3JvdXAtdGV4dFwiPicgKyB0ZXh0ICsgJzwvc3Bhbj5cXFxuICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBwbGFjZWhvbGRlcj1cIlFcIiB2YWx1ZT1cIicgKyB0b1N0YXRlICsgJ1wiPlxcXG4gICAgICAgIDwvZGl2Pic7XG4gICAgbGlzdEVsZW1lbnQuaW5uZXJIVE1MID0gbGlzdEl0ZW1TdHJpbmc7XG4gICAgdHJhbnNpdGlvbkxpc3QuYXBwZW5kQ2hpbGQobGlzdEVsZW1lbnQpO1xufVxuXG4vL1NWR1xuZnVuY3Rpb24gdXBkYXRlU1ZHKCkge1xuICAgIGNyZWF0ZVN0YXRlcygpOyBcbiAgICBjcmVhdGVUcmFuc2l0aW9uU1ZHcygpO1xufVxuXG5sZXQgc3RhdGVTcGFjaW5nOiBudW1iZXIgPSAyMDA7XG5mdW5jdGlvbiBjcmVhdGVTdGF0ZXMoKSB7XG4gICAgbGV0IHN2ZyA9IDxTVkdTVkdFbGVtZW50Pjxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RmYVN2ZycpO1xuICAgIGxldCBtaWRkbGUgPSBkZmEubnVtU3RhdGVzIC8gMiAtIC41O1xuICAgIGxldCBzdmdXaWR0aCA9IHN2Zy5nZXRCQm94KCkud2lkdGg7XG4gICAgbGV0IHN2Z0hlaWdodCA9IHN2Zy5nZXRCQm94KCkuaGVpZ2h0O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGZhLm51bVN0YXRlczsgaSsrKSB7XG4gICAgICAgIGxldCBzdGFydFggPSBzdmdXaWR0aCAvIDIgKyAoaSAtIG1pZGRsZSkgKiBzdGF0ZVNwYWNpbmc7XG4gICAgICAgIGxldCBzdGFydFkgPSBzdmdIZWlnaHQgLyAyICsgKGkgLSBtaWRkbGUpICogc3RhdGVTcGFjaW5nO1xuICAgICAgICBjcmVhdGVTdGF0ZUF0UG9pbnQoaSwgc3RhcnRYLCBzdGFydFkpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlU3RhdGUoc3RhdGU6IG51bWJlciwgZXZlbnQgOiBNb3VzZUV2ZW50KSB7XG4gICAgdmFyIHN2ZyA6IFNWR1NWR0VsZW1lbnQgPSA8U1ZHU1ZHRWxlbWVudD48YW55PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZmFTdmcnKTtcbiAgICBsZXQgZG9tUG9pbnQgPSBtb3VzZUV2ZW50VG9TVkdDb29yZChzdmcsIGV2ZW50KTtcbiAgICBjcmVhdGVTdGF0ZUF0UG9pbnQoc3RhdGUsIGRvbVBvaW50LngsIGRvbVBvaW50LnkpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVUcmFuc2l0aW9uU1ZHcygpIHtcbiAgICBmb3IgKGxldCBzdGF0ZSA9IDA7IHN0YXRlIDwgZGZhLm51bVN0YXRlczsgc3RhdGUrKykge1xuICAgICAgICBmb3IgKGxldCBsZXR0ZXIgb2YgZGZhLmFscGhhYmV0KSB7XG4gICAgICAgICAgICBpZiAoc3RhdGUgIT0gZGZhLnRyYW5zaXRpb25zW3N0YXRlXVtsZXR0ZXJdKSB7XG4gICAgICAgICAgICAgICAgY3JlYXRlVHJhbnNpdGlvblNWRyhzdGF0ZSwgbGV0dGVyLCBkZmEudHJhbnNpdGlvbnNbc3RhdGVdW2xldHRlcl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVUcmFuc2l0aW9uU1ZHKGZyb21TdGF0ZTogbnVtYmVyLCBsZXR0ZXI6IHN0cmluZywgdG9TdGF0ZTogbnVtYmVyKSB7XG4gICAgY29uc29sZS5sb2coZnJvbVN0YXRlLCBsZXR0ZXIsIHRvU3RhdGUpO1xuICAgIGxldCBmcm9tU3RhdGVTVkcgPSBzdGF0ZXNbZnJvbVN0YXRlXS5lbDtcbiAgICBsZXQgdG9TdGF0ZVNWRyA9IHN0YXRlc1t0b1N0YXRlXS5lbDtcblxuICAgIGxldCBmcm9tUG9pbnRYOiBudW1iZXIgPSBmcm9tU3RhdGVTVkcueC5iYXNlVmFsLnZhbHVlOyAvL3BhcnNlSW50KGZyb21TdGF0ZVNWRy5nZXRBdHRyaWJ1dGVOUyhudWxsLCAneCcpKTtcbiAgICBsZXQgZnJvbVBvaW50WTogbnVtYmVyID0gZnJvbVN0YXRlU1ZHLnkuYmFzZVZhbC52YWx1ZTsgLy9wYXJzZUludChmcm9tU3RhdGVTVkcuZ2V0QXR0cmlidXRlTlMobnVsbCwgJ3knKSk7IFxuXG4gICAgbGV0IHRvUG9pbnRYOiBudW1iZXIgPSB0b1N0YXRlU1ZHLnguYmFzZVZhbC52YWx1ZTsgLy9wYXJzZUludCh0b1N0YXRlU1ZHLmdldEF0dHJpYnV0ZU5TKG51bGwsICd4JykpO1xuICAgIGxldCB0b1BvaW50WTogbnVtYmVyID0gdG9TdGF0ZVNWRy55LmJhc2VWYWwudmFsdWU7IC8vcGFyc2VJbnQodG9TdGF0ZVNWRy5nZXRBdHRyaWJ1dGVOUyhudWxsLCAneScpKTtcbiAgICBjb25zb2xlLmxvZyhmcm9tUG9pbnRYLCBmcm9tUG9pbnRZLCB0b1BvaW50WCwgdG9Qb2ludFkpO1xuXG4gICAgLy9nZXQgYW5nbGUgYmV0d2VlbiBub2Rlcy5cbiAgICBsZXQgeERpZmYgPSB0b1BvaW50WCAtIGZyb21Qb2ludFg7XG4gICAgbGV0IHlEaWZmID0gdG9Qb2ludFkgLSBmcm9tUG9pbnRZO1xuXG4gICAgbGV0IGFuZ2xlOiBudW1iZXI7XG4gICAgaWYgKHhEaWZmID09IDApIHtcbiAgICAgICAgYW5nbGUgPSAwO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgYW5nbGUgPSBNYXRoLnRhbih5RGlmZi94RGlmZik7XG4gICAgfVxuICAgIGxldCBmcm9tUG9pbnRDb25uZWN0aW9uT2Zmc2V0WCA9IE1hdGguY29zKGFuZ2xlKSAqIHN0YXRlUmFkaXVzO1xuICAgIGxldCBmcm9tUG9pbnRDb25uZWN0aW9uT2Zmc2V0WSA9IE1hdGguc2luKGFuZ2xlKSAqIHN0YXRlUmFkaXVzO1xuXG4gICAgbGV0IHRvUG9pbnRDb25uZWN0aW9uT2Zmc2V0WCA9IC1mcm9tUG9pbnRDb25uZWN0aW9uT2Zmc2V0WDtcbiAgICBsZXQgdG9Qb2ludENvbm5lY3Rpb25PZmZzZXRZID0gLWZyb21Qb2ludENvbm5lY3Rpb25PZmZzZXRZO1xuXG4gICAgbGV0IGZyb21Qb2ludENvbm5lY3Rpb25YID0gZnJvbVBvaW50Q29ubmVjdGlvbk9mZnNldFggKyBmcm9tUG9pbnRYICsgU3RhdGVWaWV3LmhhbGZTdGF0ZVdpZHRoO1xuICAgIGxldCBmcm9tUG9pbnRDb25uZWN0aW9uWSA9IGZyb21Qb2ludENvbm5lY3Rpb25PZmZzZXRZICsgZnJvbVBvaW50WSArIFN0YXRlVmlldy5oYWxmU3RhdGVXaWR0aDtcbiAgICBsZXQgdG9Qb2ludENvbm5lY3Rpb25YID0gdG9Qb2ludENvbm5lY3Rpb25PZmZzZXRYICsgdG9Qb2ludFggKyBTdGF0ZVZpZXcuaGFsZlN0YXRlV2lkdGg7XG4gICAgbGV0IHRvUG9pbnRDb25uZWN0aW9uWSA9IHRvUG9pbnRDb25uZWN0aW9uT2Zmc2V0WSArIHRvUG9pbnRZICsgU3RhdGVWaWV3LmhhbGZTdGF0ZVdpZHRoO1xuXG4gICAgbGV0IHRyYW5zaXRpb25Hcm91cDogU1ZHR0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ2cnKTtcbiAgICBsZXQgbGluZVN2ZzogU1ZHUGF0aEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3BhdGgnKTsgXG4gICAgbGluZVN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZCcsICdNICcgKyBmcm9tUG9pbnRDb25uZWN0aW9uWC50b1N0cmluZygpICsgJyAnICsgZnJvbVBvaW50Q29ubmVjdGlvblkudG9TdHJpbmcoKVxuICAgICAgICArICcgTCAnICsgdG9Qb2ludENvbm5lY3Rpb25YLnRvU3RyaW5nKCkgKyAnICcgKyB0b1BvaW50Q29ubmVjdGlvblkudG9TdHJpbmcoKSk7XG4gICAgbGluZVN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlJywgJ3doaXRlJyk7IFxuICAgIGxpbmVTdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZS13aWR0aCcsICczJyk7XG4gICAgbGV0IGRmYVN2ZzogU1ZHU1ZHRWxlbWVudCA9IDxTVkdTVkdFbGVtZW50Pjxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RmYVN2ZycpO1xuICAgIGRmYVN2Zy5hcHBlbmRDaGlsZChsaW5lU3ZnKTtcbn1cblxuZnVuY3Rpb24gbW91c2VFdmVudFRvU1ZHQ29vcmQoc3ZnOiBTVkdTVkdFbGVtZW50LCBtb3VzZUV2ZW50OiBNb3VzZUV2ZW50KTogRE9NUG9pbnQge1xuICAgIHJldHVybiB0b1N2Z0Nvb3JkKHN2ZywgbW91c2VFdmVudC54LCBtb3VzZUV2ZW50LnkpO1xufVxuXG5mdW5jdGlvbiB0b1N2Z0Nvb3JkKHN2ZzpTVkdTVkdFbGVtZW50LCB4OiBudW1iZXIsIHk6IG51bWJlcik6IERPTVBvaW50IHtcbiAgICBsZXQgcG9pbnQgOiBTVkdQb2ludCA9IHN2Zy5jcmVhdGVTVkdQb2ludCgpO1xuICAgIHBvaW50LnggPSB4O1xuICAgIHBvaW50LnkgPSB5O1xuICAgIFxuICAgIHJldHVybiBwb2ludC5tYXRyaXhUcmFuc2Zvcm0oc3ZnLmdldFNjcmVlbkNUTSgpLmludmVyc2UoKSk7XG59XG5cbmZ1bmN0aW9uIGNsZWFyQWxsKCkge1xuICAgIGNsZWFyRGVmaW5pdGlvbigpO1xuICAgIGNsZWFyVGVzdGluZygpO1xuICAgIGNsZWFyU3ZnKCk7XG59XG5cbmZ1bmN0aW9uIGNsZWFyRGVmaW5pdGlvbigpIHtcbiAgICBsZXQgYWxwaGFiZXRJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhbHBoYWJldElucHV0JykgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICBhbHBoYWJldElucHV0LnZhbHVlID0gJyc7XG5cbiAgICBsZXQgbnVtU3RhdGVzSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbnVtU3RhdGVzSW5wdXQnKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgIG51bVN0YXRlc0lucHV0LnZhbHVlID0gJyc7XG5cbiAgICBsZXQgc3RhcnRTdGF0ZUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXJ0U3RhdGVJbnB1dCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgc3RhcnRTdGF0ZUlucHV0LnZhbHVlID0gJyc7XG5cbiAgICBsZXQgYWNjZXB0aW5nU3RhdGVzSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWNjZXB0aW5nU3RhdGVzSW5wdXQnKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgIGFjY2VwdGluZ1N0YXRlc0lucHV0LnZhbHVlID0gJyc7XG5cbiAgICBjbGVhclRyYW5zaXRpb25zTGlzdCgpO1xufVxuXG5mdW5jdGlvbiBjbGVhclN2ZygpIHtcbiAgICBjbGVhclN0YXRlcygpO1xuICAgIGNsZWFyVHJhbnNpdGlvbnMoKTtcbn1cblxuZnVuY3Rpb24gY2xlYXJTdGF0ZXMoKSB7XG4gICAgbGV0IGVsZW1lbnRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc3RhdGUnKTtcbiAgICBmb3IgKGxldCBpID0gZWxlbWVudHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgZWxlbWVudHNbaV0ucmVtb3ZlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjbGVhclRyYW5zaXRpb25zKCkge1xuICAgIGxldCB0cmFuc2l0aW9uTGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0cmFuc2l0aW9uc0xpc3QnKTtcbiAgICBsZXQgY2hpbGROb2RlcyA9IHRyYW5zaXRpb25MaXN0LmNoaWxkTm9kZXM7XG4gICAgZm9yIChsZXQgaSA9IGNoaWxkTm9kZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgbGV0IGNoaWxkID0gY2hpbGROb2Rlc1tpXTtcbiAgICAgICAgY2hpbGQucmVtb3ZlKCk7XG4gICAgfVxufVxuXG5sZXQgc3RhdGVSYWRpdXMgPSA0MDtcbmxldCBzdHJva2VXaWR0aCA9IDQ7XG5sZXQgaGFsZlN0YXRlV2lkdGggPSAoc3RhdGVSYWRpdXMgKyBzdHJva2VXaWR0aCk7XG5sZXQgc3RhdGVXaWR0aCA9IDIgKiBoYWxmU3RhdGVXaWR0aDtcbmZ1bmN0aW9uIGNyZWF0ZVN0YXRlQXRQb2ludChzdGF0ZTogbnVtYmVyLCBzdmdYOiBudW1iZXIsIHN2Z1k6IG51bWJlcikge1xuICAgIGxldCBzdmc6IFNWR1NWR0VsZW1lbnQgPSA8U1ZHU1ZHRWxlbWVudD48YW55PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZmFTdmcnKTtcbiAgICBsZXQgc3RhdGVWaWV3ID0gbmV3IFN0YXRlVmlldyhzdGF0ZSk7XG4gICAgc3ZnLmFwcGVuZENoaWxkKHN0YXRlVmlldy5lbCk7XG4gICAgc3RhdGVzLnB1c2goc3RhdGVWaWV3KTtcbiAgICBzdGF0ZVZpZXcuc2V0UG9zaXRpb24oc3ZnWCwgc3ZnWSk7XG59XG5cbmZ1bmN0aW9uIGFkZERyYWcoc3RhdGU6IFNWR1NWR0VsZW1lbnQsIGdyaWQ6IFNWR1NWR0VsZW1lbnQpIHtcbiAgICBsZXQgc2VsZWN0ZWRFbGVtZW50OiBTVkdTVkdFbGVtZW50ID0gbnVsbDtcbiAgICBsZXQgb2Zmc2V0IDogRE9NUG9pbnQ7XG5cbiAgICBzdGF0ZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBzdGFydERyYWcpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGRyYWcpO1xuICAgIHN0YXRlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBlbmREcmFnKTtcblxuICAgIGZ1bmN0aW9uIHN0YXJ0RHJhZyhldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICBzZWxlY3RlZEVsZW1lbnQgPSBzdGF0ZTtcbiAgICAgICAgb2Zmc2V0ID0gbW91c2VFdmVudFRvU1ZHQ29vcmQoZ3JpZCwgZXZlbnQpO1xuICAgICAgICBvZmZzZXQueCAtPSBwYXJzZUZsb2F0KHNlbGVjdGVkRWxlbWVudC5nZXRBdHRyaWJ1dGVOUyhudWxsLCBcInhcIikpO1xuICAgICAgICBvZmZzZXQueSAtPSBwYXJzZUZsb2F0KHNlbGVjdGVkRWxlbWVudC5nZXRBdHRyaWJ1dGVOUyhudWxsLCAneScpKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZHJhZyhldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICBpZiAoc2VsZWN0ZWRFbGVtZW50KSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgbGV0IGRvbVBvaW50OiBET01Qb2ludCA9IG1vdXNlRXZlbnRUb1NWR0Nvb3JkKGdyaWQsIGV2ZW50KTtcbiAgICAgICAgICAgIHN0YXRlLnNldEF0dHJpYnV0ZSgneCcsIChkb21Qb2ludC54IC0gb2Zmc2V0LngpLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgc3RhdGUuc2V0QXR0cmlidXRlKCd5JywgKGRvbVBvaW50LnkgLSBvZmZzZXQueSkudG9TdHJpbmcoKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlbmREcmFnKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgIHNlbGVjdGVkRWxlbWVudCA9IG51bGw7XG4gICAgfVxufVxuXG5cblxuZnVuY3Rpb24gYWRkR3JpZEV2ZW50cygpIHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JpZCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgLy9jcmVhdGVTdGF0ZShldmVudCk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGxvYWREZWZhdWx0RGZhKCkge1xuICAgIGxvYWREZmEoY3JlYXRlRGVmYXVsdERmYSgpKTtcbn1cblxuLy9TdHJpbmcgdGVzdGluZ1xuZnVuY3Rpb24gdGVzdFN0cmluZygpIHtcbiAgICBsZXQgaW5wdXRFbGVtZW50ID0gPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rlc3RTdHJpbmdJbnB1dCcpO1xuICAgIGxldCBpbnB1dFN0cmluZyA6IHN0cmluZyA9IGlucHV0RWxlbWVudC52YWx1ZTtcbiAgICBsZXQgcmVzdWx0IDogYm9vbGVhbiA9IGRmYS5hY2NlcHRzU3RyaW5nKGlucHV0U3RyaW5nKTtcbiAgICByZXN1bHQgPyByZXN1bHRTdWNjZXNzKGlucHV0U3RyaW5nKSA6IHJlc3VsdEZhaWwoaW5wdXRTdHJpbmcpO1xufVxuXG5mdW5jdGlvbiBjbGVhcklucHV0KCkge1xuICAgIGxldCBpbnB1dEVsZW1lbnQgPSA8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGVzdFN0cmluZ0lucHV0Jyk7XG4gICAgaW5wdXRFbGVtZW50LnZhbHVlID0gJyc7XG59XG5cbmZ1bmN0aW9uIHJlc3VsdFN1Y2Nlc3MoaW5wdXRTdHJpbmcgOiBzdHJpbmcpIHtcbiAgICBsZXQgcmVzdWx0RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN1bHRCYXInKTtcbiAgICByZXN1bHRFbGVtZW50LnN0eWxlLmJhY2tncm91bmQgPSAnZ3JlZW4nO1xuICAgIGxldCByZXN1bHRUZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3VsdFRleHQnKTtcbiAgICByZXN1bHRUZXh0LmlubmVyVGV4dCA9ICdcIicgKyBpbnB1dFN0cmluZyArICdcIiB5aWVsZHMgU1VDQ0VTUyc7XG59XG5cbmZ1bmN0aW9uIHJlc3VsdEZhaWwoaW5wdXRTdHJpbmcgOiBzdHJpbmcpIHtcbiAgICBsZXQgcmVzdWx0RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN1bHRCYXInKTtcbiAgICByZXN1bHRFbGVtZW50LnN0eWxlLmJhY2tncm91bmQgPSAncmVkJztcbiAgICBsZXQgcmVzdWx0VGV4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN1bHRUZXh0Jyk7XG4gICAgcmVzdWx0VGV4dC5pbm5lclRleHQgPSAnXCInICsgaW5wdXRTdHJpbmcgKyAnXCIgeWllbGRzIEZBSUwnO1xufVxuXG5mdW5jdGlvbiByZXN1bHRSZXNldCgpIHtcbiAgICBsZXQgcmVzdWx0RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN1bHRCYXInKTtcbiAgICByZXN1bHRFbGVtZW50LnN0eWxlLmJhY2tncm91bmQgPSAnIzQ0NDQ0NCc7XG4gICAgbGV0IHJlc3VsdFRleHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdWx0VGV4dCcpO1xuICAgIHJlc3VsdFRleHQuaW5uZXJUZXh0ID0gJ1Jlc3VsdCc7XG59XG5cbi8vU3RlcCB0aHJvdWdoIHRlc3RpbmdcbmZ1bmN0aW9uIGJlZ2luU3RlcFRocm91Z2goKSB7XG4gICAgbGV0IGlucHV0RWxlbWVudCA9IDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZXN0U3RyaW5nSW5wdXQnKTtcbiAgICBleGVjdXRpb24gPSBkZmEuZ2V0RXhlY3V0aW9uKGlucHV0RWxlbWVudC52YWx1ZSk7XG4gICAgcG9wdWxhdGVDaGFyYWN0ZXJzKCk7XG59XG5cbmZ1bmN0aW9uIGNsZWFyVGVzdGluZygpIHtcbiAgICBjbGVhcklucHV0KCk7XG4gICAgcmVzdWx0UmVzZXQoKTtcbiAgICBleGVjdXRpb24gPSBkZmEuZ2V0RXhlY3V0aW9uKCcnKTtcbiAgICBwb3B1bGF0ZUNoYXJhY3RlcnMoKTtcbn1cblxuZnVuY3Rpb24gc3RlcEZvcndhcmQoc3RlcHM6IG51bWJlciA9IDEpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ZXBzOyBpKyspIHtcbiAgICAgICAgZXhlY3V0aW9uLnN0ZXBfZm9yd2FyZCgpO1xuICAgIH1cbiAgICBwb3B1bGF0ZUNoYXJhY3RlcnMoKTtcbiAgICB1cGRhdGVJbmRleElucHV0KCk7XG59XG5cbmZ1bmN0aW9uIHN0ZXBCYWNrd2FyZChzdGVwczogbnVtYmVyID0gMSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RlcHM7IGkrKykge1xuICAgICAgICBleGVjdXRpb24uc3RlcF9iYWNrd2FyZCgpO1xuICAgIH1cbiAgICBleGVjdXRpb24uc3RlcF9iYWNrd2FyZCgpO1xuICAgIHBvcHVsYXRlQ2hhcmFjdGVycygpO1xuICAgIHVwZGF0ZUluZGV4SW5wdXQoKTtcbn1cblxuZnVuY3Rpb24gcmVzZXRTdGVwVGhyb3VnaCgpIHtcbiAgICBleGVjdXRpb24ucmVzZXQoKTtcbiAgICBwb3B1bGF0ZUNoYXJhY3RlcnMoKTtcbiAgICB1cGRhdGVJbmRleElucHV0KCk7XG59XG5cbmZ1bmN0aW9uIGZpbmlzaFN0ZXBUaHJvdWdoKCkge1xuICAgIGV4ZWN1dGlvbi5maW5pc2goKTtcbiAgICBwb3B1bGF0ZUNoYXJhY3RlcnMoKTtcbiAgICB1cGRhdGVJbmRleElucHV0KCk7XG59XG5cbmZ1bmN0aW9uIHBvcHVsYXRlQ2hhcmFjdGVycygpIHtcbiAgICBsZXQgY2hhcmFjdGVyU2xvdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2hhcmFjdGVycycpO1xuICAgIGxldCBudW1TbG90cyA9IGNoYXJhY3RlclNsb3RzLmNoaWxkRWxlbWVudENvdW50O1xuICAgIGxldCBtaWRkbGVJbmRleCA9IE1hdGguZmxvb3IobnVtU2xvdHMgLyAyKTtcbiAgICBsZXQgZmlyc3RDaGFySW5kZXggPSBtaWRkbGVJbmRleCAtIGV4ZWN1dGlvbi5jdXJyZW50Q2hhckluZGV4XG4gICAgbGV0IGxhc3RDaGFySW5kZXggPSBmaXJzdENoYXJJbmRleCArIGV4ZWN1dGlvbi5pbnB1dFN0cmluZy5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1TbG90czsgaSsrKSB7XG4gICAgICAgIGlmIChpID49IGZpcnN0Q2hhckluZGV4ICYmIGkgPCBsYXN0Q2hhckluZGV4KSB7XG4gICAgICAgICAgICBjaGFyYWN0ZXJTbG90cy5jaGlsZHJlbltpXS50ZXh0Q29udGVudCA9IGV4ZWN1dGlvbi5pbnB1dFN0cmluZ1tpIC0gZmlyc3RDaGFySW5kZXhdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY2hhcmFjdGVyU2xvdHMuY2hpbGRyZW5baV0udGV4dENvbnRlbnQgPSAnJztcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlSW5kZXhJbnB1dCgpIHtcbiAgICBsZXQgaW5kZXhJbnB1dCA9IDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbmRleElucHV0Jyk7XG4gICAgaW5kZXhJbnB1dC52YWx1ZSA9IGV4ZWN1dGlvbi5jdXJyZW50Q2hhckluZGV4LnRvU3RyaW5nKCk7XG59XG5cbmZ1bmN0aW9uIGFkZFNhdmVMb2FkRXZlbnRzKCkge1xuICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvYWRCdG4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBsb2FkRGZhRnJvbUZpbGUoKTtcbiAgICB9KTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hZEV4YW1wbGVCdG4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBsb2FkRGVmYXVsdERmYSgpO1xuICAgIH0pO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbGVhckJ0bicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNsZWFyQWxsKCk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGFkZFRlc3RpbmdFdmVudHMoKSB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rlc3RCdG4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICB0ZXN0U3RyaW5nKCk7XG4gICAgfSk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rlc3RTdHJpbmdJbnB1dCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGJlZ2luU3RlcFRocm91Z2goKTtcbiAgICAgICAgcmVzdWx0UmVzZXQoKTtcbiAgICB9KTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xlYXJJbnB1dEJ0bicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNsZWFyVGVzdGluZygpO1xuICAgIH0pO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmb3J3YXJkQnRuJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgc3RlcEZvcndhcmQoKTtcbiAgICB9KTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFja0J0bicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHN0ZXBCYWNrd2FyZCgpO1xuICAgIH0pO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXNldEJ0bicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKXtcbiAgICAgICAgcmVzZXRTdGVwVGhyb3VnaCgpO1xuICAgIH0pO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaW5pc2hCdG4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBmaW5pc2hTdGVwVGhyb3VnaCgpO1xuICAgIH0pO1xuICAgIGFkZENoYXJhY3RlckJ1dHRvbkV2ZW50cygpO1xufVxuXG5mdW5jdGlvbiBhZGRDaGFyYWN0ZXJCdXR0b25FdmVudHMoKSB7XG4gICAgbGV0IGNoYXJhY3RlclNsb3RzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NoYXJhY3RlcnMnKTtcbiAgICBsZXQgbnVtU2xvdHMgPSBjaGFyYWN0ZXJTbG90cy5jaGlsZEVsZW1lbnRDb3VudDtcbiAgICBsZXQgbWlkZGxlSW5kZXggPSBNYXRoLmZsb29yKG51bVNsb3RzIC8gMik7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1pZGRsZUluZGV4OyBpKyspIHtcbiAgICAgICAgY2hhcmFjdGVyU2xvdHMuY2hpbGRyZW5baV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHN0ZXBCYWNrd2FyZChtaWRkbGVJbmRleCAtIGkgLSAxKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSBtaWRkbGVJbmRleCArIDE7IGkgPCBudW1TbG90czsgaSsrKSB7XG4gICAgICAgIGNoYXJhY3RlclNsb3RzLmNoaWxkcmVuW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzdGVwRm9yd2FyZChpIC0gbWlkZGxlSW5kZXgpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgIC8vYWRkR3JpZEV2ZW50cygpO1xuICAgIGFkZFRlc3RpbmdFdmVudHMoKTtcbiAgICBhZGRTYXZlTG9hZEV2ZW50cygpO1xuICAgIGxvYWREZWZhdWx0RGZhKCk7XG59KTtcbiIsImV4cG9ydCBjbGFzcyBTdGF0ZVZpZXcge1xuXG4gICAgc3RhdGljIHN0YXRlUmFkaXVzID0gNDA7XG4gICAgc3RhdGljIHN0cm9rZVdpZHRoID0gNDtcbiAgICBzdGF0aWMgaGFsZlN0YXRlV2lkdGggPSBTdGF0ZVZpZXcuc3RhdGVSYWRpdXMgKyBTdGF0ZVZpZXcuc3Ryb2tlV2lkdGg7XG4gICAgc3RhdGljIHN0YXRlV2lkdGggPSAyICogU3RhdGVWaWV3LmhhbGZTdGF0ZVdpZHRoO1xuXG4gICAgc3RhdGU6IG51bWJlcjtcbiAgICBlbDogU1ZHU1ZHRWxlbWVudDtcbiAgICBjaXJjbGVFbGVtZW50OiBTVkdDaXJjbGVFbGVtZW50O1xuICAgIHRleHRFbGVtZW50OiBTVkdUZXh0RWxlbWVudDtcblxuICAgIGNvbnN0cnVjdG9yKHN0YXRlOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICAgICAgICB0aGlzLmNyZWF0ZUVsZW1lbnQoKTsgXG4gICAgfVxuXG4gICAgY3JlYXRlRWxlbWVudCgpIHtcbiAgICAgICAgbGV0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgJ3N2ZycpO1xuICAgICAgICBsZXQgY2lyY2xlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsJ2NpcmNsZScpOyBcbiAgICAgICAgbGV0IHRleHRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgJ3RleHQnKTtcbiAgICAgICAgZWwuYXBwZW5kQ2hpbGQoY2lyY2xlRWxlbWVudCk7XG4gICAgICAgIGVsLmFwcGVuZENoaWxkKHRleHRFbGVtZW50KTtcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgU3RhdGVWaWV3LnN0YXRlV2lkdGgudG9TdHJpbmcoKSk7XG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBTdGF0ZVZpZXcuc3RhdGVXaWR0aC50b1N0cmluZygpKTtcbiAgICAgICAgZWwuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCdzdGF0ZScpO1xuXG4gICAgICAgIGNpcmNsZUVsZW1lbnQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3InLCBTdGF0ZVZpZXcuc3RhdGVSYWRpdXMudG9TdHJpbmcoKSk7XG4gICAgICAgIGNpcmNsZUVsZW1lbnQuc3R5bGUuc3Ryb2tlID0gJ2JsYWNrJztcbiAgICAgICAgY2lyY2xlRWxlbWVudC5zdHlsZS5zdHJva2VXaWR0aCA9IFN0YXRlVmlldy5zdHJva2VXaWR0aC50b1N0cmluZygpO1xuICAgICAgICBjaXJjbGVFbGVtZW50LnN0eWxlLmZpbGwgPSAnd2hpdGUnO1xuICAgICAgICBjaXJjbGVFbGVtZW50LnNldEF0dHJpYnV0ZU5TKG51bGwsICdjeCcsIFN0YXRlVmlldy5oYWxmU3RhdGVXaWR0aC50b1N0cmluZygpKTtcbiAgICAgICAgY2lyY2xlRWxlbWVudC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnY3knLCBTdGF0ZVZpZXcuaGFsZlN0YXRlV2lkdGgudG9TdHJpbmcoKSk7XG5cbiAgICAgICAgY2lyY2xlRWxlbWVudC5vbm1vdXNlZW50ZXIgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgY2lyY2xlRWxlbWVudC5zdHlsZS5maWxsID0gJyNCQkJCQkInO1xuICAgICAgICB9IFxuICAgICAgICBjaXJjbGVFbGVtZW50Lm9ubW91c2VsZWF2ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBjaXJjbGVFbGVtZW50LnN0eWxlLmZpbGwgPSAnI0ZGRkZGRic7XG4gICAgICAgIH1cblxuICAgICAgICB0ZXh0RWxlbWVudC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCAnNTAnKTtcbiAgICAgICAgdGV4dEVsZW1lbnQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsICc1MCcpO1xuICAgICAgICB0ZXh0RWxlbWVudC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneCcsIFN0YXRlVmlldy5oYWxmU3RhdGVXaWR0aC50b1N0cmluZygpKTtcbiAgICAgICAgdGV4dEVsZW1lbnQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3knLCBTdGF0ZVZpZXcuaGFsZlN0YXRlV2lkdGgudG9TdHJpbmcoKSk7XG4gICAgICAgIHRleHRFbGVtZW50LnNldEF0dHJpYnV0ZU5TKG51bGwsICdkb21pbmFudC1iYXNlbGluZScsICdtaWRkbGUnKTtcbiAgICAgICAgdGV4dEVsZW1lbnQudGV4dENvbnRlbnQgPSB0aGlzLnN0YXRlLnRvU3RyaW5nKCk7XG4gICAgICAgIHRleHRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3N0YXRlLXRleHQnKTtcblxuICAgICAgICB0aGlzLmVsID0gZWw7XG4gICAgICAgIHRoaXMuY2lyY2xlRWxlbWVudCA9IGNpcmNsZUVsZW1lbnQ7XG4gICAgICAgIHRoaXMudGV4dEVsZW1lbnQgPSB0ZXh0RWxlbWVudDtcbiAgICB9XG5cbiAgICBzZXRQb3NpdGlvbih4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgICAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZSgneCcsIHgudG9TdHJpbmcoKSk7XG4gICAgICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKCd5JywgeS50b1N0cmluZygpKVxuICAgIH1cbn0iLCJpbXBvcnQge3JlYWRGaWxlU3luYywgd3JpdGVGaWxlU3luY30gZnJvbSAnZnMnO1xuaW1wb3J0IHsgc3RhcnQgfSBmcm9tICdyZXBsJztcblxuZXhwb3J0IGNsYXNzIERmYSB7XG4gICAgYWxwaGFiZXQ6IHN0cmluZ1tdO1xuICAgIG51bVN0YXRlczogbnVtYmVyO1xuICAgIHN0YXJ0U3RhdGU6IG51bWJlcjtcbiAgICBhY2NlcHRpbmdTdGF0ZXM6IG51bWJlcltdO1xuICAgIHRyYW5zaXRpb25zOiB7W2tleSA6IG51bWJlcl06IHtba2V5OiBzdHJpbmddOiBudW1iZXJ9fTtcblxuICAgIGNvbnN0cnVjdG9yKHtcbiAgICAgICAgYWxwaGFiZXQgPSBbXSxcbiAgICAgICAgbnVtU3RhdGVzID0gMCxcbiAgICAgICAgc3RhcnRTdGF0ZSA9IDAsXG4gICAgICAgIGFjY2VwdGluZ1N0YXRlcyA9IFtdLFxuICAgICAgICB0cmFuc2l0aW9ucyA9IHt9XG4gICAgfToge2FscGhhYmV0Pzogc3RyaW5nW10sIG51bVN0YXRlcz86IG51bWJlciwgc3RhcnRTdGF0ZT86IG51bWJlciwgYWNjZXB0aW5nU3RhdGVzPzogbnVtYmVyW10sIHRyYW5zaXRpb25zPzoge1trZXkgOiBudW1iZXJdOiB7W2tleTogc3RyaW5nXTogbnVtYmVyfX19ID0ge30pIHtcbiAgICAgICAgdGhpcy5hbHBoYWJldCA9IGFscGhhYmV0OyBcbiAgICAgICAgdGhpcy5udW1TdGF0ZXMgPSBudW1TdGF0ZXM7XG4gICAgICAgIHRoaXMuc3RhcnRTdGF0ZSA9IHN0YXJ0U3RhdGU7XG4gICAgICAgIHRoaXMuYWNjZXB0aW5nU3RhdGVzID0gYWNjZXB0aW5nU3RhdGVzO1xuICAgICAgICB0aGlzLnRyYW5zaXRpb25zID0gdHJhbnNpdGlvbnM7XG4gICAgfVxuXG4gICAgYWNjZXB0c1N0cmluZyhpbnB1dFN0cmluZzogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIGxldCBleGVjdXRpb246IERmYUV4ZWN1dGlvbiA9IHRoaXMuZ2V0RXhlY3V0aW9uKGlucHV0U3RyaW5nKTtcbiAgICAgICAgZXhlY3V0aW9uLmZpbmlzaCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5hY2NlcHRpbmdTdGF0ZXMuaW5jbHVkZXMoZXhlY3V0aW9uLmN1cnJlbnRTdGF0ZSk7XG4gICAgfVxuXG4gICAgZ2V0RXhlY3V0aW9uKGlucHV0U3RyaW5nOiBzdHJpbmcpIDogRGZhRXhlY3V0aW9uIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEZmFFeGVjdXRpb24odGhpcywgaW5wdXRTdHJpbmcpO1xuICAgIH1cblxuICAgIGRlc2VyaWFsaXplKGNvbnRlbnRzOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IGxpbmVzOiBzdHJpbmdbXSA9IGNvbnRlbnRzLnNwbGl0KCdcXG4nKTtcbiAgICAgICAgdGhpcy5hbHBoYWJldCA9IGxpbmVzWzBdLnNwbGl0KCcsJyk7XG4gICAgICAgIHRoaXMubnVtU3RhdGVzID0gcGFyc2VJbnQobGluZXNbMV0pO1xuICAgICAgICB0aGlzLnN0YXJ0U3RhdGUgPSBwYXJzZUludChsaW5lc1syXSk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmFjY2VwdGluZ1N0YXRlcyA9IGxpbmVzWzNdLnNwbGl0KCcsJykubWFwKGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUludChpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy50cmFuc2l0aW9ucyA9IHt9O1xuICAgICAgICBmb3IgKGxldCBzdGF0ZSA9IDA7IHN0YXRlIDwgdGhpcy5udW1TdGF0ZXM7IHN0YXRlKyspIHtcbiAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbnNbc3RhdGVdID0ge307XG4gICAgICAgICAgICBmb3IgKGxldCBjaGFyIG9mIHRoaXMuYWxwaGFiZXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRyYW5zaXRpb25zW3N0YXRlXVtjaGFyXSA9IC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG51bVRyYW5zaXRpb25zOiBudW1iZXIgPSB0aGlzLmFscGhhYmV0Lmxlbmd0aCAqIHRoaXMubnVtU3RhdGVzO1xuICAgICAgICBmb3IgKGxldCBpID0gNDsgaSA8IDQgKyBudW1UcmFuc2l0aW9uczsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgbGluZTogc3RyaW5nW10gPSBsaW5lc1tpXS5zcGxpdCgnLCcpO1xuICAgICAgICAgICAgdGhpcy50cmFuc2l0aW9uc1twYXJzZUludChsaW5lWzBdKV1bbGluZVsxXV0gPSBwYXJzZUludChsaW5lWzJdKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNlcmlhbGl6ZSgpOiBzdHJpbmcge1xuICAgICAgICBsZXQgY29udGVudHM6IHN0cmluZ1tdID0gW107O1xuICAgICAgICBjb250ZW50cy5wdXNoKHRoaXMuYWxwaGFiZXQuam9pbignLCcpKTtcbiAgICAgICAgY29udGVudHMucHVzaCh0aGlzLm51bVN0YXRlcy50b1N0cmluZygpKTtcbiAgICAgICAgY29udGVudHMucHVzaCh0aGlzLnN0YXJ0U3RhdGUudG9TdHJpbmcoKSk7XG4gICAgICAgIGNvbnRlbnRzLnB1c2godGhpcy5hY2NlcHRpbmdTdGF0ZXMuam9pbignLCcpKTtcbiAgICAgICAgZm9yIChsZXQgc3RhdGUgPSAwOyBzdGF0ZSA8PSB0aGlzLm51bVN0YXRlczsgc3RhdGUrKykge1xuICAgICAgICAgICAgZm9yKGxldCBsZXR0ZXIgb2YgdGhpcy5hbHBoYWJldCkge1xuICAgICAgICAgICAgICAgIGNvbnRlbnRzLnB1c2goc3RhdGUudG9TdHJpbmcoKSArICcsJyArIGxldHRlciArICcsJyArIFxuICAgICAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbnNbc3RhdGVdW2xldHRlcl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb250ZW50cy5qb2luKCdcXG4nKTtcbiAgICB9XG5cbiAgICByZWFkRnJvbUZpbGUoZmlsZXBhdGg6IHN0cmluZykge1xuICAgICAgICBsZXQgY29udGVudHM6IHN0cmluZyA9IHJlYWRGaWxlU3luYyhmaWxlcGF0aCwgXCJ1dGY4XCIpO1xuICAgICAgICB0aGlzLmRlc2VyaWFsaXplKGNvbnRlbnRzKTsgXG4gICAgfVxuXG4gICAgd3JpdGVUb0ZpbGUoZmlsZXBhdGg6IHN0cmluZykge1xuICAgICAgICBsZXQgY29udGVudHM6IHN0cmluZyA9IHRoaXMuc2VyaWFsaXplKCk7XG4gICAgICAgIHdyaXRlRmlsZVN5bmMoZmlsZXBhdGgsIGNvbnRlbnRzKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBEZmFFeGVjdXRpb24ge1xuICAgIGRmYSA6IERmYTtcbiAgICBjdXJyZW50U3RhdGUgOiBudW1iZXI7IFxuICAgIGlucHV0U3RyaW5nIDogc3RyaW5nO1xuICAgIGN1cnJlbnRDaGFySW5kZXggOiBudW1iZXI7XG4gICAgcGF0aDogbnVtYmVyW107IFxuXG4gICAgY29uc3RydWN0b3IoZGZhOiBEZmEsIGlucHV0U3RyaW5nOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5kZmEgPSBkZmE7XG4gICAgICAgIHRoaXMuaW5wdXRTdHJpbmcgPSBpbnB1dFN0cmluZztcbiAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgIH1cblxuICAgIGN1cnJlbnRDaGFyKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmlucHV0U3RyaW5nW3RoaXMuY3VycmVudENoYXJJbmRleF07XG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMucGF0aCA9IFt0aGlzLmRmYS5zdGFydFN0YXRlXTtcbiAgICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSB0aGlzLmRmYS5zdGFydFN0YXRlO1xuICAgICAgICB0aGlzLmN1cnJlbnRDaGFySW5kZXggPSAwO1xuICAgIH1cblxuICAgIGZpbmlzaCgpIHtcbiAgICAgICAgd2hpbGUgKHRoaXMuY3VycmVudENoYXJJbmRleCA8IHRoaXMuaW5wdXRTdHJpbmcubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnN0ZXBfZm9yd2FyZCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RlcF9mb3J3YXJkKCkge1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50Q2hhckluZGV4ID49IHRoaXMuaW5wdXRTdHJpbmcubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY3VycmVudENoYXIgOiBzdHJpbmcgPSB0aGlzLmN1cnJlbnRDaGFyKCk7XG4gICAgICAgIGxldCBuZXh0U3RhdGUgOiBudW1iZXIgPSB0aGlzLmRmYS50cmFuc2l0aW9uc1t0aGlzLmN1cnJlbnRTdGF0ZV1bY3VycmVudENoYXJdO1xuICAgICAgICB0aGlzLnBhdGgucHVzaChuZXh0U3RhdGUpO1xuICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IG5leHRTdGF0ZTtcbiAgICAgICAgdGhpcy5jdXJyZW50Q2hhckluZGV4Kys7XG4gICAgfVxuXG4gICAgc3RlcF9iYWNrd2FyZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudENoYXJJbmRleCA8PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IHRoaXMucGF0aC5wb3AoKTtcbiAgICAgICAgdGhpcy5jdXJyZW50Q2hhckluZGV4LS07XG4gICAgfVxufSIsbnVsbF19
