import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
// if you have successfuly compiled the smart contract in the backend folder, typechain should have created an interface that we can use here 
// import {ExampleContract} from '../../backend/typechain/ExampleContract';
import getContract from "./utils/useGetContract";

function App() {
  const [contract, setContract] = useState();
  const [ships, setShips] = useState([]);

  const [shipFormData, setShipFormData] = useState({
    positionX: 0,
    positionY: 0,
    //isVertical: false,
    size: 0,
  })

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  /*-----------SIDE EFFECTS---------------*/
  useEffect(() => {
    // wild wild west version of setting contract
    setContract(getContract(contractAddress))

  }, [])

  useEffect(() => {
    if (contract) {
      getAllShips()
      contract.on("ShipAdded", async function () {
        getAllShips();
      });
    };
  }, [contract]);

  useEffect(() => {
    if (ships.length > 0) {
      generateGrid(ships);
    }
  }, [ships]);



  async function getAllShips() {
    const shipsA = await contract.getShips();
    const tempArray: any = [];
    shipsA.forEach(ship => {
      tempArray.push({
        position: ship.position,
        size: ship.size,
        isVertical: ship.isVertical,
        id: ship.id,
      })

    });
    setShips(tempArray);
    console.log(shipsA);
  }

  async function addShip() {
    const posX = shipFormData.positionX;
    const posY = shipFormData.positionY;
    const size = shipFormData.size;
    const isVertical = true;

    const finalPosition = [posX, posY];

    await contract.addShip(finalPosition, size, isVertical);
  }

  const handleChange = (event: any) => {
    setShipFormData((prevState) => {
      return {
        ...prevState,
        [event.target.name]: event.target.value,
      };
    })
  }


  // async function generateGrid(tableauxShips: any[]) {
  //   const grid = document.querySelector(".grid-container");
  //   const gridItems = document.querySelectorAll(".grid-item");
  //   const ships = tableauxShips;

  //   ships.forEach(ship => {
  //     const position = ship.position;
  //     const size = ship.size;
  //     const isVertical = ship.isVertical;
  //     const id = ship.id;

  //     if (isVertical) {
  //       for (let i = 0; i < size; i++) {
  //         gridItems[position[0] + i + position[1] * 10].classList.add("ship");
  //       }
  //     } else {
  //       for (let i = 0; i < size; i++) {
  //         gridItems[position[0] + position[1] * 10 + i * 10].classList.add("ship");
  //       }
  //     }
  //   })
  // }

  function generateGrid() {
    const grid = document.querySelector(".grid-container");
    const gridItems = document.querySelectorAll(".grid-item");

    ships.forEach(ship => {
      const position = ship.position;
      const size = ship.size;
      const isVertical = ship.isVertical;
      const id = ship.id;

      if (isVertical) {
        for (let i = 0; i < size; i++) {
          gridItems[position[0] + i + position[1] * 10].classList.add("ship");
        }
      } else {
        for (let i = 0; i < size; i++) {
          gridItems[position[0] + position[1] * 10 + i * 10].classList.add("ship");
        }
      }
    })
  }



  return (
    <>
      <label>Position X : </label>
      <input type="number" name="positionX" min={0} max={9} value={shipFormData.positionX} onChange={handleChange} />
      <label>Position Y : </label>
      <input type="number" name="positionY" min={0} max={9} value={shipFormData.positionY} onChange={handleChange} />

      <select name="size" value={shipFormData.size} onChange={handleChange}>|
        <option value="0">Select size</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
      <button onClick={() => addShip()}>Add ship</button>

      <br />
      <br />
      <div className="grid-container">
        {Array.from({ length: 100 }).map((_, index) => (
          <div key={index} className="grid-item" onClick={() => console.log(index)}></div>
        ))}
      </div>    </>
  );
}

export default App;