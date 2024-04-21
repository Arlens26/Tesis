import { useContext } from "react";
import { AuthContext } from "../context/user";

export function useUsers() {

    const AUTH_ENDPOINT = `http://127.0.0.1:8000/authentication/user/login/`
    const PROFILE_ENDPOINT = `http://127.0.0.1:8000/authentication/user/profile/`

    const { user, setUser } = useContext(AuthContext);
    //const profile = user.profile;
    /*useEffect(() => {
        console.log(user)
        getProfile(user)
    }, [setUser]);*/

    const getLogin = (fields) => {
      return fetch(AUTH_ENDPOINT, {
          method: 'POST', 
          headers: {
              'Content-Type' : 'application/json'
          },
          body : JSON.stringify(fields)
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Error al enviar los datos');
          }
          return response.json();
      })
      .then(data => {
          setUser(data.user);
          return fetch(PROFILE_ENDPOINT, {
              method: 'POST',
              headers: {
                  'Authorization': `Token ${data.token}`
              }
          });
      })
      .then(profileResponse => {
          if (!profileResponse.ok) {
              throw new Error('Error al obtener el perfil del usuario');
          }
          return profileResponse.json();
      })
      .then(profileData => {
          setUser(prevUser => ({ ...prevUser, profile: profileData }));
          console.log(profileData);
          return profileData;
      })
      .catch(error => {
          console.error('Error:', error);
          throw error;
      });
  };

    /*const getProfile = (fields) => {
        return fetch(PROFILE_ENDPOINT, {
            method: 'POST', 
            headers: {
              'Content-Type' : 'application/json',
              'Token' : token
            },
            body : JSON.stringify(fields)
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Error al enviar los datos');
            }
            return response.json();
          })
          .then(data => {
            // Aquí deberías establecer el usuario y el token en el contexto de autenticación
            setUser(data.user);
            console.log('Datos enviados exitosamente', data);
          })
          .catch(error => {
            console.error('Error:', error);
          });
    };*/

    // Devuelve las funciones o valores necesarios del contexto
    return { user, getLogin }
}