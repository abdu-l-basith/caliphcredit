import React,{useState} from 'react'
import './MultiCreditSelecter.css'

function MultiCreditSelecter({credit, onCreditFix}) {
     const [selected, setSelected] = useState(null);
     const [creditFix,setCreidtFix] = useState();
  return (
    <div className='selecter-wrapper'>
         {credit.map((item, index) => (
        <button 
          key={index}
           className={`selecter-button ${selected === index ? 'active' : ''}`}
          value={item.Credit}
         onClick={(e) => {setSelected(index);setCreidtFix(e.target.value);onCreditFix(e.target.value)}} // Optional click handler
        >
          {item.Title}
        </button>
      ))}
    </div>
  )
}

export default MultiCreditSelecter