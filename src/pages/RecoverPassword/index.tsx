import React from "react";

import Auth from "../../components/Auth";
import Input from "../../components/Input";
import Button from "../../components/Button";

const RecoverPassword: React.FC<{
  history: {
    push: (url: string) => void;
  };
}> = props => {
  return (
    <Auth
      arrowBack={() => props.history.push("/")}
      style={{ justifyContent: "center" }}
    >
      <Input label="Email" type="text" />
      <Button>Recuperar Senha</Button>
    </Auth>
  );
};
export default RecoverPassword;
