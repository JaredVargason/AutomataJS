export class ConnectionView {
    constructor() {
        
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