import React, { createContext, useState } from "react";

interface AppContextType {
  name: string;
  setName: (str: string) => void;
  id: string;
  setId: (str: string) => void;
}

const AppContext = createContext<AppContextType>({
  name: "",
  setName: () => {},
  id: "",
  setId: () => {},
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [name, setNameState] = useState("");
  const [id, setIdState] = useState("");

  const setName = (str: string) => {
    setNameState(str);
  };

  const setId = (str: string) => {
    setIdState(str);
  };

  const values: AppContextType = {
    name,
    setName,
    id,
    setId,
  };

  return (
    <AppContext.Provider value={values}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
