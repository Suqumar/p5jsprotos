let zodiacSigns = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
let zodiacAngles = [];
let sunPosition;
let cycleDays = 584; // Venus cycle in days
let radius = 300;
let completedTrajectories = []; // Store completed legs for drawing
let progress = 0; // Track progress within a leg
let currentLeg = 0; // Track which leg is currently being drawn

function setup() {
  createCanvas(800, 800);
  angleMode(DEGREES);

  sunPosition = createVector(width / 2, height / 2);

  // Calculate zodiac angles
  for (let i = 0; i < zodiacSigns.length; i++) {
    let angle = i * (360 / zodiacSigns.length);
    zodiacAngles.push(angle);
  }
}

function calculatePosition(sign) {
  let angle = zodiacAngles[zodiacSigns.indexOf(sign)];
  let x = sunPosition.x + radius * cos(angle);
  let y = sunPosition.y + radius * sin(angle);
  return createVector(x, y);
}

function drawCompletedTrajectories() {
  stroke(255, 100, 100);
  strokeWeight(2);
  for (let leg of completedTrajectories) {
    line(leg.start.x, leg.start.y, leg.end.x, leg.end.y);
  }
}

function drawFirstLeg() {
  const start = "Leo";
  const end = "Pisces";
  let startPos = calculatePosition(start);
  let endPos = calculatePosition(end);
  let currentX = lerp(startPos.x, endPos.x, progress);
  let currentY = lerp(startPos.y, endPos.y, progress);

  stroke(255, 100, 100);
  line(startPos.x, startPos.y, currentX, currentY);

  fill(100, 255, 100);
  ellipse(currentX, currentY, 10, 10);

  if (progress >= 1) {
    completedTrajectories.push({ start: startPos, end: endPos });
    progress = 0;
    currentLeg++;
  } else {
    progress += 1 / cycleDays;
  }
}

function drawSecondLeg() {
  const start = "Pisces";
  const end = "Libra";
  let startPos = calculatePosition(start);
  let endPos = calculatePosition(end);
  let currentX = lerp(startPos.x, endPos.x, progress);
  let currentY = lerp(startPos.y, endPos.y, progress);

  stroke(255, 100, 100);
  line(startPos.x, startPos.y, currentX, currentY);

  fill(100, 255, 100);
  ellipse(currentX, currentY, 10, 10);

  if (progress >= 1) {
    completedTrajectories.push({ start: startPos, end: endPos });
    progress = 0;
    currentLeg++;
  } else {
    progress += 1 / cycleDays;
  }
}


function drawThirdLeg() {
  const start = "Libra";
  const end = "Taurus";
  let startPos = calculatePosition(start);
  let endPos = calculatePosition(end);
  let currentX = lerp(startPos.x, endPos.x, progress);
  let currentY = lerp(startPos.y, endPos.y, progress);

  stroke(255, 100, 100);
  line(startPos.x, startPos.y, currentX, currentY);

  fill(100, 255, 100);
  ellipse(currentX, currentY, 10, 10);

  if (progress >= 1) {
    completedTrajectories.push({ start: startPos, end: endPos });
    progress = 0;
    currentLeg++;
  } else {
    progress += 1 / cycleDays;
  }
}

function drawFourthLeg() {
  const start = "Taurus";
  const end = "Sagittarius";
  let startPos = calculatePosition(start);
  let endPos = calculatePosition(end);
  let currentX = lerp(startPos.x, endPos.x, progress);
  let currentY = lerp(startPos.y, endPos.y, progress);

  stroke(255, 100, 100);
  line(startPos.x, startPos.y, currentX, currentY);

  fill(100, 255, 100);
  ellipse(currentX, currentY, 10, 10);

  if (progress >= 1) {
    completedTrajectories.push({ start: startPos, end: endPos });
    progress = 0;
    currentLeg++;
  } else {
    progress += 1 / cycleDays;
  }
}


function drawFifthLeg() {
  const start = "Sagittarius";
  const end = "Leo";
  let startPos = calculatePosition(start);
  let endPos = calculatePosition(end);
  let currentX = lerp(startPos.x, endPos.x, progress);
  let currentY = lerp(startPos.y, endPos.y, progress);

  stroke(255, 100, 100);
  line(startPos.x, startPos.y, currentX, currentY);

  fill(100, 255, 100);
  ellipse(currentX, currentY, 10, 10);

  if (progress >= 1) {
    completedTrajectories.push({ start: startPos, end: endPos });
    noLoop();
  } else {
    progress += 1 / cycleDays;
  }
}

function draw() {
  background(0);

  // Draw Zodiac wheel
  stroke(255);
  noFill();
  ellipse(sunPosition.x, sunPosition.y, 2 * radius, 2 * radius);

  for (let i = 0; i < zodiacAngles.length; i++) {
    let angle = zodiacAngles[i];
    let x = sunPosition.x + 320 * cos(angle);
    let y = sunPosition.y + 320 * sin(angle);

    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    text(zodiacSigns[i], x, y);
  }

  // Draw Sun
  fill(255, 204, 0);
  noStroke();
  ellipse(sunPosition.x, sunPosition.y, 20, 20);

  // Draw completed trajectories
  drawCompletedTrajectories();

  // Draw current leg
  if (currentLeg === 0) {
    drawFirstLeg();
  } else if (currentLeg === 1) {
    drawSecondLeg();
  } else if (currentLeg === 2) {
    drawThirdLeg();
  } else if (currentLeg === 3) {
    drawFourthLeg();
  } else if (currentLeg === 4) {
    drawFifthLeg();
  }
}

