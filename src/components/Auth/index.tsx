import React from "react";
import { Card, makeStyles } from "@material-ui/core";

import classes from "./index.module.css";

const styles = makeStyles({
  "main-card": {
    padding: "50px",
    display: "flex",
    flexDirection: "row"
  }
});

const Auth: React.FC = props => {
  const materialClasses = styles();

  return (
    <div className={classes["login-container"]}>
      <Card className={materialClasses["main-card"]}>
        <img src="/logo.png" alt="logo" />
        <div className={classes["input-container"]}>{props.children}</div>
      </Card>
    </div>
  );
};

export default Auth;
