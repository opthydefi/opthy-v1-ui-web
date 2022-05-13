import useSWR from "swr";
import { ChainId, ERC20 } from 'opthy-v1-core';
import useKeepSWRDataLiveAsBlockArrive from './useKeepSWRDataLiveAsBlocksArrive';
import { useEthersState } from "src/contexts/EthereumContext";

export default function useAllowance(tokenAddress: string, contractAddress: string) {

    const { userCurrentAddress } = useEthersState();

    const { ABI } = ERC20(ChainId.RinkebyTestnet);

    const { data: allowanceData, mutate, isValidating } = useSWR([ABI, tokenAddress, "allowance", userCurrentAddress, contractAddress ]);

    useKeepSWRDataLiveAsBlockArrive(mutate);
    
    return { allowanceData, mutate, isValidating };
}