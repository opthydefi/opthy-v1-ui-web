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
    // console.log(ethereum, "ethereum")


    // const createEthereumContract = () => {
    //     const provider = new ethers.providers.Web3Provider(ethereum);
    //     const signer = provider.getSigner();
    //     const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);
    //     // console.log(provider, signer, transactionsContract, 'provider, signer, transactionsContract')
    //     return transactionsContract;
    // };

    // const fetcher = (library: Web3Provider, abi?: any) => (...args: any) => {
    //     console.log(library, abi, args, "dfd");
    //     const [arg1, arg2, ...params] = args
    //     // it's a contract
    //     if (isAddress(arg1)) {
    //         const address = arg1
    //         const method = arg2
    //         const contract = new ethers.Contract(address, abi, library.getSigner())
    //         return contract[method](...params)
    //     }
    //     // it's a eth call
    //     const method = arg1
    //     return library[method](arg2, ...params)
    // }

    const fetcher = () => async (...args: any) => {
        // let provider = ethers.getDefaultProvider();
        const library: Web3Provider = new ethers.providers.Web3Provider(ethereum, "any");
        const [abi, arg1, arg2, ...params] = args
        await ethereum.enable();
        // console.log(abi);
        // it's a contract
        if (isAddress(arg1)) {
            console.log("here");
            const address = arg1
            const method = arg2
            const contract = new ethers.Contract(address, abi, library.getSigner())
            console.log(contract, address, abi, arg2, params, 'contract, address, abi, method, params');
            return contract[method](...params)
        }
        // it's a eth call
        // console.log(library, arg1, arg2)
        const method = arg1
        return library[method](arg2, ...params)
    }

    // const fetcher = (arg1: string, ...args: any[]) => {
    //     // console.log(arg1, args); ////////////////////////////////////////////////////////////////////
    //     //arg1 is an address, so it's a contract call


    //     const library: Web3Provider = new ethers.providers.Web3Provider(ethereum);
    //     if (isAddress(arg1)) {
    //         const [address, contractName, abi, method, ...params] = [arg1, ...args];
    //         const contract = new ethers.Contract(address, abi, library.getSigner());

    //         //   const contract = new Contract(address, name2ABI(contractName), library.getSigner(window.ethereum.selectedAddress))
    //         return contract[method](...params)
    //     }
    //     console.log(library, arg1, args, 'library, arg1, args')
    //     // //arg1 is a method, so it's a eth call
    //     return library[arg1](...args)
    // }


    return (
        <SWRConfig
            value={{
                refreshInterval: 10000,
                fetcher: fetcher()
            }}
        // value={{ fetcher: fetcher }}
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




