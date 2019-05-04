import { StateView } from "./StateView";

export class ConnectionView {
    
    fromStateView: StateView;
    toStateView: StateView; 
    letter: string;

    constructor(fromStateView: StateView, toStateView: StateView, letter: string) {
        this.fromStateView = fromStateView;
        this.toStateView = toStateView;
        this.letter = letter;
    }

    update() {
        let fromStateSVG = this.fromStateView.el;
        let toStateSVG = this.toStateView.el;

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

    removeConnection() {
    }

    createSVGMarker() {
        let defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        let marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        marker.setAttributeNS(null, 'id', 'arrow');
        marker.setAttributeNS(null, 'viewBox', '0 0 10 10');
        marker.setAttributeNS(null, 'refX', '5');
        marker.setAttributeNS(null, 'refY', '5');
        marker.setAttributeNS(null, 'markerWidth', '6');
        marker.setAttributeNS(null, 'markerHeight', '6');
        marker.setAttributeNS(null, 'orient', 'auto-start-reverse');
        
        let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttributeNS(null, 'd', 'M 0 0 L 10 5 L 0 10 z');

        marker.appendChild(path);
        defs.appendChild(marker);
    }
}