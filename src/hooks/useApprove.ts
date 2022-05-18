import React from "react";
import { ChainId, ERC20 } from 'opthy-v1-core';
import { useEthersState } from "src/contexts/EthereumContext";
import useAllowance from "./useAllowance";
import { TransactionReceipt, TransactionResponse } from "@ethersproject/providers";
import useERC20Metadata from "./useERC20Metadata";
import { formatUnits, parseEther } from "@ethersproject/units";
import { ethers } from "ethers"; //ContractInterface


export default function useApprove(tokenAddress: string, tokenAmount: any, contractAddress: string, ) {
    
    const [needApprove, setNeedApprove] = React.useState<Boolean>(true);
    const { provider } = useEthersState();
    const tokenDetails = useERC20Metadata(tokenAddress);

    const { allowanceData, isValidating } = useAllowance(tokenAddress, contractAddress);
    
    React.useEffect(() => {
        if(!isValidating){

            const allownaceAmount = Number(formatUnits(allowanceData, tokenDetails?.decimals));
            const getTokenAmount = Number(formatUnits(tokenAmount, tokenDetails?.decimals));
    
            if(allownaceAmount > 0){
                if(getTokenAmount > 0) {
                    if(allownaceAmount > getTokenAmount){
                        setNeedApprove(false);
                    }
                }
            }
        }
    }, [allowanceData, isValidating, tokenAmount, tokenDetails?.decimals]);

    async function contractApprove(){
        const { ABI } = ERC20(ChainId.RinkebyTestnet);
        // const iface:ContractInterface = new ethers.utils.Interface(ABI)
        try {
            const contract = new ethers.Contract(tokenAddress, ABI, provider.getSigner());
            const txResponse: TransactionResponse = await contract.approve(
                contractAddress,
                parseEther("1000000000000")
            );
            
            const txReceipt: TransactionReceipt = await txResponse.wait();
            console.log("Approve transaction = ", txReceipt);
            // console.log("txReceipt log = ", txReceipt.logs[0])
            // const event: LogDescription = iface.parseLog(txReceipt.logs[0])
            return txReceipt;
        } catch (error) {
            console.error("Approve Error = ", error);
            return null;
        }
    }
    
    return { allowanceData, isValidating, needApprove, approveContract: contractApprove };
}