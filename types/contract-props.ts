type ContractProps = {
  id: number;
  property: { address: string; number: number };
  renter: { name: string };
  status: "EDITING" | "ACTIVE" | "CLOSED";
  startDate: string | Date;
  endDate: string | Date;
};

type ContractDto = {};
