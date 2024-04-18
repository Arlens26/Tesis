import { createContext, useState } from "react";
import PropTypes from 'prop-types';

// Crear contexto Autentificación
export const AuthContext = createContext()

// Proveer el acceso al contexto
export function AuthProvider ({ children }) {
    const [user, setUser] = useState({ user: null, token: null, profile: null });
    const [course, setCourse] = useState([])

    return(
        <AuthContext.Provider value={{ user, setUser, course, setCourse }}>
            {children}
        </AuthContext.Provider>
    )
}

// Validamos las propiedades del AuthProvider
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
}