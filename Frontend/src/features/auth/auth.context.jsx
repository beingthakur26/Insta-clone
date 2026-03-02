/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { createContext, useState, useEffect } from "react";
import { login, register, getMe, logout } from "./services/auth.api";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Check auth on page refresh
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await getMe()
                setUser(response.user)
            } catch (err) {
                setUser(null)
            }
        }

        checkAuth()
    }, [])

    const handleLogin = async (email, password) => {
        setLoading(true)
        setError(null)

        try {
            const response = await login(email, password)
            setUser(response.user)
            return response   // FIXED
        }
        catch (error) {
            setError(error)
            throw error
        }
        finally {
            setLoading(false)
        }
    }

    const handleRegister = async (username, email, password) => {
        setLoading(true)
        setError(null)

        try {
            const response = await register(username, email, password)
            setUser(response.user)
            return response   // FIXED
        }   
        catch (error) {
            setError(error)
            throw error
        }
        finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        await logout()
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, error, handleLogin, handleRegister, handleLogout }}>
            {children}
        </AuthContext.Provider>
    )
}