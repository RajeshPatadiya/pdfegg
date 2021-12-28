import { useRef, useState } from "react";
import useClickOutsideEffect from "../common/useKeyOutsideEffect";
import ColorPicker from "./ColorPicker";

interface Props {
  color: string;
  onChange: (newColor: string) => void;
  onChangeEnd: (finalColor: string) => void;
}

function ColorButton({ color, onChange, onChangeEnd }: Props) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useClickOutsideEffect(popoverRef, () => setOpen(false));

  return (
    <div className="popover-container">
      <button
        className="color-button"
        style={{ backgroundColor: color }}
        onClick={() => setOpen(true)}
      />

      {open && (
        <div className="popover" ref={popoverRef}>
          <ColorPicker
            color={color}
            onChange={onChange}
            onChangeEnd={onChangeEnd}
          />
        </div>
      )}
    </div>
  );
}

export default ColorButton;
