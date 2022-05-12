import { useEthersState } from 'src/contexts/EthereumContext';
import { ethers} from "ethers";
declare let window:any

let { ethereum } = window;
const provider = new ethers.providers.Web3Provider(ethereum);

async function getTransactionLogs() {
    return async () => {
        const { viewContractAddress } = useEthersState();
        const logs = await provider.getLogs({
            fromBlock: 0,
            toBlock: "latest",
            address: viewContractAddress,
            // topics: [null],
        });
        const newLogs = logs.map(async function(log) {
            const logData = await provider.getTransactionReceipt(log.transactionHash);
            logData['timestamp'] = (await provider.getBlock(logData.blockNumber)).timestamp;
            return logData;
        })
        const getAllTransactionLogs = await Promise.all(newLogs);
  
        return getAllTransactionLogs;
    };
}

export default async function useTransactions() {
    try {
        const getAllLogs = await getTransactionLogs();
        return getAllLogs;
    } catch (error) {
        console.error(error);
        return null
    }
}