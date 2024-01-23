type OwnershipProps = {
  id?: number;
  ownerId?: number;
  name?: string;
  cut: number;
  isMainOwner: boolean;
};

type OwnershipDto = {
  id?: number;
  owner?: { id: number; name: string };
  cut: number;
  isMainOwner: boolean;
};

type CreateOwnershipDto = {
  cut: number;
  isMainOwner?: boolean;
  userId: number;
  propertyId: number;
  ownerId?: number;
};
