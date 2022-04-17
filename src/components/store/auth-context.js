import React, { useState, useEffect, useCallback } from "react"


let logoutTimer;

const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    login: (token) => { },
    logout: () => { }
})

const calculateRemainingTime = (expirationTime) => {
    const currentTime = new Date().getTime()
    const adjustedExpirationTime = new Date(expirationTime).getTime()

    const remainingDuration = adjustedExpirationTime - currentTime;

    return remainingDuration;
}

const retriveStoredToken = () => {
    const storedToken = localStorage.getItem('token')
    const storedExpirationTime = localStorage.getItem('expirationTime')

    const remainingTime = calculateRemainingTime(storedExpirationTime)

    // if(remainingTime <=one minute)
    if (remainingTime <= 3600) {
        localStorage.removeItem('token')
        localStorage.removeItem('expirationTime')
        return null;
    }

    return {
        token: storedToken,
        duration: remainingTime
    }
}

export const AuthContextProvider = (props) => {

    const tokenData = retriveStoredToken()
    let initalToken;
    if (tokenData) {
        initalToken = tokenData.token;
    }

    const [token, setToken] = useState(initalToken)

    const userIsLoggedIn = token ? true : false


    const logoutHandler = useCallback(() => {
        setToken(null)
        localStorage.removeItem('token')
        localStorage.removeItem('expirationTime')

        if (logoutTimer) {
            clearTimeout(logoutTimer)
        }
    }, [])

    const loginHandler = (token, expirationTime) => {
        setToken(token)
        localStorage.setItem('token', token)
        localStorage.setItem('expirationTime', expirationTime)

        const remainingTime = calculateRemainingTime(expirationTime)

        console.log(remainingTime);
        logoutTimer = setTimeout(loginHandler, remainingTime);
    }


    useEffect(() => {
        if (tokenData) {
            console.log(tokenData.duration);
            logoutTimer = setTimeout(logoutHandler, tokenData.duration);
        }
    }, [tokenData, logoutHandler])

    const contextValue = {
        token: token,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler
    }

    return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>
}

export default AuthContext;
