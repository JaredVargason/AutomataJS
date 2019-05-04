require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dfaView_1 = require("./dfaView");
$().ready(function () {
    var dfaView = new dfaView_1.DfaView();
});
},{"./dfaView":4}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dfa_1 = require("../models/dfa");
var StateView_1 = require("./StateView");
var DfaView = (function () {
    function DfaView() {
        this.dfa = new dfa_1.Dfa();
        this.execution = this.dfa.getExecution('');
        this.states = [];
        this.addTestingEvents();
        this.addSaveLoadEvents();
        this.loadDefaultDfa();
    }
    DfaView.prototype.addTestingEvents = function () {
        var _this = this;
        document.getElementById('testBtn').addEventListener('click', function () {
            _this.testString();
        });
        document.getElementById('testStringInput').addEventListener('input', function () {
            _this.beginStepThrough();
            _this.resultReset();
        });
        document.getElementById('clearInputBtn').addEventListener('click', function () {
            _this.clearTesting();
        });
        document.getElementById('forwardBtn').addEventListener('click', function () {
            _this.stepForward();
        });
        document.getElementById('backBtn').addEventListener('click', function () {
            _this.stepBackward();
        });
        document.getElementById('resetBtn').addEventListener('click', function () {
            _this.resetStepThrough();
        });
        document.getElementById('finishBtn').addEventListener('click', function () {
            _this.finishStepThrough();
        });
        var indexInput = document.getElementById('indexInput');
        indexInput.addEventListener('input', function () {
            if (indexInput.value) {
                _this.goToStep(parseInt(indexInput.value));
            }
        });
        this.addCharacterButtonEvents();
    };
    DfaView.prototype.addCharacterButtonEvents = function () {
        var _this = this;
        var characterSlots = document.getElementById('characters');
        var numSlots = characterSlots.childElementCount;
        var middleIndex = Math.floor(numSlots / 2);
        var _loop_1 = function (i) {
            characterSlots.children[i].addEventListener('click', function () {
                _this.stepBackward(middleIndex - i - 1);
            });
        };
        for (var i = 0; i < middleIndex; i++) {
            _loop_1(i);
        }
        var _loop_2 = function (i) {
            characterSlots.children[i].addEventListener('click', function () {
                _this.stepForward(i - middleIndex);
            });
        };
        for (var i = middleIndex + 1; i < numSlots; i++) {
            _loop_2(i);
        }
    };
    DfaView.prototype.addSaveLoadEvents = function () {
        var _this = this;
        document.getElementById('loadBtn').addEventListener('click', function () {
            _this.loadDfaFromFile();
        });
        document.getElementById('loadExampleBtn').addEventListener('click', function () {
            _this.loadDefaultDfa();
        });
        document.getElementById('clearBtn').addEventListener('click', function () {
            _this.clearAll();
        });
    };
    DfaView.prototype.loadDefaultDfa = function () {
        this.loadDfa(dfa_1.Dfa.createExampleDfa());
    };
    DfaView.prototype.loadDfa = function (newDfa) {
        this.clearAll();
        this.dfa = newDfa;
        this.updateDefinition();
        this.updateSVG();
    };
    DfaView.prototype.loadDfaFromFile = function () {
        var _this = this;
        var input = document.getElementById('dfaFile');
        if (input.files.length == 1) {
            var reader_1 = new FileReader();
            reader_1.onload = function (e) {
                _this.dfa.deserialize(reader_1.result);
                _this.loadDfa(_this.dfa);
            };
            reader_1.readAsText(input.files[0]);
        }
    };
    DfaView.prototype.clearAll = function () {
        this.clearDefinition();
        this.clearTesting();
        this.clearSvg();
    };
    DfaView.prototype.clearDefinition = function () {
        var alphabetInput = document.getElementById('alphabetInput');
        alphabetInput.value = '';
        var numStatesInput = document.getElementById('numStatesInput');
        numStatesInput.value = '';
        var startStateInput = document.getElementById('startStateInput');
        startStateInput.value = '';
        var acceptingStatesInput = document.getElementById('acceptingStatesInput');
        acceptingStatesInput.value = '';
        this.clearTransitionsList();
    };
    DfaView.prototype.updateDefinition = function () {
        this.updateAlphabet();
        this.updateNumStates();
        this.updateStartState();
        this.updateAcceptStates();
        this.updateTransitions();
    };
    DfaView.prototype.updateAlphabet = function () {
        var alphabetInput = document.getElementById('alphabetInput');
        alphabetInput.value = this.dfa.alphabet.join(',');
    };
    DfaView.prototype.updateNumStates = function () {
        var numStatesInput = document.getElementById('numStatesInput');
        numStatesInput.value = this.dfa.numStates.toString();
    };
    DfaView.prototype.updateStartState = function () {
        var startStateInput = document.getElementById('startStateInput');
        startStateInput.value = this.dfa.startState.toString();
    };
    DfaView.prototype.updateAcceptStates = function () {
        var acceptingStatesInput = document.getElementById('acceptingStatesInput');
        acceptingStatesInput.value = this.dfa.acceptingStates.join(',');
    };
    DfaView.prototype.updateTransitions = function () {
        this.clearTransitionsList();
        for (var fromState = 0; fromState < this.dfa.numStates; fromState++) {
            for (var _i = 0, _a = this.dfa.alphabet; _i < _a.length; _i++) {
                var letter = _a[_i];
                this.addTransitionToList(fromState, letter, this.dfa.transitions[fromState][letter]);
            }
        }
    };
    DfaView.prototype.addTransitionToList = function (fromState, letter, toState) {
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
    };
    DfaView.prototype.clearTransitionsList = function () {
        var transitionsList = document.getElementById("transitionsList");
        while (transitionsList.firstChild) {
            transitionsList.removeChild(transitionsList.firstChild);
        }
    };
    DfaView.prototype.testString = function () {
        var inputElement = document.getElementById('testStringInput');
        var inputString = inputElement.value;
        var result = this.dfa.acceptsString(inputString);
        result ? this.resultSuccess(inputString) : this.resultFail(inputString);
    };
    DfaView.prototype.clearExecutionInputString = function () {
        var inputElement = document.getElementById('testStringInput');
        inputElement.value = '';
    };
    DfaView.prototype.clearInputIndex = function () {
        var inputIndex = document.getElementById('indexInput');
        inputIndex.value = '0';
    };
    DfaView.prototype.resultSuccess = function (inputString) {
        var resultElement = document.getElementById('resultBar');
        resultElement.style.background = 'green';
        var resultText = document.getElementById('resultText');
        resultText.innerText = '"' + inputString + '" yields SUCCESS';
    };
    DfaView.prototype.resultFail = function (inputString) {
        var resultElement = document.getElementById('resultBar');
        resultElement.style.background = 'red';
        var resultText = document.getElementById('resultText');
        resultText.innerText = '"' + inputString + '" yields FAIL';
    };
    DfaView.prototype.resultReset = function () {
        var resultElement = document.getElementById('resultBar');
        resultElement.style.background = '#444444';
        var resultText = document.getElementById('resultText');
        resultText.innerText = 'Result';
    };
    DfaView.prototype.beginStepThrough = function () {
        var inputElement = document.getElementById('testStringInput');
        this.execution = this.dfa.getExecution(inputElement.value);
        this.populateCharacters();
        this.clearInputIndex();
    };
    DfaView.prototype.clearTesting = function () {
        this.clearExecutionInputString();
        this.resultReset();
        this.execution = this.dfa.getExecution('');
        this.populateCharacters();
    };
    DfaView.prototype.stepForward = function (steps) {
        if (steps === void 0) { steps = 1; }
        for (var i = 0; i < steps; i++) {
            this.execution.stepForward();
        }
        this.populateCharacters();
        this.updateIndexInput();
    };
    DfaView.prototype.stepBackward = function (steps) {
        if (steps === void 0) { steps = 1; }
        for (var i = 0; i < steps; i++) {
            this.execution.stepBackward();
        }
        this.populateCharacters();
        this.updateIndexInput();
    };
    DfaView.prototype.goToStep = function (step) {
        if (step < 0) {
            step = 0;
            this.updateIndexInput();
        }
        else if (step > this.execution.inputString.length) {
            step = this.execution.inputString.length - 1;
            this.updateIndexInput();
        }
        this.execution.reset();
        for (var i = 0; i < step; i++) {
            this.execution.stepForward();
        }
        this.populateCharacters();
    };
    DfaView.prototype.resetStepThrough = function () {
        this.execution.reset();
        this.populateCharacters();
        this.updateIndexInput();
    };
    DfaView.prototype.finishStepThrough = function () {
        this.execution.finish();
        this.populateCharacters();
        this.updateIndexInput();
    };
    DfaView.prototype.populateCharacters = function () {
        var characterSlots = document.getElementById('characters');
        var numSlots = characterSlots.childElementCount;
        var middleIndex = Math.floor(numSlots / 2);
        var firstCharIndex = middleIndex - this.execution.currentCharIndex;
        var lastCharIndex = firstCharIndex + this.execution.inputString.length;
        for (var i = 0; i < numSlots; i++) {
            if (i >= firstCharIndex && i < lastCharIndex) {
                characterSlots.children[i].textContent = this.execution.inputString[i - firstCharIndex];
            }
            else {
                characterSlots.children[i].textContent = '';
            }
        }
    };
    DfaView.prototype.updateIndexInput = function () {
        var indexInput = document.getElementById('indexInput');
        indexInput.value = this.execution.currentCharIndex.toString();
    };
    DfaView.prototype.updateSVG = function () {
        this.createStates();
        this.createTransitionSVGs();
    };
    DfaView.prototype.createStates = function () {
        var svg = document.getElementById('dfaSvg');
        var middle = this.dfa.numStates / 2 - .5;
        var svgWidth = svg.getBBox().width;
        var svgHeight = svg.getBBox().height;
        for (var i = 0; i < this.dfa.numStates; i++) {
            var startX = svgWidth / 2 + (i - middle) * DfaView.defaultStateSpacing;
            var startY = svgHeight / 2 + (i - middle) * DfaView.defaultStateSpacing;
            this.createStateAtPoint(i, startX, startY);
        }
    };
    DfaView.prototype.createState = function (state, event) {
        var svg = document.getElementById('dfaSvg');
        var domPoint = this.mouseEventToSVGCoord(svg, event);
        this.createStateAtPoint(state, domPoint.x, domPoint.y);
    };
    DfaView.prototype.createTransitionSVGs = function () {
        for (var state = 0; state < this.dfa.numStates; state++) {
            for (var _i = 0, _a = this.dfa.alphabet; _i < _a.length; _i++) {
                var letter = _a[_i];
                if (state != this.dfa.transitions[state][letter]) {
                    this.createTransitionSVG(state, letter, this.dfa.transitions[state][letter]);
                }
            }
        }
    };
    DfaView.prototype.createTransitionSVG = function (fromState, letter, toState) {
        console.log(fromState, letter, toState);
        var fromStateSVG = this.states[fromState].el;
        var toStateSVG = this.states[toState].el;
        var fromPointX = fromStateSVG.x.baseVal.value + StateView_1.StateView.halfStateWidth;
        var fromPointY = fromStateSVG.y.baseVal.value + StateView_1.StateView.halfStateWidth;
        var toPointX = toStateSVG.x.baseVal.value + StateView_1.StateView.halfStateWidth;
        var toPointY = toStateSVG.y.baseVal.value + StateView_1.StateView.halfStateWidth;
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
        var fromPointConnectionOffsetX = Math.cos(angle) * StateView_1.StateView.stateRadius;
        var fromPointConnectionOffsetY = Math.sin(angle) * StateView_1.StateView.stateRadius;
        var toPointConnectionOffsetX = -fromPointConnectionOffsetX;
        var toPointConnectionOffsetY = -fromPointConnectionOffsetY;
        var fromPointConnectionX = fromPointConnectionOffsetX + fromPointX;
        var fromPointConnectionY = fromPointConnectionOffsetY + fromPointY;
        var toPointConnectionX = toPointConnectionOffsetX + toPointX;
        var toPointConnectionY = toPointConnectionOffsetY + toPointY;
        var transitionGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        var lineSvg = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        lineSvg.setAttributeNS(null, 'd', 'M ' + fromPointConnectionX.toString() + ' ' + fromPointConnectionY.toString()
            + ' L ' + toPointConnectionX.toString() + ' ' + toPointConnectionY.toString());
        lineSvg.setAttributeNS(null, 'stroke', 'white');
        lineSvg.setAttributeNS(null, 'stroke-width', '3');
        lineSvg.setAttributeNS(null, 'marker-end', 'url(#arrow)');
        var dfaSvg = document.getElementById('dfaSvg');
        dfaSvg.appendChild(lineSvg);
    };
    DfaView.prototype.mouseEventToSVGCoord = function (svg, mouseEvent) {
        return this.toSvgCoord(svg, mouseEvent.x, mouseEvent.y);
    };
    DfaView.prototype.toSvgCoord = function (svg, x, y) {
        var point = svg.createSVGPoint();
        point.x = x;
        point.y = y;
        return point.matrixTransform(svg.getScreenCTM().inverse());
    };
    DfaView.prototype.clearSvg = function () {
        this.clearStates();
        this.clearTransitions();
    };
    DfaView.prototype.clearStates = function () {
        var elements = document.getElementsByClassName('state');
        for (var i = elements.length - 1; i >= 0; i--) {
            elements[i].remove();
        }
    };
    DfaView.prototype.clearTransitions = function () {
        var transitionList = document.getElementById('transitionsList');
        var childNodes = transitionList.childNodes;
        for (var i = childNodes.length - 1; i >= 0; i--) {
            var child = childNodes[i];
            child.remove();
        }
    };
    DfaView.prototype.createStateAtPoint = function (state, svgX, svgY) {
        var svg = document.getElementById('dfaSvg');
        var stateView = new StateView_1.StateView(state);
        svg.appendChild(stateView.el);
        this.states.push(stateView);
        stateView.setPosition(svgX, svgY);
    };
    DfaView.prototype.addDrag = function (state, grid) {
        var selectedElement = null;
        var offset;
        state.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        state.addEventListener('mouseup', endDrag);
        function startDrag(event) {
            selectedElement = state;
            offset = this.mouseEventToSVGCoord(grid, event);
            offset.x -= parseFloat(selectedElement.getAttributeNS(null, "x"));
            offset.y -= parseFloat(selectedElement.getAttributeNS(null, 'y'));
        }
        function drag(event) {
            if (selectedElement) {
                event.preventDefault();
                var domPoint = this.mouseEventToSVGCoord(grid, event);
                state.setAttribute('x', (domPoint.x - offset.x).toString());
                state.setAttribute('y', (domPoint.y - offset.y).toString());
            }
        }
        function endDrag(event) {
            selectedElement = null;
        }
    };
    DfaView.prototype.addGridEvents = function () {
        document.getElementById('grid').addEventListener('click', function (event) {
        });
    };
    DfaView.defaultStateSpacing = 200;
    return DfaView;
}());
exports.DfaView = DfaView;
},{"../models/dfa":2,"./StateView":3}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StateView = (function () {
    function StateView(state) {
        this.state = state;
        this.createElement();
        this.connections = {};
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
        el.onmouseenter = function (event) {
            circleElement.style.fill = '#BBBBBB';
        };
        el.onmouseleave = function (event) {
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
},{}],2:[function(require,module,exports){
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
    Dfa.createExampleDfa = function () {
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
        return new Dfa({
            alphabet: alphabet,
            numStates: numStates,
            startState: startState,
            acceptingStates: acceptingStates,
            transitions: transitions
        });
    };
    return Dfa;
}());
exports.Dfa = Dfa;
var DfaConnection = (function () {
    function DfaConnection() {
    }
    return DfaConnection;
}());
exports.DfaConnection = DfaConnection;
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
            this.stepForward();
        }
    };
    DfaExecution.prototype.stepForward = function () {
        if (this.currentCharIndex >= this.inputString.length) {
            return;
        }
        var currentChar = this.currentChar();
        var nextState = this.dfa.transitions[this.currentState][currentChar];
        this.path.push(nextState);
        this.currentState = nextState;
        this.currentCharIndex++;
    };
    DfaExecution.prototype.stepBackward = function () {
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

},{}]},{},[5])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9mYWN0b3ItYnVuZGxlL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvdmlld3MvZGZhX2NsaWVudC50cyIsInNyYy92aWV3cy9kZmFWaWV3LnRzIiwic3JjL3ZpZXdzL1N0YXRlVmlldy50cyIsInNyYy9tb2RlbHMvZGZhLnRzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbGliL19lbXB0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEscUNBQW9DO0FBRXBDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQztJQUNOLElBQUksT0FBTyxHQUFhLElBQUksaUJBQU8sRUFBRSxDQUFDO0FBQzFDLENBQUMsQ0FBQyxDQUFDOzs7O0FDSkgscUNBQWtEO0FBQ2xELHlDQUF3QztBQUd4QztJQU9JO1FBQ0ksSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLFNBQUcsRUFBRSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFFakIsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFRCxrQ0FBZ0IsR0FBaEI7UUFBQSxpQkE4QkM7UUE3QkcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUU7WUFDekQsS0FBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3RCLENBQUMsQ0FBQyxDQUFDO1FBQ0gsUUFBUSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRTtZQUNqRSxLQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FB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QkFBZ0IsR0FBRyxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVELDZCQUFNLEdBQU47UUFDSSxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRTtZQUNwRCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDdEI7SUFDTCxDQUFDO0lBRUQsa0NBQVcsR0FBWDtRQUNJLElBQUksSUFBSSxDQUFDLGdCQUFnQixJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFO1lBQ2xELE9BQU87U0FDVjtRQUVELElBQUksV0FBVyxHQUFZLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUM5QyxJQUFJLFNBQVMsR0FBWSxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDOUUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDMUIsSUFBSSxDQUFDLFlBQVksR0FBRyxTQUFTLENBQUM7UUFDOUIsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDNUIsQ0FBQztJQUVELG1DQUFZLEdBQVo7UUFDSSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxDQUFDLEVBQUU7WUFDNUIsT0FBTztTQUNWO1FBRUQsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQzVCLENBQUM7SUFDTCxtQkFBQztBQUFELENBakRBLEFBaURDLElBQUE7QUFqRFksb0NBQVk7O0FDdEh6QiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgeyBEZmFWaWV3IH0gZnJvbSBcIi4vZGZhVmlld1wiO1xuXG4kKCkucmVhZHkoKCkgPT4ge1xuICAgIGxldCBkZmFWaWV3IDogRGZhVmlldyA9IG5ldyBEZmFWaWV3KCk7XG59KTsiLCJpbXBvcnQgeyBEZmEsIERmYUV4ZWN1dGlvbiB9IGZyb20gXCIuLi9tb2RlbHMvZGZhXCI7XG5pbXBvcnQgeyBTdGF0ZVZpZXcgfSBmcm9tIFwiLi9TdGF0ZVZpZXdcIjtcbmltcG9ydCB7IGV4ZWN1dGlvbkFzeW5jSWQgfSBmcm9tIFwiYXN5bmNfaG9va3NcIjtcblxuZXhwb3J0IGNsYXNzIERmYVZpZXcge1xuICAgIGRmYTogRGZhO1xuICAgIGV4ZWN1dGlvbjogRGZhRXhlY3V0aW9uO1xuICAgIHN0YXRlczogU3RhdGVWaWV3W107XG5cbiAgICBzdGF0aWMgZGVmYXVsdFN0YXRlU3BhY2luZyA9IDIwMDtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmRmYSA9IG5ldyBEZmEoKTtcbiAgICAgICAgdGhpcy5leGVjdXRpb24gPSB0aGlzLmRmYS5nZXRFeGVjdXRpb24oJycpO1xuICAgICAgICB0aGlzLnN0YXRlcyA9IFtdO1xuXG4gICAgICAgIHRoaXMuYWRkVGVzdGluZ0V2ZW50cygpO1xuICAgICAgICB0aGlzLmFkZFNhdmVMb2FkRXZlbnRzKCk7XG4gICAgICAgIHRoaXMubG9hZERlZmF1bHREZmEoKTtcbiAgICB9XG5cbiAgICBhZGRUZXN0aW5nRXZlbnRzKCkge1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGVzdEJ0bicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy50ZXN0U3RyaW5nKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGVzdFN0cmluZ0lucHV0JykuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmJlZ2luU3RlcFRocm91Z2goKTtcbiAgICAgICAgICAgIHRoaXMucmVzdWx0UmVzZXQoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbGVhcklucHV0QnRuJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNsZWFyVGVzdGluZygpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZvcndhcmRCdG4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc3RlcEZvcndhcmQoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiYWNrQnRuJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnN0ZXBCYWNrd2FyZCgpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc2V0QnRuJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0U3RlcFRocm91Z2goKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaW5pc2hCdG4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZmluaXNoU3RlcFRocm91Z2goKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCBpbmRleElucHV0ID0gPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luZGV4SW5wdXQnKTtcbiAgICAgICAgaW5kZXhJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsICgpID0+IHtcbiAgICAgICAgICAgIGlmIChpbmRleElucHV0LnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nb1RvU3RlcChwYXJzZUludChpbmRleElucHV0LnZhbHVlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmFkZENoYXJhY3RlckJ1dHRvbkV2ZW50cygpO1xuICAgIH1cblxuICAgIGFkZENoYXJhY3RlckJ1dHRvbkV2ZW50cygpIHtcbiAgICAgICAgbGV0IGNoYXJhY3RlclNsb3RzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NoYXJhY3RlcnMnKTtcbiAgICAgICAgbGV0IG51bVNsb3RzID0gY2hhcmFjdGVyU2xvdHMuY2hpbGRFbGVtZW50Q291bnQ7XG4gICAgICAgIGxldCBtaWRkbGVJbmRleCA9IE1hdGguZmxvb3IobnVtU2xvdHMgLyAyKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1pZGRsZUluZGV4OyBpKyspIHtcbiAgICAgICAgICAgIGNoYXJhY3RlclNsb3RzLmNoaWxkcmVuW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RlcEJhY2t3YXJkKG1pZGRsZUluZGV4IC0gaSAtIDEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IG1pZGRsZUluZGV4ICsgMTsgaSA8IG51bVNsb3RzOyBpKyspIHtcbiAgICAgICAgICAgIGNoYXJhY3RlclNsb3RzLmNoaWxkcmVuW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RlcEZvcndhcmQoaSAtIG1pZGRsZUluZGV4KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkU2F2ZUxvYWRFdmVudHMoKSB7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2FkQnRuJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvYWREZmFGcm9tRmlsZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvYWRFeGFtcGxlQnRuJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvYWREZWZhdWx0RGZhKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xlYXJCdG4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJBbGwoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbG9hZERlZmF1bHREZmEoKSB7XG4gICAgICAgIHRoaXMubG9hZERmYShEZmEuY3JlYXRlRXhhbXBsZURmYSgpKTtcbiAgICB9XG5cbiAgICBsb2FkRGZhKG5ld0RmYTogRGZhKSB7XG4gICAgICAgIHRoaXMuY2xlYXJBbGwoKTtcbiAgICAgICAgdGhpcy5kZmEgPSBuZXdEZmE7XG4gICAgICAgIHRoaXMudXBkYXRlRGVmaW5pdGlvbigpO1xuICAgICAgICB0aGlzLnVwZGF0ZVNWRygpO1xuICAgIH0gICBcblxuICAgIGxvYWREZmFGcm9tRmlsZSgpIHtcbiAgICAgICAgdmFyIGlucHV0IDogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZmFGaWxlJykgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgaWYgKGlucHV0LmZpbGVzLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICBsZXQgcmVhZGVyOiBGaWxlUmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICAgICAgICAgIHJlYWRlci5vbmxvYWQgPSAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZGZhLmRlc2VyaWFsaXplKHJlYWRlci5yZXN1bHQgYXMgc3RyaW5nKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWREZmEodGhpcy5kZmEpOyBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlYWRlci5yZWFkQXNUZXh0KGlucHV0LmZpbGVzWzBdKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNsZWFyQWxsKCkge1xuICAgICAgICB0aGlzLmNsZWFyRGVmaW5pdGlvbigpO1xuICAgICAgICB0aGlzLmNsZWFyVGVzdGluZygpO1xuICAgICAgICB0aGlzLmNsZWFyU3ZnKCk7XG4gICAgfVxuXG4gICAgY2xlYXJEZWZpbml0aW9uKCkge1xuICAgICAgICBsZXQgYWxwaGFiZXRJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhbHBoYWJldElucHV0JykgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgYWxwaGFiZXRJbnB1dC52YWx1ZSA9ICcnO1xuXG4gICAgICAgIGxldCBudW1TdGF0ZXNJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdudW1TdGF0ZXNJbnB1dCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgIG51bVN0YXRlc0lucHV0LnZhbHVlID0gJyc7XG5cbiAgICAgICAgbGV0IHN0YXJ0U3RhdGVJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGFydFN0YXRlSW5wdXQnKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICBzdGFydFN0YXRlSW5wdXQudmFsdWUgPSAnJztcblxuICAgICAgICBsZXQgYWNjZXB0aW5nU3RhdGVzSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWNjZXB0aW5nU3RhdGVzSW5wdXQnKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICBhY2NlcHRpbmdTdGF0ZXNJbnB1dC52YWx1ZSA9ICcnO1xuXG4gICAgICAgIHRoaXMuY2xlYXJUcmFuc2l0aW9uc0xpc3QoKTtcbiAgICB9XG5cbiAgICAvL1BhbmVsIGZ1bmN0aW9uc1xuICAgIHVwZGF0ZURlZmluaXRpb24oKSB7XG4gICAgICAgIHRoaXMudXBkYXRlQWxwaGFiZXQoKTtcbiAgICAgICAgdGhpcy51cGRhdGVOdW1TdGF0ZXMoKTtcbiAgICAgICAgdGhpcy51cGRhdGVTdGFydFN0YXRlKCk7XG4gICAgICAgIHRoaXMudXBkYXRlQWNjZXB0U3RhdGVzKCk7XG4gICAgICAgIHRoaXMudXBkYXRlVHJhbnNpdGlvbnMoKTtcbiAgICB9XG5cbiAgICB1cGRhdGVBbHBoYWJldCgpIHtcbiAgICAgICAgbGV0IGFscGhhYmV0SW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWxwaGFiZXRJbnB1dCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgIGFscGhhYmV0SW5wdXQudmFsdWUgPSB0aGlzLmRmYS5hbHBoYWJldC5qb2luKCcsJyk7XG4gICAgfVxuXG4gICAgdXBkYXRlTnVtU3RhdGVzKCkge1xuICAgICAgICBsZXQgbnVtU3RhdGVzSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbnVtU3RhdGVzSW5wdXQnKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICBudW1TdGF0ZXNJbnB1dC52YWx1ZSA9IHRoaXMuZGZhLm51bVN0YXRlcy50b1N0cmluZygpO1xuICAgIH1cblxuICAgIHVwZGF0ZVN0YXJ0U3RhdGUoKSB7XG4gICAgICAgIGxldCBzdGFydFN0YXRlSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhcnRTdGF0ZUlucHV0JykgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgc3RhcnRTdGF0ZUlucHV0LnZhbHVlID0gdGhpcy5kZmEuc3RhcnRTdGF0ZS50b1N0cmluZygpO1xuICAgIH1cblxuICAgIHVwZGF0ZUFjY2VwdFN0YXRlcygpIHtcbiAgICAgICAgbGV0IGFjY2VwdGluZ1N0YXRlc0lucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FjY2VwdGluZ1N0YXRlc0lucHV0JykgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgYWNjZXB0aW5nU3RhdGVzSW5wdXQudmFsdWUgPSB0aGlzLmRmYS5hY2NlcHRpbmdTdGF0ZXMuam9pbignLCcpO1xuICAgIH1cblxuICAgIHVwZGF0ZVRyYW5zaXRpb25zKCkge1xuICAgICAgICB0aGlzLmNsZWFyVHJhbnNpdGlvbnNMaXN0KCk7XG4gICAgICAgIGZvciAobGV0IGZyb21TdGF0ZSA9IDA7IGZyb21TdGF0ZSA8IHRoaXMuZGZhLm51bVN0YXRlczsgZnJvbVN0YXRlKyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IGxldHRlciBvZiB0aGlzLmRmYS5hbHBoYWJldCkge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkVHJhbnNpdGlvblRvTGlzdChmcm9tU3RhdGUsIGxldHRlciwgdGhpcy5kZmEudHJhbnNpdGlvbnNbZnJvbVN0YXRlXVtsZXR0ZXJdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZFRyYW5zaXRpb25Ub0xpc3QoZnJvbVN0YXRlOiBudW1iZXIsIGxldHRlcjogc3RyaW5nLCB0b1N0YXRlOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IHRyYW5zaXRpb25MaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RyYW5zaXRpb25zTGlzdCcpO1xuICAgICAgICBsZXQgdGV4dCA9IGZyb21TdGF0ZS50b1N0cmluZygpICsgJyArICcgKyBsZXR0ZXIgKyAnICZyYXJyOydcbiAgICAgICAgbGV0IGxpc3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgbGlzdEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbGlzdC1ncm91cC1pdGVtJyk7XG5cbiAgICAgICAgbGV0IGxpc3RJdGVtU3RyaW5nID0gXG4gICAgICAgICc8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIj5cXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cC1wcmVwZW5kXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJpbnB1dC1ncm91cC10ZXh0XCI+JyArIHRleHQgKyAnPC9zcGFuPlxcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cIm51bWJlclwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgcGxhY2Vob2xkZXI9XCJRXCIgdmFsdWU9XCInICsgdG9TdGF0ZSArICdcIj5cXFxuICAgICAgICAgICAgPC9kaXY+JztcbiAgICAgICAgbGlzdEVsZW1lbnQuaW5uZXJIVE1MID0gbGlzdEl0ZW1TdHJpbmc7XG4gICAgICAgIHRyYW5zaXRpb25MaXN0LmFwcGVuZENoaWxkKGxpc3RFbGVtZW50KTtcbiAgICB9XG5cbiAgICBjbGVhclRyYW5zaXRpb25zTGlzdCgpIHtcbiAgICAgICAgbGV0IHRyYW5zaXRpb25zTGlzdCA6IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cmFuc2l0aW9uc0xpc3RcIik7XG4gICAgICAgIHdoaWxlICh0cmFuc2l0aW9uc0xpc3QuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgdHJhbnNpdGlvbnNMaXN0LnJlbW92ZUNoaWxkKHRyYW5zaXRpb25zTGlzdC5maXJzdENoaWxkKTtcbiAgICAgICAgfSBcbiAgICB9XG5cbiAgICAvL1N0cmluZyB0ZXN0aW5nXG4gICAgdGVzdFN0cmluZygpIHtcbiAgICAgICAgbGV0IGlucHV0RWxlbWVudCA9IDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZXN0U3RyaW5nSW5wdXQnKTtcbiAgICAgICAgbGV0IGlucHV0U3RyaW5nIDogc3RyaW5nID0gaW5wdXRFbGVtZW50LnZhbHVlO1xuICAgICAgICBsZXQgcmVzdWx0IDogYm9vbGVhbiA9IHRoaXMuZGZhLmFjY2VwdHNTdHJpbmcoaW5wdXRTdHJpbmcpO1xuICAgICAgICByZXN1bHQgPyB0aGlzLnJlc3VsdFN1Y2Nlc3MoaW5wdXRTdHJpbmcpIDogdGhpcy5yZXN1bHRGYWlsKGlucHV0U3RyaW5nKTtcbiAgICB9XG5cbiAgICBjbGVhckV4ZWN1dGlvbklucHV0U3RyaW5nKCkge1xuICAgICAgICBsZXQgaW5wdXRFbGVtZW50ID0gPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rlc3RTdHJpbmdJbnB1dCcpO1xuICAgICAgICBpbnB1dEVsZW1lbnQudmFsdWUgPSAnJztcbiAgICB9XG5cbiAgICBjbGVhcklucHV0SW5kZXgoKSB7XG4gICAgICAgIGxldCBpbnB1dEluZGV4ID0gPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luZGV4SW5wdXQnKTtcbiAgICAgICAgaW5wdXRJbmRleC52YWx1ZSA9ICcwJztcbiAgICB9XG5cbiAgICByZXN1bHRTdWNjZXNzKGlucHV0U3RyaW5nIDogc3RyaW5nKSB7XG4gICAgICAgIGxldCByZXN1bHRFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3VsdEJhcicpO1xuICAgICAgICByZXN1bHRFbGVtZW50LnN0eWxlLmJhY2tncm91bmQgPSAnZ3JlZW4nO1xuICAgICAgICBsZXQgcmVzdWx0VGV4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN1bHRUZXh0Jyk7XG4gICAgICAgIHJlc3VsdFRleHQuaW5uZXJUZXh0ID0gJ1wiJyArIGlucHV0U3RyaW5nICsgJ1wiIHlpZWxkcyBTVUNDRVNTJztcbiAgICB9XG5cbiAgICByZXN1bHRGYWlsKGlucHV0U3RyaW5nIDogc3RyaW5nKSB7XG4gICAgICAgIGxldCByZXN1bHRFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3VsdEJhcicpO1xuICAgICAgICByZXN1bHRFbGVtZW50LnN0eWxlLmJhY2tncm91bmQgPSAncmVkJztcbiAgICAgICAgbGV0IHJlc3VsdFRleHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdWx0VGV4dCcpO1xuICAgICAgICByZXN1bHRUZXh0LmlubmVyVGV4dCA9ICdcIicgKyBpbnB1dFN0cmluZyArICdcIiB5aWVsZHMgRkFJTCc7XG4gICAgfVxuXG4gICAgcmVzdWx0UmVzZXQoKSB7XG4gICAgICAgIGxldCByZXN1bHRFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3VsdEJhcicpO1xuICAgICAgICByZXN1bHRFbGVtZW50LnN0eWxlLmJhY2tncm91bmQgPSAnIzQ0NDQ0NCc7XG4gICAgICAgIGxldCByZXN1bHRUZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3VsdFRleHQnKTtcbiAgICAgICAgcmVzdWx0VGV4dC5pbm5lclRleHQgPSAnUmVzdWx0JztcbiAgICB9XG5cbiAgICAvL1N0ZXAgdGhyb3VnaCB0ZXN0aW5nXG4gICAgYmVnaW5TdGVwVGhyb3VnaCgpIHtcbiAgICAgICAgbGV0IGlucHV0RWxlbWVudCA9IDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZXN0U3RyaW5nSW5wdXQnKTtcbiAgICAgICAgdGhpcy5leGVjdXRpb24gPSB0aGlzLmRmYS5nZXRFeGVjdXRpb24oaW5wdXRFbGVtZW50LnZhbHVlKTtcbiAgICAgICAgdGhpcy5wb3B1bGF0ZUNoYXJhY3RlcnMoKTtcbiAgICAgICAgdGhpcy5jbGVhcklucHV0SW5kZXgoKTsgXG4gICAgfVxuXG4gICAgY2xlYXJUZXN0aW5nKCkge1xuICAgICAgICB0aGlzLmNsZWFyRXhlY3V0aW9uSW5wdXRTdHJpbmcoKTtcbiAgICAgICAgdGhpcy5yZXN1bHRSZXNldCgpO1xuICAgICAgICB0aGlzLmV4ZWN1dGlvbiA9IHRoaXMuZGZhLmdldEV4ZWN1dGlvbignJyk7XG4gICAgICAgIHRoaXMucG9wdWxhdGVDaGFyYWN0ZXJzKCk7XG4gICAgfVxuXG4gICAgc3RlcEZvcndhcmQoc3RlcHM6IG51bWJlciA9IDEpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGVwczsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGlvbi5zdGVwRm9yd2FyZCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucG9wdWxhdGVDaGFyYWN0ZXJzKCk7XG4gICAgICAgIHRoaXMudXBkYXRlSW5kZXhJbnB1dCgpO1xuICAgIH1cblxuICAgIHN0ZXBCYWNrd2FyZChzdGVwczogbnVtYmVyID0gMSkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ZXBzOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0aW9uLnN0ZXBCYWNrd2FyZCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucG9wdWxhdGVDaGFyYWN0ZXJzKCk7XG4gICAgICAgIHRoaXMudXBkYXRlSW5kZXhJbnB1dCgpO1xuICAgIH1cblxuICAgIGdvVG9TdGVwKHN0ZXA6IG51bWJlcikge1xuICAgICAgICBpZiAoc3RlcCA8IDApIHtcbiAgICAgICAgICAgIHN0ZXAgPSAwO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVJbmRleElucHV0KCk7XG4gICAgICAgIH0gICAgICAgIFxuICAgICAgICBlbHNlIGlmIChzdGVwID4gdGhpcy5leGVjdXRpb24uaW5wdXRTdHJpbmcubGVuZ3RoKSB7XG4gICAgICAgICAgICBzdGVwID0gdGhpcy5leGVjdXRpb24uaW5wdXRTdHJpbmcubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlSW5kZXhJbnB1dCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5leGVjdXRpb24ucmVzZXQoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGVwOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0aW9uLnN0ZXBGb3J3YXJkKCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMucG9wdWxhdGVDaGFyYWN0ZXJzKCk7XG4gICAgfVxuXG4gICAgcmVzZXRTdGVwVGhyb3VnaCgpIHtcbiAgICAgICAgdGhpcy5leGVjdXRpb24ucmVzZXQoKTtcbiAgICAgICAgdGhpcy5wb3B1bGF0ZUNoYXJhY3RlcnMoKTtcbiAgICAgICAgdGhpcy51cGRhdGVJbmRleElucHV0KCk7XG4gICAgfVxuXG4gICAgZmluaXNoU3RlcFRocm91Z2goKSB7XG4gICAgICAgIHRoaXMuZXhlY3V0aW9uLmZpbmlzaCgpO1xuICAgICAgICB0aGlzLnBvcHVsYXRlQ2hhcmFjdGVycygpO1xuICAgICAgICB0aGlzLnVwZGF0ZUluZGV4SW5wdXQoKTtcbiAgICB9XG5cbiAgICBwb3B1bGF0ZUNoYXJhY3RlcnMoKSB7XG4gICAgICAgIGxldCBjaGFyYWN0ZXJTbG90cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaGFyYWN0ZXJzJyk7XG4gICAgICAgIGxldCBudW1TbG90cyA9IGNoYXJhY3RlclNsb3RzLmNoaWxkRWxlbWVudENvdW50O1xuICAgICAgICBsZXQgbWlkZGxlSW5kZXggPSBNYXRoLmZsb29yKG51bVNsb3RzIC8gMik7XG4gICAgICAgIGxldCBmaXJzdENoYXJJbmRleCA9IG1pZGRsZUluZGV4IC0gdGhpcy5leGVjdXRpb24uY3VycmVudENoYXJJbmRleFxuICAgICAgICBsZXQgbGFzdENoYXJJbmRleCA9IGZpcnN0Q2hhckluZGV4ICsgdGhpcy5leGVjdXRpb24uaW5wdXRTdHJpbmcubGVuZ3RoO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVNsb3RzOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChpID49IGZpcnN0Q2hhckluZGV4ICYmIGkgPCBsYXN0Q2hhckluZGV4KSB7XG4gICAgICAgICAgICAgICAgY2hhcmFjdGVyU2xvdHMuY2hpbGRyZW5baV0udGV4dENvbnRlbnQgPSB0aGlzLmV4ZWN1dGlvbi5pbnB1dFN0cmluZ1tpIC0gZmlyc3RDaGFySW5kZXhdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY2hhcmFjdGVyU2xvdHMuY2hpbGRyZW5baV0udGV4dENvbnRlbnQgPSAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZUluZGV4SW5wdXQoKSB7XG4gICAgICAgIGxldCBpbmRleElucHV0ID0gPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luZGV4SW5wdXQnKTtcbiAgICAgICAgaW5kZXhJbnB1dC52YWx1ZSA9IHRoaXMuZXhlY3V0aW9uLmN1cnJlbnRDaGFySW5kZXgudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICAvL1NWR1xuICAgIHVwZGF0ZVNWRygpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVTdGF0ZXMoKTsgXG4gICAgICAgIHRoaXMuY3JlYXRlVHJhbnNpdGlvblNWR3MoKTtcbiAgICB9XG5cbiAgICBjcmVhdGVTdGF0ZXMoKSB7XG4gICAgICAgIGxldCBzdmcgPSA8U1ZHU1ZHRWxlbWVudD48YW55PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZmFTdmcnKTtcbiAgICAgICAgbGV0IG1pZGRsZSA9IHRoaXMuZGZhLm51bVN0YXRlcyAvIDIgLSAuNTtcbiAgICAgICAgbGV0IHN2Z1dpZHRoID0gc3ZnLmdldEJCb3goKS53aWR0aDtcbiAgICAgICAgbGV0IHN2Z0hlaWdodCA9IHN2Zy5nZXRCQm94KCkuaGVpZ2h0O1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZGZhLm51bVN0YXRlczsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgc3RhcnRYID0gc3ZnV2lkdGggLyAyICsgKGkgLSBtaWRkbGUpICogRGZhVmlldy5kZWZhdWx0U3RhdGVTcGFjaW5nO1xuICAgICAgICAgICAgbGV0IHN0YXJ0WSA9IHN2Z0hlaWdodCAvIDIgKyAoaSAtIG1pZGRsZSkgKiBEZmFWaWV3LmRlZmF1bHRTdGF0ZVNwYWNpbmc7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVN0YXRlQXRQb2ludChpLCBzdGFydFgsIHN0YXJ0WSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVTdGF0ZShzdGF0ZTogbnVtYmVyLCBldmVudCA6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgdmFyIHN2ZyA6IFNWR1NWR0VsZW1lbnQgPSA8U1ZHU1ZHRWxlbWVudD48YW55PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZmFTdmcnKTtcbiAgICAgICAgbGV0IGRvbVBvaW50ID0gdGhpcy5tb3VzZUV2ZW50VG9TVkdDb29yZChzdmcsIGV2ZW50KTtcbiAgICAgICAgdGhpcy5jcmVhdGVTdGF0ZUF0UG9pbnQoc3RhdGUsIGRvbVBvaW50LngsIGRvbVBvaW50LnkpO1xuICAgIH1cblxuICAgIGNyZWF0ZVRyYW5zaXRpb25TVkdzKCkge1xuICAgICAgICBmb3IgKGxldCBzdGF0ZSA9IDA7IHN0YXRlIDwgdGhpcy5kZmEubnVtU3RhdGVzOyBzdGF0ZSsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBsZXR0ZXIgb2YgdGhpcy5kZmEuYWxwaGFiZXQpIHtcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGUgIT0gdGhpcy5kZmEudHJhbnNpdGlvbnNbc3RhdGVdW2xldHRlcl0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVUcmFuc2l0aW9uU1ZHKHN0YXRlLCBsZXR0ZXIsIHRoaXMuZGZhLnRyYW5zaXRpb25zW3N0YXRlXVtsZXR0ZXJdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVUcmFuc2l0aW9uU1ZHKGZyb21TdGF0ZTogbnVtYmVyLCBsZXR0ZXI6IHN0cmluZywgdG9TdGF0ZTogbnVtYmVyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGZyb21TdGF0ZSwgbGV0dGVyLCB0b1N0YXRlKTtcbiAgICAgICAgbGV0IGZyb21TdGF0ZVNWRyA9IHRoaXMuc3RhdGVzW2Zyb21TdGF0ZV0uZWw7XG4gICAgICAgIGxldCB0b1N0YXRlU1ZHID0gdGhpcy5zdGF0ZXNbdG9TdGF0ZV0uZWw7XG4gICAgICAgIGxldCBmcm9tUG9pbnRYOiBudW1iZXIgPSBmcm9tU3RhdGVTVkcueC5iYXNlVmFsLnZhbHVlICsgU3RhdGVWaWV3LmhhbGZTdGF0ZVdpZHRoOyAvL3BhcnNlSW50KGZyb21TdGF0ZVNWRy5nZXRBdHRyaWJ1dGVOUyhudWxsLCAneCcpKTtcbiAgICAgICAgbGV0IGZyb21Qb2ludFk6IG51bWJlciA9IGZyb21TdGF0ZVNWRy55LmJhc2VWYWwudmFsdWUgKyBTdGF0ZVZpZXcuaGFsZlN0YXRlV2lkdGg7IC8vcGFyc2VJbnQoZnJvbVN0YXRlU1ZHLmdldEF0dHJpYnV0ZU5TKG51bGwsICd5JykpOyBcblxuICAgICAgICBsZXQgdG9Qb2ludFg6IG51bWJlciA9IHRvU3RhdGVTVkcueC5iYXNlVmFsLnZhbHVlICsgU3RhdGVWaWV3LmhhbGZTdGF0ZVdpZHRoOyAvL3BhcnNlSW50KHRvU3RhdGVTVkcuZ2V0QXR0cmlidXRlTlMobnVsbCwgJ3gnKSk7XG4gICAgICAgIGxldCB0b1BvaW50WTogbnVtYmVyID0gdG9TdGF0ZVNWRy55LmJhc2VWYWwudmFsdWUgKyBTdGF0ZVZpZXcuaGFsZlN0YXRlV2lkdGg7IC8vcGFyc2VJbnQodG9TdGF0ZVNWRy5nZXRBdHRyaWJ1dGVOUyhudWxsLCAneScpKTtcbiAgICAgICAgY29uc29sZS5sb2coZnJvbVBvaW50WCwgZnJvbVBvaW50WSwgdG9Qb2ludFgsIHRvUG9pbnRZKTtcblxuICAgICAgICAvL2dldCBhbmdsZSBiZXR3ZWVuIG5vZGVzLlxuICAgICAgICBsZXQgeERpZmYgPSB0b1BvaW50WCAtIGZyb21Qb2ludFg7XG4gICAgICAgIGxldCB5RGlmZiA9IHRvUG9pbnRZIC0gZnJvbVBvaW50WTtcblxuICAgICAgICBsZXQgYW5nbGU6IG51bWJlcjtcbiAgICAgICAgaWYgKHhEaWZmID09IDApIHtcbiAgICAgICAgICAgIGFuZ2xlID0gMDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGFuZ2xlID0gTWF0aC50YW4oeURpZmYveERpZmYpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBmcm9tUG9pbnRDb25uZWN0aW9uT2Zmc2V0WCA9IE1hdGguY29zKGFuZ2xlKSAqIFN0YXRlVmlldy5zdGF0ZVJhZGl1cztcbiAgICAgICAgbGV0IGZyb21Qb2ludENvbm5lY3Rpb25PZmZzZXRZID0gTWF0aC5zaW4oYW5nbGUpICogU3RhdGVWaWV3LnN0YXRlUmFkaXVzO1xuXG4gICAgICAgIGxldCB0b1BvaW50Q29ubmVjdGlvbk9mZnNldFggPSAtZnJvbVBvaW50Q29ubmVjdGlvbk9mZnNldFg7XG4gICAgICAgIGxldCB0b1BvaW50Q29ubmVjdGlvbk9mZnNldFkgPSAtZnJvbVBvaW50Q29ubmVjdGlvbk9mZnNldFk7XG5cbiAgICAgICAgbGV0IGZyb21Qb2ludENvbm5lY3Rpb25YID0gZnJvbVBvaW50Q29ubmVjdGlvbk9mZnNldFggKyBmcm9tUG9pbnRYO1xuICAgICAgICBsZXQgZnJvbVBvaW50Q29ubmVjdGlvblkgPSBmcm9tUG9pbnRDb25uZWN0aW9uT2Zmc2V0WSArIGZyb21Qb2ludFk7XG4gICAgICAgIGxldCB0b1BvaW50Q29ubmVjdGlvblggPSB0b1BvaW50Q29ubmVjdGlvbk9mZnNldFggKyB0b1BvaW50WDtcbiAgICAgICAgbGV0IHRvUG9pbnRDb25uZWN0aW9uWSA9IHRvUG9pbnRDb25uZWN0aW9uT2Zmc2V0WSArIHRvUG9pbnRZO1xuXG4gICAgICAgIGxldCB0cmFuc2l0aW9uR3JvdXA6IFNWR0dFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdnJyk7XG4gICAgICAgIGxldCBsaW5lU3ZnOiBTVkdQYXRoRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAncGF0aCcpOyBcbiAgICAgICAgbGluZVN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZCcsICdNICcgKyBmcm9tUG9pbnRDb25uZWN0aW9uWC50b1N0cmluZygpICsgJyAnICsgZnJvbVBvaW50Q29ubmVjdGlvblkudG9TdHJpbmcoKVxuICAgICAgICAgICAgKyAnIEwgJyArIHRvUG9pbnRDb25uZWN0aW9uWC50b1N0cmluZygpICsgJyAnICsgdG9Qb2ludENvbm5lY3Rpb25ZLnRvU3RyaW5nKCkpO1xuICAgICAgICBsaW5lU3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2UnLCAnd2hpdGUnKTsgXG4gICAgICAgIGxpbmVTdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZS13aWR0aCcsICczJyk7XG4gICAgICAgIGxpbmVTdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ21hcmtlci1lbmQnLCAndXJsKCNhcnJvdyknKTtcbiAgICAgICAgbGV0IGRmYVN2ZzogU1ZHU1ZHRWxlbWVudCA9IDxTVkdTVkdFbGVtZW50Pjxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RmYVN2ZycpO1xuICAgICAgICBkZmFTdmcuYXBwZW5kQ2hpbGQobGluZVN2Zyk7XG4gICAgfVxuXG4gICAgbW91c2VFdmVudFRvU1ZHQ29vcmQoc3ZnOiBTVkdTVkdFbGVtZW50LCBtb3VzZUV2ZW50OiBNb3VzZUV2ZW50KTogRE9NUG9pbnQge1xuICAgICAgICByZXR1cm4gdGhpcy50b1N2Z0Nvb3JkKHN2ZywgbW91c2VFdmVudC54LCBtb3VzZUV2ZW50LnkpO1xuICAgIH1cblxuICAgIHRvU3ZnQ29vcmQoc3ZnOlNWR1NWR0VsZW1lbnQsIHg6IG51bWJlciwgeTogbnVtYmVyKTogRE9NUG9pbnQge1xuICAgICAgICBsZXQgcG9pbnQgOiBTVkdQb2ludCA9IHN2Zy5jcmVhdGVTVkdQb2ludCgpO1xuICAgICAgICBwb2ludC54ID0geDtcbiAgICAgICAgcG9pbnQueSA9IHk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gcG9pbnQubWF0cml4VHJhbnNmb3JtKHN2Zy5nZXRTY3JlZW5DVE0oKS5pbnZlcnNlKCkpO1xuICAgIH1cblxuICAgIGNsZWFyU3ZnKCkge1xuICAgICAgICB0aGlzLmNsZWFyU3RhdGVzKCk7XG4gICAgICAgIHRoaXMuY2xlYXJUcmFuc2l0aW9ucygpO1xuICAgIH1cblxuICAgIGNsZWFyU3RhdGVzKCkge1xuICAgICAgICBsZXQgZWxlbWVudHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzdGF0ZScpO1xuICAgICAgICBmb3IgKGxldCBpID0gZWxlbWVudHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGVsZW1lbnRzW2ldLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xlYXJUcmFuc2l0aW9ucygpIHtcbiAgICAgICAgbGV0IHRyYW5zaXRpb25MaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RyYW5zaXRpb25zTGlzdCcpO1xuICAgICAgICBsZXQgY2hpbGROb2RlcyA9IHRyYW5zaXRpb25MaXN0LmNoaWxkTm9kZXM7XG4gICAgICAgIGZvciAobGV0IGkgPSBjaGlsZE5vZGVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBsZXQgY2hpbGQgPSBjaGlsZE5vZGVzW2ldO1xuICAgICAgICAgICAgY2hpbGQucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVTdGF0ZUF0UG9pbnQoc3RhdGU6IG51bWJlciwgc3ZnWDogbnVtYmVyLCBzdmdZOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IHN2ZzogU1ZHU1ZHRWxlbWVudCA9IDxTVkdTVkdFbGVtZW50Pjxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RmYVN2ZycpO1xuICAgICAgICBsZXQgc3RhdGVWaWV3ID0gbmV3IFN0YXRlVmlldyhzdGF0ZSk7XG4gICAgICAgIHN2Zy5hcHBlbmRDaGlsZChzdGF0ZVZpZXcuZWwpO1xuICAgICAgICB0aGlzLnN0YXRlcy5wdXNoKHN0YXRlVmlldyk7XG4gICAgICAgIHN0YXRlVmlldy5zZXRQb3NpdGlvbihzdmdYLCBzdmdZKTtcbiAgICB9XG5cbiAgICBhZGREcmFnKHN0YXRlOiBTVkdTVkdFbGVtZW50LCBncmlkOiBTVkdTVkdFbGVtZW50KSB7XG4gICAgICAgIGxldCBzZWxlY3RlZEVsZW1lbnQ6IFNWR1NWR0VsZW1lbnQgPSBudWxsO1xuICAgICAgICBsZXQgb2Zmc2V0IDogRE9NUG9pbnQ7XG5cbiAgICAgICAgc3RhdGUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgc3RhcnREcmFnKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZHJhZyk7XG4gICAgICAgIHN0YXRlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBlbmREcmFnKTtcblxuICAgICAgICBmdW5jdGlvbiBzdGFydERyYWcoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgICAgIHNlbGVjdGVkRWxlbWVudCA9IHN0YXRlO1xuICAgICAgICAgICAgb2Zmc2V0ID0gdGhpcy5tb3VzZUV2ZW50VG9TVkdDb29yZChncmlkLCBldmVudCk7XG4gICAgICAgICAgICBvZmZzZXQueCAtPSBwYXJzZUZsb2F0KHNlbGVjdGVkRWxlbWVudC5nZXRBdHRyaWJ1dGVOUyhudWxsLCBcInhcIikpO1xuICAgICAgICAgICAgb2Zmc2V0LnkgLT0gcGFyc2VGbG9hdChzZWxlY3RlZEVsZW1lbnQuZ2V0QXR0cmlidXRlTlMobnVsbCwgJ3knKSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZHJhZyhldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICAgICAgaWYgKHNlbGVjdGVkRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgbGV0IGRvbVBvaW50OiBET01Qb2ludCA9IHRoaXMubW91c2VFdmVudFRvU1ZHQ29vcmQoZ3JpZCwgZXZlbnQpO1xuICAgICAgICAgICAgICAgIHN0YXRlLnNldEF0dHJpYnV0ZSgneCcsIChkb21Qb2ludC54IC0gb2Zmc2V0LngpLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIHN0YXRlLnNldEF0dHJpYnV0ZSgneScsIChkb21Qb2ludC55IC0gb2Zmc2V0LnkpLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZW5kRHJhZyhldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICAgICAgc2VsZWN0ZWRFbGVtZW50ID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZEdyaWRFdmVudHMoKSB7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmlkJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgLy9jcmVhdGVTdGF0ZShldmVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBDb25uZWN0aW9uVmlldyB9IGZyb20gXCIuL2Nvbm5lY3Rpb25WaWV3XCI7XG5cbmV4cG9ydCBjbGFzcyBTdGF0ZVZpZXcge1xuXG4gICAgc3RhdGljIHN0YXRlUmFkaXVzID0gNDA7XG4gICAgc3RhdGljIHN0cm9rZVdpZHRoID0gNDtcbiAgICBzdGF0aWMgaGFsZlN0YXRlV2lkdGggPSBTdGF0ZVZpZXcuc3RhdGVSYWRpdXMgKyBTdGF0ZVZpZXcuc3Ryb2tlV2lkdGg7XG4gICAgc3RhdGljIHN0YXRlV2lkdGggPSAyICogU3RhdGVWaWV3LmhhbGZTdGF0ZVdpZHRoO1xuXG4gICAgc3RhdGU6IG51bWJlcjtcbiAgICBlbDogU1ZHU1ZHRWxlbWVudDtcbiAgICBjaXJjbGVFbGVtZW50OiBTVkdDaXJjbGVFbGVtZW50O1xuICAgIHRleHRFbGVtZW50OiBTVkdUZXh0RWxlbWVudDtcblxuICAgIGNvbm5lY3Rpb25zOiB7W2tleTogc3RyaW5nXTogQ29ubmVjdGlvblZpZXd9O1xuXG4gICAgY29uc3RydWN0b3Ioc3RhdGU6IG51bWJlcikge1xuICAgICAgICB0aGlzLnN0YXRlID0gc3RhdGU7XG4gICAgICAgIHRoaXMuY3JlYXRlRWxlbWVudCgpOyBcbiAgICAgICAgdGhpcy5jb25uZWN0aW9ucyA9IHt9O1xuICAgIH1cblxuICAgIGNyZWF0ZUVsZW1lbnQoKSB7XG4gICAgICAgIGxldCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsICdzdmcnKTtcbiAgICAgICAgbGV0IGNpcmNsZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCdjaXJjbGUnKTsgXG4gICAgICAgIGxldCB0ZXh0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsICd0ZXh0Jyk7XG4gICAgICAgIGVsLmFwcGVuZENoaWxkKGNpcmNsZUVsZW1lbnQpO1xuICAgICAgICBlbC5hcHBlbmRDaGlsZCh0ZXh0RWxlbWVudCk7XG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIFN0YXRlVmlldy5zdGF0ZVdpZHRoLnRvU3RyaW5nKCkpO1xuICAgICAgICBlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgU3RhdGVWaWV3LnN0YXRlV2lkdGgudG9TdHJpbmcoKSk7XG4gICAgICAgIGVsLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgZWwuY2xhc3NMaXN0LmFkZCgnc3RhdGUnKTtcblxuICAgICAgICBjaXJjbGVFbGVtZW50LnNldEF0dHJpYnV0ZU5TKG51bGwsICdyJywgU3RhdGVWaWV3LnN0YXRlUmFkaXVzLnRvU3RyaW5nKCkpO1xuICAgICAgICBjaXJjbGVFbGVtZW50LnN0eWxlLnN0cm9rZSA9ICdibGFjayc7XG4gICAgICAgIGNpcmNsZUVsZW1lbnQuc3R5bGUuc3Ryb2tlV2lkdGggPSBTdGF0ZVZpZXcuc3Ryb2tlV2lkdGgudG9TdHJpbmcoKTtcbiAgICAgICAgY2lyY2xlRWxlbWVudC5zdHlsZS5maWxsID0gJ3doaXRlJztcbiAgICAgICAgY2lyY2xlRWxlbWVudC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnY3gnLCBTdGF0ZVZpZXcuaGFsZlN0YXRlV2lkdGgudG9TdHJpbmcoKSk7XG4gICAgICAgIGNpcmNsZUVsZW1lbnQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2N5JywgU3RhdGVWaWV3LmhhbGZTdGF0ZVdpZHRoLnRvU3RyaW5nKCkpO1xuXG4gICAgICAgIGVsLm9ubW91c2VlbnRlciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBjaXJjbGVFbGVtZW50LnN0eWxlLmZpbGwgPSAnI0JCQkJCQic7XG4gICAgICAgIH0gXG4gICAgICAgIGVsLm9ubW91c2VsZWF2ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBjaXJjbGVFbGVtZW50LnN0eWxlLmZpbGwgPSAnI0ZGRkZGRic7XG4gICAgICAgIH1cblxuICAgICAgICB0ZXh0RWxlbWVudC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCAnNTAnKTtcbiAgICAgICAgdGV4dEVsZW1lbnQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsICc1MCcpO1xuICAgICAgICB0ZXh0RWxlbWVudC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneCcsIFN0YXRlVmlldy5oYWxmU3RhdGVXaWR0aC50b1N0cmluZygpKTtcbiAgICAgICAgdGV4dEVsZW1lbnQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3knLCBTdGF0ZVZpZXcuaGFsZlN0YXRlV2lkdGgudG9TdHJpbmcoKSk7XG4gICAgICAgIHRleHRFbGVtZW50LnNldEF0dHJpYnV0ZU5TKG51bGwsICdkb21pbmFudC1iYXNlbGluZScsICdtaWRkbGUnKTtcbiAgICAgICAgdGV4dEVsZW1lbnQudGV4dENvbnRlbnQgPSB0aGlzLnN0YXRlLnRvU3RyaW5nKCk7XG4gICAgICAgIHRleHRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3N0YXRlLXRleHQnKTtcblxuICAgICAgICB0aGlzLmVsID0gZWw7XG4gICAgICAgIHRoaXMuY2lyY2xlRWxlbWVudCA9IGNpcmNsZUVsZW1lbnQ7XG4gICAgICAgIHRoaXMudGV4dEVsZW1lbnQgPSB0ZXh0RWxlbWVudDtcbiAgICB9XG5cbiAgICBzZXRQb3NpdGlvbih4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgICAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZSgneCcsIHgudG9TdHJpbmcoKSk7XG4gICAgICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKCd5JywgeS50b1N0cmluZygpKVxuICAgIH1cbn0iLCJpbXBvcnQge3JlYWRGaWxlU3luYywgd3JpdGVGaWxlU3luY30gZnJvbSAnZnMnO1xuaW1wb3J0IHsgc3RhcnQgfSBmcm9tICdyZXBsJztcblxuZXhwb3J0IGNsYXNzIERmYSB7XG4gICAgYWxwaGFiZXQ6IHN0cmluZ1tdO1xuICAgIG51bVN0YXRlczogbnVtYmVyO1xuICAgIHN0YXJ0U3RhdGU6IG51bWJlcjtcbiAgICBhY2NlcHRpbmdTdGF0ZXM6IG51bWJlcltdO1xuICAgIHRyYW5zaXRpb25zOiB7W2tleSA6IG51bWJlcl06IHtba2V5OiBzdHJpbmddOiBudW1iZXJ9fTtcblxuICAgIGNvbnN0cnVjdG9yKHtcbiAgICAgICAgYWxwaGFiZXQgPSBbXSxcbiAgICAgICAgbnVtU3RhdGVzID0gMCxcbiAgICAgICAgc3RhcnRTdGF0ZSA9IDAsXG4gICAgICAgIGFjY2VwdGluZ1N0YXRlcyA9IFtdLFxuICAgICAgICB0cmFuc2l0aW9ucyA9IHt9XG4gICAgfToge2FscGhhYmV0Pzogc3RyaW5nW10sIG51bVN0YXRlcz86IG51bWJlciwgc3RhcnRTdGF0ZT86IG51bWJlciwgYWNjZXB0aW5nU3RhdGVzPzogbnVtYmVyW10sIHRyYW5zaXRpb25zPzoge1trZXkgOiBudW1iZXJdOiB7W2tleTogc3RyaW5nXTogbnVtYmVyfX19ID0ge30pIHtcbiAgICAgICAgdGhpcy5hbHBoYWJldCA9IGFscGhhYmV0OyBcbiAgICAgICAgdGhpcy5udW1TdGF0ZXMgPSBudW1TdGF0ZXM7XG4gICAgICAgIHRoaXMuc3RhcnRTdGF0ZSA9IHN0YXJ0U3RhdGU7XG4gICAgICAgIHRoaXMuYWNjZXB0aW5nU3RhdGVzID0gYWNjZXB0aW5nU3RhdGVzO1xuICAgICAgICB0aGlzLnRyYW5zaXRpb25zID0gdHJhbnNpdGlvbnM7XG4gICAgfVxuXG4gICAgYWNjZXB0c1N0cmluZyhpbnB1dFN0cmluZzogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIGxldCBleGVjdXRpb246IERmYUV4ZWN1dGlvbiA9IHRoaXMuZ2V0RXhlY3V0aW9uKGlucHV0U3RyaW5nKTtcbiAgICAgICAgZXhlY3V0aW9uLmZpbmlzaCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5hY2NlcHRpbmdTdGF0ZXMuaW5jbHVkZXMoZXhlY3V0aW9uLmN1cnJlbnRTdGF0ZSk7XG4gICAgfVxuXG4gICAgZ2V0RXhlY3V0aW9uKGlucHV0U3RyaW5nOiBzdHJpbmcpIDogRGZhRXhlY3V0aW9uIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEZmFFeGVjdXRpb24odGhpcywgaW5wdXRTdHJpbmcpO1xuICAgIH1cblxuICAgIGRlc2VyaWFsaXplKGNvbnRlbnRzOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IGxpbmVzOiBzdHJpbmdbXSA9IGNvbnRlbnRzLnNwbGl0KCdcXG4nKTtcbiAgICAgICAgdGhpcy5hbHBoYWJldCA9IGxpbmVzWzBdLnNwbGl0KCcsJyk7XG4gICAgICAgIHRoaXMubnVtU3RhdGVzID0gcGFyc2VJbnQobGluZXNbMV0pO1xuICAgICAgICB0aGlzLnN0YXJ0U3RhdGUgPSBwYXJzZUludChsaW5lc1syXSk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmFjY2VwdGluZ1N0YXRlcyA9IGxpbmVzWzNdLnNwbGl0KCcsJykubWFwKGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUludChpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy50cmFuc2l0aW9ucyA9IHt9O1xuICAgICAgICBmb3IgKGxldCBzdGF0ZSA9IDA7IHN0YXRlIDwgdGhpcy5udW1TdGF0ZXM7IHN0YXRlKyspIHtcbiAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbnNbc3RhdGVdID0ge307XG4gICAgICAgICAgICBmb3IgKGxldCBjaGFyIG9mIHRoaXMuYWxwaGFiZXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRyYW5zaXRpb25zW3N0YXRlXVtjaGFyXSA9IC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG51bVRyYW5zaXRpb25zOiBudW1iZXIgPSB0aGlzLmFscGhhYmV0Lmxlbmd0aCAqIHRoaXMubnVtU3RhdGVzO1xuICAgICAgICBmb3IgKGxldCBpID0gNDsgaSA8IDQgKyBudW1UcmFuc2l0aW9uczsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgbGluZTogc3RyaW5nW10gPSBsaW5lc1tpXS5zcGxpdCgnLCcpO1xuICAgICAgICAgICAgdGhpcy50cmFuc2l0aW9uc1twYXJzZUludChsaW5lWzBdKV1bbGluZVsxXV0gPSBwYXJzZUludChsaW5lWzJdKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNlcmlhbGl6ZSgpOiBzdHJpbmcge1xuICAgICAgICBsZXQgY29udGVudHM6IHN0cmluZ1tdID0gW107O1xuICAgICAgICBjb250ZW50cy5wdXNoKHRoaXMuYWxwaGFiZXQuam9pbignLCcpKTtcbiAgICAgICAgY29udGVudHMucHVzaCh0aGlzLm51bVN0YXRlcy50b1N0cmluZygpKTtcbiAgICAgICAgY29udGVudHMucHVzaCh0aGlzLnN0YXJ0U3RhdGUudG9TdHJpbmcoKSk7XG4gICAgICAgIGNvbnRlbnRzLnB1c2godGhpcy5hY2NlcHRpbmdTdGF0ZXMuam9pbignLCcpKTtcbiAgICAgICAgZm9yIChsZXQgc3RhdGUgPSAwOyBzdGF0ZSA8PSB0aGlzLm51bVN0YXRlczsgc3RhdGUrKykge1xuICAgICAgICAgICAgZm9yKGxldCBsZXR0ZXIgb2YgdGhpcy5hbHBoYWJldCkge1xuICAgICAgICAgICAgICAgIGNvbnRlbnRzLnB1c2goc3RhdGUudG9TdHJpbmcoKSArICcsJyArIGxldHRlciArICcsJyArIFxuICAgICAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbnNbc3RhdGVdW2xldHRlcl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb250ZW50cy5qb2luKCdcXG4nKTtcbiAgICB9XG5cbiAgICByZWFkRnJvbUZpbGUoZmlsZXBhdGg6IHN0cmluZykge1xuICAgICAgICBsZXQgY29udGVudHM6IHN0cmluZyA9IHJlYWRGaWxlU3luYyhmaWxlcGF0aCwgXCJ1dGY4XCIpO1xuICAgICAgICB0aGlzLmRlc2VyaWFsaXplKGNvbnRlbnRzKTsgXG4gICAgfVxuXG4gICAgd3JpdGVUb0ZpbGUoZmlsZXBhdGg6IHN0cmluZykge1xuICAgICAgICBsZXQgY29udGVudHM6IHN0cmluZyA9IHRoaXMuc2VyaWFsaXplKCk7XG4gICAgICAgIHdyaXRlRmlsZVN5bmMoZmlsZXBhdGgsIGNvbnRlbnRzKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgY3JlYXRlRXhhbXBsZURmYSgpOiBEZmEge1xuICAgICAgICAvL0VuZHMgd2l0aCBcIjAwXCIgREZBXG4gICAgICAgIGxldCBhbHBoYWJldCA9IFsnMCcsICcxJ107XG4gICAgICAgIGxldCBudW1TdGF0ZXMgPSAzO1xuICAgICAgICBsZXQgc3RhcnRTdGF0ZSA9IDA7XG4gICAgICAgIGxldCBhY2NlcHRpbmdTdGF0ZXMgPSBbMl07XG4gICAgICAgIGxldCB0cmFuc2l0aW9ucyA9IHtcbiAgICAgICAgICAgIDA6IHtcbiAgICAgICAgICAgICAgICAnMCc6IDEsXG4gICAgICAgICAgICAgICAgJzEnOiAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgMToge1xuICAgICAgICAgICAgICAgICcwJzogMixcbiAgICAgICAgICAgICAgICAnMSc6IDBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAyOiB7XG4gICAgICAgICAgICAgICAgJzAnOiAyLFxuICAgICAgICAgICAgICAgICcxJzogMFxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gbmV3IERmYSh7XG4gICAgICAgICAgICBhbHBoYWJldCxcbiAgICAgICAgICAgIG51bVN0YXRlcyxcbiAgICAgICAgICAgIHN0YXJ0U3RhdGUsXG4gICAgICAgICAgICBhY2NlcHRpbmdTdGF0ZXMsXG4gICAgICAgICAgICB0cmFuc2l0aW9uc1xuICAgICAgICB9KTsgXG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgRGZhQ29ubmVjdGlvbiB7XG4gICAgXG59XG5cbmV4cG9ydCBjbGFzcyBEZmFFeGVjdXRpb24ge1xuICAgIGRmYSA6IERmYTtcbiAgICBjdXJyZW50U3RhdGUgOiBudW1iZXI7IFxuICAgIGlucHV0U3RyaW5nIDogc3RyaW5nO1xuICAgIGN1cnJlbnRDaGFySW5kZXggOiBudW1iZXI7XG4gICAgcGF0aDogbnVtYmVyW107IFxuXG4gICAgY29uc3RydWN0b3IoZGZhOiBEZmEsIGlucHV0U3RyaW5nOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5kZmEgPSBkZmE7XG4gICAgICAgIHRoaXMuaW5wdXRTdHJpbmcgPSBpbnB1dFN0cmluZztcbiAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgIH1cblxuICAgIGN1cnJlbnRDaGFyKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmlucHV0U3RyaW5nW3RoaXMuY3VycmVudENoYXJJbmRleF07XG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMucGF0aCA9IFt0aGlzLmRmYS5zdGFydFN0YXRlXTtcbiAgICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSB0aGlzLmRmYS5zdGFydFN0YXRlO1xuICAgICAgICB0aGlzLmN1cnJlbnRDaGFySW5kZXggPSAwO1xuICAgIH1cblxuICAgIGZpbmlzaCgpIHtcbiAgICAgICAgd2hpbGUgKHRoaXMuY3VycmVudENoYXJJbmRleCA8IHRoaXMuaW5wdXRTdHJpbmcubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnN0ZXBGb3J3YXJkKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGVwRm9yd2FyZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudENoYXJJbmRleCA+PSB0aGlzLmlucHV0U3RyaW5nLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGN1cnJlbnRDaGFyIDogc3RyaW5nID0gdGhpcy5jdXJyZW50Q2hhcigpO1xuICAgICAgICBsZXQgbmV4dFN0YXRlIDogbnVtYmVyID0gdGhpcy5kZmEudHJhbnNpdGlvbnNbdGhpcy5jdXJyZW50U3RhdGVdW2N1cnJlbnRDaGFyXTtcbiAgICAgICAgdGhpcy5wYXRoLnB1c2gobmV4dFN0YXRlKTtcbiAgICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSBuZXh0U3RhdGU7XG4gICAgICAgIHRoaXMuY3VycmVudENoYXJJbmRleCsrO1xuICAgIH1cblxuICAgIHN0ZXBCYWNrd2FyZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudENoYXJJbmRleCA8PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IHRoaXMucGF0aC5wb3AoKTtcbiAgICAgICAgdGhpcy5jdXJyZW50Q2hhckluZGV4LS07XG4gICAgfVxufSIsbnVsbF19
