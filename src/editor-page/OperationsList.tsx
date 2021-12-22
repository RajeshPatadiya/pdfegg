import { usePageOperations } from "./PageOperationsContext";

function OperationsList() {
  const operations = usePageOperations();

  return (
    <ul>
      {operations.map((op) => (
        <li key={op.creationEpoch}>{op.getDisplayString()}</li>
      ))}
    </ul>
  );
}

export default OperationsList;
