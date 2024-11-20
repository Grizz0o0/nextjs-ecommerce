'use client';
import { createContext, useContext, useState } from 'react';

const AppContext = createContext({
    sessionToken: '',
    setSessionToken: (sessionToken: string) => {},
});

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context)
        throw new Error('UseAppContext must be used within an AppProvider!');
    return context;
};

function AppProvider({
    children,
    initialSessionToken = '',
}: {
    children: React.ReactNode;
    initialSessionToken?: string | undefined;
}) {
    const [sessionToken, setSessionToken] = useState(initialSessionToken);
    return (
        <AppContext.Provider value={{ sessionToken, setSessionToken }}>
            {children}
        </AppContext.Provider>
    );
}

export default AppProvider;
