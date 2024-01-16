type PropertiesProps = {
  id?: number;
  address: string;
  number: number;
  avaliable: boolean;
  zipcode: string;
  uf: string;
  complement: string;
  district: string;
  city: string;
  userId?: number;
  ownership?: OwnershipProps[];
};
