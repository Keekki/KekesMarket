import React, { useState, useEffect } from "react";
import Item from "../../components/Item";
import "../../styling/FeaturedItems.css";

const FeaturedItems: React.FC = () => {
  const [itemIds, setItemIds] = useState<number[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/listings`)
      .then((response) => response.json())
      .then((data) => {
        const ids = data.map((item: any) => item.id);
        const shuffled = ids.sort(() => 0.5 - Math.random());
        setItemIds(shuffled.slice(0, 3));
      })
      .catch((error) => console.error("Error fetching item IDs:", error));
  }, []);

  return (
    <div className="featured-items-container">
      {itemIds.map((id, index) => (
        <Item key={index} itemId={id} />
      ))}
    </div>
  );
};

export default FeaturedItems;
