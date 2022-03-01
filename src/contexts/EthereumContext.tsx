import React, { useEffect, useState, useContext } from "react";
import { ethers } from 'ethers';
import type { FC, ReactNode } from 'react';
import { contractABI, contractAddress } from "src/artifacts/constants";
import LoadingScreen from 'src/components/LoadingScreen';
import InstallMetamask from 'src/views/errors/InstallMetamask';



declare const window: any;


interface AppInitializeState {
    isMetamaskInstall: boolean | null;
    isInitialized: boolean;
    appBackendAddress: string;
    userCurrentAddress: string;
    userTransactions: any[];
    isWalletConnected: boolean;
}

interface EthereumContextValue extends AppInitializeState {

    connectWallet: (user: any) => Promise<void>;
}




const initialAppState: AppInitializeState = {
    isMetamaskInstall: null,
    isInitialized: false,
    appBackendAddress: '',
    userCurrentAddress: '',
    userTransactions: [],
    isWalletConnected: false,
};


const EthereumContext = React.createContext<EthereumContextValue>({
    ...initialAppState,
    connectWallet: () => Promise.resolve(),
    // test: () => Promise.resolve(),
});

interface EthereumProviderProps {
    children: ReactNode;
}

type InitializeAction = {
    type: 'INITIALIZE';
    payload: {
        isInitialized: boolean;
    };
};

type ChangeMetamaskAddress = {
    type: "CHANGE_METAMASK_ADDRESS",
    payload: {
        userCurrentAddress: string;
    }
}

type ConnectWallet = {
    type: "CONNECT_WALLET",
    payload: {
        userCurrentAddress: string;
        isWalletConnected: boolean;
    }
}

type checkIsMetamaskInstall = {
    type: "CHECK_METAMASK_INSTALL",
    payload: {
        isMetamaskInstall: boolean;
    }
}

type Action = InitializeAction | ChangeMetamaskAddress | checkIsMetamaskInstall | ConnectWallet;

const stateReducer = (state: AppInitializeState, action: Action): AppInitializeState => {
    switch (action.type) {
        case 'INITIALIZE': {
            const { isInitialized } = action.payload;
            return {
                ...state,
                isInitialized
            };
        }
        case "CHECK_METAMASK_INSTALL": {
            const { isMetamaskInstall } = action.payload;
            return {
                ...state,
                isMetamaskInstall
            };
        }
        case "CONNECT_WALLET": {
            const { userCurrentAddress, isWalletConnected } = action.payload;
            return {
                ...state,
                userCurrentAddress,
                isWalletConnected
            }
        }
        default: {
            return { ...state };
        }
    }
}

export const EthereumProvider: FC<EthereumProviderProps> = ({ children }) => {
    const [state, dispatch] = React.useReducer(stateReducer, initialAppState);
    const { ethereum } = window;


    const createEthereumContract = () => {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);
        return transactionsContract;
    };


    React.useEffect(() => {
        if (state.isInitialized === true) {
            console.log(ethereum, 'ethereum')
            if (!ethereum) {
                dispatch({
                    type: "CHECK_METAMASK_INSTALL",
                    payload: {
                        isMetamaskInstall: false,
                    }
                })
            } else {
                dispatch({
                    type: "CHECK_METAMASK_INSTALL",
                    payload: {
                        isMetamaskInstall: true,
                    }
                })
            }
        }
    }, [ethereum, state.isInitialized])


    React.useEffect(() => {
        dispatch({
            type: "INITIALIZE",
            payload: {
                isInitialized: true,
            }
        })
    }, [])





    const connectWallet = async () => {
        try {
            if (!ethereum) return alert("Please install MetaMask.");

            const accounts = await ethereum.request({ method: "eth_requestAccounts", });
            dispatch({
                type: "CONNECT_WALLET",
                payload: {
                    userCurrentAddress: accounts[0],
                    isWalletConnected: true
                }
            })
            //   setCurrentAccount(accounts[0]);
            //   window.location.reload();
        } catch (error) {
            console.log(error);

            throw new Error("No ethereum object");
        }
    };

    const anyFunc = async () => { }


    if (!state.isInitialized) {
        return <LoadingScreen />
    }

    if (state.isMetamaskInstall === false && state.isInitialized === true) {
        return <InstallMetamask />
    }

    return (<EthereumContext.Provider
        value={{
            ...state,
            connectWallet
        }}>
        {children}
    </EthereumContext.Provider>)
}

export const useEthersState = () => useContext(EthereumContext);




