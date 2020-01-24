export interface ViaCep {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
}

export interface AddressDB {
    zipCode: string;
    street: string;
    complement: string;
    city: string;
    state: string;
}
