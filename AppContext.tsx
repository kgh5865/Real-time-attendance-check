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
  week: number;
  setWeek: (week: number) => void;
  period: number;
  setPeriod: (period: number) => void;
  subj_part: string;
  setSubjPart: (part: string) => void;
  subj_id: string;
  setSubjId: (id: string) => void;
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
  week: 0,
  setWeek: () => {},
  period: 0,
  setPeriod: () => {},
  subj_part: "",
  setSubjPart: () => {},
  subj_id: "",
  setSubjId: () => {},
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [name, setNameState] = useState("");
  const [id, setIdState] = useState("");
  const [department, setDepartmentState] = useState<string[]>([]);
  const [subjects, setSubjectsState] = useState<string[]>([]);
  const [week, setWeekState] = useState(0);
  const [period, setPeriodState] = useState(0);
  const [subj_part, setSubjPartState] = useState("");
  const [subj_id, setSubjIdState] = useState("");

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

  const setWeek = (week: number) => {
    setWeekState(week);
  };

  const setPeriod = (period: number) => {
    setPeriodState(period);
  };

  const setSubjPart = (part: string) => {
    setSubjPartState(part);
  };

  const setSubjId = (id: string) => {
    setSubjIdState(id);
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
    week,
    setWeek,
    period,
    setPeriod,
    subj_part,
    setSubjPart,
    subj_id,
    setSubjId,
  };

  return (
    <AppContext.Provider value={values}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;