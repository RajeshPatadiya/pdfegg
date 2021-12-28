import Operation from "../pdf-generating/operations/Operation";
import RectDrawingOperation from "../pdf-generating/operations/RectDrawingOperation";
import ColorButton from "./ColorButton";

interface Props {
  operation: Operation;
  onUpdate: (updatedOperation: Operation, local: boolean) => void;
  onDelete: () => void;
}

function OperationRow({ operation, onUpdate, onDelete }: Props) {
  const hasColor = operation instanceof RectDrawingOperation;

  const onColorChange = (newColor: string, local: boolean) => {
    if (hasColor) {
      onUpdate(operation.copyWith({ color: newColor }), local);
    }
  };

  return (
    <li>
      {operation.getDisplayString()}
      {hasColor && (
        <ColorButton
          color={operation.color}
          onChange={(color) => onColorChange(color, true)}
          onChangeEnd={(color) => onColorChange(color, false)}
        />
      )}
      <button onClick={onDelete}>Delete</button>
    </li>
  );
}

export default OperationRow;
