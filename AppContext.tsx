// AppContext.tsx

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
  adminId: string;
  setAdminId: (id: string) => void;

  // 추가된 부분
  start: string;
  setStart: (start: string) => void;
  users: any[]; // any는 실제 타입에 맞게 변경해야 합니다.
  setUsers: (users: any[]) => void;
  wifiDelay: number;
  attendanceStart: boolean;
  setAttdStart: (start: boolean) => void;
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
  adminId: "",
  setAdminId: () => {},
  start: "",
  setStart: () => {},
  users: [],
  setUsers: () => {},
  wifiDelay: 10000,//5분 : 300000
  attendanceStart: false,
  setAttdStart: () => {},
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
  const [adminId, setAdminIdState] = useState("");

  const [wifiDelay, setWifiDelay] = useState(10000);
  const [attendanceStart, setAttendanceStart] = useState<boolean>(false);
  // 추가된 부분
  const [start, setStartState] = useState("");
  const [users, setUsersState] = useState<any[]>([]);

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

  const setAdminId = (id: string) => {
    setAdminIdState(id);
  };

  // 추가된 부분
  const setStart = (str: string) => {
    setStartState(str);
  };

  const setUsers = (userList: any[]) => {
    setUsersState(userList);
    
  };
  const setAttdStart = (start: boolean) => {
    setAttendanceStart(start);
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
    adminId,
    setAdminId,
    start,
    setStart,
    users,
    setUsers,
    wifiDelay,
    attendanceStart,
    setAttdStart,
  };

  return (
    <AppContext.Provider value={values}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;