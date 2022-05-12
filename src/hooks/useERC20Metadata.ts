import useSWRImmutable from 'swr/immutable';
import { ChainId, ERC20 } from 'opthy-v1-core';


export default function useERC20Metadata(address: string) {
    const { ABI } = ERC20(ChainId.RinkebyTestnet);

    let { data: name } = useSWRImmutable([ABI, address, 'name']);

    if (!name) {
        name = address.slice(-5);
    }

    let { data: symbol } = useSWRImmutable([ABI, address, 'symbol']);
    if (!symbol) {
        symbol = address.slice(-5);
    }

    let { data: decimals } = useSWRImmutable([ABI, address, 'decimals']);
    if (!decimals) {
        decimals = 18;
    }

    return { name, symbol, decimals }
}