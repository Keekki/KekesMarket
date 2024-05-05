import React, { useState, useEffect } from "react";
import Item from "../../components/Item";
import "../../styling/FeaturedItems.css";

// The FeaturedItems component displays a selection of featured items on the homepage
const FeaturedItems: React.FC = () => {
  const [itemIds, setItemIds] = useState<number[]>([]); // State to hold the IDs of featured items

  // Fetch a list of featured item IDs from the server when the component mounts
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetch(`${import.meta.env.VITE_API_URL}/api/listings`, { signal })
      .then((response) => response.json())
      .then((data) => {
        const ids = data.map((item: any) => item.id); // Extract IDs from the fetched data
        const shuffled = ids.sort(() => 0.5 - Math.random()); // Shuffle the array of IDs
        setItemIds(shuffled.slice(0, 3)); // Select the first three IDs for featured items
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error("Error fetching item IDs:", error);
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  // Render the component
  return (
    <div className="featured-items-container">
      {itemIds.map((id, index) => (
        <Item key={index} itemId={id} /> // Render an Item component for each featured item ID
      ))}
    </div>
  );
};

export default FeaturedItems;
