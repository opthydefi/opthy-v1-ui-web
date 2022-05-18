import useSWR from "swr";
import { ChainId, ERC20 } from 'opthy-v1-core';
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";


export default function useTokenBalance(address: string, tokenAddress: string) {

    const { ABI } = ERC20(ChainId.RinkebyTestnet);
    
    const { data, mutate, isValidating } = useSWR([ABI, tokenAddress, "balanceOf", address]);

    useKeepSWRDataLiveAsBlocksArrive(mutate);

    return { data, mutate, isValidating };
}