"use client";

import { createContext, useContext, useState } from "react";

const UploadModalContext = createContext();

export function UploadModalProvider({children}){
    const [open, setOpen] = useState(false);
    return(
        <UploadModalContext.Provider value={{open, setOpen}}>
           {children}
        </UploadModalContext.Provider>
    )
}

export function useUploadModal(){
    return useContext(UploadModalContext);
}