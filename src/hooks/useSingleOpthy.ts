import { useMemo } from "react";
import useOpthys from './useOpthys';

export default function useSingleOpthy(address: string) {
    const { opthys, isValidating } = useOpthys();

    const singleOpthy = opthys?.filter((singleOpthy: { [x: string]: any; }) => singleOpthy.opthy === address);
    
    const singleOpthyData = opthys ? singleOpthy[0] : null;

    return useMemo(() => {

        return { singleOpthy: singleOpthyData, isValidating };

    }, [address, singleOpthyData]);

    // return { singleOpthy: opthys ? singleOpthy[0] : null, isValidating };
}