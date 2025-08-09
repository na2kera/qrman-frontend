import useSWR, { SWRConfig } from "swr";
import type { SWRConfiguration, Key } from "swr";
import type { ReactNode } from "react";
import { request } from "./client";

export const defaultFetcher = (path: string) => request(path);

export function SwrProvider({
  children,
  config,
}: {
  children: ReactNode;
  config?: SWRConfiguration;
}) {
  return (
    <SWRConfig
      value={{ fetcher: defaultFetcher, shouldRetryOnError: false, ...config }}
    >
      {children}
    </SWRConfig>
  );
}

export function useApiSWR<Data = unknown, Err = unknown>(
  key: Key | null,
  config?: SWRConfiguration<Data, Err>
) {
  return useSWR<Data, Err>(key, { ...config });
}
