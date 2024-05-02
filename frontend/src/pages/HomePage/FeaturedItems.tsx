import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "../../styling/FeaturedItems.css";
import ConnectWithoutContactOutlinedIcon from "@mui/icons-material/ConnectWithoutContactOutlined";

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

interface User {
  name: string;
  email: string;
  phoneNumber: string;
  city: string;
}

const FeaturedItems: React.FC = () => {
  const [featuredItems, setFeaturedItems] = useState<Listing[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/listings`)
      .then((response) => response.json())
      .then((data) => {
        const shuffled = data.sort(() => 0.5 - Math.random());
        setFeaturedItems(shuffled.slice(0, 3));
      })
      .catch((error) => console.error("Error fetching featured items:", error));
  }, []);

  const fetchUserDetails = (ownerId: string) => {
    fetch(`${import.meta.env.VITE_API_URL}/users/public/${ownerId}`)
      .then((response) => response.json())
      .then((data) => {
        setSelectedUser(data);
        setOpen(true);
      })
      .catch((error) => console.error("Error fetching user details:", error));
  };

  return (
    <div className="featured-items-container">
      {featuredItems.map((item, index) => (
        <div key={index} className="featured-item">
          <img
            src={`${import.meta.env.VITE_API_URL}${item.image}`}
            alt={item.title}
            className="item-image"
          />
          <div className="item-info">
            <strong>{item.title}</strong>
            <p>{item.description}</p>
            <strong>${item.price.toFixed(2)}</strong>
            <button onClick={() => fetchUserDetails(item.ownerId)}>
              Contact the Seller <ConnectWithoutContactOutlinedIcon />
            </button>
            <Popup
              open={open}
              closeOnDocumentClick={false}
              onClose={() => setOpen(false)}
            >
              <div className="modal">
                <a className="close" onClick={() => setOpen(false)}>
                  &times;
                </a>
                <div className="header"> {item.title} </div>
                <div className="content">
                  {selectedUser ? (
                    <>
                      <p>
                        This item is being sold by{" "}
                        <strong>{selectedUser.name}</strong>! Feel free to
                        contact him/her by email:
                      </p>
                      <p>
                        <strong>{selectedUser.email}</strong>
                      </p>
                      <p>or by phone:</p>
                      <p>
                        <strong>{selectedUser.phoneNumber}</strong>
                      </p>
                      <p>
                        Where? <strong>{selectedUser.city}</strong>
                      </p>
                      <p>NOTE from the seller: {item.additionalInfo}</p>
                    </>
                  ) : (
                    <p>Loading...</p>
                  )}
                </div>
              </div>
            </Popup>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedItems;
