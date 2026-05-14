import { useState, useEffect } from "react";
import { authedRequest, apiErrorMessage } from "@/lib/workspace-action-client";

export type LocationState = {
  label: string;
  state_name: string;
  state_code: string;
  country_code: string;
};

export type LocationCountry = {
  name: string;
  iso_code: string;
  phone_code: string;
};

export type LocationsResponse = {
  states?: LocationState[];
  countries?: LocationCountry[];
};

export function useLocations() {
  const [states, setStates] = useState<LocationState[]>([]);
  const [countries, setCountries] = useState<LocationCountry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLocations() {
      const res = await authedRequest<LocationsResponse>("/api/auth/workspace/locations");
      if (res.ok && res.data) {
        setStates(res.data.states || []);
        setCountries(res.data.countries || []);
      }
      setIsLoading(false);
    }
    void fetchLocations();
  }, []);

  return { states, countries, isLoading };
}

export type CatalogItem = {
  id: number;
  name: string;
  type?: string;
};

export function useCatalogMasters() {
  const [categories, setCategories] = useState<CatalogItem[]>([]);
  const [groups, setGroups] = useState<CatalogItem[]>([]);
  const [brands, setBrands] = useState<CatalogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMasters = async () => {
    setIsLoading(true);
    const res = await authedRequest<any>("/api/auth/workspace/product-catalog");
    if (res.ok && res.data) {
      setCategories(res.data.categories || []);
      setGroups(res.data.groups || []);
      setBrands(res.data.brands || []);
    }
    setIsLoading(false);
  };

  const createMasterItem = async (type: "category" | "group" | "brand" | "service_line", name: string) => {
    if (!name.trim()) return false;
    
    const res = await authedRequest<any>("/api/auth/workspace/product-catalog", {
      method: "POST",
      body: JSON.stringify({ type, name: name.trim() }),
    });

    if (!res.ok || !res.data.item) {
      return { success: false, message: apiErrorMessage(`${type} create nahi ho saka.`, res.data) };
    }

    const item = { id: res.data.item.id, name: res.data.item.name };

    if (type === "category" || type === "service_line") {
      setCategories((curr) => [...curr.filter((c) => c.name !== item.name), item].sort((a, b) => a.name.localeCompare(b.name)));
    } else if (type === "group") {
      setGroups((curr) => [...curr.filter((c) => c.name !== item.name), item].sort((a, b) => a.name.localeCompare(b.name)));
    } else if (type === "brand") {
      setBrands((curr) => [...curr.filter((c) => c.name !== item.name), item].sort((a, b) => a.name.localeCompare(b.name)));
    }

    return { success: true, message: res.data.message || `${type} created.` };
  };

  useEffect(() => {
    void fetchMasters();
  }, []);

  return { categories, groups, brands, isLoading, refresh: fetchMasters, createMasterItem };
}
