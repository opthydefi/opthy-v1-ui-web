import type { Web3Provider } from "@ethersproject/providers";
// import { useWeb3React } from "@web3-react/core";
import { ethers } from 'ethers';
import useSWR from "swr";

declare const window: any;

function getBlockNumber(library: Web3Provider) {
    return async () => {
        return library.getBlockNumber();
    };
}

export default function useBlockNumber() {
//   const { library } = useWeb3React<Web3Provider>();
    const { ethereum } = window;
    const library: Web3Provider = new ethers.providers.Web3Provider(ethereum, "any");
    const shouldFetch = !!library;

    return useSWR(shouldFetch ? ["BlockNumber"] : null, getBlockNumber(library), {
        refreshInterval: 10 * 1000,
    });
}