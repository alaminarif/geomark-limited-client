import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

const LoaderContext = createContext(null);

export function LoaderProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const countRef = useRef(0);

  const show = useCallback(() => {
    countRef.current += 1;
    if (countRef.current === 1) setIsLoading(true);
  }, []);

  const hide = useCallback(() => {
    countRef.current = Math.max(0, countRef.current - 1);
    if (countRef.current === 0) setIsLoading(false);
  }, []);

  const reset = useCallback(() => {
    countRef.current = 0;
    setIsLoading(false);
  }, []);

  const value = useMemo(() => ({ isLoading, show, hide, reset }), [isLoading, show, hide, reset]);

  return <LoaderContext.Provider value={value}>{children}</LoaderContext.Provider>;
}

export function useLoader() {
  const ctx = useContext(LoaderContext);
  if (!ctx) throw new Error("useLoader must be used inside LoaderProvider");
  return ctx;
}
