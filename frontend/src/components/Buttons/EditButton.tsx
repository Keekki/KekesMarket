import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { Button } from "@mui/material";

interface EditButtonProps {
  id: string;
}

const EditButton = ({ id }: EditButtonProps) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/edit-listing/${id}`);
  };

  return (
    <Button onClick={handleEdit} startIcon={<EditIcon />} variant="outlined">
      Edit
    </Button>
  );
};

export default EditButton;
