import { Dfa } from '../models/dfa';
import { read } from 'fs';

let dfa: Dfa = new Dfa();

function createState() {
    var svg = document.getElementById('grid');
    var stateSvg = document.createElementNS("http://www.w3.org/2000/svg",'circle');
    stateSvg.setAttribute('r', '40');
    stateSvg.setAttribute('cx', '50');
    stateSvg.setAttribute('cy', '50');
    stateSvg.style.stroke = 'black';
    stateSvg.style.strokeWidth = '3';
    stateSvg.style.fill = 'white';
}

function loadDfa() {
    var input : HTMLInputElement = document.getElementById('dfaFile') as HTMLInputElement;
    if (input.files.length == 1) {
        let reader: FileReader = new FileReader();
        reader.onload = function(e) {
            dfa.deserialize(reader.result as string);
            updateUI();
        }
        reader.readAsText(input.files[0]);
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

function addGridEvents() {
    document.getElementById('grid').addEventListener('click', function() {
        createState();
    });
}

$(document).ready(function() {
    addGridEvents();
    document.getElementById('loadBtn').addEventListener('click', function() {
        loadDfa();
    });
});