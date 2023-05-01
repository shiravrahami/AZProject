import React, { useState, createContext, useContext } from 'react';

const UserContext = createContext();

export function useUserContext() {
  return useContext(UserContext)
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  function signinUser(user) {
    setUser(user);
  }

  async function updateUser(updatedUser, user) {
    console.log('77777777777'+user.EmployeePK + ' '+user.ID + ' ' + updatedUser.EmployeeName);
    try {
      const response = await fetch(`https://proj.ruppin.ac.il/cgroup95/prod/api/EmployeeUpdate/${user.EmployeePK}`, {
        method: "PUT",
        body: JSON.stringify(updatedUser),
        headers: new Headers({
          'Accept': 'application/json; charset=UTF-8',
          'Content-type': 'application/json; charset=UTF-8'
        })
      });
      const json = await response.json();
      setUser(json);
    } catch (error) {
      console.log("error", error);
    } 
  }

  return (
    <UserContext.Provider value={{ user, setUser, signinUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
