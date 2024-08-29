'use client'

import React, { useEffect } from 'react';

const BuyMeACoffeeButton: React.FC = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js';
    script.dataset.name = 'bmc-button';
    script.dataset.slug = 'yourlocalbarista';
    script.dataset.color = '#FFDD00';
    script.dataset.emoji = '';
    script.dataset.font = 'Bree';
    script.dataset.text = 'Tip your barista';
    script.dataset.outlineColor = '#000000';
    script.dataset.fontColor = '#000000';
    script.dataset.coffeeColor = '#ffffff';
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id="bmc-wbtn" style={{ display: 'inline-block', marginTop: '10px' }} />;
};

export default BuyMeACoffeeButton;