import React, { CSSProperties } from 'react';

const gradients = {
  gold: `linear-gradient(45deg, #FEDB37 0%, #FDB931 8%, #9f7928 30%, #8A6E2F 40%, #FEDB37 100%)`,
  silver: `linear-gradient(45deg, #FFFFFF 0%, #EFEFEF 8%, #D9D9D9 30%, #BDBDBD 40%, #FFFFFF 100%)`,
  bronze: `linear-gradient(45deg, #D0853C 0%, #B8741A 8%, #8C5211 30%, #6E3E0B 40%, #D0853C 100%)`
};

const Medal = ({
  type = 'gold',
  size = 40,
  number,
  numberColor = 'primary-foreground',
  fontSize = 14
}) => {
  const gradient = gradients[type] || gradients.gold;

  const wrapperStyle: CSSProperties = {
    width: `${size + 3}px`,
    height: `${size + 3}px`,
    borderRadius: '50%',
    padding: '3px',
    background: gradient,
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'transform 0.5s ease-in-out', // Smooth transition for hover effects
    
      animation: 'spin 2s linear infinite'
    
  };

  const innerStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: '#333',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  };

  const numberStyle: CSSProperties = {
    fontSize: `${fontSize}px`,
    fontWeight: 'bold',
    position: 'absolute',
    zIndex: 1,
  };

  return (
    <div className={`shrink-0 pl-4`} style={wrapperStyle}>
      <div className={`text-${numberColor}`} style={innerStyle}>
        {number !== undefined && <span style={numberStyle}>{number}</span>}
      </div>
    </div>
  );
};

export default Medal;