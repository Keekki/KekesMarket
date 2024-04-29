import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import "../../../styling/Form.css";

interface Field {
  name: string;
  label: string;
  required: boolean;
  type?: string;
  value?: string;
}

interface FormProps {
  fields: Field[];
  submitHandler: (values: any) => Promise<any>;
  submitLabel: string;
  title: string;
}

const Form: React.FC<FormProps> = ({
  fields,
  submitHandler,
  submitLabel,
  title,
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newErrors: { [key: string]: string } = {};
    fields.forEach((field) => {
      const fieldValue = values[field.name];
      if (typeof fieldValue === "string" && fieldValue.trim() === "") {
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
        } else if (response && response.status === 200) {
          toast.success("Logged in!", {
            style: {
              border: "1px solid orange",
              padding: "16px",
              color: "white",
              background: "black",
              marginLeft: "1100px",
            },
            iconTheme: {
              primary: "orange",
              secondary: "black",
            },
          });
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
        {fields.map((field) => (
          <TextField
            key={field.name}
            label={field.label}
            name={field.name}
            value={values[field.name]}
            onChange={handleChange}
            required={field.required}
            type={field.type || "text"}
            error={submitted && !!errors[field.name]}
            helperText={
              submitted && errors[field.name] ? errors[field.name] : ""
            }
            InputLabelProps={{ shrink: true, style: { color: "white" } }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "white" },
                "&:hover fieldset": { borderColor: "white" },
                "&.Mui-focused fieldset": { borderColor: "white" },
              },
              "& .MuiInputBase-input": { color: "white" },
            }}
          />
        ))}
        <Button
          type="submit"
          variant="outlined"
          sx={{
            color: "white",
            borderColor: "white",
            "&:hover": {
              backgroundColor: "transparent",
              color: "orange",
              borderColor: "orange",
              transition: "0.3s ease-in",
            },
          }}
        >
          {submitLabel}
        </Button>
      </form>
      {location.pathname === "/login" && (
        <Link
          to="/signup"
          style={{
            color: "orange",
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
