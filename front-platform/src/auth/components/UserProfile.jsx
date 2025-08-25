import { useState, useEffect, useContext } from 'react'
import { useUserProfile } from '../hooks/useUserProfile'
import { AuthContext } from '../context/user'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { GoBackButton } from '../../components/GoBackButton'
import { toast } from 'sonner'
import { UpdateIcon } from '../../components/Icons'

export function UserProfile() {
    const { user, setUser } = useContext(AuthContext)
    const { 
        updating, 
        changingPassword, 
        updateProfile, 
        updatePassword, 
        error,
        clearError 
    } = useUserProfile()
    
    const [loading, setLoading] = useState(false)

    const [profileForm, setProfileForm] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: ''
    })

    const [passwordForm, setPasswordForm] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    })

    const [activeTab, setActiveTab] = useState('profile')

    // Cargar información del perfil al montar el componente
    useEffect(() => {
        const loadProfile = async () => {
            if (user?.token) {
                setLoading(true)
                try {
                    const { getUserProfile } = await import('../services/userProfileService')
                    const profileData = await getUserProfile(user.token)
                    setProfileForm({
                        username: profileData.username || '',
                        first_name: profileData.first_name || '',
                        last_name: profileData.last_name || '',
                        email: profileData.email || ''
                    })
                } catch (error) {
                    console.error('Error al cargar perfil:', error)
                    // Si falla, usar datos del contexto como fallback
                    if (user?.profile) {
                        setProfileForm({
                            username: user.profile.username || '',
                            first_name: user.profile.first_name || '',
                            last_name: user.profile.last_name || '',
                            email: user.profile.email || ''
                        })
                    }
                } finally {
                    setLoading(false)
                }
            }
        }

        loadProfile()
    }, [user?.token])

    const handleProfileChange = (e) => {
        const { name, value } = e.target
        setProfileForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handlePasswordChange = (e) => {
        const { name, value } = e.target
        setPasswordForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleProfileSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await updateProfile(profileForm, user.token)
            toast.success('Perfil actualizado exitosamente')
            
            // Actualizar el contexto del usuario con los nuevos datos
            setUser(prevUser => ({
                ...prevUser,
                profile: {
                    ...prevUser.profile,
                    username: profileForm.username,
                    first_name: profileForm.first_name,
                    last_name: profileForm.last_name,
                    email: profileForm.email
                }
            }))
        } catch (error) {
            toast.error('Error al actualizar el perfil')
        }
    }

    const handlePasswordSubmit = async (e) => {
        e.preventDefault()
        
        if (passwordForm.new_password !== passwordForm.confirm_password) {
            toast.error('Las contraseñas no coinciden')
            return
        }

        try {
            const response = await updatePassword(passwordForm, user.token, (newToken) => {
                // Actualizar el token en el contexto del usuario
                setUser(prevUser => ({
                    ...prevUser,
                    token: newToken
                }))
            })
            toast.success('Contraseña actualizada exitosamente')
            setPasswordForm({
                current_password: '',
                new_password: '',
                confirm_password: ''
            })
        } catch (error) {
            toast.error('Error al cambiar la contraseña')
        }
    }

    if (loading) {
        return <LoadingSpinner label="Cargando perfil..." />
    }

    if (error && !user?.profile) {
        return (
            <div className="flex flex-col gap-4">
                <p className="text-red-500">{error}</p>
                <button 
                    onClick={clearError}
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
                >
                    Reintentar
                </button>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-primary">Perfil de Usuario</h1>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'profile'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Información Personal
                    </button>
                    <button
                        onClick={() => setActiveTab('password')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'password'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Cambiar Contraseña
                    </button>
                </nav>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Información Personal</h2>
                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre de usuario
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={profileForm.username}
                                onChange={handleProfileChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre
                            </label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={profileForm.first_name}
                                onChange={handleProfileChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
                        </div>

                        <div>
                            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                                Apellido
                            </label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={profileForm.last_name}
                                onChange={handleProfileChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={profileForm.email}
                                onChange={handleProfileChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                required
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={updating}
                                className="bg-btn-create opacity-80 w-fit px-4 py-1 rounded-lg hover:opacity-100 flex items-center text-white disabled:cursor-not-allowed gap-2"
                            >
                                <UpdateIcon/>
                                {updating ? 'Actualizando...' :  'Actualizar Perfil'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Cambiar Contraseña</h2>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-1">
                                Contraseña actual
                            </label>
                            <input
                                type="password"
                                id="current_password"
                                name="current_password"
                                value={passwordForm.current_password}
                                onChange={handlePasswordChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-1">
                                Nueva contraseña
                            </label>
                            <input
                                type="password"
                                id="new_password"
                                name="new_password"
                                value={passwordForm.new_password}
                                onChange={handlePasswordChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                required
                                minLength={8}
                            />
                            <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres</p>
                        </div>

                        <div>
                            <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirmar nueva contraseña
                            </label>
                            <input
                                type="password"
                                id="confirm_password"
                                name="confirm_password"
                                value={passwordForm.confirm_password}
                                onChange={handlePasswordChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                required
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={changingPassword}
                                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {changingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="flex justify-end">
                <GoBackButton label="Volver" route="/course-list/" />
            </div>
        </div>
    )
}
