// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Battleship {
    struct Ship {
        uint id;
        uint8[2] position;
        uint8 size;
        bool isVertical;
    }

    struct Player {
        address addr;
        Ship[5] ships;        
    }

    struct Game {
        Player player1;
        Player player2;
        uint8[10][10] board1;
        uint8[10][10] board2;
    }
    using Counters for Counters.Counter;
    Counters.Counter private shipsIds;

    mapping(address => Ship[]) public ships;

    event ShipAdded(address indexed player, uint shipId);

    function addShip(uint8[2] memory _position, uint8 _size, bool _isVertical) public {

        require(msg.sender != address(0)); // Check if sender is not null

        shipsIds.increment();
        uint shipId = shipsIds.current();
        Ship memory newShip = Ship(shipId, _position, _size, _isVertical);
        ships[msg.sender].push(newShip);
        emit ShipAdded(msg.sender, shipId);        
    }

    function getShips() public view returns (Ship[] memory) {
        // uint itemCount = shipsIds.current();
        // Ship[] memory items = new Ship[](itemCount);
        // for (uint i = 0; i < itemCount; i++) {
        //     uint currentId = i +1;
        //     Ship memory currentItem = ships[msg.sender][i];
        //     items[i] = currentItem;
        // }
        // return items;
        return ships[msg.sender];        
    }
}
