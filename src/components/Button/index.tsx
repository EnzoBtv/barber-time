import React from "react";
import { Button, makeStyles } from "@material-ui/core";

const styles = makeStyles({
  button: {
    backgroundColor: "#e61b23",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#ba1a1f"
    }
  }
});

const CustomButton: React.FC<{
  onClick?: () => void;
}> = props => {
  const materialClasses = styles();

  return (
    <Button onClick={props.onClick} className={materialClasses["button"]}>
      {props.children}
    </Button>
  );
};

export default CustomButton;
