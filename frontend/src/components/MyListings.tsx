import { useState, useEffect, useContext } from "react";

import { UserContext } from "./User/UserContext";
import Item from "./Item";
import { toast } from "react-hot-toast";

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

const MyListings = () => {
  const { user } = useContext(UserContext);
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    // Function to fetch listings
    const fetchListings = () => {
      if (user && user.token) {
        fetch(`${import.meta.env.VITE_API_URL}/api/user/listings`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.error) {
              toast.error("Failed to fetch listings: " + data.message);
            } else {
              setListings(data);
            }
          })
          .catch((error) => {
            console.error("Error fetching listings:", error);
            toast.error("Failed to fetch listings.");
          });
      }
    };

    // Call fetchListings when the component mounts and when user changes
    fetchListings();
  }, [user]); // Depend only on user state

  return (
    <div>
      <h1
        style={{
          color: "black",
          fontFamily: "Courier New",
          marginLeft: "40px",
        }}
      >
        Your Listings
      </h1>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          padding: "20px",
        }}
      >
        {listings.length > 0 ? (
          listings.map((listing) => (
            <Item key={listing.id} itemId={listing.id} />
          ))
        ) : (
          <p
            style={{
              color: "black",
              fontFamily: "Courier New",
              display: "flex",
              justifyContent: "center",
              marginTop: "200px",
            }}
          >
            You don't seem to have any listings. :/ (if you have, refresh the
            page and they'll appear, this is a feature I promise)
          </p>
        )}
      </div>
    </div>
  );
};

export default MyListings;
