type RenterProps = {
  id?: number;
  name: string;
  email: string;
  birthdate: string | Date;
  cnpjcpf: string;
  ierg: string;
  phone: string;
  pessoa: "FISICA" | "JURIDICA";
  userId?: number;
};
