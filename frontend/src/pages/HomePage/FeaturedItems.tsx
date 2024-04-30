import React, { useState, useEffect } from "react";

import "../../styling/FeaturedItems.css";

interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  ownerId: string;
  image: string;
  additionalInfo: string;
  category: string;
}

const FeaturedItems: React.FC = () => {
  const [featuredItems, setFeaturedItems] = useState<Listing[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/listings`)
      .then((response) => response.json())
      .then((data) => {
        // Shuffle array and pick the first three items
        const shuffled = data.sort(() => 0.5 - Math.random());
        setFeaturedItems(shuffled.slice(0, 3));
      })
      .catch((error) => console.error("Error fetching featured items:", error));
  }, []);

  return (
    <div className="featured-items-container">
      {featuredItems.map((item, index) => (
        <div key={index} className="featured-item">
          <img src={item.image} alt={item.title} className="item-image" />
          <div className="item-info">
            <strong>Title:</strong> {item.title}
            <br />
            <strong>Description:</strong> {item.description}
            <br />
            <strong>Category:</strong> {item.category}
            <br />
            <strong>Price:</strong> ${item.price.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedItems;
