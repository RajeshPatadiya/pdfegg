import RectDrawingOperation from "../pdf-generating/operations/RectDrawingOperation";
import ColorPicker from "./ColorPicker";
import {
  usePageOperations,
  usePageOperationsDispatch,
} from "./PageOperationsContext";

function OperationsList() {
  const operations = usePageOperations();
  const dispatch = usePageOperationsDispatch();

  const deleteAt = (index: number) => {
    dispatch({
      type: "REMOVE",
      index,
    });
  };

  const changeColorAt = (index: number, newColor: string, local: boolean) => {
    const operation = operations[index];

    if (operation instanceof RectDrawingOperation) {
      dispatch({
        type: "UPDATE",
        index,
        operation: operation.copyWith({ color: newColor }),
        local,
      });
    }
  };

  return (
    <ul>
      {operations.map((op, index) => (
        <li key={op.creationEpoch}>
          {op.getDisplayString()}
          {op instanceof RectDrawingOperation && (
            <ColorPicker
              color={op.color}
              onChange={(color) => changeColorAt(index, color, true)}
              onChangeEnd={(color) => changeColorAt(index, color, false)}
            />
          )}
          <button onClick={() => deleteAt(index)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

export default OperationsList;
