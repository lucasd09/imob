type OwnershipProps = {
  ownerId: number;
  name: string;
  cut: number;
  isMainOwner: boolean;
};

type OwnershipDto = {
  owner: { id: number; name: string };
  cut: number;
  isMainOwner: boolean;
};
