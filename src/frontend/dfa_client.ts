import { Dfa, DfaExecution } from '../models/dfa';
import { read } from 'fs';
import { pathToFileURL } from 'url';
import { create } from 'domain';
import { exec } from 'child_process';

class State {
    stateNum: number;
    svg: SVGSVGElement; 

    constructor(stateNum: number) {

    }
}

let dfa: Dfa = new Dfa();
let execution: DfaExecution = null;
let states: SVGGElement[] = [];

function createDefaultDfa(): Dfa {
    //Ends with "00" DFA
    let alphabet = ['0', '1'];
    let numStates = 3;
    let startState = 0;
    let acceptingStates = [2];
    let transitions = {
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
        alphabet,
        numStates,
        startState,
        acceptingStates,
        transitions
    }); 
}

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
}

function addTransitionSVG(fromState, toState) {
    
}

function createState(event : MouseEvent) {
    var svg : SVGSVGElement = <SVGSVGElement><any>document.getElementById('dfaSvg');
    let domPoint = mouseEventToSVGCoord(svg, event);
    createStateAtPoint(domPoint.x, domPoint.y);
}

function addDrag(state: SVGCircleElement, grid: SVGSVGElement) {
    let selectedElement: SVGCircleElement = null;
    let offset : DOMPoint;

    state.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    state.addEventListener('mouseup', endDrag);

    function startDrag(event: MouseEvent) {
        selectedElement = state;
        offset = mouseEventToSVGCoord(grid, event);
        offset.x -= parseFloat(selectedElement.getAttributeNS(null, "cx"));
        offset.y -= parseFloat(selectedElement.getAttributeNS(null, 'cy'));
    }
    function drag(event: MouseEvent) {
        if (selectedElement) {
            event.preventDefault();
            let domPoint: DOMPoint = mouseEventToSVGCoord(grid, event);
            state.setAttribute('cx', (domPoint.x - offset.x).toString());
            state.setAttribute('cy', (domPoint.y - offset.y).toString());
        }
    }

    function endDrag(event: MouseEvent) {
        selectedElement = null;
    }
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

function createStateAtPoint(svgX: number, svgY: number) {
    var svg: SVGSVGElement = <SVGSVGElement><any>document.getElementById('dfaSvg');
    var group: SVGGElement = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    var circle = document.createElementNS("http://www.w3.org/2000/svg",'circle');
    circle.setAttribute('draggable', 'true');
    circle.setAttribute('r', '40');
    circle.setAttribute('cx', svgX.toString());
    circle.setAttribute('cy', svgY.toString());
    circle.style.stroke = 'black';
    circle.style.strokeWidth = '3';
    circle.style.fill = 'white';
    circle.style.position = 'absolute';
    circle.classList.add('state');
    circle.onmouseenter = function(event) {
        circle.style.fill = '#BBBBBB';
    };
    circle.onmouseleave = function(event) {
        circle.style.fill = '#FFFFFF';
    }
    addDrag(circle, svg);
    svg.appendChild(circle);
}

let stateSpacing: number = 200;
function createStates() {
    let svg = <SVGSVGElement><any>document.getElementById('dfaSvg');
    let middle = dfa.numStates / 2 - .5;
    let svgWidth = svg.getBBox().width;
    let svgHeight = svg.getBBox().height;
    for (let i = 0; i < dfa.numStates; i++) {
        let startX = svgWidth / 2 + (i - middle) * stateSpacing;
        let startY = svgHeight / 2 - middle * stateSpacing;
        createStateAtPoint(startX, startY);
    }
}

function addGridEvents() {
    document.getElementById('grid').addEventListener('click', function(event) {
        createState(event);
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

$(document).ready(function() {
    //addGridEvents();
    document.getElementById('loadBtn').addEventListener('click', function() {
        loadDfaFromFile();
    });
    document.getElementById('loadExampleBtn').addEventListener('click', function() {
        loadDefaultDfa();
    });
    document.getElementById('testBtn').addEventListener('click', function() {
        testString();
    });
    document.getElementById('clearBtn').addEventListener('click', function() {
        clearAll();
    });
    document.getElementById('clearInputBtn').addEventListener('click', function() {
        clearTesting();
    });
    document.getElementById('testStringInput').addEventListener('input', function() {
        beginStepThrough();
        resultReset();
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
    loadDefaultDfa();
});
