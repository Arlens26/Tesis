import { useState, useEffect } from 'react'
import { getUserProfile, updateUserProfile, changePassword } from '../services/userProfileService'

export const useUserProfile = () => {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [updating, setUpdating] = useState(false)
    const [changingPassword, setChangingPassword] = useState(false)

    const getProfile = async (token) => {
        setLoading(true)
        setError(null)
        try {
            const profileData = await getUserProfile(token)
            setProfile(profileData)
            return profileData
        } catch (err) {
            setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const updateProfile = async (profileData, token) => {
        setUpdating(true)
        setError(null)
        try {
            const response = await updateUserProfile(profileData, token)
            // Actualizar el perfil local con los nuevos datos
            setProfile(prev => ({
                ...prev,
                ...response.user
            }))
            return response
        } catch (err) {
            setError(err.message)
            throw err
        } finally {
            setUpdating(false)
        }
    }

    const updatePassword = async (passwordData, token, updateUserContext) => {
        setChangingPassword(true)
        setError(null)
        try {
            const response = await changePassword(passwordData, token)
            // Actualizar el token en el contexto si se proporciona la función
            if (updateUserContext && response.token) {
                updateUserContext(response.token)
            }
            return response
        } catch (err) {
            setError(err.message)
            throw err
        } finally {
            setChangingPassword(false)
        }
    }

    const clearError = () => {
        setError(null)
    }

    return {
        profile,
        loading,
        error,
        updating,
        changingPassword,
        getProfile,
        updateProfile,
        updatePassword,
        clearError
    }
}
