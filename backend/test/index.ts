import { expect } from "chai";
import { ethers } from "hardhat";

describe("Battleship", function () {
  let battleship: any;
  let player1: any;
  let player2: any;

  beforeEach(async function () {
    const Battleship = await ethers.getContractFactory("Battleship");
    battleship = await Battleship.deploy();
    await battleship.deployed();

    [player1, player2] = await ethers.getSigners();
  });

  it("Doit être déployé", async function () {
    expect(await battleship.deployed()).to.equal(battleship);
  });

  describe("joinGame", function () {
    it("Doit permettre à un joueur de rejoindre la partie", async function () {
      await battleship.joinGame("Alice");
      const alice = await battleship.players(player1.address);

      expect(alice.name).to.equal("Alice");
      expect(alice.joined).to.equal(true);
    });

    it("Doit permettre à deux joueurs de rejoindre la partie", async function () {
      await battleship.joinGame("Alice");
      await battleship.connect(player2).joinGame("Bob");

      const alice = await battleship.players(player1.address);
      const bob = await battleship.players(player2.address);

      expect(alice.name).to.equal("Alice");
      expect(alice.joined).to.equal(true);
      expect(bob.name).to.equal("Bob");
      expect(bob.joined).to.equal(true);
    });

    it("Doit empêcher un joueur de rejoindre deux fois la partie", async function () {
      const playerName = "Alice";
      await battleship.joinGame(playerName);

      // Try to join the game again
      await expect(battleship.joinGame(playerName)).to.be.revertedWith(
        "Player already joined the game"
      );
    });

    it("Doit empêcher un joueur de rejoindre la partie s'il y a déjà deux joueurs", async function () {
      await battleship.joinGame("Alice");
      await battleship.connect(player2).joinGame("Bob");

      // Try to join the game again
      await expect(battleship.joinGame("Charlie")).to.be.revertedWith(
        "Game is full"
      );
    });
  });

  describe("startGame", function () {

    it("Doit empecher de démarrer la partie si il y a 0 joueurs", async function () {
      await expect(battleship.startGame()).to.be.revertedWith(
        "Not enough players"
      );
    });

    it("Doit empecher de démarrer la partie si il y a 1 joueur", async function () {
      await battleship.joinGame("Alice");

      await expect(battleship.startGame()).to.be.revertedWith(
        "Not enough players"
      );
    });

    it("Doit permettre de démarrer la partie si il y a 2 joueurs", async function () {
      await battleship.joinGame("Alice");
      await battleship.connect(player2).joinGame("Bob");

      await battleship.startGame();
    });

  });

  describe("addShip", function () {

    it("Doit permettre aux 2 joueurs de placer un bateau chacun", async function () {
      await battleship.joinGame("Alice");
      await battleship.connect(player2).joinGame("Bob");

      await battleship.startGame();

      await battleship.addShip(5, 0, 0, true);
      await battleship.connect(player2).addShip(2, 4, 6, false);

      const ships = await battleship.getShips(player1.address);
      const ships2 = await battleship.getShips(player2.address);

      //console.log(ships[0]);   
      expect(ships[0]._length).to.equal(5);
      expect(ships[0].x).to.equal(0);
      expect(ships[0].y).to.equal(0);
      expect(ships[0].horizontal).to.equal(true);

      //console.log(ships2[0])
      expect(ships2[0]._length).to.equal(2);
      expect(ships2[0].x).to.equal(4);
      expect(ships2[0].y).to.equal(6);
      expect(ships2[0].horizontal).to.equal(false);
    });

    it("Doit permettre aux 2 joueurs de placer 5 bateaux chacun", async function () {
      // Ajouter les deux joueurs
      await battleship.joinGame("Alice");
      await battleship.connect(player2).joinGame("Bob");
    
      // Commencer la partie
      await battleship.startGame();
    
      // Ajouter les bateaux pour les joueurs l'un après l'autre
      await battleship.addShip(2, 0, 0, true);
      await battleship.connect(player2).addShip(2, 5, 0, false);

      await battleship.addShip(3, 1, 1, true);
      await battleship.connect(player2).addShip(3, 6, 1, false);

      await battleship.addShip(3, 2, 2, true);
      await battleship.connect(player2).addShip(3, 7, 2, false);

      await battleship.addShip(4, 3, 3, true);
      await battleship.connect(player2).addShip(4, 8, 3, false);

      await battleship.addShip(5, 4, 4, true);
      await battleship.connect(player2).addShip(5, 9, 4, false);

    
      // Vérifier que les bateaux ont été ajoutés correctement pour le joueur 1
      const ships1 = await battleship.getShips(player1.address);
      //console.log(ships1);
      expect(ships1[0]._length).to.equal(2);
      expect(ships1[1]._length).to.equal(3);
      expect(ships1[2]._length).to.equal(3);
      expect(ships1[3]._length).to.equal(4);
      expect(ships1[4]._length).to.equal(5);
    
      // Vérifier que les bateaux ont été ajoutés correctement pour le joueur 2
      const ships2 = await battleship.getShips(player2.address);
      //console.log(ships2);
      
      expect(ships2[0]._length).to.equal(2);
      expect(ships2[1]._length).to.equal(3);
      expect(ships2[2]._length).to.equal(3);
      expect(ships2[3]._length).to.equal(4);
      expect(ships2[4]._length).to.equal(5);
    });

    it("Doit empecher un joueur de placer un bateau s'il a déjà 5 bateaux", async function () {
      // Ajouter les deux joueurs
      await battleship.joinGame("Alice");
      await battleship.connect(player2).joinGame("Bob");
    
      // Commencer la partie
      await battleship.startGame();
    
      // Ajouter les bateaux pour les joueurs l'un après l'autre
      await battleship.addShip(2, 0, 0, true);
      await battleship.connect(player2).addShip(2, 5, 0, false);

      await battleship.addShip(3, 1, 1, true);
      await battleship.connect(player2).addShip(3, 6, 1, false);

      await battleship.addShip(3, 2, 2, true);
      await battleship.connect(player2).addShip(3, 7, 2, false);

      await battleship.addShip(4, 3, 3, true);
      await battleship.connect(player2).addShip(4, 8, 3, false);

      await battleship.addShip(5, 4, 4, true);
      await battleship.connect(player2).addShip(5, 9, 4, false);
        
      // Ajouter un bateau pour le joueur 1
      await expect(battleship.addShip(5, 4, 4, true)).to.be.revertedWith(
        "Player has already placed 5 ships"
      );
    });

    it("Doit empecher un joueur de placer un bateau deux fois sur des cellules qui se chevauchent", async function () {
      // Ajouter les deux joueurs
      await battleship.joinGame("Alice");
      await battleship.connect(player2).joinGame("Bob");
    
      // Commencer la partie
      await battleship.startGame();
    
      // Ajouter les bateaux pour les joueurs l'un après l'autre
      await battleship.addShip(2, 0, 0, true);
      await battleship.connect(player2).addShip(2, 5, 0, false);

      await battleship.addShip(3, 1, 1, true);
      await battleship.connect(player2).addShip(3, 6, 1, false);

      await battleship.addShip(3, 2, 2, true);
      await battleship.connect(player2).addShip(3, 7, 2, false);

      await battleship.addShip(4, 3, 3, true);
      await battleship.connect(player2).addShip(4, 8, 3, false);

        
      // Ajouter un bateau sur des cellules deja utilisees pour le joueur 1
      await expect(battleship.addShip(5, 3, 3, true)).to.be.revertedWith(
        "Player has already placed a ship on this cell"
      );
    });

    it("Doit empecher un joueur de placer un bateau en dehors de la grille", async function () {
      // Ajouter les deux joueurs
      await battleship.joinGame("Alice");
      await battleship.connect(player2).joinGame("Bob");
    
      // Commencer la partie
      await battleship.startGame();
    
      // Ajouter les bateaux pour les joueurs l'un après l'autre
      await battleship.addShip(2, 0, 0, true);
      await battleship.connect(player2).addShip(2, 5, 0, false);

      await battleship.addShip(3, 1, 1, true);
      await battleship.connect(player2).addShip(3, 6, 1, false);

      await battleship.addShip(3, 2, 2, true);
      await battleship.connect(player2).addShip(3, 7, 2, false);

      await battleship.addShip(4, 3, 3, true);
      await battleship.connect(player2).addShip(4, 8, 3, false);
        
      // Ajouter un bateau en dehors de la grille pour le joueur 1
      await expect(battleship.addShip(5, 5, 5, true)).to.be.revertedWith(
        "Le bateau ou une partie est placee en dehors de la grille"
      );
    });
    
  });

  describe("attack", function () {

    it("Doit permettre a un joueur d'attaquer une cellule et voir qu'il a rate ('miss')", async function () {
      // Ajouter les deux joueurs
      await battleship.joinGame("Alice");
      await battleship.connect(player2).joinGame("Bob");
    
      // Commencer la partie
      await battleship.startGame();
    
      // Ajouter les bateaux pour les joueurs l'un après l'autre
      await battleship.addShip(2, 0, 0, true);
      await battleship.connect(player2).addShip(2, 5, 0, false);

      await battleship.addShip(3, 1, 1, true);
      await battleship.connect(player2).addShip(3, 6, 1, false);

      await battleship.addShip(3, 2, 2, true);
      await battleship.connect(player2).addShip(3, 7, 2, false);

      await battleship.addShip(4, 3, 3, true);
      await battleship.connect(player2).addShip(4, 8, 3, false);

      await battleship.addShip(5, 4, 4, true);
      await battleship.connect(player2).addShip(5, 9, 4, false);

      await battleship.attack(4, 2); //miss

      const missilesJoueur1 = await battleship.getMissiles(player1.address);

      // await battleship.connect(player2).attack(2, 3); //miss
      // await battleship.attack(6, 3); //hit
      // await battleship.connect(player2).attack(1, 1); //hit


      expect(missilesJoueur1[0].x).to.equal(4);
      expect(missilesJoueur1[0].y).to.equal(2);
      expect(missilesJoueur1[0].result).to.equal("miss");


      //Attquer une cellule vide pour le joueur 2
      // await battleship.connect(player2).attack(2, 3);

      // expect(missilesJoueur2[0].x).to.equal(2);
      // expect(missilesJoueur2[0].y).to.equal(3);
      // expect(missilesJoueur2[0].result).to.equal("miss");




      // const missilesJoueur2 = await battleship.getMissiles(player2.address);


    });

    it("Doit permettre a un joueur d'attaquer une cellule et voir qu'il a touche ('hit')", async function () {
      // Ajouter les deux joueurs
      await battleship.joinGame("Alice");
      await battleship.connect(player2).joinGame("Bob");

      // Commencer la partie
      await battleship.startGame();

      // Ajouter les bateaux pour les joueurs l'un après l'autre
      await battleship.addShip(2, 0, 0, true);
      await battleship.connect(player2).addShip(2, 5, 0, false);

      await battleship.addShip(3, 1, 1, true);
      await battleship.connect(player2).addShip(3, 6, 1, false);

      await battleship.addShip(3, 2, 2, true);
      await battleship.connect(player2).addShip(3, 7, 2, false);

      await battleship.addShip(4, 3, 3, true);
      await battleship.connect(player2).addShip(4, 8, 3, false);

      await battleship.addShip(5, 4, 4, true);
      await battleship.connect(player2).addShip(5, 9, 4, false);
      await battleship.attack(6, 3); //hit

      const missilesJoueur1 = await battleship.getMissiles(player1.address);

      expect(missilesJoueur1[0].x).to.equal(6);
      expect(missilesJoueur1[0].y).to.equal(3);
      expect(missilesJoueur1[0].result).to.equal("hit");

    });
          


    it("Doit empecher un joueur d'attaquer une cellule deja attaquee", async function () {
      // Ajouter les deux joueurs
      await battleship.joinGame("Alice");
      await battleship.connect(player2).joinGame("Bob");
    
      // Commencer la partie
      await battleship.startGame();
    
      // Ajouter les bateaux pour les joueurs l'un après l'autre
      await battleship.addShip(2, 0, 0, true);
      await battleship.connect(player2).addShip(2, 5, 0, false);

      await battleship.addShip(3, 1, 1, true);
      await battleship.connect(player2).addShip(3, 6, 1, false);

      await battleship.addShip(3, 2, 2, true);
      await battleship.connect(player2).addShip(3, 7, 2, false);

      await battleship.addShip(4, 3, 3, true);
      await battleship.connect(player2).addShip(4, 8, 3, false);

      await battleship.addShip(5, 4, 4, true);
      await battleship.connect(player2).addShip(5, 9, 4, false);

      await battleship.attack(4, 2); //miss

      const missilesJoueur1 = await battleship.getMissiles(player1.address);

      await expect(battleship.attack(4, 2)).to.be.revertedWith(
        "Player has already shot this cell"
      );

    });
  });

  describe("Player Turn", function () {

    it("Doit empecher un joueur de placer un bateau si ce n'est pas son tour", async function () {
          // Ajouter les deux joueurs
          await battleship.joinGame("Alice");
          await battleship.connect(player2).joinGame("Bob");
        
          // Commencer la partie
          await battleship.startGame();

          await battleship.addShip(2, 0, 0, true);
          
          // Le joueur 1 ne peut pas placer un bateau car ce n'est pas son tour
          await expect(battleship.addShip(3, 1, 1, true)).to.be.revertedWith(
            "Ce n'est pas votre tour"
          );
    });

    it("Doit empecher un joueur d'attaquer si ce n'est pas son tour", async function () {
          // Ajouter les deux joueurs
          await battleship.joinGame("Alice");
          await battleship.connect(player2).joinGame("Bob");
        
          // Commencer la partie
          await battleship.startGame();

          await battleship.addShip(2, 0, 0, true);
          await battleship.connect(player2).addShip(2, 5, 0, false);

          await battleship.addShip(3, 1, 1, true);
          await battleship.connect(player2).addShip(3, 6, 1, false);

          await battleship.addShip(3, 2, 2, true);
          await battleship.connect(player2).addShip(3, 7, 2, false);

          await battleship.addShip(4, 3, 3, true);
          await battleship.connect(player2).addShip(4, 8, 3, false);

          await battleship.addShip(5, 4, 4, true);
          await battleship.connect(player2).addShip(5, 9, 4, false);


          // Le joueur 2 ne peut pas attaquer car ce n'est pas son tour
          await expect(battleship.connect(player2).attack(6, 4)).to.be.revertedWith(
            "Ce n'est pas votre tour"
          );
    });

  });
    

      

      
});
