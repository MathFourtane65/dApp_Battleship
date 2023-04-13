import { Contract, ethers } from "ethers";
import ExampleContract  from '../../../backend/artifacts/contracts/ExampleContract.sol/ExampleContract.json';
import BattleshipContract from '../../../backend/artifacts/contracts/Battleship.sol/Battleship.json';

export default function getContract(contractAddress: string): any {
  const provider = new ethers.providers.Web3Provider( (window as any).ethereum);
  provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    contractAddress,
    BattleshipContract.abi,
    signer
  );
  return contract;
}