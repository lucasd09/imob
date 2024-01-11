import { setCookie, parseCookies, destroyCookie } from "nookies";
import { ZipCodeClient, axiosClient } from "./axios-client";
import axios from "axios";

const { "imob-token": token } = parseCookies();

export async function signInRequest({ email, password }: SignInProps) {
  try {
    const res = await axiosClient.post("/login", { email, password });

    if (res.status === 200) {
      const token = res.data.access_token;
      return token;
    }
  } catch {
    return null;
  }
}

export async function getRenters(
  userId: number
): Promise<RenterProps[] | undefined> {
  try {
    const res = await axiosClient.get(`/renters/${userId}`);

    if (res.status === 200) {
      const Renters: RenterProps[] = res.data.map((item: RenterProps) => {
        return {
          id: item.id,
          name: item.name,
          email: item.email,
          phone: item.phone,
          cnpjcpf: item.cnpjcpf,
          pessoa: item.pessoa,
          birthdate: item.birthdate,
          ierg: item.ierg,
          userId: item.userId,
        };
      });
      return Renters;
    }
  } catch {}
}

export async function getRenter(
  userId: number,
  id: number
): Promise<RenterProps | undefined> {
  const res = await axiosClient.get(`/renters/${userId}/${id}`);

  if (res.status === 200) {
    const renter: RenterProps = {
      id: res.data.id,
      name: res.data.name,
      email: res.data.email,
      userId: res.data.userId,
      birthdate: res.data.birthdate,
      cnpjcpf: res.data.cnpjcpf,
      ierg: res.data.ierg,
      phone: res.data.phone,
      pessoa: res.data.pessoa,
    };
    return renter;
  }
}

export async function createRenter(data: RenterProps, userId: number) {
  const res = await axiosClient.post("/renters", {
    name: data.name,
    email: data.email,
    birthdate: data.birthdate,
    cnpjcpf: data.cnpjcpf,
    ierg: data.ierg,
    phone: data.phone,
    pessoa: data.pessoa,
    user: { connect: { id: userId } },
  });

  if (res.status === 201) {
    return res.data;
  }
}

export async function getOwners(
  userId: number
): Promise<OwnerProps[] | undefined> {
  try {
    const res = await axiosClient.get(`/owners/${userId}`);

    if (res.status === 200) {
      const owners: OwnerProps[] = res.data.map((item: OwnerProps) => {
        return {
          id: item.id,
          name: item.name,
          email: item.email,
          phone: item.phone,
          cnpjcpf: item.cnpjcpf,
          pessoa: item.pessoa,
          birthdate: item.birthdate,
          ierg: item.ierg,
          userId: item.userId,
        };
      });
      return owners;
    }
  } catch {}
}

export async function createOwner(data: OwnerProps, userId: number) {
  const res = await axiosClient.post("/owners", {
    name: data.name,
    email: data.email,
    birthdate: data.birthdate,
    cnpjcpf: data.cnpjcpf,
    ierg: data.ierg,
    phone: data.phone,
    pessoa: data.pessoa,
    user: { connect: { id: userId } },
  });

  if (res.status === 201) {
    return res.data;
  }
}

export async function getProperties(userId: number) {
  const res = await axiosClient.get(`/properties/${userId}`);

  if (res.status === 200) {
    const properties: PropertiesProps[] = res.data.map(
      (item: PropertiesProps) => {
        return item;
      }
    );

    return properties;
  }
}

export async function createProperty(data: PropertiesProps, userId: number) {
  const res: PropertiesProps = await axiosClient.post("/properties", {
    address: data.address,
    number: data.number,
    avaliable: data.avaliable,
    complement: data.complement,
    district: data.district,
    uf: data.uf,
    zipcode: data.zipcode,
    city: data.city,
    user: { connect: { id: userId } },
  });

  return res;
}

export async function updateProperty(data: PropertiesProps, userId: number) {
  const res: PropertiesProps = await axiosClient.patch(
    `/properties/${userId}/${data.id}`,
    {
      address: data.address,
      number: data.number,
      avaliable: data.avaliable,
      complement: data.complement,
      district: data.district,
      uf: data.uf,
      zipcode: data.zipcode,
      city: data.city,
    }
  );

  return res;
}

export async function getZipcode(zipcode: string) {
  const res = await ZipCodeClient.get(`/${zipcode}/json/`);

  const CEP: ZipcodeProps = {
    logradouro: res.data.logradouro,
    CEP: res.data.cep,
    uf: res.data.uf,
    complemento: res.data.complemento,
    bairro: res.data.bairro,
    localidade: res.data.localidade,
  };

  return CEP;
}

export async function getOwnerships(
  userId: number,
  propertyId: number
): Promise<OwnershipProps[] | undefined> {
  try {
    const res = await axiosClient.get(
      `/properties/ownerships/${userId}/${propertyId}`
    );

    if (res.status === 200) {
      const ownerships: OwnershipProps[] = res.data.map(
        (item: OwnershipDto) => {
          return {
            ownerId: item.owner.id,
            name: item.owner.name,
            cut: item.cut,
            isMainOwner: item.isMainOwner,
          };
        }
      );
      return ownerships;
    }
  } catch (error) {}
}

export async function getContracts(userId: number) {
  const res = await axiosClient.get(`/contracts/${userId}`);

  if (res.status === 200) {
    const contracts: ContractProps[] = res.data.map((item: ContractProps) => {
      return {
        id: item.id,
        property: item.property.address + ", " + item.property.number,
        renter: item.renter.name,
        status: item.status,
        startDate: item.startDate,
        endDate: item.endDate,
      };
    });

    return contracts;
  }
}

export function logout() {
  destroyCookie(undefined, "imob-token");
}
