import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import ConnectWithoutContactOutlinedIcon from "@mui/icons-material/ConnectWithoutContactOutlined";
import CircularProgress from "@mui/material/CircularProgress";

import "../styling/Item.css";

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

const Item: React.FC<{ itemId: number }> = ({ itemId }) => {
  const [item, setItem] = useState<Listing | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Fetch the item details
    fetch(`${import.meta.env.VITE_API_URL}/api/listings/${itemId}`)
      .then((response) => response.json())
      .then((data) => {
        setItem(data);
        // Fetch user details
        fetch(`${import.meta.env.VITE_API_URL}/users/public/${data.ownerId}`)
          .then((response) => response.json())
          .then(setSelectedUser)
          .catch((error) =>
            console.error("Error fetching user details:", error)
          );
      })
      .catch((error) => console.error("Error fetching item details:", error));
  }, [itemId]);

  return (
    <div className="item">
      {item && (
        <>
          <img
            src={`${import.meta.env.VITE_API_URL}${item.image}`}
            alt={item.title}
            className="item-image"
          />
          <div className="item-info">
            <strong>{item.title}</strong>
            <p>{item.description}</p>
            <strong>${item.price.toFixed(2)}</strong>
            <button onClick={() => setOpen(true)}>
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
                    <CircularProgress color="inherit" />
                  )}
                </div>
              </div>
            </Popup>
          </div>
        </>
      )}
    </div>
  );
};

export default Item;
