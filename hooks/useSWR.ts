import { Method } from "axios";
import useSWR, { SWRConfiguration } from "swr";

import { axiosClient } from "@/services/axios-client";

const defaultOptions: SWRConfiguration = {
  revalidateOnFocus: false,
};

export function useFetch<data = unknown, error = unknown>(
  path: string,
  swrOptions = defaultOptions,
  method: Method = "get"
) {
  const data = useSWR<data, error>(
    path,
    async (url: string) => {
      const res = await axiosClient.request({ method, url });
      return res.data;
    },
    swrOptions
  );

  return data;
}
