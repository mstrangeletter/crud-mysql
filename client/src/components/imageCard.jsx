import React from 'react';
import "../components/imagecard.css";

function ImageCard({ imagePath, country, description }) {
    const imageUrl = `/public/dbimages/${imagePath}`;
    
  
    return (
      <div className="container">
        <div className="cardFlag">
          <div className="cardImg">
            <img src={imageUrl} alt="Flag"/>
          </div>
          <div className="cardTitle">{country}</div>
          <div className="cardSubtitle">{description}</div>
          <div className="cardWrapper">
            <button className="cardBtn">Button</button>
            <button className="cardBtn cardBtnSolid">Button</button>
          </div>
        </div>
      </div>
    );
}

export default ImageCard;
