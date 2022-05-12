import useOpthys from './useOpthys';
// import useERC20Metadata from './useERC20Metadata';
import useKeepSWRDataLiveAsBlockArrive from './useKeepSWRDataLiveAsBlocksArrive';
import { useERC20Metadata } from 'src/utils/helpers';
// import { useEffect, useState } from 'react';

export default function useSingleOpthy(address: string) {
    // const [singleOpthy, setSingleOpthy] = useState([]);
    const { opthys, mutate, isValidating } = useOpthys();

    // useEffect(() => {
    //     const fetchTransactionLogs = async () => {
    //         try {
    //             const singleOpthyData = !isValidating ? opthys?.filter((singleOpthy: { [x: string]: any; }) => singleOpthy.opthy === address) : "";
    //             singleOpthyData['token0Details'] = useERC20Metadata(singleOpthyData[0]?.token0);
    //             singleOpthyData['token1Details'] = useERC20Metadata(singleOpthyData[0]?.token1);
    //             singleOpthyData['swapperTokenDetails'] =  useERC20Metadata(singleOpthyData[0]?.swapperFeeToken);
    //             singleOpthyData['liquidityProviderTokenDetails'] = useERC20Metadata(singleOpthyData[0]?.liquidityProviderFeeToken);
    //             setSingleOpthy(singleOpthyData)
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     }
    //     if(isValidating === false){
    //         console.log("isValidating = ", isValidating)
    //         fetchTransactionLogs();
    //     }
    // }, [address, isValidating, opthys])

    const singleOpthy = !isValidating ? opthys?.filter((singleOpthy: { [x: string]: any; }) => singleOpthy.opthy === address) : "";
    singleOpthy['token0Details'] = useERC20Metadata(singleOpthy[0]?.token0);
    singleOpthy['token1Details'] = useERC20Metadata(singleOpthy[0]?.token1);
    singleOpthy['swapperTokenDetails'] =  useERC20Metadata(singleOpthy[0]?.swapperFeeToken);
    singleOpthy['liquidityProviderTokenDetails'] = useERC20Metadata(singleOpthy[0]?.liquidityProviderFeeToken);

    // Expire Calculation
    const now = Math.floor(Date.now() / 1000);
    const expire = parseInt(singleOpthy[0]?.expiration);
    let delta = expire - now;
    const days = Math.floor(delta / 86400);
    delta -= days * 86400;
    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    const seconds = delta % 60;
    singleOpthy['opthyExpiration'] = days +' days ' + hours + 'h. ' + minutes + 'm. ' + seconds + 's.';

    useKeepSWRDataLiveAsBlockArrive(mutate);

    return { singleOpthy, isValidating };
}