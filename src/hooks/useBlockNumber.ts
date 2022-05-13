import type { Web3Provider } from "@ethersproject/providers";
// import { ethers } from 'ethers';
import useSWR from "swr";
import { useEthersState } from "src/contexts/EthereumContext";


// declare const window: any;

function getBlockNumber(library: Web3Provider) {
    return async () => {
        return library.getBlockNumber();
    };
}

export default function useBlockNumber() {

    const { provider } = useEthersState();
    
    // const { ethereum } = window;
    // const library: Web3Provider = new ethers.providers.Web3Provider(ethereum, "any");
    const shouldFetch = !!provider;

    return useSWR(shouldFetch ? ["BlockNumber"] : null, getBlockNumber(provider), {
        refreshInterval: 10 * 1000,
    });
}