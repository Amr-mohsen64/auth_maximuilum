import React, { useState } from "react"

const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    login: (token) => { },
    logout: () => { }
})

export const AuthContextProvider = (props) => {
    const [token, setToken] = useState(null)

    const userIsLoggedIn = token ? true : false

    const loginHandler = (token) => {
        setToken(token)
    }

    const logoutHandler = () => {
        setToken(null)
    }

    const contextValue = {
        token: token,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler
    }

    return <AuthContextProvider.Provider value={contextValue}>{props.children}</AuthContextProvider.Provider>
}

export default AuthContext;