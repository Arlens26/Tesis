import { useContext } from "react";
import { AuthContext } from "../context/user";
import { loginUser, userProfile } from "../services/userService";

export function useUsers() {

    const { user, setUser, role, setRole } = useContext(AuthContext)

    const getLogin = (fields) => {
      return loginUser(fields)
      .then(data => {
        const updateUser = {...data.user, token: data.token}
        setUser(updateUser)
        return userProfile(data.token)
      })
      .then(profileData => {
          setUser(prevUser => ({ ...prevUser, profile: profileData }));
          console.log(profileData)
            if (profileData.is_director && profileData.is_professor) {
                setRole('director')
            } else if (profileData.is_professor) {
                setRole('professor')
            } else if (profileData.is_student) {
                setRole('student')
            } else {
                console.error('No se pudo determinar el rol del usuario')
            }
          return profileData
      })
      .catch(error => {
          console.error('Error:', error)
          throw error
      })
  }

    // Devuelve las funciones o valores necesarios del contexto
    return { user, getLogin, role, setRole }
}