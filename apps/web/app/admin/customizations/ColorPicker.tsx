import { Button } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { HexColorPicker } from "react-colorful";

interface ColorPickerProps {
  colors: string[]; // Predefined colors
  onSelect: (color: string) => void;
  defaultColor?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ colors, onSelect, defaultColor }) => {
  const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(false);
  const [currentColor, setCurrentColor] = useState<string>(defaultColor || colors[0]);
  const [selectedColor, setSelectedColor] = useState<string>(defaultColor || colors[0]);
  const [displayColors, setDisplayColors] = useState<string[]>([])
  const isColorInPredefined = (color: string) => colors.includes(color);

  useEffect(() => {
    setCurrentColor(defaultColor || colors[0])
    setSelectedColor(defaultColor || colors[0])
    onSelect(defaultColor || colors[0])
    console.log("inside useefect currentc olor " + currentColor)
    if (isColorInPredefined(currentColor)) {
      setDisplayColors(colors)
      console.log(colors)
    }
    else {
      setDisplayColors([...colors, currentColor]);
    }
  }, [])
  const handleColorSelect = (event: React.MouseEvent<HTMLButtonElement>, color: string) => {
    event.preventDefault();
    setCurrentColor(color);
    setSelectedColor(color);
    setDisplayColorPicker(false);
    onSelect(color);
  };
  const handleApplyColor = (e: string) => {
    setSelectedColor(e);
    setCurrentColor(e)
    onSelect(e); // Apply the selected color
  };
  const removeColorPicker = () => {
    setDisplayColorPicker(false); // Close the picker
    setDisplayColors([...displayColors, selectedColor])
  };
  const toggleColorPicker = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setDisplayColorPicker(!displayColorPicker);
  };

  // Display the predefined colors and the selected custom color if it's not predefined
  return (
    <div className="flex flex-wrap gap-2 items-center">
      {displayColors.map((color, index) => (
        <button
          key={`${color}-${index}`}
          className={`h-8 w-8 rounded-full ${selectedColor === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
          style={{ backgroundColor: color }}
          onClick={(event) => handleColorSelect(event, color)}
        />
      ))}
      <button onClick={(event) => toggleColorPicker(event)} className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-300 text-lg">
        ...
      </button>
      {displayColorPicker && (
        <div className="fixed inset-0 z-999 flex items-center justify-center">
          <div className="bg-white p-2 shadow-xl rounded-lg text-center">
            {/* <SketchPicker color={selectedColor} onChangeComplete={handleChangeComplete} /> */}
            <HexColorPicker color={selectedColor} onChange={handleApplyColor} />
            <Button
              color='default'
              onClick={removeColorPicker}
              className="mt-2"
            >

              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
