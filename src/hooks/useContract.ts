import { useMemo } from "react";
import { ethers } from "ethers";
import { ChainId } from 'opthy-v1-core';
import { useEthersState } from "src/contexts/EthereumContext";
import { Contract } from "@ethersproject/contracts";

export default function useContract<T extends Contract = Contract>(
  address: string,
  ABI: any
): T | null {
  const { provider } = useEthersState();

  return useMemo(() => {
    if (!address || !ABI || !provider || !ChainId) {
      return null;
    }

    try {
      return new ethers.Contract(address, ABI, provider.getSigner());

    } catch (error) {
      console.error("Failed To Get Contract", error);

      return null;
    }
  }, [address, ABI, provider]) as T;
}