import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  DialogTitle,
} from "@mui/material";
import { toast } from "react-hot-toast";

interface EditButtonProps {
  id: string;
}

const EditButton = ({ id }: EditButtonProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    additionalInfo: "",
    category: "",
  });

  useEffect(() => {
    // Fetch the current listing data
    fetch(`${import.meta.env.VITE_API_URL}/api/listings/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setFormData({
          title: data.title,
          description: data.description,
          price: data.price,
          image: data.image,
          additionalInfo: data.additionalInfo,
          category: data.category,
        });
      })
      .catch((error) => {
        console.error("Failed to fetch listing details:", error);
        toast.error("Failed to load listing data.");
      });
  }, [id]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/listings/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          toast.error("Failed to update listing: " + data.message);
        } else {
          toast.success("Listing updated successfully", {
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

          handleClose();
          setTimeout(() => {
            window.location.reload(); // Refresh page 2 seconds after successful edit
          }, 2000);
        }
      })
      .catch((error) => {
        console.error("Error updating listing:", error);
        toast.error("Failed to update listing.");
      });
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        startIcon={<EditIcon />}
        variant="outlined"
        style={{
          color: "black",
          borderColor: "black",
        }}
      >
        Edit
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Edit Listing</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="title"
            label="Title"
            type="text"
            fullWidth
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            id="price"
            label="Price"
            type="number"
            fullWidth
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            id="image"
            label="Image URL"
            type="text"
            fullWidth
            name="image"
            value={formData.image}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            id="additionalInfo"
            label="Additional Info"
            type="text"
            fullWidth
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            id="category"
            label="Category"
            type="text"
            fullWidth
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            style={{ color: "red", fontFamily: "Courier New" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            style={{ color: "black", fontFamily: "Courier New" }}
          >
            Confirm changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditButton;
