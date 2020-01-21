import React from "react";
import { TextField, makeStyles } from "@material-ui/core";

const styles = makeStyles({
  input: {
    marginBottom: "30px",
    width: "16vw",
    "& label.Mui-focused": {
      color: "#ba1a1f"
    },
    "& label": {
      color: "#ba1a1f"
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#ba1a1f"
      },
      "&:hover fieldset": {
        borderColor: "#ba1a1f"
      },
      "&.Mui-focused fieldset": {
        borderColor: "#ba1a1f"
      }
    }
  }
});

const Input: React.FC<{
  label: string;
  type: string;
  onChange?: () => void;
}> = props => {
  const materialClasses = styles();
  return (
    <TextField
      className={materialClasses["input"]}
      variant="outlined"
      label={props.label}
      type={props.type}
      onChange={props.onChange}
    />
  );
};

export default Input;
