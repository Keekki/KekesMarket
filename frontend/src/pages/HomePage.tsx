import React, { useState, useEffect } from "react";
import "../styling/HomePage.css";

const items = [
  "a bike",
  "shoes",
  "clothing",
  "a PC",
  "an Xbox",
  "a sofa",
  "a TV",
  "a painting",
];
const changeInterval = 4500; // Time in milliseconds

const HomePage: React.FC = () => {
  const [currentItem, setCurrentItem] = useState(0);
  const [featuredItems, setFeaturedItems] = useState<any[]>([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentItem((prevItem) => (prevItem + 1) % items.length);
    }, changeInterval);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/listings`)
      .then((response) => response.json())
      .then((data) => setFeaturedItems(data))
      .catch((error) => console.error("Error fetching featured items:", error));
  }, []);

  return (
    <div className="home-page">
      <div
        className="hero-section"
        style={{ backgroundImage: 'url("/background2.jpg")' }}
      >
        <div className="text-box">
          <span className="static-text">Looking for </span>
          <span className="changing-text">{items[currentItem]}</span>
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
