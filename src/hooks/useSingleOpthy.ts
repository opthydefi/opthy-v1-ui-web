import useOpthys from './useOpthys';
import useKeepSWRDataLiveAsBlockArrive from './useKeepSWRDataLiveAsBlocksArrive';

export default function useSingleOpthy(address: string) {
    const { opthys, mutate, isValidating } = useOpthys();

    const singleOpthy = opthys?.filter((singleOpthy: { [x: string]: any; }) => singleOpthy.opthy === address);

    useKeepSWRDataLiveAsBlockArrive(mutate);

    return { singleOpthy: opthys ? singleOpthy[0] : null, isValidating };
}