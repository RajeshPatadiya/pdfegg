import { HexColorPicker } from "react-colorful";
import useDebounce from "../common/hooks/useDebounce";

interface Props {
  color: string;
  onChange: (newColor: string) => void;
  onChangeEnd: (finalColor: string) => void;
}

function ColorPicker({ color, onChange, onChangeEnd }: Props) {
  const debounce = useDebounce(500);

  const handleChange = (newColor: string) => {
    onChange(newColor);
    debounce(() => onChangeEnd(newColor));
  };

  return <HexColorPicker color={color} onChange={handleChange} />;
}

export default ColorPicker;
