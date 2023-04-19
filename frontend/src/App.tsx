import React, { useEffect, useState } from 'react'
import logo from './logo.svg'
import { Contract, ethers } from 'ethers'
import BattleshipContract from '../../backend/artifacts/contracts/Battleship.sol/Battleship.json'
import getContract from './utils/useGetContract'

function App() {
  const [contract, setContract] = useState() as any
  const [name, setName] = useState('')

  const [address, setAddress] = useState('')

  const [connectedPlayers, setConnectedPlayers] = useState<string[]>([])

  const [gameJoined, setGameJoined] = useState(false)

  const [gameStarted, setGameStarted] = useState(false)

  const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

  // /*-----------SIDE EFFECTS---------------*/
  // useEffect(() => {
  //   // wild wild west version of setting contract
  //   setContract(getContract(contractAddress));
  // }, [])

  useEffect(()  => {
    if (contract) {
      contract.on('PlayerJoinded', async function () {
        const players = await contract.getPlayers();
        setConnectedPlayers(players);
        console.log(players)

        if(players.length == 2){
          setGameStarted(true)
        }
        

        // for (let i = 0; i < players.length; i++) {
        //   if (players[i].playerAddress == address) {
        //     console.log(players[i].playerAddress)
        //     setGameJoined(true)
        //   }
        //}
      })
    }
  }, [contract]) /*-----------FUNCTIONS---------------*/
  const handleConnect = async () => {
    const provider = new ethers.providers.Web3Provider((window as any).ethereum)
    await provider.send('eth_requestAccounts', [])
    const signer = provider.getSigner()
    const contract = new ethers.Contract(
      contractAddress,
      BattleshipContract.abi,
      signer
    )
    setContract(contract)
    setAddress(await signer.getAddress())
  }

  const handleJoinGame = async () => {
    try {
      await contract.joinGame(name)
      console.log('Player joined the game')
      setGameJoined(true)
    } catch (err) {
      console.error(err)
      alert(err.reason) //affiche le message d'erreur 'Game is full'
    }
  }

  return (
    <>
      {address ? (
        <>
          <div>Connected Address: {address}</div>

          {gameJoined === true ? (
            <div>Game Joined</div>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter your name"
                name="name"
                id="name"
                onChange={(e) => setName(e.target.value)}
              />
              <button onClick={handleJoinGame}>Join Game</button>
            </>
          )}

          <div>
            <h2>Connected Players:</h2>
            <ul>
              {connectedPlayers.map((player) => (
                <li key={player}>{player.name} : {player.playerAddress}</li>
              ))}
            </ul>
          </div>


          {gameStarted === true ? (
            <div>Partie démarrée</div>
          ) : (
            <div>En attente de joueurs ....</div>
          )}
        </>
      ) : (
        <button onClick={handleConnect}>Connect to Metamask</button>
      )}
    </>
  )
}

export default App
