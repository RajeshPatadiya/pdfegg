import RectDrawingOperation from "../pdf-generating/operations/RectDrawingOperation";
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

  const changeColorAt = (index: number, newColor: string, finished = false) => {
    const operation = operations[index];

    if (operation instanceof RectDrawingOperation) {
      dispatch(
        {
          type: "REPLACE",
          index,
          operation: operation.copyWith({ color: newColor }),
        },
        finished
      );
    }
  };

  return (
    <ul>
      {operations.map((op, index) => (
        <li key={op.creationEpoch}>
          {op.getDisplayString()}
          {op instanceof RectDrawingOperation && (
            <input
              type="color"
              value={op.color}
              onChange={(e) => changeColorAt(index, e.target.value)}
              onBlur={(e) => changeColorAt(index, e.target.value, true)}
            />
          )}
          <button onClick={() => deleteAt(index)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

export default OperationsList;
