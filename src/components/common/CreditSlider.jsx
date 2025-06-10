import React, { useState } from 'react';
import './CreditSlider.css'; // We'll add styles here

const CreditSlider = ({credit, onCreditFix}) => {
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
  <div className="credit-slider-container" style={{ '--progress': `${((value - min) / (max - min)) * 100}%` }}>
    <div className='credit-slider-wrapper'>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="credit-styled-slider"
      />
      <div className="credit-slider-labels">
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

export default CreditSlider;
