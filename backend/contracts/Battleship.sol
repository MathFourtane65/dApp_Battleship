// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Battleship {
    
    struct Player {
        string name;
        bool joined;
        uint8 shipsPlaced;
        address playerAddress;
    }

    struct Ship {
        uint8 x;
        uint8 y;
        uint8 length;
        bool horizontal;
    }

    mapping(address => Ship[]) public playerShipsMap;

    

    address[] public playerAddresses;
    mapping(address => Player) public players;

    event PlayerJoinded(address player, string name);

    function joinGame(string memory _name) public {
        require(playerAddresses.length < 2, "Game is full");
        require(!players[msg.sender].joined, "Player already joined the game");
        players[msg.sender] = Player(_name, true, 0, msg.sender);
        playerAddresses.push(msg.sender);
        emit PlayerJoinded(msg.sender, _name);
    }

    function startGame() public view {
        require(playerAddresses.length == 2, "Not enough players");
    }

    //function to add ships if game is started, this function take the ship length and the coordinates, and the orientation of the ship  as paameters and then add it to the playerShipsMap
    function addShip(uint8 _length, uint8 _x, uint8 _y, bool _horizontal) public {
        startGame();
        require(players[msg.sender].joined, "Player not joined the game");
        require(players[msg.sender].shipsPlaced < 5, "Player has already placed 5 ships");
        require(_x < 10, "Le bateau est placee en dehors de la grille horizontalement");
        require(_y < 10, "Le bateau est placee en dehors de la grille verticalement");
        require(_length > 0, "La longueur du bateau ne peut pas etre inferieure a 1");
        require(_length < 6, "La longueur du bateau ne peut pas etre superieure a 5");
        require(_horizontal == true || _horizontal == false, "L orientation horizontale doit etre vraie ou fausse");
        if (_horizontal == true) {
            require(_x + _length < 10, "Le bateau depasse de la grille horizontalement");
        } else {
            require(_y + _length < 10, "Le bateau depasse de la grille verticalement");
        }
        Ship memory newShip = Ship(_x, _y, _length, _horizontal);
        playerShipsMap[msg.sender].push(newShip);
        players[msg.sender].shipsPlaced++;
    }

    //function to get the ships of a player
    function getShips(address _player) public view returns (Ship[] memory) {
        return playerShipsMap[_player];
    }

    //function to get the players of the game
  //  function getPlayers() public view returns (address[] memory) {
  //      return playerAddresses;
  //  }

  function getPlayers() public view returns (Player[] memory) {
    Player[] memory result = new Player[](playerAddresses.length);
    for (uint i = 0; i < playerAddresses.length; i++) {
        result[i] = players[playerAddresses[i]];
    }
    return result;
}




}
