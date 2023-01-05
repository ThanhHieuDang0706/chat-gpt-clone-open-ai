import bot from "../assets/bot.svg";
import user from "../assets/user.svg";

const form: HTMLFormElement = document.querySelector("form") as HTMLFormElement;
const chatContainer: HTMLDivElement = document.querySelector(
  "#chat_container"
) as HTMLDivElement;

let loadInterval: number;

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
  }, 5);
}

function generateUniqueId(): string {
  const timeStamp = Date.now();
  const randomNumber = Math.random();
  const hexaDecimalString = randomNumber.toString(16);

  return `id-${timeStamp}-${hexaDecimalString}`;
}

function chatStripe(isAi: boolean, value: string, uniqueId: string): string {
  return `
    <div class="wrapper ${isAi && "ai"}">
      <div class="chat">
        <div class="profile">
          <img 
            src=${isAi ? bot : user} 
            alt="${isAi ? "bot" : "user"}" 
          />
        </div>
        <div class="message" id=${uniqueId}>${value}</div>
      </div>
    </div>
    `;
}

async function handleSubmit(e: Event): Promise<void> {
  e.preventDefault();

  // get the form data
  const data = new FormData(form);

  // user's message
  const formData = data.get("prompt") as string;
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(false, formData, uniqueId);

  form.reset();

  // bot's message
  const uniqueBotId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, "", uniqueBotId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueBotId) as HTMLElement;
  loader(messageDiv);

  // fetch data
  const response = await fetch("https://open-ai-chat-ifvq.onrender.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt: data.get("prompt") as string }),
  });

  clearInterval(loadInterval);
  messageDiv.innerHTML = "";

  if (response.ok) {
    const data: { bot: string } = await response.json();
    const parsedData = data.bot.trim();
    typeText(messageDiv, parsedData);
  } else {
    const err = await response.text();
    messageDiv.innerHTML = "Something went wrong!!";
    alert(err);
  }
}

// add event listener
form.addEventListener("submit", handleSubmit);
form.addEventListener("keypress", (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    handleSubmit(e);
  }
});
