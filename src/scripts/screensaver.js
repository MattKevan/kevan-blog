// screensaver.js - Vanilla JS screensaver for Astro sites

/**
 * WebScreensaver - Creates a retro screensaver effect after inactivity
 * @param {Object} options - Configuration options
 * @param {number} options.timeout - Inactivity timeout in milliseconds (default: 3 minutes)
 */
export function initScreensaver(options = {}) {
    const screensaverTypes = ['starWarp', 'pipes', 'toasters', 'dvdLogo'];
    
    const settings = {
      timeout: options.timeout || 3 * 60 * 1000, // 3 minutes default
      // Randomly choose a screensaver type on initialization
      type: screensaverTypes[Math.floor(Math.random() * screensaverTypes.length)]
    };
  
    let timer = null;
    let animationFrame = null;
    let isActive = false;
    
    // Create screensaver elements
    const screensaverContainer = document.createElement('div');
    screensaverContainer.className = 'screensaver-container';
    screensaverContainer.style.display = 'none';
    
    const canvas = document.createElement('canvas');
    canvas.className = 'screensaver-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '9999';
    
    screensaverContainer.appendChild(canvas);
    
    // Add screensaver container to the DOM
    document.body.appendChild(screensaverContainer);
    
    // Initialize canvas context
    const ctx = canvas.getContext('2d');
    
    // Event handlers
    function resetTimer() {
      if (timer) {
        clearTimeout(timer);
      }
      
      if (isActive) {
        hideScreensaver();
      }
      
      timer = setTimeout(() => {
        showScreensaver();
      }, settings.timeout);
    }
    
    function showScreensaver() {
      // Randomly select a new screensaver type each time it activates
      settings.type = screensaverTypes[Math.floor(Math.random() * screensaverTypes.length)];
      isActive = true;
      screensaverContainer.style.display = 'block';
      resizeCanvas();
      startAnimation();
    }
    
    function hideScreensaver() {
      isActive = false;
      screensaverContainer.style.display = 'none';
      stopAnimation();
    }
    
    function stopAnimation() {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    }
    
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    
    // Helper function to interpolate between two colors (used by multiple animations)
    function interpolateColor(color1, color2, factor) {
      // Convert hex to RGB
      const hex2rgb = (hex) => {
        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);
        return [r, g, b];
      };
      
      // Convert RGB to hex
      const rgb2hex = (r, g, b) => {
        return '#' + 
          ((1 << 24) + (r << 16) + (g << 8) + b)
            .toString(16)
            .slice(1)
            .toUpperCase();
      };
      
      const c1 = hex2rgb(color1);
      const c2 = hex2rgb(color2);
      
      // Interpolate RGB values
      const r = Math.round(c1[0] + factor * (c2[0] - c1[0]));
      const g = Math.round(c1[1] + factor * (c2[1] - c1[1]));
      const b = Math.round(c1[2] + factor * (c2[2] - c1[2]));
      
      return rgb2hex(r, g, b);
    }
    
    // Animation functions - Improved Star Field (Star Trek Warp)
    function animateStarWarp() {
      // Constants for star field
      const numStars = 3000;
      const speed = 2;
      const maxDepth = 1500;
      const starColors = ['#FF00FF', '#FFFF00', '#00FFFF'];
      let stars = [];
      
      // Helper function to get random color
      function getRandomColor() {
        return starColors[Math.floor(Math.random() * starColors.length)];
      }
      
      // Star class definition
      class Star {
        constructor(x, y, z, size, color) {
          this.x = x;
          this.y = y;
          this.z = z;
          this.size = size;
          this.color = color;
        }
        
        update() {
          this.z -= speed * (2 - this.z / maxDepth);
          if (this.z <= 0) {
            this.reset();
          }
        }
        
        reset() {
          this.z = maxDepth;
          const angle = Math.random() * 2 * Math.PI;
          const distance = Math.sqrt(Math.random()) * (canvas.width / 2);
          this.x = Math.cos(angle) * distance;
          this.y = Math.sin(angle) * distance;
          this.size = (1 - distance / (canvas.width / 2)) * 0.1 + 0.5;
          this.color = getRandomColor();
        }
        
        draw() {
          const x = ((this.x / this.z) * canvas.width) / 2 + canvas.width / 2;
          const y = ((this.y / this.z) * canvas.height) / 2 + canvas.height / 2;
          const radius = (1 - this.z / maxDepth) * this.size * 4;
          
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
        }
      }
      
      // Initialize stars
      function initStars() {
        stars = Array.from({ length: numStars }, () => {
          const angle = Math.random() * 2 * Math.PI;
          const distance = Math.sqrt(Math.random()) * (canvas.width / 2);
          return new Star(
            Math.cos(angle) * distance,
            Math.sin(angle) * distance,
            Math.random() * maxDepth,
            (1 - distance / (canvas.width / 2)) * 0.1 + 0.5,
            getRandomColor()
          );
        });
      }
      
      // Update and draw stars
      function updateAndDrawStars() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        stars.forEach((star) => {
          star.update();
          star.draw();
        });
        
        if (isActive) {
          animationFrame = requestAnimationFrame(updateAndDrawStars);
        }
      }
      
      // Initialize and start animation
      initStars();
      updateAndDrawStars();
    }
    
    // Animation function - Colorful Pipes
    function animatePipes() {
      const pipes = [];
      const pipeCount = 5;
      const segmentLength = 20;
      const maxSegments = 50;
      
      // Use the specified colors
      const colors = ['#FF00FF', '#FFFF00', '#00FFFF'];
      
      // Initialize pipes
      for (let i = 0; i < pipeCount; i++) {
        pipes.push({
          segments: [{
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            direction: Math.floor(Math.random() * 4) // 0: up, 1: right, 2: down, 3: left
          }],
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
      
      function draw() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        pipes.forEach(pipe => {
          // Draw pipe
          ctx.strokeStyle = pipe.color;
          ctx.lineWidth = 10;
          ctx.lineJoin = 'round';
          ctx.beginPath();
          
          pipe.segments.forEach((segment, i) => {
            if (i === 0) {
              ctx.moveTo(segment.x, segment.y);
            } else {
              ctx.lineTo(segment.x, segment.y);
            }
          });
          
          ctx.stroke();
          
          // Add new segment
          const lastSegment = pipe.segments[pipe.segments.length - 1];
          let newX = lastSegment.x;
          let newY = lastSegment.y;
          let newDirection = lastSegment.direction;
          
          // Randomly change direction sometimes
          if (Math.random() < 0.1) {
            newDirection = Math.floor(Math.random() * 4);
          }
          
          // Move in the current direction
          if (newDirection === 0) newY -= segmentLength; // up
          else if (newDirection === 1) newX += segmentLength; // right
          else if (newDirection === 2) newY += segmentLength; // down
          else if (newDirection === 3) newX -= segmentLength; // left
          
          // Check boundaries and change direction if needed
          if (newX < 0 || newX > canvas.width || newY < 0 || newY > canvas.height) {
            newDirection = (newDirection + 2) % 4; // Reverse direction
            
            if (newDirection === 0) newY = lastSegment.y - segmentLength;
            else if (newDirection === 1) newX = lastSegment.x + segmentLength;
            else if (newDirection === 2) newY = lastSegment.y + segmentLength;
            else if (newDirection === 3) newX = lastSegment.x - segmentLength;
            
            // Change color when hitting a wall
            //pipe.color = colors[Math.floor(Math.random() * colors.length)];
          }
          
          pipe.segments.push({
            x: newX,
            y: newY,
            direction: newDirection
          });
          
          // Limit pipe length
          if (pipe.segments.length > maxSegments) {
            pipe.segments.shift();
          }
        });
        
        if (isActive) {
          animationFrame = requestAnimationFrame(draw);
        }
      }
      
      draw();
    }
    
  // Animation function - Flying Logos with Smooth Color Transition (Fixed)
  function animateToasters() {
    const toasters = [];
    const toasterCount = 20;
    const logoWidth = 60;
    const logoHeight = 30;
    
    // Colors to cycle through - same as in the Logo component
    const colors = ['#FF00FF', '#FFFF00', '#00FFFF'];
    
    // Direct SVG drawing function - avoids image loading issues
    function drawLogo(x, y, width, height, color, rotation) {
      ctx.save();
      
      // Translate and rotate
      ctx.translate(x + width/2, y + height/2);
      ctx.rotate(rotation);
      
      // Scale to desired dimensions
      const scaleX = width / 246;
      const scaleY = height / 123;
      ctx.scale(scaleX, scaleY);
      
      // Draw logo paths directly with canvas operations
      ctx.fillStyle = 'black';
      
      // Top-left triangle (black)
      ctx.beginPath();
      ctx.moveTo(123, 0);
      ctx.lineTo(123, 123);
      ctx.lineTo(61.5, 61.5);
      ctx.closePath();
      ctx.fill();
      
      // Bottom-right triangle (black)
      ctx.beginPath();
      ctx.moveTo(246, 123);
      ctx.lineTo(123, 123);
      ctx.lineTo(184.5, 61.5);
      ctx.closePath();
      ctx.fill();
      
      // Set color for colored parts
      ctx.fillStyle = color;
      
      // Bottom-left triangle (colored)
      ctx.beginPath();
      ctx.moveTo(0, 123);
      ctx.lineTo(0, 0);
      ctx.lineTo(123, 123);
      ctx.closePath();
      ctx.fill();
      
      // Top-right triangle (colored)
      ctx.beginPath();
      ctx.moveTo(123, 0);
      ctx.lineTo(246, 0);
      ctx.lineTo(123, 123);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
    }
    
    // Initialize toasters
    function initToasters() {
      for (let i = 0; i < toasterCount; i++) {
        // Random starting color
        const colorIndex = Math.floor(Math.random() * colors.length);
        const nextColorIndex = (colorIndex + 1) % colors.length;
        
        // Random interpolation speed - wide range for varied effects
        const transitionSpeed = 0.0002 + Math.random() * 0.001;
        
        toasters.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          speedX: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 2 + 1), // Random direction
          speedY: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 1 + 0.5), // Random direction
          size: Math.random() * 20 + 30,
          directionChangeTimer: Math.random() * 200 + 50, // Random timer for direction change
          
          // Color transition properties - random starting color and speed
          colorIndex: colorIndex,
          nextColorIndex: nextColorIndex,
          transitionFactor: Math.random(), // Random starting point in transition
          transitionSpeed: transitionSpeed, // Random transition speed
          initialDelay: Math.random() * 100 // Shorter random delay before starting color transition
        });
      }
      
      // Start animation
      draw();
    }
    
    function draw() {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      toasters.forEach(toaster => {
        // Only start color transition after initial delay
        if (toaster.initialDelay > 0) {
          toaster.initialDelay--;
        } else {
          // Update color transition
          toaster.transitionFactor += toaster.transitionSpeed;
          
          // If transition complete, move to next color
          if (toaster.transitionFactor >= 1) {
            toaster.colorIndex = toaster.nextColorIndex;
            toaster.nextColorIndex = (toaster.colorIndex + 1) % colors.length;
            toaster.transitionFactor = 0;
          }
        }
        
        // Calculate interpolated color
        const currentColor = colors[toaster.colorIndex];
        const nextColor = colors[toaster.nextColorIndex];
        const interpolatedColor = toaster.initialDelay > 0 ? 
                                  currentColor : // Use current color during delay
                                  interpolateColor(currentColor, nextColor, toaster.transitionFactor);
        
        // Calculate actual size based on toaster.size
        const actualWidth = logoWidth * (toaster.size / 30);
        const actualHeight = logoHeight * (toaster.size / 30);
        
        // Calculate direction angle
        const directionAngle = Math.atan2(toaster.speedY, toaster.speedX);
        
        // Instead of rotating fully with direction, just add a slight tilt
        // This keeps the logo from going upside down
        const maxTilt = Math.PI / 10; // Maximum 15-degree tilt
        const tilt = Math.sin(directionAngle) * maxTilt;
        
        // Draw the logo directly (no image loading)
        drawLogo(
          toaster.x, 
          toaster.y, 
          actualWidth, 
          actualHeight, 
          interpolatedColor,
          tilt // Use limited tilt instead of full rotation
        );
        
        // Move toaster
        toaster.x += toaster.speedX;
        toaster.y += toaster.speedY;
        
        // Randomly change direction
        toaster.directionChangeTimer--;
        if (toaster.directionChangeTimer <= 0) {
          // 20% chance to change X direction, 20% chance to change Y direction, 10% chance to change both
          const change = Math.random();
          if (change < 0.2) {
            toaster.speedX = -toaster.speedX;
          } else if (change < 0.4) {
            toaster.speedY = -toaster.speedY;
          } else if (change < 0.5) {
            toaster.speedX = -toaster.speedX;
            toaster.speedY = -toaster.speedY;
          }
          
          // Reset timer
          toaster.directionChangeTimer = Math.random() * 200 + 50;
        }
        
        // Reset toaster if it goes offscreen
        if (toaster.x < -actualWidth || toaster.x > canvas.width + actualWidth ||
            toaster.y < -actualHeight || toaster.y > canvas.height + actualHeight) {
          // Place back at a random edge of the screen
          const edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
          
          if (edge === 0) { // Top
            toaster.x = Math.random() * canvas.width;
            toaster.y = -actualHeight;
            toaster.speedY = Math.abs(toaster.speedY); // Force downward
          } else if (edge === 1) { // Right
            toaster.x = canvas.width + actualWidth;
            toaster.y = Math.random() * canvas.height;
            toaster.speedX = -Math.abs(toaster.speedX); // Force leftward
          } else if (edge === 2) { // Bottom
            toaster.x = Math.random() * canvas.width;
            toaster.y = canvas.height + actualHeight;
            toaster.speedY = -Math.abs(toaster.speedY); // Force upward
          } else { // Left
            toaster.x = -actualWidth;
            toaster.y = Math.random() * canvas.height;
            toaster.speedX = Math.abs(toaster.speedX); // Force rightward
          }
          
          // Reset direction change timer
          toaster.directionChangeTimer = Math.random() * 200 + 50;
        }
      });
      
      if (isActive) {
        animationFrame = requestAnimationFrame(draw);
      }
    }
    
    // Start animation directly
    initToasters();
  }
  
    
    // Animation function - DVD Logo Bounce with Direct Canvas Drawing (Fixed)
    function animateDvdLogo() {
      // DVD logo dimensions
      const logoWidth = 120;
      const logoHeight = 60;
      
      // Create a DVD logo object
      const dvdLogo = {
        x: Math.random() * (canvas.width - logoWidth),
        y: Math.random() * (canvas.height - logoHeight),
        width: logoWidth,
        height: logoHeight,
        speedX: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 1 + 1.5),
        speedY: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 1 + 1.5),
        colorIndex: 0,
        nextColorIndex: 1,
        transitionFactor: 0,
        transitionSpeed: 0.001, // Very slow transition
        justBounced: false
      };
      
      // Colors to cycle through - same as in the Logo component
      const colors = ['#FF00FF', '#FFFF00', '#00FFFF'];
      
      // Direct SVG drawing function - avoids image loading issues
      function drawLogo(x, y, width, height, color) {
        ctx.save();
        
        // Translate to position
        ctx.translate(x, y);
        
        // Scale to desired dimensions
        const scaleX = width / 246;
        const scaleY = height / 123;
        ctx.scale(scaleX, scaleY);
        
        // Draw logo paths directly with canvas operations
        ctx.fillStyle = 'black';
        
        // Top-left triangle (white)
        ctx.beginPath();
        ctx.moveTo(123, 0);
        ctx.lineTo(123, 123);
        ctx.lineTo(61.5, 61.5);
        ctx.closePath();
        ctx.fill();
        
        // Bottom-right triangle (white)
        ctx.beginPath();
        ctx.moveTo(246, 123);
        ctx.lineTo(123, 123);
        ctx.lineTo(184.5, 61.5);
        ctx.closePath();
        ctx.fill();
        
        // Set color for colored parts
        ctx.fillStyle = color;
        
        // Bottom-left triangle (colored)
        ctx.beginPath();
        ctx.moveTo(0, 123);
        ctx.lineTo(0, 0);
        ctx.lineTo(123, 123);
        ctx.closePath();
        ctx.fill();
        
        // Top-right triangle (colored)
        ctx.beginPath();
        ctx.moveTo(123, 0);
        ctx.lineTo(246, 0);
        ctx.lineTo(123, 123);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
      }
      
      // Animation loop
      function animateLoop() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update color transition
        if (!dvdLogo.justBounced) {
          dvdLogo.transitionFactor += dvdLogo.transitionSpeed;
          
          // If transition complete, move to next color
          if (dvdLogo.transitionFactor >= 1) {
            dvdLogo.colorIndex = dvdLogo.nextColorIndex;
            dvdLogo.nextColorIndex = (dvdLogo.colorIndex + 1) % colors.length;
            dvdLogo.transitionFactor = 0;
          }
        } else {
          dvdLogo.justBounced = false;
        }
        
        // Calculate interpolated color
        const currentColor = colors[dvdLogo.colorIndex];
        const nextColor = colors[dvdLogo.nextColorIndex];
        const interpolatedColor = interpolateColor(currentColor, nextColor, dvdLogo.transitionFactor);
        
        // Draw the logo directly (no image loading)
        drawLogo(dvdLogo.x, dvdLogo.y, dvdLogo.width, dvdLogo.height, interpolatedColor);
        
        // Move logo
        dvdLogo.x += dvdLogo.speedX;
        dvdLogo.y += dvdLogo.speedY;
        
        // Check for collisions with edges
        let collided = false;
        
        // Right edge
        if (dvdLogo.x + dvdLogo.width > canvas.width) {
          dvdLogo.speedX = -Math.abs(dvdLogo.speedX);
          dvdLogo.x = canvas.width - dvdLogo.width;
          collided = true;
        }
        // Left edge
        else if (dvdLogo.x < 0) {
          dvdLogo.speedX = Math.abs(dvdLogo.speedX);
          dvdLogo.x = 0;
          collided = true;
        }
        
        // Bottom edge
        if (dvdLogo.y + dvdLogo.height > canvas.height) {
          dvdLogo.speedY = -Math.abs(dvdLogo.speedY);
          dvdLogo.y = canvas.height - dvdLogo.height;
          collided = true;
        }
        // Top edge
        else if (dvdLogo.y < 0) {
          dvdLogo.speedY = Math.abs(dvdLogo.speedY);
          dvdLogo.y = 0;
          collided = true;
        }
        
        // Change color immediately on collision
        if (collided) {
          dvdLogo.colorIndex = dvdLogo.nextColorIndex;
          dvdLogo.nextColorIndex = (dvdLogo.colorIndex + 1) % colors.length;
          dvdLogo.transitionFactor = 0;
          dvdLogo.justBounced = true;
        }
        
        if (isActive) {
          animationFrame = requestAnimationFrame(animateLoop);
        }
      }
      
      // Start the animation
      animateLoop();
    }
    
    // Function to start the appropriate animation
    function startAnimation() {
      switch (settings.type) {
        case 'starWarp':
          animateStarWarp();
          break;
        case 'pipes':
          animatePipes();
          break;
        case 'toasters':
          animateToasters();
          break;
        case 'dvdLogo':
          animateDvdLogo();
          break;
        default:
          animateStarWarp();
      }
    }
    
    // Set up event listeners for user activity to hide screensaver
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });
    
    // Handle window resize
    window.addEventListener('resize', resizeCanvas);
    
    // Add Escape key handler to start screensaver
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault(); // Prevent default Escape behavior
        
        if (!isActive) {
          // If not already active, immediately show screensaver
          if (timer) {
            clearTimeout(timer);
          }
          showScreensaver();
        } else {
          // If already active, hide it
          hideScreensaver();
          resetTimer();
        }
      }
    });
    
    // Initial setup
    resetTimer();
    
    // Return control functions
    return {
      start: showScreensaver,
      stop: hideScreensaver,
      setType: (type) => {
        if (['starWarp', 'pipes', 'toasters', 'dvdLogo'].includes(type)) {
          settings.type = type;
          if (isActive) {
            stopAnimation();
            startAnimation();
          }
        }
      },
      setTimeout: (ms) => {
        settings.timeout = ms;
        resetTimer();
      }
    };
  }