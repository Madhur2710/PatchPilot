import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

interface SearchContextValue {
  query: string;
  setQuery: (q: string) => void;
  placeholder: string;
  setPlaceholder: (p: string) => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [placeholder, setPlaceholder] = useState("Search…");
  const value = useMemo(
    () => ({ query, setQuery, placeholder, setPlaceholder }),
    [query, placeholder],
  );
  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useAppSearch(): SearchContextValue {
  const ctx = useContext(SearchContext);
  if (!ctx)
    return {
      query: "",
      setQuery: () => {},
      placeholder: "Search…",
      setPlaceholder: () => {},
    };
  return ctx;
}
