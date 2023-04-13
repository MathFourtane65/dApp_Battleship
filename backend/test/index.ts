import { expect } from "chai";
import { ethers } from "hardhat";

describe("Battleship", function () {
  let battleship: any;

  beforeEach(async function () {
    const Battleship = await ethers.getContractFactory("Battleship");
    battleship = await Battleship.deploy();
    await battleship.deployed();
  });

  it("should add a ship and retrieve all ships", async function () {
    const position = [0, 0];
    const size = 5;
    const isVertical = false;
    await battleship.addShip(position, size, isVertical);

    const ships = await battleship.getShips();
    expect(ships.length).to.equal(1);
    expect(ships[0].position).to.deep.equal(position);
    expect(ships[0].size).to.equal(size);
    expect(ships[0].isVertical).to.equal(isVertical);

    console.log("postion :" + ships[0].position);
    console.log("size :" + ships[0].size);
    console.log("isVertical :" + ships[0].isVertical);
  });
});
