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
  cities?: Record<string, string[]>;
};

const fallbackStates: LocationState[] = [
  {
    label: "Andaman and Nicobar Islands (35)",
    state_name: "Andaman and Nicobar Islands",
    state_code: "35",
    country_code: "IN",
  },
  {
    label: "Andhra Pradesh (28)",
    state_name: "Andhra Pradesh",
    state_code: "28",
    country_code: "IN",
  },
  {
    label: "Andhra Pradesh (New) (37)",
    state_name: "Andhra Pradesh (New)",
    state_code: "37",
    country_code: "IN",
  },
  {
    label: "Arunachal Pradesh (12)",
    state_name: "Arunachal Pradesh",
    state_code: "12",
    country_code: "IN",
  },
  {
    label: "Assam (18)",
    state_name: "Assam",
    state_code: "18",
    country_code: "IN",
  },
  {
    label: "Bihar (10)",
    state_name: "Bihar",
    state_code: "10",
    country_code: "IN",
  },
  {
    label: "Chandigarh (04)",
    state_name: "Chandigarh",
    state_code: "04",
    country_code: "IN",
  },
  {
    label: "Chhattisgarh (22)",
    state_name: "Chhattisgarh",
    state_code: "22",
    country_code: "IN",
  },
  {
    label: "Dadra and Nagar Haveli (26)",
    state_name: "Dadra and Nagar Haveli",
    state_code: "26",
    country_code: "IN",
  },
  {
    label: "Daman and Diu (25)",
    state_name: "Daman and Diu",
    state_code: "25",
    country_code: "IN",
  },
  {
    label: "Delhi (07)",
    state_name: "Delhi",
    state_code: "07",
    country_code: "IN",
  },
  {
    label: "Goa (30)",
    state_name: "Goa",
    state_code: "30",
    country_code: "IN",
  },
  {
    label: "Gujarat (24)",
    state_name: "Gujarat",
    state_code: "24",
    country_code: "IN",
  },
  {
    label: "Haryana (06)",
    state_name: "Haryana",
    state_code: "06",
    country_code: "IN",
  },
  {
    label: "Himachal Pradesh (02)",
    state_name: "Himachal Pradesh",
    state_code: "02",
    country_code: "IN",
  },
  {
    label: "Jammu and Kashmir (01)",
    state_name: "Jammu and Kashmir",
    state_code: "01",
    country_code: "IN",
  },
  {
    label: "Jharkhand (20)",
    state_name: "Jharkhand",
    state_code: "20",
    country_code: "IN",
  },
  {
    label: "Karnataka (29)",
    state_name: "Karnataka",
    state_code: "29",
    country_code: "IN",
  },
  {
    label: "Kerala (32)",
    state_name: "Kerala",
    state_code: "32",
    country_code: "IN",
  },
  {
    label: "Ladakh (38)",
    state_name: "Ladakh",
    state_code: "38",
    country_code: "IN",
  },
  {
    label: "Lakshadweep (31)",
    state_name: "Lakshadweep",
    state_code: "31",
    country_code: "IN",
  },
  {
    label: "Madhya Pradesh (23)",
    state_name: "Madhya Pradesh",
    state_code: "23",
    country_code: "IN",
  },
  {
    label: "Maharashtra (27)",
    state_name: "Maharashtra",
    state_code: "27",
    country_code: "IN",
  },
  {
    label: "Manipur (14)",
    state_name: "Manipur",
    state_code: "14",
    country_code: "IN",
  },
  {
    label: "Meghalaya (17)",
    state_name: "Meghalaya",
    state_code: "17",
    country_code: "IN",
  },
  {
    label: "Mizoram (15)",
    state_name: "Mizoram",
    state_code: "15",
    country_code: "IN",
  },
  {
    label: "Nagaland (13)",
    state_name: "Nagaland",
    state_code: "13",
    country_code: "IN",
  },
  {
    label: "Odisha (21)",
    state_name: "Odisha",
    state_code: "21",
    country_code: "IN",
  },
  {
    label: "Other Territory (97)",
    state_name: "Other Territory",
    state_code: "97",
    country_code: "IN",
  },
  {
    label: "Puducherry (34)",
    state_name: "Puducherry",
    state_code: "34",
    country_code: "IN",
  },
  {
    label: "Punjab (03)",
    state_name: "Punjab",
    state_code: "03",
    country_code: "IN",
  },
  {
    label: "Rajasthan (08)",
    state_name: "Rajasthan",
    state_code: "08",
    country_code: "IN",
  },
  {
    label: "Sikkim (11)",
    state_name: "Sikkim",
    state_code: "11",
    country_code: "IN",
  },
  {
    label: "Tamil Nadu (33)",
    state_name: "Tamil Nadu",
    state_code: "33",
    country_code: "IN",
  },
  {
    label: "Telangana (36)",
    state_name: "Telangana",
    state_code: "36",
    country_code: "IN",
  },
  {
    label: "Tripura (16)",
    state_name: "Tripura",
    state_code: "16",
    country_code: "IN",
  },
  {
    label: "Uttar Pradesh (09)",
    state_name: "Uttar Pradesh",
    state_code: "09",
    country_code: "IN",
  },
  {
    label: "Uttarakhand (05)",
    state_name: "Uttarakhand",
    state_code: "05",
    country_code: "IN",
  },
  {
    label: "West Bengal (19)",
    state_name: "West Bengal",
    state_code: "19",
    country_code: "IN",
  },
];

const fallbackCities: Record<string, string[]> = {
  Rajasthan: [
    "Jaipur",
    "Jodhpur",
    "Udaipur",
    "Kota",
    "Ajmer",
    "Bikaner",
    "Alwar",
  ],
  Maharashtra: [
    "Mumbai",
    "Pune",
    "Nagpur",
    "Nashik",
    "Thane",
    "Aurangabad",
    "Kolhapur",
  ],
  Gujarat: [
    "Ahmedabad",
    "Surat",
    "Vadodara",
    "Rajkot",
    "Bhavnagar",
    "Jamnagar",
    "Gandhinagar",
  ],
  Delhi: [
    "New Delhi",
    "Central Delhi",
    "East Delhi",
    "North Delhi",
    "South Delhi",
    "West Delhi",
  ],
  Karnataka: [
    "Bengaluru",
    "Mysuru",
    "Mangaluru",
    "Hubballi",
    "Belagavi",
    "Shivamogga",
  ],
  "Uttar Pradesh": [
    "Lucknow",
    "Kanpur",
    "Noida",
    "Ghaziabad",
    "Agra",
    "Varanasi",
    "Prayagraj",
    "Meerut",
  ],
  "Tamil Nadu": [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Tiruchirappalli",
    "Salem",
    "Tiruppur",
    "Erode",
  ],
  Telangana: [
    "Hyderabad",
    "Warangal",
    "Nizamabad",
    "Karimnagar",
    "Khammam",
    "Mahbubnagar",
  ],
};

export function useLocations() {
  const [states, setStates] = useState<LocationState[]>([]);
  const [countries, setCountries] = useState<LocationCountry[]>([]);
  const [citiesByState, setCitiesByState] = useState<Record<string, string[]>>(
    {},
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLocations() {
      const res = await authedRequest<LocationsResponse>(
        "/api/auth/workspace/locations",
      );
      if (res.ok && res.data) {
        setStates(
          res.data.states && res.data.states.length > 0
            ? res.data.states
            : fallbackStates,
        );
        setCountries(res.data.countries || []);
        setCitiesByState(
          Object.keys(res.data.cities || {}).length > 0
            ? res.data.cities || {}
            : fallbackCities,
        );
      } else {
        setStates(fallbackStates);
        setCitiesByState(fallbackCities);
      }
      setIsLoading(false);
    }
    void fetchLocations();
  }, []);

  return { states, countries, citiesByState, isLoading };
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

  const createMasterItem = async (
    type: "category" | "group" | "brand" | "service_line",
    name: string,
  ) => {
    if (!name.trim()) return false;

    const res = await authedRequest<any>(
      "/api/auth/workspace/product-catalog",
      {
        method: "POST",
        body: JSON.stringify({ type, name: name.trim() }),
      },
    );

    if (!res.ok || !res.data.item) {
      return {
        success: false,
        message: apiErrorMessage(`${type} create nahi ho saka.`, res.data),
      };
    }

    const item = { id: res.data.item.id, name: res.data.item.name };

    if (type === "category" || type === "service_line") {
      setCategories((curr) =>
        [...curr.filter((c) => c.name !== item.name), item].sort((a, b) =>
          a.name.localeCompare(b.name),
        ),
      );
    } else if (type === "group") {
      setGroups((curr) =>
        [...curr.filter((c) => c.name !== item.name), item].sort((a, b) =>
          a.name.localeCompare(b.name),
        ),
      );
    } else if (type === "brand") {
      setBrands((curr) =>
        [...curr.filter((c) => c.name !== item.name), item].sort((a, b) =>
          a.name.localeCompare(b.name),
        ),
      );
    }

    return { success: true, message: res.data.message || `${type} created.` };
  };

  useEffect(() => {
    void fetchMasters();
  }, []);

  return {
    categories,
    groups,
    brands,
    isLoading,
    refresh: fetchMasters,
    createMasterItem,
  };
}
