import { useCallback, useReducer } from "react";
import HighDpiCanvas from "../common/HighDpiCanvas";
import RectDrawingOperation from "../pdf-generator/operations/RectDrawingOperation";

function PageOverlayCanvas({ width, height, pageWidth }) {
    const [boxState, dispatchBoxEvent] = useReducer(boxStateReducer, initialBoxState);

    const renderBox = useCallback(
        (context) => {
            const { operation } = boxState;
            if (operation === null) return;
            operation.applyOnCanvas(context, pageWidth);
        },
        [boxState, pageWidth],
    );

    const getMouseCoords = (e) => {
        const canvas = e.target;
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        }
    };

    const getPageCoords = (e) => {
        const { x, y } = getMouseCoords(e);
        return {
            x: scaleContainerToPageUnits(x),
            y: scaleContainerToPageUnits(y),
        }
    }

    const scaleContainerToPageUnits = (containerUnits) => containerUnits / width * pageWidth;

    return (
        <HighDpiCanvas
            width={width}
            height={height}
            render={renderBox}
            onMouseDown={e => {
                const { x, y } = getPageCoords(e);
                dispatchBoxEvent({ type: 'DRAG_START', x, y });
            }}
            onMouseMove={e => {
                const { x, y } = getPageCoords(e);
                dispatchBoxEvent({ type: 'DRAG_UPDATE', x, y });
            }}
            onMouseUp={e => {
                dispatchBoxEvent({ type: 'DRAG_END' });
            }}
            onMouseLeave={e => {
                dispatchBoxEvent({ type: 'DRAG_END' });
            }}
        />
    );
}

const initialBoxState = { dragging: false, operation: null };

function boxStateReducer(state, action) {
    const { dragging, operation } = state;
    const { type, x, y } = action;

    switch (type) {
        case 'DRAG_START':
            return {
                dragging: true,
                operation: new RectDrawingOperation(x, y, 0, 0)
            };
        case 'DRAG_UPDATE':
            if (!dragging) return state;
            const width = x - operation.x;
            const height = y - operation.y;
            return {
                dragging,
                operation: new RectDrawingOperation(operation.x, operation.y, width, height),
            };
        case 'DRAG_END':
            return {
                dragging: false,
                operation
            };
        default:
            throw new Error();
    }
}

export default PageOverlayCanvas;