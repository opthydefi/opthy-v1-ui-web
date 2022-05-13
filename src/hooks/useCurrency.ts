import useSWR from "swr";
import useKeepSWRDataLiveAsBlockArrive from './useKeepSWRDataLiveAsBlocksArrive';

export default function useCurrency(convertFrom: string) {

    const fetcher = (url: RequestInfo) => fetch(url).then(r => r.json());

    let { data: convertResult, error, mutate, isValidating: currencyIsValidating } = useSWR('https://api.diadata.org/v1/quotation/' + ((convertFrom.length !== 5) ? convertFrom : "DAI"), fetcher)
    
    useKeepSWRDataLiveAsBlockArrive(mutate);
    
    return { convertResult, error, mutate, currencyIsValidating };
}