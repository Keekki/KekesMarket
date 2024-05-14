import { useState, useEffect, useContext } from "react";
import { UserContext } from "./User/UserContext";
import Item from "./Item";
import { toast } from "react-hot-toast";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditButton from "./Buttons/EditButton";
import DeleteButton from "./Buttons/DeleteButton";

import "../styling/MyListings.css";

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
    fetchListings();
  }, [user]);

  const fetchListings = () => {
    const storedUserString = localStorage.getItem("user");
    const storedUser = storedUserString ? JSON.parse(storedUserString) : null;
    const token = user?.token || storedUser?.token;

    if (user && user.token) {
      fetch(`${import.meta.env.VITE_API_URL}/api/user/listings`, {
        headers: {
          Authorization: `Bearer ${token}`,
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

  const handleDelete = (id: string) => {
    const storedUserString = localStorage.getItem("user");
    const storedUser = storedUserString ? JSON.parse(storedUserString) : null;
    const token = user?.token || storedUser?.token;

    fetch(`${import.meta.env.VITE_API_URL}/api/listings/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          toast.error("Failed to delete listing: " + data.message);
        } else {
          toast.success("Listing deleted", {
            icon: <DeleteOutlineIcon style={{ color: "red" }} />,
            style: {
              border: "1px solid black",
              padding: "16px",
              color: "black",
              background: "white",
              fontFamily: "Courier New",
            },
          });
          fetchListings(); // Refresh listings
        }
      })
      .catch((error) => {
        console.error("Error deleting listing:", error);
        toast.error("Failed to delete listing.");
      });
  };

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
      <div className="my-listings-container">
        {listings.length > 0 ? (
          listings.map((listing) => (
            <div key={listing.id} className="listing-item-container">
              <Item itemId={listing.id} />

              <div className="listing-buttons">
                <EditButton id={listing.id.toString()} />
                <DeleteButton
                  id={listing.id.toString()}
                  onConfirm={handleDelete}
                />
              </div>
            </div>
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
