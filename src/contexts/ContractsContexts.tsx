import React, { useEffect, useState, useContext } from "react";
import { ethers } from 'ethers';
import type { FC, ReactNode } from 'react';
import { contractABI, contractAddress } from "src/artifacts/constants";
import LoadingScreen from 'src/components/LoadingScreen';
import InstallMetamask from 'src/views/errors/InstallMetamask';
import { Web3Provider } from "@ethersproject/providers";
import { isAddress } from "@ethersproject/address";
import { SWRConfig } from "swr";
import { name2ABI } from "src/utils/helpers";





declare const window: any;


interface AppInitializeState {
    isMetamaskInstall: boolean | null;
    isInitialized: boolean;
    appBackendAddress: string;
    userCurrentAddress: string;
    userTransactions: any[];
    isWalletConnected: boolean;
}

interface ContractsContextValue extends AppInitializeState {

    // connectWallet: (user: any) => Promise<void>;
}




const initialAppState: AppInitializeState = {
    isMetamaskInstall: null,
    isInitialized: false,
    appBackendAddress: '',
    userCurrentAddress: '',
    userTransactions: [],
    isWalletConnected: false,
};


const ContractsContext = React.createContext<ContractsContextValue>({
    ...initialAppState,
    // connectWallet: () => Promise.resolve(),
    // test: () => Promise.resolve(),
});

interface ContractsProviderProps {
    children: ReactNode;
}

type InitializeAction = {
    type: 'INITIALIZE';
    payload: {
        isInitialized: boolean;
    };
};


type Action = InitializeAction;

const stateReducer = (state: AppInitializeState, action: Action): AppInitializeState => {
    switch (action.type) {
        case 'INITIALIZE': {
            const { isInitialized } = action.payload;
            return {
                ...state,
                isInitialized
            };
        }

        default: {
            return { ...state };
        }
    }
}

export const ContractsProvider: FC<ContractsProviderProps> = ({ children }) => {
    const [state, dispatch] = React.useReducer(stateReducer, initialAppState);
    const { ethereum } = window;

    const fetcher = () => async (...args: any) => {
        const library: Web3Provider = new ethers.providers.Web3Provider(ethereum, "any");
        const [abi, arg1, arg2, ...params] = args
        // it's a contract
        if (isAddress(arg1)) {
            const address = arg1
            const method = arg2
            const contract = new ethers.Contract(address, abi, library.getSigner())
            return contract[method](...params)
        }

        const method = arg1
        return library[method](arg2, ...params)
    }


    return (
        <SWRConfig
            value={{
                refreshInterval: 0,
                fetcher: fetcher()
            }}
        >
            <ContractsContext.Provider
                value={{
                    ...state,
                }}>
                {children}
            </ContractsContext.Provider>
        </SWRConfig>
    )
}

export const useContractsState = () => useContext(ContractsContext);




