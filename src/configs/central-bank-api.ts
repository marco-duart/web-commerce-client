import axios from "axios";

export const centralBankApi = axios.create({
  baseURL: "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});
