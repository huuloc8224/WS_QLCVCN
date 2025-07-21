import React, { useState, useEffect } from 'react';
import { UserContext } from './UserContext';

export const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) setUserName(storedName);
  }, []);

  return (
    <UserContext.Provider value={{ userName, setUserName }}>
      {children}
    </UserContext.Provider>
  );
};
