document.addEventListener('DOMContentLoaded', () => {
  // All your javascript code goes here.
  const grid = document.querySelector('.grid')  /*Tjis tells our javascript that evrytime we call and use grid we mean the HTML element with the classname grid.*/
  let squares = Array.from(document.querySelectorAll('.grid div')) /* querySelecetorAll() enables jaavascript to control each sqaure in the grid. All the 200 divs we made can be now controlled.*/
  const scoreDisplay = document.querySelector('#score') /*Fetching the Score board value from HTML*/
  const startBtn = document.querySelector('#start-button') /*Fetching the button from HTML*/
  const GRID_WIDTH = 10
  let nextRandom = 0
  let timerId
  let score = 0
  const colors = ['orange', 'red', 'purple', 'green', 'blue']
  // The Tetrominoes (You can experiment with these after your code rflects on GUI)
  const lTetromino = [
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, 2],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 2],
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2],
    [GRID_WIDTH, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2 + 2]
  ]
  const zTetromino = [
    [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
    [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1],
    [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
    [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1]
  ]
  const tTetromino = [
    [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2],
    [1, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
    [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1]
  ]
  const oTetromino = [
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1]
  ]
  const iTetromino = [
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3],
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3]
  ]
  const TheTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino] // List of all the tetriminoes defined above
  let currentPosition = 4
  let currentRotation = 0
  let random = Math.floor(Math.random() * TheTetrominoes.length)
  let current = TheTetrominoes[random][currentRotation] // Picking Ltetrimino first rotation. That is why we did [0][0]
  // Draw the tetrimino
  function draw () {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino') // index is currently chosen tetromino array.
      squares[currentPosition + index].style.backgroundColor = colors[random] // adding color to a tetrimino
    })
  }
  // Undraw the tetrimino
  function undraw () {
    current.forEach(index =>{
      squares[currentPosition + index].classList.remove('tetromino') // index is currently chosen tetromino array.
      squares[currentPosition + index].style.backgroundColor = '' // removing color from a tetrimino

    })
  }
  // make the tetrimino move down every second
  // timerId = setInterval(moveDown, 1000) // We can use timerId to stop the setInterval in future
  // Funtion to control movements of tetrimino
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft()
    } else if (e.keyCode === 38) {
      rotate()
    } else if (e.keyCode === 39) {
      moveRight()
    } else if (e.keyCode === 40) {
      moveDown()
    }
  }

  document.addEventListener('keyup', control)
  // move down animation function
  function moveDown () {
    undraw()
    currentPosition += GRID_WIDTH
    draw()
    freeze()
  }

  function freeze () {
    if (current.some(index => squares[currentPosition + index + GRID_WIDTH].classList.contains('taken'))) { // If any of the tetrimino has a classname taken then we make the class of all the blocks as taken
      current.forEach(index => squares[currentPosition + index].classList.add('taken')) // making all the classnames of divs of the falling tetrimino as taken
      // Start a new tetromino falling
      random = nextRandom
      nextRandom = Math.floor(Math.random() * TheTetrominoes.length)
      current = TheTetrominoes[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
      addScore()
      gameOver()
    }
  }

  // move the tetrimino left unless it's at an edge or there is a blockage

  function moveLeft() {
    undraw()
    // Defining the left Edge
    const isAtLeftEdge = current.some( index => (currentPosition + index) % GRID_WIDTH === 0)
    // moving the piece left
    if (!isAtLeftEdge) currentPosition -= 1
    // If you have a piece already while you;re moving left.
    if (current.some(index => squares[currentPosition + index].classList.contains('taken')))
    {
      currentPosition += 1
    }
    draw()
  }

  // mover the tetrimino right unless it's at an edge or there is a blockage

  function moveRight() {
    undraw()
    //Defining the Right Edge
    const isAtRightEdge = current.some( index => (currentPosition + index) % GRID_WIDTH === GRID_WIDTH - 1)
    // Moving the piece right
    if (!isAtRightEdge) currentPosition += 1
    // If you have a piece already while you;re moving right.
    if (current.some(index => squares[currentPosition + index].classList.contains('taken')))
    {
      currentPosition -= 1
    }
    draw()
  }
  // rotate the current tetrimino
  function rotate() {
    undraw()
    currentRotation ++
    if(currentRotation == current.length){ // if the current rotation goes to 4, make it go back to 0
      currentRotation = 0
    }
    current = TheTetrominoes[random][currentRotation]
    draw()
  }
  // show up-next tetrimino in mini-grid display
  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  const displayIndex = 0
  // the Tetrimino without Rotation

  const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], // l-tetrimino
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // z-tetromino
    [1, displayWidth, displayWidth + 1, displayWidth + 2], // t-tetrimino
    [0, 1, displayWidth, displayWidth + 1], // o-tetrimino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] // i-tetromino
  ]

  // display the shape in the mini-grid display
  function displayShape()
  {
    // remove any trace of tetrimino from the entire grid
    displaySquares.forEach(square =>{
      square.classList.remove('tetromino')
      square.style.backgroundColor = ''
    })
    upNextTetrominoes [nextRandom].forEach(index =>{
      displaySquares[displayIndex + index].classList.add('tetromino')
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
  }
  //add functionality to the button
  startBtn.addEventListener('click', () =>{
    if(timerId){
      clearInterval(timerId)
      timerId = null
    } else{
      draw()
      timerId = setInterval(moveDown, 1000)
      nextRandom = Math.floor(Math.random() * TheTetrominoes.length)
      displayShape()
    }
  })
  // add score
  function addScore(){
    //loop over a grid of 10 displaySquares
    for(let i=0; i<199; i+= GRID_WIDTH){
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9] //define what each row is

      if (row.every( index => squares[index].classList.contains('taken'))) {
        score += 10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
          squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(i, GRID_WIDTH)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }

  // game over function

  function gameOver(){
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
      scoreDisplay.innerHTML = 'end'
      clearInterval(timerId)
    }
  }









})
