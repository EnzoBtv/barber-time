import React from "react";
import { Card, makeStyles } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";

import classes from "./index.module.css";

const styles = makeStyles({
  "main-card": {
    padding: "50px",
    display: "flex",
    flexDirection: "row"
  },
  icon: {
    position: "relative",
    top: "-36px",
    left: "-40px",
    cursor: "pointer"
  }
});

const Auth: React.FC<{
  arrowBack?: () => void;
}> = props => {
  const materialClasses = styles();

  return (
    <div className={classes["login-container"]}>
      <Card className={materialClasses["main-card"]}>
        {props.arrowBack ? (
          <ArrowBack
            onClick={props.arrowBack}
            className={materialClasses["icon"]}
          />
        ) : null}
        <img className={classes["image"]} src="/logo.png" alt="logo" />
        <div className={classes["input-container"]}>{props.children}</div>
      </Card>
    </div>
  );
};

export default Auth;
