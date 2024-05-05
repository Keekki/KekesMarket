import Form from "../parent/Form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const CreateListing = () => {
  const navigate = useNavigate();

  const fields = [
    { name: "title", label: "Title", required: true },
    { name: "description", label: "Description", required: true },
    {
      name: "price",
      label: "Price",
      required: true,
      type: "number",
      min: 0,
      step: "0.01",
    },
    {
      name: "category",
      label: "Category",
      required: true,
      type: "select",
      options: [
        { value: "Freetime", label: "Freetime" },
        { value: "Kitchen", label: "Kitchen" },
        { value: "Sports", label: "Sports" },
        { value: "IT", label: "IT" },
        { value: "Gaming", label: "Gaming" },
        { value: "Pets", label: "Pets" },
        { value: "Home", label: "Home" },
        { value: "Clothing", label: "Clothing" },
        { value: "Hiking", label: "Hiking" },
      ],
    },
    { name: "additionalInfo", label: "Additional Info", required: false },
    { name: "image", label: "Image URL", required: false },
  ];

  const submitHandler = async (values: any) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/listings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(values),
        }
      );

      if (response.ok) {
        const result = await response.json();
        toast.success("Listing created!", {
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
        navigate(`/my-listings`); // Navigate to users listings
        return result;
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      console.error("Error creating listing:", error);
      toast.error("Failed to create listing. Please try again.");
    }
  };

  return (
    <div>
      <Form
        fields={fields}
        submitHandler={submitHandler}
        submitLabel="Create Listing"
        title="What are you selling?"
      />
    </div>
  );
};

export default CreateListing;
