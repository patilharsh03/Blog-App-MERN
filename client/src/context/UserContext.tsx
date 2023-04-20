import { createContext, useState } from 'react'

interface User {
    password: string;
    username?: string
}

interface UserContextType {
    userInfo: User | null;
    setUserInfo: React.Dispatch<React.SetStateAction<User | null>>;
  }

export const UserContext = createContext<UserContextType>({
    setUserInfo: () => {},
    userInfo: { password: ''}
})

interface UserContextProviderProps {
    children: React.ReactNode
}

export const UserContextProvider: React.FC<UserContextProviderProps
> = ({children}) => {
    const [userInfo, setUserInfo] = useState<User | null>(null)

    return (
        <UserContext.Provider value={{userInfo, setUserInfo}}>
            {children}
        </UserContext.Provider>
    )
}