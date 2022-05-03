let GAME_SIZE: 10 | 15 | 20 = 10;

function renderPage() {
  const pageWrapper: HTMLDivElement = document.createElement("div");
  pageWrapper.classList.add("page-wrapper");
  document.body.appendChild(pageWrapper);

  const gameWrapper: HTMLDivElement = document.createElement("div");
  gameWrapper.classList.add("game-wrapper");
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
  gameWrapper.appendChild(gameContent);

  for (let y = 0; y < GAME_SIZE; y++) {
    const gameRow: HTMLDivElement = document.createElement("div");
    gameRow.classList.add("game-row");
    gameContent.appendChild(gameRow);

    for (let x = 0; x < GAME_SIZE; x++) {
      const gameCell: HTMLDivElement = document.createElement("div");
      gameCell.classList.add("game-cell");
      gameCell.setAttribute("x", `${x}`);
      gameCell.setAttribute("y", `${y}`);
      gameRow.appendChild(gameCell);
    }
  }
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

renderPage();
