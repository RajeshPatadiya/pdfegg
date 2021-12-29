import { useCallback, useRef, useState } from "react";
import useClickOutsideEffect from "../common/useClickOutsideEffect";
import ColorPicker from "./ColorPicker";

interface Props {
  color: string;
  onChange: (newColor: string) => void;
  onChangeEnd: (finalColor: string) => void;
}

function ColorButton({ color, onChange, onChangeEnd }: Props) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  useClickOutsideEffect([popoverRef, buttonRef], () => setOpen(false));

  return (
    <div className="popover-container">
      <button
        ref={buttonRef}
        className="color-button"
        style={{ backgroundColor: color }}
        onClick={() => setOpen(!open)}
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
