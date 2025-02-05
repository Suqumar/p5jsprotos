// p5.js sketch to generate a Nakshatra wheel with 27 Nakshatras and animate the Moon's motion

let nakshatras = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
  "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];
let nakshatraAngles;
let moonDay = 0;
let totalDays = 27;
let frameInterval = 1.5 * 60; // 1.5 seconds per segment at 60 FPS
let animationStopped = false;

function setup() {
  createCanvas(800, 800);
  angleMode(DEGREES);
  nakshatraAngles = 360 / nakshatras.length;
}

function draw() {
  background(30);
  translate(width / 2, height / 2);
  noFill();

  // Draw Nakshatra wheel
  stroke(200);
  strokeWeight(2);
  ellipse(0, 0, 400, 400);
  
  for (let i = 0; i < nakshatras.length; i++) {
    let angle = (i + 0.5) * nakshatraAngles; // Center of each segment
    let x = 200 * cos(angle);
    let y = 200 * sin(angle);

    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    text(nakshatras[i], x * 1.2, y * 1.2);

    stroke(150);
    line(0, 0, x, y);
  }

  // Animate Moon traversing the Nakshatras at the center of each segment
  let moonAngle = (moonDay + 0.5) * nakshatraAngles;
  let moonX = 180 * cos(moonAngle);
  let moonY = 180 * sin(moonAngle);
  fill(255, 204, 0);
  noStroke();
  ellipse(moonX, moonY, 20, 20);

  // Increment Moon's position every 5 seconds, stop at Revati
  if (!animationStopped && frameCount % frameInterval === 0) {
    if (moonDay < totalDays - 1) {
      moonDay++;
    } else {
      animationStopped = true;
    }
  }
}