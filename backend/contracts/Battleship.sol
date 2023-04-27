// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Battleship {
    
    //STRUCTURES DES DONNEES DU JEU ==> Player, Ship, Missile
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

    struct Missile {
        uint8 x;
        uint8 y;
        string result;
    }

    mapping(address => Ship[]) public playerShipsMap; //tableau de bateaux pour chaque joueur

    mapping(address => Missile[]) public playerMissilesMap; //tableau de missiles pour chaque joueur

    

    address[] public playerAddresses; //tableau des adresses des joueurs
    mapping(address => Player) public players; //tableau des joueurs

    address public currentPlayer; //joueur courant

    event PlayerJoinded(address player, string name); //evenement de connexion d'un joueur à la partie
    event PlayerTurn(address player); //evenement de changement de joueur courant

    // constructor() {
    //     currentPlayer = msg.sender;
    // }

    modifier onlyCurrentPlayer() {
        require(msg.sender == currentPlayer, "Ce n'est pas votre tour");
        _;
    }

    function joinGame(string memory _name) public {
        if(playerAddresses.length == 0) {
            currentPlayer = msg.sender;
        }
        require(playerAddresses.length < 2, "Game is full");
        require(!players[msg.sender].joined, "Player already joined the game");
        players[msg.sender] = Player(_name, true, 0, msg.sender);
        playerAddresses.push(msg.sender);
        emit PlayerJoinded(msg.sender, _name);
    }

    function startGame() public view {
        require(playerAddresses.length == 2, "Not enough players");
    }

    function addShip(uint8 _length, uint8 _x, uint8 _y, bool _horizontal) public onlyCurrentPlayer{
        startGame();
        require(players[msg.sender].joined, "Player not joined the game");
        require(players[msg.sender].shipsPlaced < 5, "Player has already placed 5 ships");
        require(!isShipOnCellForCurrentPlayer(_x, _y), "Player has already placed a ship on this cell");
        require(_x < 10, "Le bateau ou une partie est placee en dehors de la grille");
        require(_y < 10, "Le bateau ou une partie est placee en dehors de la grille");
        require(_length > 0, "La longueur du bateau ne peut pas etre inferieure a 1");
        require(_length < 6, "La longueur du bateau ne peut pas etre superieure a 5");
        require(_horizontal == true || _horizontal == false, "L orientation horizontale doit etre vraie ou fausse");

        if (_horizontal == true) {
            require(_x + _length < 10, "Le bateau ou une partie est placee en dehors de la grille");
        } else {
            require(_y + _length < 10, "Le bateau ou une partie est placee en dehors de la grille");
        }
        Ship memory newShip = Ship(_x, _y, _length, _horizontal);
        playerShipsMap[msg.sender].push(newShip);
        players[msg.sender].shipsPlaced++;

        address otherPlayer = getOtherPlayer();
        currentPlayer = otherPlayer;
        emit PlayerTurn(currentPlayer);

    }



    // FONCTIONS "UTILITAIRES GENERALES" ==> getShips, getPLayers, getOtherPLayer, 
    function getShips(address _player) public view returns (Ship[] memory) {
        return playerShipsMap[_player];
    }

    function getMissiles(address _player) public view returns (Missile[] memory) {
        return playerMissilesMap[_player];
    }

    function getPlayers() public view returns (Player[] memory) {
        Player[] memory result = new Player[](playerAddresses.length);
        for (uint i = 0; i < playerAddresses.length; i++) {
            result[i] = players[playerAddresses[i]];
        }
        return result;
    } 

    function getOtherPlayer() private view returns (address) {
        for (uint i =0; i< playerAddresses.length; i++) {
            if (playerAddresses[i] != msg.sender) {
                return playerAddresses[i];
            }
        }
        revert("Could not find the other player !!!");
    }



    // FONCTIONS "UTILITAIRES DE TIR" ==> isShipOnCellForCurrentPlayer, isShipOnCellForOtherPlayer, isMissileOnCellForCurrentPlayer

    function isShipOnCellForCurrentPlayer(uint8 _x, uint8 _y) public view returns (bool) { // TRUE si un bateau est sur la cellule du joueur courant
        Ship[] memory ships = playerShipsMap[msg.sender];
        for (uint i = 0; i < ships.length; i++) {
            Ship memory ship = ships[i];
            if (ship.horizontal) {
                if (ship.x <= _x && _x < ship.x + ship.length && ship.y == _y) {
                    return true;
                }
            } else {
                if (ship.y <= _y && _y < ship.y + ship.length && ship.x == _x) {
                    return true;
                }
            }
        }
        return false;
    }

    function isShipOnCellForOtherPlayer(uint8 _x, uint8 _y) public view returns (bool) { // TRUE si un bateau est sur la cellule de l'autre joueur (adversaire)
    address otherPlayer = getOtherPlayer();
    Ship[] memory ships = playerShipsMap[otherPlayer];
    for (uint i = 0; i < ships.length; i++) {
        Ship memory ship = ships[i];
        if (ship.horizontal) {
            if (ship.x <= _x && _x < ship.x + ship.length && ship.y == _y) {
                return true;
            }
        } else {
            if (ship.y <= _y && _y < ship.y + ship.length && ship.x == _x) {
                return true;
            }
        }
    }
    return false;
}

    function isMissileOnCellForCurrentPlayer(uint8 _x, uint8 _y) public view returns (bool) { // TRUE si un missile est sur la cellule du joueur courant (si il a deja tire sur cette cellule)
    Missile[] memory missiles = playerMissilesMap[msg.sender];
    for (uint i = 0; i < missiles.length; i++) {
        Missile memory missile = missiles[i];
        if (missile.x == _x && missile.y == _y) {
            return true;
        }
    }
    return false;
    }


function attack(uint8 _x, uint8 _y) public onlyCurrentPlayer{
    startGame();
    require(players[msg.sender].joined, "Player not joined the game");
    require(!isMissileOnCellForCurrentPlayer(_x, _y), "Player has already shot this cell");
    playerMissilesMap[msg.sender].push(Missile(_x, _y, ""));
    bool hit = isShipOnCellForOtherPlayer(_x, _y);
    if (hit) {
        //console.log("Player %s shoot on cell [%d,%d] and HIT!", players[msg.sender].name, _x, _y);
        playerMissilesMap[msg.sender][playerMissilesMap[msg.sender].length-1].result = "hit";
    } else {
        //console.log("Player %s shoot on cell [%d,%d] and MISS!", players[msg.sender].name, _x, _y);
        playerMissilesMap[msg.sender][playerMissilesMap[msg.sender].length-1].result = "miss";
    }
}   


}
