let keys = {
  "active-size": "small",
  "active-theme": "spring",
  "remaining-flags": 25,
  "game-state": "ready",
};

const translateSize = {
  small: [10, 25],
  medium: [15, 50],
  large: [20, 100],
};

const numberMap = {
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
};

const currentTime: [number, number] = [0, 0];

let minInterval: number;
let secInterval: number;

let gameState: number[][] = [];

function renderPage() {
  const pageWrapper: HTMLDivElement = document.createElement("div");
  pageWrapper.classList.add("page-wrapper");
  document.body.appendChild(pageWrapper);
  document.body.setAttribute("oncontextmenu", "return false;");

  const gameWrapper: HTMLDivElement = document.createElement("div");
  gameWrapper.classList.add("game-wrapper");
  gameWrapper.id = "game-wrapper";
  pageWrapper.appendChild(gameWrapper);

  // HEADER
  const gameHeader: HTMLDivElement = document.createElement("div");
  gameHeader.classList.add("game-header");
  gameWrapper.appendChild(gameHeader);

  gameHeader.appendChild(
    gameHeaderDropdown(["Small", "Medium", "Large"], "size")
  );
  gameHeader.appendChild(
    gameHeaderDropdown(["Spring", "Summer", "Autumn", "Winter"], "theme")
  );

  gameHeader.appendChild(
    headerItem("./assets/images/flag-solid.svg", "Flag", "100")
  );
  gameHeader.appendChild(
    headerItem("./assets/images/clock-solid.svg", "Clock", ["00", "00", "00"])
  );

  // CONTENT
  const gameContent: HTMLDivElement = document.createElement("div");
  gameContent.classList.add("game-content");
  gameContent.id = "game-content";
  gameWrapper.appendChild(gameContent);

  resetGameContent();
}

function gameHeaderDropdown(options: string[], name: string): HTMLDivElement {
  const dropdown: HTMLDivElement = document.createElement("div");
  dropdown.classList.add("game-header-dropdown");

  const dropdownButton: HTMLButtonElement = document.createElement("button");
  dropdownButton.classList.add("game-header-dropdown-button");
  dropdownButton.id = `change-${name}`;
  dropdownButton.append(options[0]);
  dropdown.appendChild(dropdownButton);

  const dropdownImg: HTMLImageElement = document.createElement("img");
  dropdownImg.src = "./assets/images/angle-down-solid.svg";
  dropdownImg.alt = "Down";
  dropdownImg.style.width = "10px";
  dropdownImg.style.height = "10px";
  dropdownButton.appendChild(dropdownImg);

  const dropdownList: HTMLDivElement = document.createElement("div");
  dropdownList.classList.add("game-header-dropdown-list");
  dropdownList.id = `${name}-list`;
  dropdown.appendChild(dropdownList);

  options.forEach((option, index) => {
    const listEntry: HTMLButtonElement = document.createElement("button");
    listEntry.classList.add("game-header-dropdown-list-entry");
    listEntry.id = option.toLowerCase();

    if (index === 0) {
      const checkImg: HTMLImageElement = document.createElement("img");
      checkImg.src = "./assets/images/check-solid.svg";
      checkImg.alt = "Tick";
      checkImg.style.height = "20px";
      checkImg.style.width = "20px";

      listEntry.appendChild(checkImg);
    } else {
      listEntry.classList.add("not-selected");
    }

    listEntry.append(option);
    dropdownList.appendChild(listEntry);

    listEntry.addEventListener("click", () => {
      // Update Button
      keys[`active-${name}`] = listEntry.id;
      dropdownButton.firstChild.textContent = option;

      // Update List
      updateList(dropdownList, name);

      // Update Board
      resetGameContent();
    });
  });

  dropdownButton.addEventListener("click", () => {
    if (dropdownList.style.display === "inline") {
      dropdownList.style.display = "none";
      dropdownImg.style.transform = "none";
    } else {
      updateList(dropdownList, name);
      dropdownList.style.display = "inline";
      dropdownImg.style.transform = "rotate(180deg)";
    }
  });

  return dropdown;
}

function headerItem(
  imageSrc: string,
  imageAlt: string,
  text: string | [string, string, string]
): HTMLDivElement {
  const item: HTMLDivElement = document.createElement("div");
  item.classList.add("header-item");

  const itemImg: HTMLImageElement = document.createElement("img");
  itemImg.src = imageSrc;
  itemImg.alt = imageAlt;
  itemImg.style.width = "30px";
  itemImg.style.height = "30px";
  item.appendChild(itemImg);

  const headerItemText: HTMLDivElement = document.createElement("div");
  headerItemText.classList.add("header-item-text");
  item.appendChild(headerItemText);

  if (typeof text === "string") {
    headerItemText.innerHTML = text;
    headerItemText.id = "flag-count";
  } else {
    const minSpan: HTMLSpanElement = document.createElement("span");
    minSpan.id = "min";
    minSpan.innerHTML = text[0];
    headerItemText.appendChild(minSpan);

    headerItemText.append(":");

    const secSpan: HTMLSpanElement = document.createElement("span");
    secSpan.id = "sec";
    secSpan.innerHTML = text[1];
    headerItemText.appendChild(secSpan);

    headerItemText.append(".");

    const msSpan: HTMLSpanElement = document.createElement("span");
    msSpan.id = "ms";
    msSpan.innerHTML = text[2];
    headerItemText.appendChild(msSpan);
  }

  return item;
}

function updateList(dropdownList: HTMLDivElement, name: string) {
  const listChildren = [...dropdownList.children];
  listChildren.forEach((element) => {
    if (
      element.id === keys[`active-${name}`] &&
      element.children.length === 0
    ) {
      const checkImg: HTMLImageElement = document.createElement("img");
      checkImg.src = "./assets/images/check-solid.svg";
      checkImg.alt = "Tick";
      checkImg.style.height = "20px";
      checkImg.style.width = "20px";

      element.prepend(checkImg);
      element.classList.remove("not-selected");
    } else if (
      element.id !== keys[`active-${name}`] &&
      element.children.length > 0
    ) {
      element.classList.add("not-selected");
      element.removeChild(element.firstChild);
    }
  });
}

function resetGameContent() {
  const gameContent: HTMLDivElement = document.getElementById(
    "game-content"
  ) as HTMLDivElement;
  gameContent.innerHTML = "";
  gameContent.setAttribute("theme", keys["active-theme"]);

  let gameSize = translateSize[keys["active-size"]][0];
  for (let y = 0; y < gameSize; y++) {
    const gameRow: HTMLDivElement = document.createElement("div");
    gameRow.classList.add("game-row");
    gameContent.appendChild(gameRow);

    for (let x = 0; x < gameSize; x++) {
      const gameCell: HTMLDivElement = document.createElement("div");
      gameCell.classList.add("game-cell");
      gameCell.setAttribute("x", `${x}`);
      gameCell.setAttribute("y", `${y}`);
      gameCell.setAttribute(keys["active-size"], "");
      gameRow.appendChild(gameCell);
    }
  }

  // Handle Remaining Bombs
  keys["remaining-flags"] = translateSize[keys["active-size"]][1];
  const flagCount: HTMLDivElement = document.getElementById(
    "flag-count"
  ) as HTMLDivElement;
  flagCount.innerHTML = keys["remaining-flags"].toString();

  // Init Game State
  const randomNos: number[] = [];
  while (randomNos.length < keys["remaining-flags"]) {
    const potentialNo: number = Math.floor(Math.random() * gameSize ** 2);

    if (randomNos.indexOf(potentialNo) === -1) {
      randomNos.push(potentialNo);
    }
  }

  gameState = [];
  for (let y = 0; y < gameSize; y++) {
    const row: number[] = [];
    for (let x = 0; x < gameSize; x++) {
      row.push(randomNos.indexOf(gameSize * y + x) > -1 ? -1 : 0);
    }

    gameState.push(row);
  }

  for (let y = 0; y < gameSize; y++) {
    for (let x = 0; x < gameSize; x++) {
      const cell: HTMLDivElement = document.querySelector(
        `div[x=\"${x}\"][y=\"${y}\"]`
      );

      cell.addEventListener("contextmenu", () => {
        if (cell.innerHTML === "" && !cell.classList.contains("open")) {
          const flagImg: HTMLImageElement = document.createElement("img");
          flagImg.src = "./assets/images/flag-solid.svg";
          flagImg.alt = "Flag";
          flagImg.style.height = "80%";
          flagImg.style.width = "80%";
          cell.appendChild(flagImg);

          keys["remaining-flags"]--;
          flagCount.innerHTML = keys["remaining-flags"].toString();
        } else {
          const firstChild: HTMLImageElement =
            cell.firstElementChild as HTMLImageElement;

          if (
            firstChild !== null &&
            firstChild.src.includes("flag-solid.svg")
          ) {
            cell.innerHTML = "";
            keys["remaining-flags"]++;
            flagCount.innerHTML = keys["remaining-flags"].toString();
          }
        }
      });

      if (gameState[y][x] !== -1) {
        for (let i = -1; i < 2; i++) {
          for (let j = -1; j < 2; j++) {
            if (
              !(i === 0 && j === 0) &&
              y + i > -1 &&
              y + i < gameSize &&
              x + j > -1 &&
              x + j < gameSize &&
              gameState[y + i][x + j] === -1
            ) {
              gameState[y][x]++;
            }
          }
        }

        cell.addEventListener("click", () => {
          if (cell.innerHTML === "") {
            cell.classList.add("open");
            if (gameState[y][x] > 0) {
              cell.classList.add(numberMap[gameState[y][x]]);
              cell.innerHTML = gameState[y][x].toString();
            }

            // Start Timer
            if (keys["game-state"] === "ready") {
              keys["game-state"] = "playing";

              secInterval = setInterval(() => {
                updateSec();
              }, 1000);

              minInterval = setInterval(() => {
                updateMin();
              }, 60000);
            }
          }
        });
      } else {
        cell.addEventListener("click", () => {
          if (cell.innerHTML === "") {
            cell.classList.add("open");

            const bombImg: HTMLImageElement = document.createElement("img");
            bombImg.src = "./assets/images/bomb-solid.svg";
            bombImg.alt = "Bomb";
            bombImg.style.height = "80%";
            bombImg.style.width = "80%";
            cell.appendChild(bombImg);

            banner("GAME OVER");

            clearInterval(minInterval);
            clearInterval(secInterval);
          }
        });
      }
    }
  }
}

function updateMin() {
  const min: HTMLSpanElement = document.getElementById(
    "min"
  ) as HTMLSpanElement;
  min.innerHTML = "";
  currentTime[1]++;

  if (currentTime[1] < 10) {
    min.append("0");
  }

  min.append(currentTime[1].toString());
}

function updateSec() {
  const sec: HTMLSpanElement = document.getElementById(
    "sec"
  ) as HTMLSpanElement;
  sec.innerHTML = "";
  currentTime[0]++;

  if (currentTime[0] % 60 < 10) {
    sec.append("0");
  }

  sec.append((currentTime[0] % 60).toString());
}

function banner(text: string) {
  const container: HTMLDivElement = document.createElement("div");
  container.classList.add("banner-container");
  document.getElementById("game-wrapper").appendChild(container);

  const banner: HTMLDivElement = document.createElement("div");
  banner.classList.add("banner");
  banner.innerHTML = text;
  container.appendChild(banner);

  const restartButton: HTMLButtonElement = document.createElement("button");
  restartButton.classList.add("restart");
  container.appendChild(restartButton);

  const restartImg: HTMLImageElement = document.createElement("img");
  restartImg.classList.add("restart-img");
  restartImg.src = "./assets/images/arrow-rotate-left-solid.svg";
  restartImg.alt = "Restart";
  restartImg.style.width = "50px";
  restartImg.style.height = "50px";
  restartButton.appendChild(restartImg);

  restartButton.addEventListener("click", () => {
    document.location.reload();
  });
}

renderPage();
