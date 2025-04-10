import { createContext, useState } from 'react';
import { UserRoles } from '../types/dbTypes';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [breads, setBreads] = useState([]);

  // Example function - will connect to real API later
  const fetchBreads = async () => {
    // const { data } = await breadAPI.getAll();
    // setBreads(data);
    setBreads(mockBreads); // Temporary mock
  };

  return (
    <AppContext.Provider value={{ currentUser, breads, fetchBreads }}>
      {children}
    </AppContext.Provider>
  );
}