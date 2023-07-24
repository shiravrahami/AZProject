import React, { useState, createContext, useContext, useEffect } from 'react';
import { getUserFromLocalStorage } from '../utils/localStorageUtils';

const UserContext = createContext();

export function useUserContext() {
  return useContext(UserContext)
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user data exists in local storage
    const storedUser = getUserFromLocalStorage();

    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const path = "http://194.90.158.74/cgroup95/prod/api/";
  
  function signinUser(user) {
    setUser(user);
  }

  // async function updateUser(updatedUser, user) {
  //   console.log('77777777777'+user.EmployeePK + ' '+user.ID + ' ' + updatedUser.EmployeeName);
  //   try {
  //     const response = await fetch(`https://proj.ruppin.ac.il/cgroup95/prod/api/EmployeeUpdate/${user.EmployeePK}`, {
  //       method: "PUT",
  //       body: JSON.stringify(updatedUser),
  //       headers: new Headers({
  //         'Accept': 'application/json; charset=UTF-8',
  //         'Content-type': 'application/json; charset=UTF-8'
  //       })
  //     });
  //     const json = await response.json();
  //     setUser(json);
  //   } catch (error) {
  //     console.log("error", error);
  //   } 
    
  // }

  return (
    <UserContext.Provider value={{ user, setUser, signinUser, 
    // updateUser, 
    path }}> 
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
