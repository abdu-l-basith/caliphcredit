import React, { useState } from 'react';
import './Slider.css'; // We'll add styles here

const SliderWithLabels = ({credit, onCreditFix}) => {
  const min = 1;
  const max = credit;
  const step = 1;
   // Default position
const [creditFix, setCreditFix] = useState();
const [value,setValue] = useState(1);
  const handleChange = (e) => {
    const newValue = Number(e.target.value)
    setValue(Number(e.target.value));
    setCreditFix(Number(e.target.value))
    onCreditFix(Number(e.target.value))
  };

  const labels = [];
  for (let i = min; i <= max; i += step) {
    labels.push(i);
  } 
  return (
    <div className="slider-container">
        <div className='slider-wrapper'>
            <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="styled-slider"
      />
      <div className="slider-labels">
        {labels.map((label) => (
          <span
            key={label}
            className={`label ${label === value ? 'active' : ''}`}
          >
            {label}
          </span>
        ))}
      </div>
        </div>
      
    </div>
  );
};

export default SliderWithLabels;
