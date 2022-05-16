import React from "react";
import { TransactionReceipt } from '@ethersproject/providers';
import { useEthersState } from "src/contexts/EthereumContext";
import type { Web3Provider } from "@ethersproject/providers";
import useBlockNumber from "./useBlockNumber";

async function getTransactionLogs(contractAddress: string, provider: Web3Provider) {
    
    const logs = await provider.getLogs({
        fromBlock: 0,
        toBlock: "latest",
        address: contractAddress,
        // topics: [null],
    });
    const newLogs = logs.map(async function(log) {
        const logData = await provider.getTransactionReceipt(log.transactionHash);
        logData['timestamp'] = (await provider.getBlock(logData.blockNumber)).timestamp;
        return logData;
    })
    const getAllTransactionLogs = await Promise.all(newLogs);

    return getAllTransactionLogs;
}

export default function useTransactions (address: string) {
    const { provider } = useEthersState();
    
    const [transactionLogs, setTransactionLogs] = React.useState<TransactionReceipt[]>([]);

    const { data } = useBlockNumber();

    React.useEffect(() => {
        const fetchTransactionLogs = async () => {
            try {
                const getAllTransactionLogs = await getTransactionLogs(address, provider);
                setTransactionLogs(getAllTransactionLogs)
            } catch (error) {
                console.error(error);
            }
        }

        fetchTransactionLogs();
    }, [address, data, provider])

    return transactionLogs;
}