import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";

interface Props {
  color: string;
  onChange: (newColor: string) => void;
  onChangeEnd: () => void;
}

function ColorPicker({ color, onChange, onChangeEnd }: Props) {
  const [changing, setChanging] = useState(false);

  const handleChange = (newColor: string) => {
    onChange(newColor);
    if (!changing) setChanging(true);
  };

  const handleChangeEnd = () => {
    if (changing) {
      onChangeEnd();
      setChanging(false);
    }
  };

  useEffect(() => {
    document.addEventListener("pointerup", handleChangeEnd);

    return () => {
      document.removeEventListener("pointerup", handleChangeEnd);
    };
  });

  return <HexColorPicker color={color} onChange={handleChange} />;
}

export default ColorPicker;
