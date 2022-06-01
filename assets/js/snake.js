
class Model {
  constructor() {
    this.SIZE = 500;
    this.GRID_SIZE = this.SIZE / 50;
    this.newDirection = -1;
    this.direction = -1; // -2: haut, 2: bas, -1: gauche, 1: droite / Ici le serpent démarre vers la gauche
    this.snakeLength = 5;
    this.snake = [{x: this.SIZE / 2, y: this.SIZE / 2}]; // le serpent apparaît au centre
    this.food = null;
    this.end = false;
    this.recordBattu = false;
    this.score = 0;
    this.snakeColor = "";
    this.arrayColors = ["#62FF00","#00FFF9","#E900FF","#FFFE00","#FF0000","#0021FF"];
    this.aleat = false;
    this.highScore = localStorage.getItem("highScore");
    this.snakeObj = {};
    this.newHead = {x: this.snake[0].x, y: this.snake[0].y};
  }

  randomLocation() {
    do {
      var newValue = Math.floor(Math.random() * this.SIZE / this.GRID_SIZE) * this.GRID_SIZE;
      var badValue = false;
      for(var i=0;i<this.snake.length;i++) {
        if(this.snake[i].x == newValue || this.snake[i].y == newValue) { // si la valeur de coordonnées pour la pomme correspond à une coordonnée du serpent
          badValue = true;
          break;
        }
      }
    }while(badValue==true); // on cherche une nouvelle coordonnée pour la pomme tant que badValue est à "true"
    return newValue;
  }

  stringifyCoord(obj) {
    return [obj.x, obj.y].join(',');
  }

  changeDirectionValue() {
    // on change de direction si la nouvelle direction est sur un axe différent
    if (Math.abs(this.direction) !== Math.abs(this.newDirection)) {
      this.direction = this.newDirection;
    } else {
      this.direction;
    }
  }

  deplacement() {
    var axis = Math.abs(this.direction) === 1 ? 'x' : 'y'; // pour X on peut avoir les valeurs 1 ou -1; 2 ou -2 pour Y
    if (this.direction < 0) {
      this.newHead[axis] -= this.GRID_SIZE; // bouger à gauche ou en bas
    } else {
      this.newHead[axis] += this.GRID_SIZE; // bouger à droite ou en haut
    }
  }

  isFoodEaten() {
    // check si le serpent a mangé un fruit
    if (this.food && this.food.x === this.newHead.x && this.food.y === this.newHead.y) {
      this.food = null;
      this.snakeLength += 2;
      this.score +=1;
      if(this.score > this.highScore) {
        this.recordBattu = true;
        this.highScore = this.score;
        localStorage.setItem("highScore", this.highScore);
      }
      return true;
    }
    else {
      return false;
    }
  }
  // détecte les collisions contre le mur et déclenche l'échec de la partie
  finPartie() {
    if (this.newHead.x < 0 || this.newHead.x >= this.SIZE || this.newHead.y < 0 || this.newHead.y >= this.SIZE || this.snakeObj[this.stringifyCoord(this.newHead)]) {
      this.end = true;
    }
  }

  // crée de nouvelles coordonnées pour un nouveau fruit
  newFood() {
    return this.food = {x: this.randomLocation(), y: this.randomLocation()};
  }

  bindNewHead(callback){
    this.propNewHead = callback;
  }

  execNewHead(){
    this.propNewHead();
  }

  bindNewDirection(callback){
    this.propNewDirection = callback;
  }

  execNewDirection(e) {
    this.propNewDirection(e);
  }
}

class View {
  constructor() {
    this.c = document.getElementById('canvas');
    this.scoreDisplay = document.getElementById('score');
    this.highScoreDisplay = document.getElementById('highScore');
    this.button = document.getElementsByClassName("color");
    this.random = document.getElementById("partyTime");
    this.music = document.getElementById("music");
    this.c.height = this.c.width = 0;
    this.c.style.width = this.c.style.height = 0;
    this.context = this.c.getContext('2d');
    this.context.scale(2, 2);
    this.button[2].style.outline = "2px solid black";
  }

  bindPauseGame(callback){
    this.propPauseGame = callback;
  }

  execPauseGame(interval){
    this.propPauseGame(interval);
  }

  bindPlayGame(callback){
    this.propPlayGame = callback;
  }

  execPlayGame(interval, jeu){
    let int = this.propPlayGame(interval, jeu);
    return int;
  }

  // permet d'afficher le score à l'écran
  displayScore(model) {
    this.scoreDisplay.innerHTML = model.score;
  }

  displayHighScore(model) {
    this.highScoreDisplay.innerHTML = model.highScore;
  }

  finDuGame(model){
    this.random.src="assets/img/img_snake/block.png";
    this.random.style="pointer-events: none"; // désactive la possibilité de cliquer sur le mode fête à la fin du jeu
    for(let i=0;i<this.button.length;i++) {
      this.button[i].style="pointer-events: none"; // désactive les boutons de changement de couleur du snake
      this.button[i].src="assets/img/img_snake/grey.png";
    }
    this.music.src="";
    this.context.fillStyle = '#eee8d5';
    this.context.font = '25px Arvo';
    this.context.textAlign = 'center';
    this.context.fillText('Appuyer sur le bouton \'PLAY\'', model.SIZE / 2, model.SIZE / 2);
    if(model.recordBattu) {
      this.context.fillText('BRAVO !! NOUVEAU RECORD : '+model.highScore, model.SIZE / 2, model.SIZE -15);
    }
  }

  drawSnake(model){
      this.context.fillStyle = "#51ff0d";
    for(let i=0;i<this.button.length;i++) {
      this.button[i].addEventListener('click', event => {
        this.random.style.outline = "";
        this.music.src="";
        model.aleat = false;
        if(this.button[i].id=="red") {
          this.button[i].style.outline = "2px solid black";
          this.button[i+1].style.outline = "";
          this.button[i+2].style.outline = "";
          model.snakeColor = "#ff0000";
        }
        else if(this.button[i].id=="blue") {
          this.button[i].style.outline = "2px solid black";
          this.button[i-1].style.outline = "";
          this.button[i+1].style.outline = "";
          model.snakeColor  = "#0000FF";
        }
        else {
          this.button[i].style.outline = "2px solid black";
          this.button[i-1].style.outline = "";
          this.button[i-2].style.outline = "";
          model.snakeColor  = "#51ff0d";
        }
      });
    }

    this.random.addEventListener('click', event => {
      if(!model.aleat) {
        for(let i=0;i<this.button.length;i++) {
          this.button[i].style.outline = "";
        }
        this.random.style.outline = "2px solid black";
        this.music.src="./music/mario.mp3";
        this.music.play = true;
        model.aleat = true;
      }
    });

    if(model.aleat) {
      var colorValue = Math.floor(Math.random() * Math.floor(model.arrayColors.length-1));
      model.snakeColor = model.arrayColors[colorValue];
    }

    this.context.fillStyle = model.snakeColor;
    model.snakeObj = {};
    for (var i = 0; i < model.snake.length; i++) {
      var a = model.snake[i];
      this.context.fillRect(a.x, a.y, model.GRID_SIZE, model.GRID_SIZE); // dessine le serpent
      if (i > 0) {
        model.snakeObj[model.stringifyCoord(a)] = true;
      }
    }
  }

  // dessin de fruit
  createFood(model) {
    // si pas de fruit existant, on crée de nouvelles coordonnées
    if(model.food == null) {
      var food = model.newFood();
    } else { // sinon
      var food = model.food; // on garde l'objet food déjà créé
    }
    this.context.fillStyle = '#b58900';
    this.context.fillRect(food.x, food.y, model.GRID_SIZE, model.GRID_SIZE); // dessine la pomme
  }

  initPlateau(model) {
    this.c.height = this.c.width = model.SIZE;
    this.c.style.width = this.c.style.height = model.SIZE;
    this.context.fillStyle = '#002b36';
    this.context.fillRect(0, 0, model.SIZE, model.SIZE); // dessine le plateau de jeu
  }
}

class Controller {

  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.paused = false;

    // Binding
    this.model.bindNewHead(this.newHeadFromModel);
    this.model.bindNewDirection(this.newDirectionFromModel);
    this.view.bindPauseGame(this.newPauseGame);
    this.view.bindPlayGame(this.newPlayGame);
    this.init();
  }

  // les coordonées de la tête sont crées au tout début de ce qui symbolise le reste du serpent
  newHeadFromModel(){ // contexte de Model
    this.newHead = {x: this.snake[0].x, y: this.snake[0].y};
  }

  // on redéfinit les valeurs des directions
  newDirectionFromModel(e){ // contexte de Model
    this.newDirection = {37: -1, 38: -2, 39: 1, 40: 2}[e.keyCode] || this.newDirection; // 37 = GAUCHE; 38 = HAUT; 39 = DROITE; 40 = BAS
  }

  newPauseGame(interval){ // contexte de view
    clearInterval(interval);
  }

  newPlayGame(interval, jeu){ // contexte de view
    interval = setInterval(jeu, 100); // on relance l'interval
    return interval;
  }

  jeu = () => {
    this.view.displayHighScore(this.model);
    this.model.execNewHead();
    this.model.changeDirectionValue();
    this.model.deplacement();
    if(this.model.isFoodEaten()) {
      this.view.displayScore(this.model);
      this.view.displayHighScore(this.model);
    }
    this.view.initPlateau(this.model);
    this.model.finPartie();
    this.view.drawSnake(this.model);
    this.view.createFood(this.model);
    if (this.model.end) {
      this.view.finDuGame(this.model);
      clearInterval(this.interval); // stoppe la boucle de jeu si le joueur a perdu
    } else {
      this.model.snake.unshift(this.model.newHead); // rajoute la nouvelle tête
      this.model.snake = this.model.snake.slice(0, this.model.snakeLength); // agrandit le serpent
    }
  }

  init() {
    // s'il n'existe pas encore un enregistrement de meilleur score on en crée un avec "0"
    if(localStorage.getItem("highScore") == null) {
      localStorage.setItem("highScore", 0);
    }
    this.interval = setInterval(this.jeu, 100); // lance la boucle de jeu.  setInterval() appelle la fonction jeu de manière répétée, avec un délai de 100ms (1s).

    window.onkeydown = (e) => { // lorsqu'une touche est enfoncée
      // si c'est la barre espace, on gère la pause du jeu
      if(e.key == " ") {
        if(this.paused == false){
          this.view.execPauseGame(this.interval);
          this.paused = true;
        } else {
          this.interval = this.view.execPlayGame(this.interval, this.jeu);
          this.paused = false;
        }
      // sinon, on gère la direction du serpent
      } else {
        this.model.execNewDirection(e);
      }
    };
  }
}
