document.addEventListener('DOMContentLoaded', startGame);

function startGame() {

    let squaresTotal = 225, 
        width = 15,
        currentShooterIndex = 202,
        currentInvaderIndex = 0,
        alienInvadersTakenDown = [],
        result = 0,
        direction = 1,
        invadersId,
        moveInvadersInterval = 500,
        moveLaserInterval = 100,
        removeBoomInterval = 250,
        removeEventListenerInterval = 100,
        increaseSpeedValue = 400,
        gameOverMsg = 'Game Over',
        winMsg = 'You Win!';
    
    //Создаем игровое поле
    for (let i = 0; i < squaresTotal; i++) document.querySelector('.grid').appendChild(document.createElement("div"));

    const squares = document.querySelectorAll('.grid div'),
          resultDisplay = document.querySelector('#result'),
          scoreDisplay = document.querySelector('.score'),
          fireBtn = document.querySelector('.openfire-button'),
          restartBtn = document.querySelector('.restart-button'),
          increaseInvadersSpeed = document.querySelector('.speed-up-button'),
          decreaseInvadersSpeed = document.querySelector('.speed-down-button'),
          alienInvaders = [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
            15, 16, 17, 18, 19, 20, 21, 21, 22, 23, 24,
            30, 31, 32, 33, 34, 35, 36, 37, 38, 39
          ];

    // Инициализация кораблей пришельцев
    alienInvaders.forEach(invader => squares[currentInvaderIndex + invader].classList.add('invader'));

    // Инициализация корабля игрока
    squares[currentShooterIndex].classList.add('shooter');

    // Двигаем корабль
    function moveShooter(e) {
        squares[currentShooterIndex].classList.remove('shooter');
        switch(e.key) {
            case 'ArrowLeft':
                if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
                break;
            case 'ArrowRight':
                if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
                break;
        }
        squares[currentShooterIndex].classList.add('shooter');
    }

    // Двигаем пришельцев
    function moveInvaders() {
        const leftEdge = alienInvaders[0] % width === 0,
              rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;

        if ((leftEdge && direction === -1) || (rightEdge && direction === 1)) {
            direction = width;
        } else if (direction === width) {
            leftEdge ? direction = 1 : direction = -1;
        }

        for (let i = 0; i <= alienInvaders.length - 1; i++) squares[alienInvaders[i]].classList.remove('invader');
        
        for (let i = 0; i < alienInvaders.length; i++) alienInvaders[i] += direction;

        for (let i = 0; i <= alienInvaders.length - 1; i++) if (!alienInvadersTakenDown.includes(i)) squares[alienInvaders[i]].classList.add('invader');

        if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
            scoreDisplay.innerHTML = gameOverMsg;
            clearInterval(invadersId);
        }

        for (let i = 0; i < alienInvaders.length; i++) {
            if (alienInvaders[i] > squares.length) {
                scoreDisplay.innerHTML = gameOverMsg;
                clearInterval(invadersId);
            }
        }
        
        if (alienInvadersTakenDown.length === alienInvaders.length) {
            resultDisplay.innerHTML = winMsg;
            clearInterval(invadersId);
        }
    }

    // Стреляем
    function shoot(e) {
        let laserId,
            currentLaserIndex = currentShooterIndex;

        function moveLaser() {
            if (squares[currentLaserIndex]) squares[currentLaserIndex].classList.remove('laser');
            
            currentLaserIndex -= width;

            if (squares[currentLaserIndex]) squares[currentLaserIndex].classList.add('laser');

            if (squares[currentLaserIndex] && squares[currentLaserIndex].classList.contains('invader')) {
                squares[currentLaserIndex].classList.remove('laser');
                squares[currentLaserIndex].classList.remove('invader');
                squares[currentLaserIndex].classList.add('boom');

                setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), removeBoomInterval);
                clearInterval(laserId);

                const alienTakenDown = alienInvaders.indexOf(currentLaserIndex);
                alienInvadersTakenDown.push(alienTakenDown);
                result++;
                resultDisplay.innerHTML = result;
            }
        }

        if (e.key === ' ') laserId = setInterval(moveLaser, moveLaserInterval);
        if (e.type === 'click') laserId = setInterval(moveLaser, moveLaserInterval);
    }

    // Изменение скорости движения пришельцев
    increaseInvadersSpeed.addEventListener('click', () => invadersId = setInterval(moveInvaders, moveInvadersInterval - increaseSpeedValue));
    decreaseInvadersSpeed.addEventListener('click', () => invadersId = clearInterval(invadersId));
    invadersId = setInterval(moveInvaders, moveInvadersInterval);
    
    // Запуск движения игрока и стрельбы
    document.addEventListener('keydown', moveShooter);
    document.addEventListener('keydown', shoot);
    fireBtn.addEventListener('click', shoot); 

    // Запрет стрельбы и движения при game over
    setInterval(() => {
        if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
            fireBtn.removeEventListener('click', shoot, false); 
            document.removeEventListener('keydown', shoot, false);
            document.removeEventListener('keydown', moveShooter, false);
            squares[currentShooterIndex].classList.remove('shooter');
            clearInterval(invadersId);
        }    
    }, removeEventListenerInterval);

    // Перезапуск
    restartBtn.addEventListener('click', () => {
        location.reload();
        return false;
    });

   

}

