import { createContext, useState } from "react";
import PropTypes from 'prop-types';

// Crear contexto Autentificación
export const AuthContext = createContext()

// Proveer el acceso al contexto
export function AuthProvider ({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)

    return(
        <AuthContext.Provider value={{ user, setUser, token, setToken}}>
            {children}
        </AuthContext.Provider>
    )
}

// Validamos las propiedades del AuthProvider
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
}