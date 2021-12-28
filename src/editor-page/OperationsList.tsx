import Operation from "../pdf-generating/operations/Operation";
import OperationRow from "./OperationRow";
import {
  usePageOperations,
  usePageOperationsDispatch,
} from "./PageOperationsContext";

function OperationsList() {
  const operations = usePageOperations();
  const dispatch = usePageOperationsDispatch();

  const onUpdateAt = (
    index: number,
    updatedOperation: Operation,
    local: boolean
  ) => {
    dispatch({
      type: "UPDATE",
      index,
      operation: updatedOperation,
      local,
    });
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
          onUpdate={onUpdateAt.bind(null, index)}
          onDelete={onDeleteAt.bind(null, index)}
        />
      ))}
    </ul>
  );
}

export default OperationsList;
