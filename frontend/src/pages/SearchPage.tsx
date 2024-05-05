import React, { useState, useEffect } from "react";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Slider,
  Box,
  Typography,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "react-hot-toast";
import Item from "../components/Item";

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

type SelectedCategories = {
  [key: string]: boolean;
};

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

const SearchPage = () => {
  const [keyword, setKeyword] = useState("");
  const [selectedCategories, setSelectedCategories] =
    useState<SelectedCategories>({});
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [maxPrice, setMaxPrice] = useState(5000);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/listings`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.message);
        } else {
          setListings(data);
          setFilteredListings(data);
          const max = Math.max(
            ...data.map((listing: Listing) => listing.price)
          );
          setMaxPrice(max);
          setPriceRange([0, max]);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch listings:", error);
        toast.error("Failed to load listings.");
      });
  }, []);

  useEffect(() => {
    applyFilters();
  }, [keyword, selectedCategories, priceRange, listings]);

  const applyFilters = () => {
    let result = listings.filter(
      (listing) =>
        listing.title.toLowerCase().includes(keyword.toLowerCase()) &&
        listing.price >= priceRange[0] &&
        listing.price <= priceRange[1]
    );

    // Check if any categories are selected
    const isAnyCategorySelected = Object.values(selectedCategories).some(
      (value) => value
    );

    if (isAnyCategorySelected) {
      result = result.filter((listing) => selectedCategories[listing.category]);
    }

    setFilteredListings(result);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setSelectedCategories((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  return (
    <div>
      <Typography variant="h4" align="center" gutterBottom>
        Search Listings
      </Typography>
      <Box display="flex" justifyContent="center" my={2}>
        <TextField
          label="Search by name"
          variant="outlined"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ fontFamily: "Courier New" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            "& label.Mui-focused": {
              color: "black", // Color of the label when the TextField is focused
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "black", // Default border color
              },
              "&:hover fieldset": {
                borderColor: "black", // Border color when mouse hovers over the TextField
              },
              "&.Mui-focused fieldset": {
                borderColor: "black", // Border color when the TextField is focused
              },
            },
          }}
        />
      </Box>
      <FormGroup row sx={{ justifyContent: "center" }}>
        {categories.map((category) => (
          <FormControlLabel
            key={category}
            control={
              <Checkbox
                checked={!!selectedCategories[category]}
                onChange={handleCategoryChange}
                name={category}
                color="default"
                style={{ color: "black" }}
              />
            }
            label={category}
            style={{ color: "black" }}
          />
        ))}
      </FormGroup>
      <Box width="80%" mx="auto" my={2}>
        <Typography gutterBottom>Price Range</Typography>
        <Slider
          value={priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="on"
          min={0}
          max={maxPrice}
          sx={{
            color: "black", // Set the color of the slider to black
            "& .MuiSlider-thumb": {
              color: "black", // Set the thumb color
              "&:hover": {
                color: "black", // Set the hover color of the thumb
                boxShadow: "0px 0px 0px 8px rgba(0, 0, 0, 0.16)", // Custom shadow color on hover
              },
              "&.Mui-focusVisible, &.Mui-active": {
                boxShadow: "0px 0px 0px 8px rgba(0, 0, 0, 0.16)", // Custom shadow color when focused or active
              },
            },
            "& .MuiSlider-track": {
              color: "black", // Set the track color
            },
            "& .MuiSlider-rail": {
              color: "white", // Set the rail color
            },
            "& .MuiSlider-valueLabel": {
              color: "white", // Set the text color inside the value label
              backgroundColor: "black", // Set the background color of the value label
            },
          }}
        />
      </Box>
      <div className="my-listings-container">
        {filteredListings.map((listing) => (
          <div key={listing.id} className="listing-item-container">
            <Item key={listing.id} itemId={listing.id} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
