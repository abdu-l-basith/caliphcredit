import React, { useEffect } from 'react'

function SingleCredit({credit, onCreditFix}) {
useEffect(() => {
    onCreditFix(credit); // Set the value on mount
  }, [credit, onCreditFix]);

  return <h4>Credit: {credit}</h4>;
};

export default SingleCredit