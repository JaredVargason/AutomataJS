import { Dfa, DfaExecution } from '../models/dfa';
import {StateView} from './stateView';

let dfa: Dfa = new Dfa();
let execution: DfaExecution = null;
let states: StateView[] = [];



function saveDfaToFile() {

}

function loadDfaFromFile() {
    var input : HTMLInputElement = document.getElementById('dfaFile') as HTMLInputElement;
    if (input.files.length == 1) {
        let reader: FileReader = new FileReader();
        reader.onload = function(e) {
            dfa.deserialize(reader.result as string);
            loadDfa(dfa); 
        }
        reader.readAsText(input.files[0]);
    }
}

function loadDfa(newDfa: Dfa) {
    clearAll();
    dfa = newDfa;
    updatePanel();
    updateSVG();
}

//Panel functions
function updatePanel() {
    updateAlphabet();
    updateNumStates();
    updateStartState();
    updateAcceptStates();
    updateTransitions();
}

function updateAlphabet() {
    let alphabetInput = document.getElementById('alphabetInput') as HTMLInputElement;
    alphabetInput.value = dfa.alphabet.join(',');
}

function updateNumStates() {
    let numStatesInput = document.getElementById('numStatesInput') as HTMLInputElement;
    numStatesInput.value = dfa.numStates.toString();
}

function updateStartState() {
    let startStateInput = document.getElementById('startStateInput') as HTMLInputElement;
    startStateInput.value = dfa.startState.toString();
}

function updateAcceptStates() {
    let acceptingStatesInput = document.getElementById('acceptingStatesInput') as HTMLInputElement;
    acceptingStatesInput.value = dfa.acceptingStates.join(',');
}

function updateTransitions() {
    clearTransitionsList();
    for (let fromState = 0; fromState < dfa.numStates; fromState++) {
        for (let letter of dfa.alphabet) {
            addTransition(fromState, letter, dfa.transitions[fromState][letter]);
        }
    }
}

function clearTransitionsList() {
    let transitionsList : HTMLElement = document.getElementById("transitionsList");
    while (transitionsList.firstChild) {
        transitionsList.removeChild(transitionsList.firstChild);
    } 
}

function addTransition(fromState: number, letter: string, toState: number) {
    let transitionList = document.getElementById('transitionsList');
    let text = fromState.toString() + ' + ' + letter + ' &rarr;'
    let listElement = document.createElement('li');
    listElement.classList.add('list-group-item');

    let listItemString = 
    '<div class="input-group">\
            <div class="input-group-prepend">\
                <span class="input-group-text">' + text + '</span>\
            </div>\
            <input type="number" class="form-control" placeholder="Q" value="' + toState + '">\
        </div>';
    listElement.innerHTML = listItemString;
    transitionList.appendChild(listElement);
}

//SVG
function updateSVG() {
    createStates(); 
    createTransitionSVGs();
}

let stateSpacing: number = 200;
function createStates() {
    let svg = <SVGSVGElement><any>document.getElementById('dfaSvg');
    let middle = dfa.numStates / 2 - .5;
    let svgWidth = svg.getBBox().width;
    let svgHeight = svg.getBBox().height;
    for (let i = 0; i < dfa.numStates; i++) {
        let startX = svgWidth / 2 + (i - middle) * stateSpacing;
        let startY = svgHeight / 2 + (i - middle) * stateSpacing;
        createStateAtPoint(i, startX, startY);
    }
}

function createState(state: number, event : MouseEvent) {
    var svg : SVGSVGElement = <SVGSVGElement><any>document.getElementById('dfaSvg');
    let domPoint = mouseEventToSVGCoord(svg, event);
    createStateAtPoint(state, domPoint.x, domPoint.y);
}

function createTransitionSVGs() {
    for (let state = 0; state < dfa.numStates; state++) {
        for (let letter of dfa.alphabet) {
            if (state != dfa.transitions[state][letter]) {
                createTransitionSVG(state, letter, dfa.transitions[state][letter]);
            }
        }
    }
}

function createTransitionSVG(fromState: number, letter: string, toState: number) {
    console.log(fromState, letter, toState);
    let fromStateSVG = states[fromState].el;
    let toStateSVG = states[toState].el;

    let fromPointX: number = fromStateSVG.x.baseVal.value; //parseInt(fromStateSVG.getAttributeNS(null, 'x'));
    let fromPointY: number = fromStateSVG.y.baseVal.value; //parseInt(fromStateSVG.getAttributeNS(null, 'y')); 

    let toPointX: number = toStateSVG.x.baseVal.value; //parseInt(toStateSVG.getAttributeNS(null, 'x'));
    let toPointY: number = toStateSVG.y.baseVal.value; //parseInt(toStateSVG.getAttributeNS(null, 'y'));
    console.log(fromPointX, fromPointY, toPointX, toPointY);

    //get angle between nodes.
    let xDiff = toPointX - fromPointX;
    let yDiff = toPointY - fromPointY;

    let angle: number;
    if (xDiff == 0) {
        angle = 0;
    }
    else {
        angle = Math.tan(yDiff/xDiff);
    }
    let fromPointConnectionOffsetX = Math.cos(angle) * stateRadius;
    let fromPointConnectionOffsetY = Math.sin(angle) * stateRadius;

    let toPointConnectionOffsetX = -fromPointConnectionOffsetX;
    let toPointConnectionOffsetY = -fromPointConnectionOffsetY;

    let fromPointConnectionX = fromPointConnectionOffsetX + fromPointX + StateView.halfStateWidth;
    let fromPointConnectionY = fromPointConnectionOffsetY + fromPointY + StateView.halfStateWidth;
    let toPointConnectionX = toPointConnectionOffsetX + toPointX + StateView.halfStateWidth;
    let toPointConnectionY = toPointConnectionOffsetY + toPointY + StateView.halfStateWidth;

    let transitionGroup: SVGGElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    let lineSvg: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path'); 
    lineSvg.setAttributeNS(null, 'd', 'M ' + fromPointConnectionX.toString() + ' ' + fromPointConnectionY.toString()
        + ' L ' + toPointConnectionX.toString() + ' ' + toPointConnectionY.toString());
    lineSvg.setAttributeNS(null, 'stroke', 'white'); 
    lineSvg.setAttributeNS(null, 'stroke-width', '3');
    let dfaSvg: SVGSVGElement = <SVGSVGElement><any>document.getElementById('dfaSvg');
    dfaSvg.appendChild(lineSvg);
}

function mouseEventToSVGCoord(svg: SVGSVGElement, mouseEvent: MouseEvent): DOMPoint {
    return toSvgCoord(svg, mouseEvent.x, mouseEvent.y);
}

function toSvgCoord(svg:SVGSVGElement, x: number, y: number): DOMPoint {
    let point : SVGPoint = svg.createSVGPoint();
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
    let alphabetInput = document.getElementById('alphabetInput') as HTMLInputElement;
    alphabetInput.value = '';

    let numStatesInput = document.getElementById('numStatesInput') as HTMLInputElement;
    numStatesInput.value = '';

    let startStateInput = document.getElementById('startStateInput') as HTMLInputElement;
    startStateInput.value = '';

    let acceptingStatesInput = document.getElementById('acceptingStatesInput') as HTMLInputElement;
    acceptingStatesInput.value = '';

    clearTransitionsList();
}

function clearSvg() {
    clearStates();
    clearTransitions();
}

function clearStates() {
    let elements = document.getElementsByClassName('state');
    for (let i = elements.length - 1; i >= 0; i--) {
        elements[i].remove();
    }
}

function clearTransitions() {
    let transitionList = document.getElementById('transitionsList');
    let childNodes = transitionList.childNodes;
    for (let i = childNodes.length - 1; i >= 0; i--) {
        let child = childNodes[i];
        child.remove();
    }
}

let stateRadius = 40;
let strokeWidth = 4;
let halfStateWidth = (stateRadius + strokeWidth);
let stateWidth = 2 * halfStateWidth;
function createStateAtPoint(state: number, svgX: number, svgY: number) {
    let svg: SVGSVGElement = <SVGSVGElement><any>document.getElementById('dfaSvg');
    let stateView = new StateView(state);
    svg.appendChild(stateView.el);
    states.push(stateView);
    stateView.setPosition(svgX, svgY);
}

function addDrag(state: SVGSVGElement, grid: SVGSVGElement) {
    let selectedElement: SVGSVGElement = null;
    let offset : DOMPoint;

    state.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    state.addEventListener('mouseup', endDrag);

    function startDrag(event: MouseEvent) {
        selectedElement = state;
        offset = mouseEventToSVGCoord(grid, event);
        offset.x -= parseFloat(selectedElement.getAttributeNS(null, "x"));
        offset.y -= parseFloat(selectedElement.getAttributeNS(null, 'y'));
    }
    function drag(event: MouseEvent) {
        if (selectedElement) {
            event.preventDefault();
            let domPoint: DOMPoint = mouseEventToSVGCoord(grid, event);
            state.setAttribute('x', (domPoint.x - offset.x).toString());
            state.setAttribute('y', (domPoint.y - offset.y).toString());
        }
    }

    function endDrag(event: MouseEvent) {
        selectedElement = null;
    }
}



function addGridEvents() {
    document.getElementById('grid').addEventListener('click', function(event) {
        //createState(event);
    });
}

function loadDefaultDfa() {
    loadDfa(createDefaultDfa());
}

//String testing
function testString() {
    let inputElement = <HTMLInputElement>document.getElementById('testStringInput');
    let inputString : string = inputElement.value;
    let result : boolean = dfa.acceptsString(inputString);
    result ? resultSuccess(inputString) : resultFail(inputString);
}

function clearInput() {
    let inputElement = <HTMLInputElement>document.getElementById('testStringInput');
    inputElement.value = '';
}

function resultSuccess(inputString : string) {
    let resultElement = document.getElementById('resultBar');
    resultElement.style.background = 'green';
    let resultText = document.getElementById('resultText');
    resultText.innerText = '"' + inputString + '" yields SUCCESS';
}

function resultFail(inputString : string) {
    let resultElement = document.getElementById('resultBar');
    resultElement.style.background = 'red';
    let resultText = document.getElementById('resultText');
    resultText.innerText = '"' + inputString + '" yields FAIL';
}

function resultReset() {
    let resultElement = document.getElementById('resultBar');
    resultElement.style.background = '#444444';
    let resultText = document.getElementById('resultText');
    resultText.innerText = 'Result';
}

//Step through testing
function beginStepThrough() {
    let inputElement = <HTMLInputElement>document.getElementById('testStringInput');
    execution = dfa.getExecution(inputElement.value);
    populateCharacters();
}

function clearTesting() {
    clearInput();
    resultReset();
    execution = dfa.getExecution('');
    populateCharacters();
}

function stepForward(steps: number = 1) {
    for (let i = 0; i < steps; i++) {
        execution.step_forward();
    }
    populateCharacters();
    updateIndexInput();
}

function stepBackward(steps: number = 1) {
    for (let i = 0; i < steps; i++) {
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
    let characterSlots = document.getElementById('characters');
    let numSlots = characterSlots.childElementCount;
    let middleIndex = Math.floor(numSlots / 2);
    let firstCharIndex = middleIndex - execution.currentCharIndex
    let lastCharIndex = firstCharIndex + execution.inputString.length;
    for (let i = 0; i < numSlots; i++) {
        if (i >= firstCharIndex && i < lastCharIndex) {
            characterSlots.children[i].textContent = execution.inputString[i - firstCharIndex];
        }
        else {
            characterSlots.children[i].textContent = '';
        }
    }
}

function updateIndexInput() {
    let indexInput = <HTMLInputElement>document.getElementById('indexInput');
    indexInput.value = execution.currentCharIndex.toString();
}

function addSaveLoadEvents() {
   document.getElementById('loadBtn').addEventListener('click', function() {
        loadDfaFromFile();
    });
    document.getElementById('loadExampleBtn').addEventListener('click', function() {
        loadDefaultDfa();
    });
    document.getElementById('clearBtn').addEventListener('click', function() {
        clearAll();
    });
}

function addTestingEvents() {
    document.getElementById('testBtn').addEventListener('click', function() {
        testString();
    });
    document.getElementById('testStringInput').addEventListener('input', function() {
        beginStepThrough();
        resultReset();
    });
    document.getElementById('clearInputBtn').addEventListener('click', function() {
        clearTesting();
    });
    document.getElementById('forwardBtn').addEventListener('click', function() {
        stepForward();
    });
    document.getElementById('backBtn').addEventListener('click', function() {
        stepBackward();
    });
    document.getElementById('resetBtn').addEventListener('click', function(){
        resetStepThrough();
    });
    document.getElementById('finishBtn').addEventListener('click', function() {
        finishStepThrough();
    });
    addCharacterButtonEvents();
}

function addCharacterButtonEvents() {
    let characterSlots = document.getElementById('characters');
    let numSlots = characterSlots.childElementCount;
    let middleIndex = Math.floor(numSlots / 2);

    for (let i = 0; i < middleIndex; i++) {
        characterSlots.children[i].addEventListener('click', function() {
            stepBackward(middleIndex - i - 1);
        });
    }
    for (let i = middleIndex + 1; i < numSlots; i++) {
        characterSlots.children[i].addEventListener('click', function() {
            stepForward(i - middleIndex);
        });
    }
}

$(document).ready(function() {
    //addGridEvents();
    addTestingEvents();
    addSaveLoadEvents();
    loadDefaultDfa();
});
