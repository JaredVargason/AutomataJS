export class StateView {

    static stateRadius = 40;
    static strokeWidth = 4;
    static halfStateWidth = StateView.stateRadius + StateView.strokeWidth;
    static stateWidth = 2 * StateView.halfStateWidth;

    state: number;
    el: SVGSVGElement;
    circleElement: SVGCircleElement;
    textElement: SVGTextElement;

    constructor(state: number) {
        this.state = state;
        this.createElement(); 
    }

    createElement() {
        let el = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        let circleElement = document.createElementNS("http://www.w3.org/2000/svg",'circle'); 
        let textElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
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

        circleElement.onmouseenter = function(event) {
            circleElement.style.fill = '#BBBBBB';
        } 
        circleElement.onmouseleave = function(event) {
            circleElement.style.fill = '#FFFFFF';
        }

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
    }

    setPosition(x: number, y: number) {
        this.el.setAttribute('x', x.toString());
        this.el.setAttribute('y', y.toString())
    }
}