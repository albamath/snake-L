// Snake in pure js. Simple as it gets. 
// But in an L translation surface 
// instead of a flat torus. 
// Forked from zprima/snake-js-game, 
// then duplicated and adapted by myself. 
// Just run a server or test it at 
// http://albamath.com/snake-L.

      var canvas, ctx;

      window.onload = function() {
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");

        document.addEventListener("keydown", keyDownEvent);
        document.addEventListener("touchstart", touchEvent);
        document.addEventListener("touchmove", touchEvent);

        // render fr times per second
        var f = 8;
        setInterval(draw, 1000 / f);
      };

      // game world 21 x 21 - 8 x 8 = 377
      var squareSize = 13;
      var rectSize = 8;
      var gridSize = rectSize + squareSize;
      var tileSize = 16;
      var nextX = (nextY = 0);
      var diffX = (diffY = 0);

      // snake
      var defaultTailSize = 3;
      var tailSize = defaultTailSize;
      var snakeTrail = [];
      var snakeY = squareSize + (snakeX = Math.floor((rectSize)/2));

      // apple
      var appleX = (appleY = 15);

      // draw
      function draw() {
        // move snake in next pos along X
        if (nextX != 0) {
          snakeX += nextX;
          // snake over game world?
          if (snakeX < 0) {
            snakeX = gridSize - 1;
            if (snakeY < rectSize) {
              snakeX = squareSize - 1;
            }
          }  
          if (snakeX > squareSize - 1) {
            if (snakeY < rectSize) {
              snakeX = 0;
            }
          }          
          if (snakeX > gridSize - 1) {
            snakeX = 0;
          }
        }
        // move snake in next pos along Y
        if (nextY != 0) {
          snakeY += nextY;
          // snake over game world?
          if (snakeY < 0) {
            snakeY = gridSize - 1;
          }  
          if (snakeY < rectSize) {
            if (snakeX > squareSize - 1) {
              snakeY = gridSize - 1;
            }
          }
          if (snakeY > gridSize - 1) {
            snakeY = 0;
            if (snakeX > squareSize - 1) {
              snakeY = rectSize;
            }
          }
        }  

        //snake bite apple?
        if (snakeX == appleX && snakeY == appleY) {
          tailSize++;

          appleX = Math.floor(Math.random() * gridSize);
          appleY = Math.floor(Math.random() * gridSize);
          // apple over game world?
          if (appleX > squareSize - 1) {
            if (appleY < squareSize) {
              appleX = Math.floor(appleX/2)
              appleY = squareSize + Math.floor(appleY/2)
            }
          }
        }

        //paint background
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, squareSize*tileSize, gridSize*tileSize);    
        ctx.fillRect(squareSize*tileSize, (rectSize)*tileSize, (rectSize)*tileSize, squareSize*tileSize);
        

        // paint snake
        ctx.fillStyle = "green";
        for (var i = 0; i < snakeTrail.length; i++) {
          ctx.fillRect(
            snakeTrail[i].x * tileSize,
            snakeTrail[i].y * tileSize,
            tileSize,
            tileSize
          );

          //snake bites it's tail?
          if (snakeTrail[i].x == snakeX && snakeTrail[i].y == snakeY) {
            tailSize = defaultTailSize;
          }
        }

        // paint apple
        ctx.fillStyle = "red";
        ctx.fillRect(appleX * tileSize, appleY * tileSize, tileSize, tileSize);

        //set snake trail
        snakeTrail.push({ x: snakeX, y: snakeY });
        while (snakeTrail.length > tailSize) {
          snakeTrail.shift();
        }
      }

      // keyboard input
      function keyDownEvent(e) {
        switch (e.keyCode) {
          case 37:
            if (nextX != 1) {
              nextX = -1; 
              nextY = 0;
            }
            break;
          case 38:
            if (nextY != 1) {
              nextX = 0;
              nextY = -1;
            }
            break;
          case 39:
            if (nextX != -1) {
              nextX = 1;
              nextY = 0;
            }
            break;
          case 40:
            if (nextY != -1) {
              nextX = 0;
              nextY = 1;
            }
            break;
        }
      }
      
      // touch input
      function touchEvent(e) {
        if (e.touches) {
          diffX = e.touches[0].pageX - canvas.offsetLeft - snakeX*tileSize;
          diffY = e.touches[0].pageY - canvas.offsetTop  - snakeY*tileSize;
          if (diffX == 0 && diffY == 0) {
            return;
          }
          if (Math.abs(diffX) > Math.abs(diffY) 
              && nextX + Math.sign(diffX) != 0) {
            nextX = Math.sign(diffX);
            nextY = 0;
          } else if (Math.abs(diffX) < Math.abs(diffY) 
                     && nextY + Math.sign(diffY) != 0) {
            nextX = 0;
            nextY = Math.sign(diffY);
          }
          //// Uncomment for touch debugging
          //output.innerHTML = "Rel. touch: "
          //                   +  " x: " + Math.ceil(diffX/tileSize) 
          //                   + ", y: " + Math.ceil(diffY/tileSize);
          e.preventDefault();
        }
      }
    
