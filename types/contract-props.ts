type ContractProps = {
  id: number;
  property: { address: string; number: number };
  renter: { name: string };
  status: "EDITING" | "ACTIVE" | "CLOSED";
  startDate: string | Date;
  endDate: string | Date;
};

type ContractDto = {
  value: number;
  status: "EDITING" | "ACTIVE" | "CLOSED";
  startDate: string | Date;
  endDate: string | Date;
  renterId: number;
  propertyId: number;
};

type ContractDetail = {
  value: number;
  status: "EDITING" | "ACTIVE" | "CLOSED";
  startDate: string | Date;
  endDate: string | Date;
  property: PropertiesProps;
  renter: RenterProps;
};
