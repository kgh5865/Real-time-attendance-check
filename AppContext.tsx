import React, { createContext, useState } from "react";

interface AppContextType {
  name: string;
  setName: (str: string) => void;
  id: string;
  setId: (str: string) => void;
  department: string[];
  setDepartment: (departments: string[]) => void;
  subjects: string[];
  setSubjects: (subjects: string[]) => void;
}

const AppContext = createContext<AppContextType>({
  name: "",
  setName: () => {},
  id: "",
  setId: () => {},
  department: [],
  setDepartment: () => {},
  subjects: [],
  setSubjects: () => {},
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [name, setNameState] = useState("");
  const [id, setIdState] = useState("");
  const [department, setDepartmentState] = useState<string[]>([]);
  const [subjects, setSubjectsState] = useState<string[]>([]);

  const setName = (str: string) => {
    setNameState(str);
  };

  const setId = (str: string) => {
    setIdState(str);
  };

  const setDepartment = (departments: string[]) => {
    setDepartmentState(departments);
  };

  const setSubjects = (subjects: string[]) => {
    setSubjectsState(subjects);
  };

  const values: AppContextType = {
    name,
    setName,
    id,
    setId,
    department,
    setDepartment,
    subjects,
    setSubjects,
  };

  return (
    <AppContext.Provider value={values}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
