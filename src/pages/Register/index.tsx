import React from "react";
import Auth from "../../components/Auth";
import Input from "../../components/Input";

const Register: React.FC<{
  history: {
    push: (url: string) => void;
  };
}> = props => {
  return (
    <Auth arrowBack={() => props.history.push("/")}>
      <Input label="Nome Completo" type="text" />
      <Input label="Email" type="email" />
      <Input label="Senha" type="password" />
    </Auth>
  );
};

export default Register;
