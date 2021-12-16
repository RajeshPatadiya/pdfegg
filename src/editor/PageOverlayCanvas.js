import { useCallback, useReducer } from "react";
import HighDpiCanvas from "../common/HighDpiCanvas";
import RectDrawingOperation from "../pdf-generator/operations/RectDrawingOperation";
import { useOperations, useOperationsDispatch } from "./OperationsContext";

function PageOverlayCanvas({ width, height, pageWidth }) {
    const [boxState, boxStateDispatch] = useReducer(boxStateReducer, initialBoxState);
    const operations = useOperations();
    const operationsDispatch = useOperationsDispatch();

    const renderBox = useCallback(
        (context) => {
            operations.forEach(op => op.applyOnCanvas(context, pageWidth));

            if (boxState.operation !== null) {
                boxState.operation.applyOnCanvas(context, pageWidth);
            }
        },
        [boxState, operations, pageWidth],
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

    const onDragStart = (e) => {
        const { x, y } = getPageCoords(e);
        boxStateDispatch({ type: 'DRAG_START', x, y });
    };

    const onDragUpdate = (e) => {
        if (boxState.operation === null) return;
        const { x, y } = getPageCoords(e);
        boxStateDispatch({ type: 'DRAG_UPDATE', x, y });
    };

    const onDragEnd = (e) => {
        if (boxState.operation === null) return;
        boxStateDispatch({ type: 'DRAG_END' });
        operationsDispatch({ type: 'ADD', operation: boxState.operation });
    };

    return (
        <HighDpiCanvas
            width={width}
            height={height}
            render={renderBox}
            onMouseDown={onDragStart}
            onMouseMove={onDragUpdate}
            onMouseUp={onDragEnd}
            onMouseLeave={onDragEnd}
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
                operation: null,
            };
        default:
            throw Error('Unknown action: ' + type);
    }
}

export default PageOverlayCanvas;