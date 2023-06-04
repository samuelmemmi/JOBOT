import {createContext, useContext, useState} from "react"

export const UserContext = createContext(null)

export const UserProvider = ({children}) => {
    // const [userType, setUserType] = useState("")$$$$$$$$$$$$$$
    const [userType, setUserType] = useState({})

    return (
        <UserContext.Provider value={{userType, setUserType}}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)
