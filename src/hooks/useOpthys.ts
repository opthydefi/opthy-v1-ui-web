import useSWR from "swr";
import { ChainId, OpthysView } from 'opthy-v1-core';
import useKeepSWRDataLiveAsBlockArrive from './useKeepSWRDataLiveAsBlocksArrive';

export default function useOpthys() {

    const {ABI, address} = OpthysView(ChainId.RinkebyTestnet);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data: opthys, mutate, isValidating } = useSWR([ABI, address, 'all']);

    useKeepSWRDataLiveAsBlockArrive(mutate);
    
    return { opthys, mutate, isValidating };
}