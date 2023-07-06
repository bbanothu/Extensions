let currentMessageIndex = 0;
const maxMessages = 10;
let messages = new Array(maxMessages).fill('');

chrome.storage.sync.get("savedMessages", (items) => {
  if (items.savedMessages) {
    messages = items.savedMessages;
  }
  updateUI();
});

document.getElementById('save').addEventListener('click', () => {
  messages[currentMessageIndex] = document.getElementById('message').value;
  chrome.storage.sync.set({"savedMessages": messages});
});

document.getElementById('paste').addEventListener('click', () => {
  const textArea = document.createElement('textarea');
  textArea.value = messages[currentMessageIndex];
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
});

document.getElementById('back').addEventListener('click', () => {
  if (currentMessageIndex > 0) {
    currentMessageIndex--;
    updateUI();
  }
});

document.getElementById('forward').addEventListener('click', () => {
  if (currentMessageIndex < maxMessages - 1) {
    currentMessageIndex++;
    updateUI();
  }
});

function updateUI() {
  document.getElementById('message').value = messages[currentMessageIndex];
  document.getElementById('indexDisplay').innerText = `${currentMessageIndex + 1}/${maxMessages}`;
  document.getElementById('back').disabled = currentMessageIndex === 0;
  document.getElementById('forward').disabled = currentMessageIndex === maxMessages - 1;
}
