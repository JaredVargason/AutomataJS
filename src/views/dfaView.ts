import { Dfa, DfaExecution } from "../models/dfa";
import { StateView } from "./StateView";
import { executionAsyncId } from "async_hooks";

export class DfaView {
    dfa: Dfa;
    execution: DfaExecution;
    states: StateView[];

    static defaultStateSpacing = 200;

    constructor() {
        this.dfa = new Dfa();
        this.execution = this.dfa.getExecution('');
        this.states = [];

        this.addTestingEvents();
        this.addSaveLoadEvents();
        this.loadDefaultDfa();
    }

    addTestingEvents() {
        document.getElementById('testBtn').addEventListener('click', () => {
            this.testString();
        });
        document.getElementById('testStringInput').addEventListener('input', () => {
            this.beginStepThrough();
            this.resultReset();
        });
        document.getElementById('clearInputBtn').addEventListener('click', () => {
            this.clearTesting();
        });
        document.getElementById('forwardBtn').addEventListener('click', () => {
            this.stepForward();
        });
        document.getElementById('backBtn').addEventListener('click', () => {
            this.stepBackward();
        });
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetStepThrough();
        });
        document.getElementById('finishBtn').addEventListener('click', () => {
            this.finishStepThrough();
        });
        let indexInput = <HTMLInputElement>document.getElementById('indexInput');
        indexInput.addEventListener('input', () => {
            if (indexInput.value) {
                this.goToStep(parseInt(indexInput.value));
            }
        });
        this.addCharacterButtonEvents();
    }

    addCharacterButtonEvents() {
        let characterSlots = document.getElementById('characters');
        let numSlots = characterSlots.childElementCount;
        let middleIndex = Math.floor(numSlots / 2);

        for (let i = 0; i < middleIndex; i++) {
            characterSlots.children[i].addEventListener('click', () => {
                this.stepBackward(middleIndex - i - 1);
            });
        }
        for (let i = middleIndex + 1; i < numSlots; i++) {
            characterSlots.children[i].addEventListener('click', () => {
                this.stepForward(i - middleIndex);
            });
        }
    }

    addSaveLoadEvents() {
        document.getElementById('loadBtn').addEventListener('click', () => {
            this.loadDfaFromFile();
        });
        document.getElementById('loadExampleBtn').addEventListener('click', () => {
            this.loadDefaultDfa();
        });
        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearAll();
        });
    }

    loadDefaultDfa() {
        this.loadDfa(Dfa.createExampleDfa());
    }

    loadDfa(newDfa: Dfa) {
        this.clearAll();
        this.dfa = newDfa;
        this.updateDefinition();
        this.updateSVG();
    }   

    loadDfaFromFile() {
        var input : HTMLInputElement = document.getElementById('dfaFile') as HTMLInputElement;
        if (input.files.length == 1) {
            let reader: FileReader = new FileReader();
            reader.onload = (e) => {
                this.dfa.deserialize(reader.result as string);
                this.loadDfa(this.dfa); 
            }
            reader.readAsText(input.files[0]);
        }
    }

    clearAll() {
        this.clearDefinition();
        this.clearTesting();
        this.clearSvg();
    }

    clearDefinition() {
        let alphabetInput = document.getElementById('alphabetInput') as HTMLInputElement;
        alphabetInput.value = '';

        let numStatesInput = document.getElementById('numStatesInput') as HTMLInputElement;
        numStatesInput.value = '';

        let startStateInput = document.getElementById('startStateInput') as HTMLInputElement;
        startStateInput.value = '';

        let acceptingStatesInput = document.getElementById('acceptingStatesInput') as HTMLInputElement;
        acceptingStatesInput.value = '';

        this.clearTransitionsList();
    }

    //Panel functions
    updateDefinition() {
        this.updateAlphabet();
        this.updateNumStates();
        this.updateStartState();
        this.updateAcceptStates();
        this.updateTransitions();
    }

    updateAlphabet() {
        let alphabetInput = document.getElementById('alphabetInput') as HTMLInputElement;
        alphabetInput.value = this.dfa.alphabet.join(',');
    }

    updateNumStates() {
        let numStatesInput = document.getElementById('numStatesInput') as HTMLInputElement;
        numStatesInput.value = this.dfa.numStates.toString();
    }

    updateStartState() {
        let startStateInput = document.getElementById('startStateInput') as HTMLInputElement;
        startStateInput.value = this.dfa.startState.toString();
    }

    updateAcceptStates() {
        let acceptingStatesInput = document.getElementById('acceptingStatesInput') as HTMLInputElement;
        acceptingStatesInput.value = this.dfa.acceptingStates.join(',');
    }

    updateTransitions() {
        this.clearTransitionsList();
        for (let fromState = 0; fromState < this.dfa.numStates; fromState++) {
            for (let letter of this.dfa.alphabet) {
                this.addTransitionToList(fromState, letter, this.dfa.transitions[fromState][letter]);
            }
        }
    }

    addTransitionToList(fromState: number, letter: string, toState: number) {
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

    clearTransitionsList() {
        let transitionsList : HTMLElement = document.getElementById("transitionsList");
        while (transitionsList.firstChild) {
            transitionsList.removeChild(transitionsList.firstChild);
        } 
    }

    //String testing
    testString() {
        let inputElement = <HTMLInputElement>document.getElementById('testStringInput');
        let inputString : string = inputElement.value;
        let result : boolean = this.dfa.acceptsString(inputString);
        result ? this.resultSuccess(inputString) : this.resultFail(inputString);
    }

    clearExecutionInputString() {
        let inputElement = <HTMLInputElement>document.getElementById('testStringInput');
        inputElement.value = '';
    }

    clearInputIndex() {
        let inputIndex = <HTMLInputElement>document.getElementById('indexInput');
        inputIndex.value = '0';
    }

    resultSuccess(inputString : string) {
        let resultElement = document.getElementById('resultBar');
        resultElement.style.background = 'green';
        let resultText = document.getElementById('resultText');
        resultText.innerText = '"' + inputString + '" yields SUCCESS';
    }

    resultFail(inputString : string) {
        let resultElement = document.getElementById('resultBar');
        resultElement.style.background = 'red';
        let resultText = document.getElementById('resultText');
        resultText.innerText = '"' + inputString + '" yields FAIL';
    }

    resultReset() {
        let resultElement = document.getElementById('resultBar');
        resultElement.style.background = '#444444';
        let resultText = document.getElementById('resultText');
        resultText.innerText = 'Result';
    }

    //Step through testing
    beginStepThrough() {
        let inputElement = <HTMLInputElement>document.getElementById('testStringInput');
        this.execution = this.dfa.getExecution(inputElement.value);
        this.populateCharacters();
        this.clearInputIndex(); 
    }

    clearTesting() {
        this.clearExecutionInputString();
        this.resultReset();
        this.execution = this.dfa.getExecution('');
        this.populateCharacters();
    }

    stepForward(steps: number = 1) {
        for (let i = 0; i < steps; i++) {
            this.execution.stepForward();
        }
        this.populateCharacters();
        this.updateIndexInput();
    }

    stepBackward(steps: number = 1) {
        for (let i = 0; i < steps; i++) {
            this.execution.stepBackward();
        }
        this.populateCharacters();
        this.updateIndexInput();
    }

    goToStep(step: number) {
        if (step < 0) {
            step = 0;
            this.updateIndexInput();
        }        
        else if (step > this.execution.inputString.length) {
            step = this.execution.inputString.length - 1;
            this.updateIndexInput();
        }

        this.execution.reset();
        for (let i = 0; i < step; i++) {
            this.execution.stepForward();
        }
        
        this.populateCharacters();
    }

    resetStepThrough() {
        this.execution.reset();
        this.populateCharacters();
        this.updateIndexInput();
    }

    finishStepThrough() {
        this.execution.finish();
        this.populateCharacters();
        this.updateIndexInput();
    }

    populateCharacters() {
        let characterSlots = document.getElementById('characters');
        let numSlots = characterSlots.childElementCount;
        let middleIndex = Math.floor(numSlots / 2);
        let firstCharIndex = middleIndex - this.execution.currentCharIndex
        let lastCharIndex = firstCharIndex + this.execution.inputString.length;
        for (let i = 0; i < numSlots; i++) {
            if (i >= firstCharIndex && i < lastCharIndex) {
                characterSlots.children[i].textContent = this.execution.inputString[i - firstCharIndex];
            }
            else {
                characterSlots.children[i].textContent = '';
            }
        }
    }

    updateIndexInput() {
        let indexInput = <HTMLInputElement>document.getElementById('indexInput');
        indexInput.value = this.execution.currentCharIndex.toString();
    }

    //SVG
    updateSVG() {
        this.createStates(); 
        this.createTransitionSVGs();
    }

    createStates() {
        let svg = <SVGSVGElement><any>document.getElementById('dfaSvg');
        let middle = this.dfa.numStates / 2 - .5;
        let svgWidth = svg.getBBox().width;
        let svgHeight = svg.getBBox().height;
        for (let i = 0; i < this.dfa.numStates; i++) {
            let startX = svgWidth / 2 + (i - middle) * DfaView.defaultStateSpacing;
            let startY = svgHeight / 2 + (i - middle) * DfaView.defaultStateSpacing;
            this.createStateAtPoint(i, startX, startY);
        }
    }

    createState(state: number, event : MouseEvent) {
        var svg : SVGSVGElement = <SVGSVGElement><any>document.getElementById('dfaSvg');
        let domPoint = this.mouseEventToSVGCoord(svg, event);
        this.createStateAtPoint(state, domPoint.x, domPoint.y);
    }

    createTransitionSVGs() {
        for (let state = 0; state < this.dfa.numStates; state++) {
            for (let letter of this.dfa.alphabet) {
                if (state != this.dfa.transitions[state][letter]) {
                    this.createTransitionSVG(state, letter, this.dfa.transitions[state][letter]);
                }
            }
        }
    }

    createTransitionSVG(fromState: number, letter: string, toState: number) {
        console.log(fromState, letter, toState);
        let fromStateSVG = this.states[fromState].el;
        let toStateSVG = this.states[toState].el;
        let fromPointX: number = fromStateSVG.x.baseVal.value + StateView.halfStateWidth; //parseInt(fromStateSVG.getAttributeNS(null, 'x'));
        let fromPointY: number = fromStateSVG.y.baseVal.value + StateView.halfStateWidth; //parseInt(fromStateSVG.getAttributeNS(null, 'y')); 

        let toPointX: number = toStateSVG.x.baseVal.value + StateView.halfStateWidth; //parseInt(toStateSVG.getAttributeNS(null, 'x'));
        let toPointY: number = toStateSVG.y.baseVal.value + StateView.halfStateWidth; //parseInt(toStateSVG.getAttributeNS(null, 'y'));
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
        let fromPointConnectionOffsetX = Math.cos(angle) * StateView.stateRadius;
        let fromPointConnectionOffsetY = Math.sin(angle) * StateView.stateRadius;

        let toPointConnectionOffsetX = -fromPointConnectionOffsetX;
        let toPointConnectionOffsetY = -fromPointConnectionOffsetY;

        let fromPointConnectionX = fromPointConnectionOffsetX + fromPointX;
        let fromPointConnectionY = fromPointConnectionOffsetY + fromPointY;
        let toPointConnectionX = toPointConnectionOffsetX + toPointX;
        let toPointConnectionY = toPointConnectionOffsetY + toPointY;

        let transitionGroup: SVGGElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        let lineSvg: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path'); 
        lineSvg.setAttributeNS(null, 'd', 'M ' + fromPointConnectionX.toString() + ' ' + fromPointConnectionY.toString()
            + ' L ' + toPointConnectionX.toString() + ' ' + toPointConnectionY.toString());
        lineSvg.setAttributeNS(null, 'stroke', 'white'); 
        lineSvg.setAttributeNS(null, 'stroke-width', '3');
        lineSvg.setAttributeNS(null, 'marker-end', 'url(#arrow)');
        let dfaSvg: SVGSVGElement = <SVGSVGElement><any>document.getElementById('dfaSvg');
        dfaSvg.appendChild(lineSvg);
    }

    mouseEventToSVGCoord(svg: SVGSVGElement, mouseEvent: MouseEvent): DOMPoint {
        return this.toSvgCoord(svg, mouseEvent.x, mouseEvent.y);
    }

    toSvgCoord(svg:SVGSVGElement, x: number, y: number): DOMPoint {
        let point : SVGPoint = svg.createSVGPoint();
        point.x = x;
        point.y = y;
        
        return point.matrixTransform(svg.getScreenCTM().inverse());
    }

    clearSvg() {
        this.clearStates();
        this.clearTransitions();
    }

    clearStates() {
        let elements = document.getElementsByClassName('state');
        for (let i = elements.length - 1; i >= 0; i--) {
            elements[i].remove();
        }
    }

    clearTransitions() {
        let transitionList = document.getElementById('transitionsList');
        let childNodes = transitionList.childNodes;
        for (let i = childNodes.length - 1; i >= 0; i--) {
            let child = childNodes[i];
            child.remove();
        }
    }

    createStateAtPoint(state: number, svgX: number, svgY: number) {
        let svg: SVGSVGElement = <SVGSVGElement><any>document.getElementById('dfaSvg');
        let stateView = new StateView(state);
        svg.appendChild(stateView.el);
        this.states.push(stateView);
        stateView.setPosition(svgX, svgY);
    }

    addDrag(state: SVGSVGElement, grid: SVGSVGElement) {
        let selectedElement: SVGSVGElement = null;
        let offset : DOMPoint;

        state.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        state.addEventListener('mouseup', endDrag);

        function startDrag(event: MouseEvent) {
            selectedElement = state;
            offset = this.mouseEventToSVGCoord(grid, event);
            offset.x -= parseFloat(selectedElement.getAttributeNS(null, "x"));
            offset.y -= parseFloat(selectedElement.getAttributeNS(null, 'y'));
        }
        function drag(event: MouseEvent) {
            if (selectedElement) {
                event.preventDefault();
                let domPoint: DOMPoint = this.mouseEventToSVGCoord(grid, event);
                state.setAttribute('x', (domPoint.x - offset.x).toString());
                state.setAttribute('y', (domPoint.y - offset.y).toString());
            }
        }

        function endDrag(event: MouseEvent) {
            selectedElement = null;
        }
    }

    addGridEvents() {
        document.getElementById('grid').addEventListener('click', function(event) {
            //createState(event);
        });
    }
}