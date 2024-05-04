import { useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import { CircularProgress, Typography, Container } from "@mui/material";
import toast from "react-hot-toast";

interface UserData {
  name: string;
  email: string;
  phoneNumber?: string;
  city?: string;
}

const MyAccount = () => {
  const { user } = useContext(UserContext);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.id) {
      setLoading(true);
      fetch(`${import.meta.env.VITE_API_URL}/users/public/${user.id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUserData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch user details:", error);
          toast.error("Failed to load user data.");
          setLoading(false);
        });
    }
  }, [user]);

  if (loading) {
    return <CircularProgress />;
  }

  const textStyle = {
    color: "black",
    fontFamily: "Courier New, Courier, monospace",
  };

  return (
    <Container
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
      }}
    >
      <Typography variant="h4" gutterBottom style={textStyle}>
        My Account
      </Typography>
      {userData ? (
        <div>
          <Typography variant="body1" style={textStyle}>
            <strong>Name:</strong> {userData.name}
          </Typography>
          <Typography variant="body1" style={textStyle}>
            <strong>Email:</strong> {userData.email}
          </Typography>
          <Typography variant="body1" style={textStyle}>
            <strong>Phone Number:</strong>{" "}
            {userData.phoneNumber || "Not provided"}
          </Typography>
          <Typography variant="body1" style={textStyle}>
            <strong>City:</strong> {userData.city || "Not provided"}
          </Typography>
        </div>
      ) : (
        <Typography variant="body1" style={textStyle}>
          No user data available.
        </Typography>
      )}
    </Container>
  );
};

export default MyAccount;
