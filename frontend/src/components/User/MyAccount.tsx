import { useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import {
  CircularProgress,
  Typography,
  Container,
  TextField,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";

interface UserData {
  name?: string;
  email?: string;
  phoneNumber?: string;
  city?: string;
}

const MyAccount = () => {
  const { user } = useContext(UserContext);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState({ phoneNumber: false, city: false });
  const [editData, setEditData] = useState({ phoneNumber: "", city: "" });

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
          setEditData({
            phoneNumber: data.phoneNumber || "",
            city: data.city || "",
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch user details:", error);
          toast.error("Failed to load user data.");
          setLoading(false);
        });
    }
  }, [user]);

  const handleEdit = (field: "phoneNumber" | "city") => {
    setEditMode({ ...editMode, [field]: true });
  };

  const handleSave = async (field: "phoneNumber" | "city") => {
    const url = `${import.meta.env.VITE_API_URL}/users/details/${user?.id}`;
    const body = { [field]: editData[field] };
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const updatedData = { ...userData, ...body };
      setUserData(updatedData);
      setEditMode({ ...editMode, [field]: false });
      toast.success("User data updated successfully.", {
        style: {
          border: "1px solid black",
          padding: "16px",
          color: "black",
          background: "white",
          fontFamily: "Courier New",
        },
        iconTheme: {
          primary: "black",
          secondary: "white",
        },
      });
    } else {
      toast.error("Failed to update user data.");
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

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
      <Typography
        variant="h4"
        gutterBottom
        style={{
          color: "black",
          fontFamily: "Courier New, Courier, monospace",
        }}
      >
        My Account
      </Typography>
      {userData ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div>
            <Typography
              variant="body1"
              style={{
                color: "black",
                fontFamily: "Courier New, Courier, monospace",
              }}
            >
              <strong>Name:</strong> {userData.name}
            </Typography>
            <Typography
              variant="body1"
              style={{
                color: "black",
                fontFamily: "Courier New, Courier, monospace",
              }}
            >
              <strong>Email:</strong> {userData.email}
            </Typography>
          </div>
          <div style={{ marginTop: "20px" }}>
            <Typography
              component="div"
              variant="body1"
              style={{
                color: "black",
                fontFamily: "Courier New, Courier, monospace",
              }}
            >
              <strong>Phone Number:</strong>{" "}
              {editMode.phoneNumber ? (
                <>
                  <TextField
                    size="small"
                    value={editData.phoneNumber}
                    onChange={(e) =>
                      setEditData({ ...editData, phoneNumber: e.target.value })
                    }
                    helperText={`Previous: ${
                      userData.phoneNumber || "Not provided"
                    }`}
                    style={{ width: "200px" }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": { borderColor: "black" },
                      },
                    }}
                  />
                  <Button onClick={() => handleSave("phoneNumber")}>
                    <CheckIcon style={{ color: "black" }} />
                  </Button>
                  <Button
                    onClick={() =>
                      setEditMode({ ...editMode, phoneNumber: false })
                    }
                  >
                    <CloseIcon style={{ color: "black" }} />
                  </Button>
                </>
              ) : (
                <>
                  {userData.phoneNumber || "Not provided"}
                  <Button onClick={() => handleEdit("phoneNumber")}>
                    <EditIcon style={{ color: "black" }} />
                  </Button>
                </>
              )}
            </Typography>
          </div>
          <div style={{ marginTop: "20px" }}>
            <Typography
              component="div"
              variant="body1"
              style={{
                color: "black",
                fontFamily: "Courier New, Courier, monospace",
              }}
            >
              <strong>City:</strong>{" "}
              {editMode.city ? (
                <>
                  <TextField
                    size="small"
                    value={editData.city}
                    onChange={(e) =>
                      setEditData({ ...editData, city: e.target.value })
                    }
                    helperText={`Previous: ${userData.city || "Not provided"}`}
                    style={{ width: "200px" }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": { borderColor: "black" },
                      },
                    }}
                  />
                  <Button onClick={() => handleSave("city")}>
                    <CheckIcon style={{ color: "black" }} />
                  </Button>
                  <Button
                    onClick={() => setEditMode({ ...editMode, city: false })}
                  >
                    <CloseIcon style={{ color: "black" }} />
                  </Button>
                </>
              ) : (
                <>
                  {userData.city || "Not provided"}
                  <Button onClick={() => handleEdit("city")}>
                    <EditIcon style={{ color: "black" }} />
                  </Button>
                </>
              )}
            </Typography>
          </div>
        </div>
      ) : (
        <Typography
          variant="body1"
          style={{
            color: "black",
            fontFamily: "Courier New, Courier, monospace",
          }}
        >
          No user data available.
        </Typography>
      )}
    </Container>
  );
};

export default MyAccount;
