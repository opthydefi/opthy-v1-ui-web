import { useEffect } from 'react';
import { ethers} from "ethers";
import { useState } from 'react';
import { TransactionReceipt } from '@ethersproject/providers';
declare let window:any

let { ethereum } = window;
const provider = new ethers.providers.Web3Provider(ethereum);

async function getTransactionLogs(contractAddress: string) {
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
  const [transactionLogs, setTransactionLogs] = useState<TransactionReceipt[]>([]);

  useEffect(() => {
    const fetchTransactionLogs = async () => {
        try {
            const getAllTransactionLogs = await getTransactionLogs(address);
            setTransactionLogs(getAllTransactionLogs)
        } catch (error) {
            console.error(error);
        }
    }

    fetchTransactionLogs();
  }, [address])

  return transactionLogs;
}