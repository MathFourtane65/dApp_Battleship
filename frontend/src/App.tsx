import React, { useEffect, useState } from 'react'
import logo from './logo.svg'
import { Contract, ethers } from 'ethers'
import BattleshipContract from '../../backend/artifacts/contracts/Battleship.sol/Battleship.json'
import getContract from './utils/useGetContract'

import './App.css'

interface GridProps {
  onSelectCell: (row: number, col: number) => void // a function to handle cell selection
  shipsPlayerGrid: {
    length: number
    horizontal: boolean
    x: number
    y: number
  }[]
}
const Grid: React.FC<GridProps> = ({ onSelectCell, shipsPlayerGrid }) => {
  const [grid, setGrid] = useState<string[][]>(
    Array.from(Array(10), () => Array(10).fill(''))
  )

  const rows = Array.from(Array(10).keys()) // generate an array of 0 to 9
  const cols = Array.from(Array(10).keys()) // generate an array of 0 to 9

  const rowLabels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] // array of row labels
  const colLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'] // array of column labels

  // useEffect(() => {
  //   shipsPlayerGrid.forEach((ship) => {
  //     for (let i = 0; i < ship.length; i++) {
  //       const [row, col] = ship.horizontal
  //         ? [ship.x + i, ship.y]
  //         : [ship.x, ship.y + i]
  //       setGrid((prevGrid) => {
  //         const newGrid = [...prevGrid]
  //         newGrid[row][col] = 'ship'
  //         return newGrid
  //       })
  //     }
  //   })
  // }, [shipsPlayerGrid])
  return (
    <div className="grid">
      <div className="row">
        <div className="cell corner" />
        {colLabels.map((colLabel) => (
          <div key={colLabel} className="cell col-label">
            {colLabel}
          </div>
        ))}
      </div>
      {rows.map((row) => (
        <div key={row} className="row">
          <div className="cell row-label">{rowLabels[row]}</div>
          {cols.map((col) => (
            <div
              key={col}
              className={`cell ${grid[row][col] === '' ? 'water' : 'ship'}`}
              onClick={() => onSelectCell(row, col)}
            ></div>
          ))}
        </div>
      ))}
    </div>
  )
}

//================================================================

function App() {
  const [contract, setContract] = useState() as any
  const [name, setName] = useState('')

  const [address, setAddress] = useState('')

  const [connectedPlayers, setConnectedPlayers] = useState<string[]>([])

  const [gameJoined, setGameJoined] = useState(false)

  const [gameStarted, setGameStarted] = useState(false)

  const [shipsPlayer, setShipsPlayer] = useState([])

  const [shipLength, setShipLength] = useState(0)

  const [shipOrientation, setShipOrientation] = useState(false)

  const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

  // /*-----------SIDE EFFECTS---------------*/
  // useEffect(() => {
  //   // wild wild west version of setting contract
  //   setContract(getContract(contractAddress));
  // }, [])

  useEffect(() => {
    if (contract) {
      contract.on('PlayerJoinded', async function () {
        const players = await contract.getPlayers()
        setConnectedPlayers(players)
        console.log(players)

        if (players.length == 2) {
          setGameStarted(true)
        }

        // for (let i = 0; i < players.length; i++) {
        //   if (players[i].playerAddress == address) {
        //     console.log(players[i].playerAddress)
        //     setGameJoined(true)
        //   }
        //}
      })

      contract.on('ShipPlaced', async function () {
        const ships = await contract.getShips(address)
        setShipsPlayer(ships)
        console.log(ships)
      })
    }
  }, [contract])

  /*-----------FUNCTIONS---------------*/
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
    } catch (err: any) {
      console.error(err)
      alert(err.reason) //affiche le message d'erreur 'Game is full'
    }
  }

  const handlePlaceShip = async (
    length: number,
    x: number,
    y: number,
    horizontal: boolean
  ) => {
    try {
      await contract.addShip(length, x, y, horizontal)
      console.log('Ship placed')
    } catch (err: any) {
      console.error(err)
      alert(err.reason)
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
              {connectedPlayers.map((player: any) => (
                <li key={player}>
                  {player.name} : {player.playerAddress}
                </li>
              ))}
            </ul>
          </div>

          {gameStarted === true ? (
            <>
              {/* <Grid onSelectCell={(row, col) => console.log(row, col)} /> */}
              <Grid
                shipsPlayerGrid={shipsPlayer}
                onSelectCell={(row, col) =>
                  handlePlaceShip(shipLength, row, col, shipOrientation)
                }
              />
              <br />

              <label>Choisissez le bateau à placer et son orientation</label>
              <select
                name="ship"
                id="ship"
                value={shipLength}
                onChange={(event) => setShipLength(Number(event.target.value))}
              >
                <option value="0">Choisir un bateau(2 cases)</option>
                <option value="5">Porte-Avions (5 cases)</option>
                <option value="4">Croiseur (4 cases)</option>
                <option value="2">Torpilleur (3 cases)</option>
              </select>
              {/* <select
                name="orientation"
                id="orientation"
                value={shipOrientation}
                onChange={(event) =>
                  setShipOrientation((event.target.value))
                }
              >
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
              </select> */}
              <label>Horizontal ?</label>
              <input
                type="checkbox"
                name="orientation"
                checked={shipOrientation}
                onChange={(event) => setShipOrientation(event.target.checked)}
              />

              <br />
              <div>
                <h2>Mes bateaux:</h2>
                <ul>
                  {shipsPlayer.map((ship: any) => (
                    <li key={ship}>
                      {ship.length} cases : X={ship.x} Y={ship.y} Orientation=
                      {ship.horizontal ? 'Horizontal' : 'Vertical'}
                    </li>
                  ))}
                </ul>
              </div>
            </>
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
