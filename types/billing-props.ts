type BillingProps = {
  id: number;
  type: "RENT" | "INSURANCE";
  installments: InstallmentProps[];
  contractId: number;
  userId: number;
};

type BillingDto = {
  type: "RENT" | "INSURANCE";
  installments: { createMany: { data: InstallmentProps[] } };
  user: { connect: { id: number } };
  contract: { connect: { id: number } };
};

type InstallmentProps = {
  id?: number;
  number: number;
  value: number;
  dueDate: string | Date;
  paid: boolean;
  billingId?: number;
};
