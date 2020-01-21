import React, { useState } from "react";
import {
  RadioGroup,
  Radio,
  FormControlLabel,
  makeStyles
} from "@material-ui/core";

import Auth from "../../components/Auth";
import Input from "../../components/Input";
import Button from "../../components/Button";

const styles = makeStyles({
  "radio-group": {
    marginTop: "-50px",
    "& .MuiFormControlLabel-root": { color: "#ba1a1f" }
  }
});

const Register: React.FC<{
  history: {
    push: (url: string) => void;
  };
}> = props => {
  const materialClasses = styles();
  const [value, setValue] = useState("client");
  return (
    <Auth arrowBack={() => props.history.push("/")}>
      <RadioGroup
        aria-label="position"
        className={materialClasses["radio-group"]}
        name="position"
        value={value}
        onChange={e => setValue(e.target.value)}
        row
      >
        <FormControlLabel
          value="barber"
          control={<Radio color="primary" />}
          label="Barbeiro"
          labelPlacement="end"
        />
        <FormControlLabel
          value="client"
          control={<Radio color="primary" />}
          label="Cliente"
          labelPlacement="end"
        />
      </RadioGroup>
      <Input label="Nome Completo" type="text" />
      <Input label="Email" type="email" />
      <Input label="Senha" type="password" />
      <Button>Registrar</Button>
    </Auth>
  );
};

export default Register;
