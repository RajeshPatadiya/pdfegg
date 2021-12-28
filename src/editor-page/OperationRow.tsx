import Operation from "../pdf-generating/operations/Operation";
import RectDrawingOperation from "../pdf-generating/operations/RectDrawingOperation";
import ColorPicker from "./ColorPicker";

interface Props {
  operation: Operation;
  onColorChange: (newColor: string, local: boolean) => void;
  onDelete: () => void;
}

function OperationRow({ operation, onColorChange, onDelete }: Props) {
  return (
    <li>
      {operation.getDisplayString()}
      {operation instanceof RectDrawingOperation && (
        <ColorPicker
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
