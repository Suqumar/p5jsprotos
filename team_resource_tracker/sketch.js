function setup() {
  noCanvas();

  // Create HTML elements
  createElement('h1', 'Team Resource Tracker');

  const nameInput = createInput();
  nameInput.attribute('placeholder', 'Enter team member name');
  nameInput.id('nameInput');

  const addButton = createButton('Add Member');
  addButton.id('addButton');
  addButton.mousePressed(addMember);

  const teamList = createDiv();
  teamList.id('teamList');

  // Apply CSS styles
  const style = document.createElement('style');
  style.innerHTML = `
    body {
      font-family: Arial, sans-serif;
    }
    #addButton {
      margin-top: 10px;
      padding: 10px 20px;
      background-color: #4CAF50;
      color: white;
      border: none;
      cursor: pointer;
    }
    #addButton:hover {
      background-color: #45a049;
    }
    #nameInput {
      padding: 10px;
      width: 200px;
    }
    .member {
      padding: 10px;
      margin-top: 10px;
      border: 1px solid #ddd;
    }
  `;
  document.head.appendChild(style);
}

let team = [];

function addMember() {
  const nameInput = select('#nameInput');
  const memberName = nameInput.value();

  if (memberName !== '') {
    team.push(memberName);
    nameInput.value('');
    displayTeam();
  }
}

function displayTeam() {
  const teamList = select('#teamList');
  teamList.html('');

  for (let i = 0; i < team.length; i++) {
    const memberDiv = createDiv(team[i]);
    memberDiv.class('member');
    memberDiv.parent(teamList);
  }
}
