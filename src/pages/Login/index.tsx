import React from "react";
import { Link } from "react-router-dom";
import { makeStyles, Typography } from "@material-ui/core";

import Auth from "../../components/Auth";
import Input from "../../components/Input";
import Button from "../../components/Button";

import classes from "./index.module.css";

const styles = makeStyles({
  button: {
    backgroundColor: "#e61b23",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#ba1a1f"
    }
  },
  text: {
    color: "#e61b23",
    cursor: "pointer"
  },
  link: {
    textDecoration: "none"
  }
});

const Login: React.FC = () => {
  const materialClasses = styles();
  return (
    <Auth>
      <Input label="Email" type="email" />
      <Input label="Senha" type="password" />
      <Button>Entrar</Button>
      <div className={classes["options-container"]}>
        <Link className={materialClasses["link"]} to="/register">
          <Typography className={materialClasses["text"]}>Cadastrar</Typography>
        </Link>
        <Typography className={materialClasses["text"]}>
          Recuperar senha
        </Typography>
      </div>
    </Auth>
  );
};

export default Login;
