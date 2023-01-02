import bot from "../assets/bot.svg";
import user from "../assets/user.svg";

const form: HTMLFormElement = document.querySelector("form");
const chatContainer: HTMLDivElement = document.querySelector("#chat_container");

let loadInterval;

function loader(element: HTMLElement): void {
  element.textContent = "";

  loadInterval = setInterval(() => {
    element.textContent += ".";

    if (element.textContent === "....") {
      element.textContent = "";
    }
  }, 300);
}

function typeText(element: HTMLElement, text: string): void {
  let index = 0;
  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      ++index;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

function generateUniqueId(): string {
  const timeStamp = Date.now();
  const randomNumber = Math.random();
  const hexaDecimalString = randomNumber.toString(16);

  return `id-${timeStamp}-${hexaDecimalString}`;
}

function chatStripe(isAi: boolean, value: string, uniqueId: string) {
  return `
    <div class="wrapper ${isAi && "ai"}" >
      <div class="chat">
        <div className="profile">
          <img src="${isAi ? bot : user}" alt="${isAi ? bot : user}"/>
        </div>
        <div id=${uniqueId} class="message">
          ${value}
        </div>
      </div>
    </div>
  `;
}
