import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { toast } from "react-hot-toast";

// Defines the props expected by the EditButton component
interface EditButtonProps {
  id: string; // ID of the item to be edited
}

// The EditButton component allows editing of an item's details
const EditButton = ({ id }: EditButtonProps) => {
  const [open, setOpen] = useState(false); // Controls the visibility of the dialog
  const [formData, setFormData] = useState({
    // State to hold form data
    title: "",
    description: "",
    price: "",
    image: "",
    additionalInfo: "",
    category: "",
  });

  // List of categories for the select dropdown
  const categories = [
    "Freetime",
    "Kitchen",
    "Sports",
    "IT",
    "Gaming",
    "Pets",
    "Home",
    "Clothing",
    "Hiking",
  ];

  // Fetches item details from the server and populates the form data
  useEffect(() => {
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

  // Opens the dialog
  const handleOpen = () => {
    setOpen(true);
  };

  // Closes the dialog
  const handleClose = () => {
    setOpen(false);
  };

  // Handles changes to text fields and updates the formData state
  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | { name?: string; value: unknown }
    >
  ) => {
    const name = event.target.name || "";
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handles changes to the select dropdown
  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Sends updated data to the server and handles the response
  const handleSave = () => {
    const storedUserString = localStorage.getItem("user");
    const storedUser = storedUserString ? JSON.parse(storedUserString) : null;
    const token = storedUser?.token;

    fetch(`${import.meta.env.VITE_API_URL}/api/listings/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          toast.error("Failed to update listing: " + data.message);
        } else {
          toast.success("Listing updated successfully");
          handleClose();
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      })
      .catch((error) => {
        console.error("Error updating listing:", error);
        toast.error("Failed to update listing.");
      });
  };

  // Renders the edit button and dialog
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
          <FormControl fullWidth margin="dense">
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleSelectChange}
              label="Category"
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
