import RectDrawingOperation from "../pdf-generating/operations/RectDrawingOperation";
import OperationRow from "./OperationRow";
import {
  usePageOperations,
  usePageOperationsDispatch,
} from "./PageOperationsContext";

function OperationsList() {
  const operations = usePageOperations();
  const dispatch = usePageOperationsDispatch();

  const onColorChangeAt = (index: number, newColor: string, local: boolean) => {
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

  const onDeleteAt = (index: number) => {
    dispatch({
      type: "REMOVE",
      index,
    });
  };

  return (
    <ul>
      {operations.map((operation, index) => (
        <OperationRow
          key={operation.creationEpoch}
          operation={operation}
          onColorChange={onColorChangeAt.bind(null, index)}
          onDelete={onDeleteAt.bind(null, index)}
        />
      ))}
    </ul>
  );
}

export default OperationsList;
