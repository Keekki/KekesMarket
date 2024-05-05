import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import GoogleIcon from "@mui/icons-material/Google";
import "../../../styling/Form.css";

interface Field {
  name: string;
  label: string;
  required: boolean;
  type?: string;
  value?: string;
  options?: { value: string; label: string }[];
  min?: number;
  step?: number;
}

interface FormProps {
  fields: Field[];
  submitHandler: (values: any) => Promise<any>;
  submitLabel: string;
  title: string;
  onGoogleLogin?: () => void;
}

const Form: React.FC<FormProps> = ({
  fields,
  submitHandler,
  submitLabel,
  title,
  onGoogleLogin,
}) => {
  const location = useLocation();
  const [values, setValues] = useState<{ [key: string]: any }>(
    fields.reduce(
      (acc, field) => ({ ...acc, [field.name]: field.value || "" }),
      {}
    )
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  useEffect(() => {
    setValues(
      fields.reduce(
        (acc, field) => ({ ...acc, [field.name]: field.value || "" }),
        {}
      )
    );
  }, [fields]);

  // Handler for TextField changes
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const name = event.target.name;
    const value = event.target.value;
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  // Handler for Select changes
  const handleSelectChange = (event: SelectChangeEvent) => {
    const name = event.target.name;
    const value = event.target.value as string; // Cast to string if necessary
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newErrors: { [key: string]: string } = {};
    fields.forEach((field) => {
      const fieldValue = values[field.name];
      if (
        field.required &&
        typeof fieldValue === "string" &&
        fieldValue.trim() === ""
      ) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    if (
      fields.some((field) => field.name === "passwordConfirmation") &&
      values.password !== values.passwordConfirmation
    ) {
      newErrors.passwordConfirmation = "Passwords do not match.";
    }

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await submitHandler(values);
        if (response && response.status === 401) {
          newErrors.password = "Password is incorrect.";
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("An error occurred. Please try again.");
      }
    }

    setErrors(newErrors);
    setSubmitted(true);
  };

  return (
    <div className="form">
      <h2>{title}</h2>
      <form onSubmit={handleSubmit}>
        {fields.map((field) => {
          if (field.type === "select") {
            return (
              <FormControl fullWidth key={field.name}>
                <InputLabel id={`${field.name}-label`}>
                  {field.label}
                </InputLabel>
                <Select
                  labelId={`${field.name}-label`}
                  id={field.name}
                  name={field.name}
                  value={values[field.name]}
                  label={field.label}
                  onChange={handleSelectChange}
                  required={field.required}
                >
                  {field.options?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            );
          } else {
            return (
              <TextField
                key={field.name}
                label={field.label}
                name={field.name}
                value={values[field.name]}
                onChange={handleInputChange}
                required={field.required}
                type={field.type || "text"}
                error={submitted && !!errors[field.name]}
                helperText={
                  submitted && errors[field.name] ? errors[field.name] : ""
                }
                InputLabelProps={{ shrink: true, style: { color: "black" } }}
                inputProps={{
                  min: field.type === "number" ? field.min : undefined,
                  step: field.type === "number" ? field.step : undefined,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "black" },
                    "&:hover fieldset": { borderColor: "black" },
                    "&.Mui-focused fieldset": { borderColor: "black" },
                  },
                  "& .MuiInputBase-input": { color: "black" },
                }}
              />
            );
          }
        })}
        <Button
          type="submit"
          variant="outlined"
          sx={{
            color: "black",
            fontFamily: "Courier New",
            borderColor: "black",
            "&:hover": {
              backgroundColor: "whitesmoke",
              color: "grey",
              borderColor: "black",
              transition: "0.3s ease-in",
            },
          }}
        >
          {submitLabel}
        </Button>
        {onGoogleLogin && (
          <Button
            onClick={onGoogleLogin}
            style={{
              marginTop: "10px",
              display: "flex",
              color: "black",
              fontFamily: "Courier New",
              textDecoration: "none",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Log in with <GoogleIcon style={{ marginLeft: "10px" }} />
          </Button>
        )}
      </form>
      {location.pathname === "/login" && (
        <Link
          to="/signup"
          style={{
            color: "black",
            textDecoration: "none",
            display: "block",
            marginTop: "20px",
          }}
        >
          Don't have an account? Create one here!
        </Link>
      )}
    </div>
  );
};

export default Form;
