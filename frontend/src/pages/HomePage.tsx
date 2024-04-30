import React, { useState, useEffect } from "react";
import { ReactTyped } from "react-typed";
import "../styling/HomePage.css";

const items = [
  "a bike",
  "shoes",
  "clothing",
  "a PC",
  "an Xbox",
  "a sofa",
  "a TV",
  "furniture",
];

const HomePage: React.FC = () => {
  const [featuredItems, setFeaturedItems] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/listings`)
      .then((response) => response.json())
      .then((data) => setFeaturedItems(data))
      .catch((error) => console.error("Error fetching featured items:", error));
  }, []);

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="text-box">
          <div className="text-content">
            <span className="static-text">Looking for</span>
            <ReactTyped
              strings={items}
              typeSpeed={100}
              backSpeed={50}
              loop
              smartBackspace
              backDelay={1250}
              startDelay={300}
              showCursor={true}
              cursorChar="|"
              className="rotating-text"
            />
            <span className="static-text-after"> ?</span>
          </div>
          <span className="static-text-footer">Feel free to explore!</span>
        </div>
      </div>
      <div className="featured-items">
        {featuredItems.map((item, index) => (
          <div key={index} className="item">
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
