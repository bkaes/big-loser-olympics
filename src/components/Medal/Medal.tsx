import React from 'react';

const gradients = {
  gold: `
    radial-gradient(ellipse farthest-corner at right bottom, #FEDB37 0%, #FDB931 8%, #9f7928 30%, #8A6E2F 40%, transparent 80%),
    radial-gradient(ellipse farthest-corner at left top, #FFFFFF 0%, #FFFFAC 8%, #D1B464 25%, #5d4a1f 62.5%, #5d4a1f 100%)
  `,
  silver: `
    radial-gradient(ellipse farthest-corner at right bottom, #FFFFFF 0%, #EFEFEF 8%, #D9D9D9 30%, #BDBDBD 40%, transparent 80%),
    radial-gradient(ellipse farthest-corner at left top, #FFFFFF 0%, #F0F0F0 8%, #D4D4D4 25%, #A6A6A6 62.5%, #A6A6A6 100%)
  `,
  bronze: `
    radial-gradient(ellipse farthest-corner at right bottom, #D0853C 0%, #B8741A 8%, #8C5211 30%, #6E3E0B 40%, transparent 80%),
    radial-gradient(ellipse farthest-corner at left top, #F5D9AF 0%, #E7AC6F 8%, #C77E41 25%, #80461B 62.5%, #80461B 100%)
  `
};

const Medal = ({ 
  type = 'gold', 
  size = 40, 
  number, 
  numberColor = 'black',
  fontSize = 14 
}) => {
  const containerStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    background: gradients[type] || gradients.gold,
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  };

  const numberStyle = {
    color: numberColor,
    fontSize: `${fontSize}px`,
    fontWeight: 'bold',
    position: 'absolute',
    zIndex: 1,
  };

  return (
    <div style={containerStyle}>
      {number !== undefined && <span style={numberStyle}>{number}</span>}
    </div>
  );
};

export default Medal;