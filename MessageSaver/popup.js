let currentMessageIndex = 0;
let messages = [{ title: '', content: '' }];

chrome.storage.sync.get("savedMessages", (items) => {
  if (items.savedMessages) {
    messages = items.savedMessages;
  }
  updateUI();
});

document.getElementById('save').addEventListener('click', () => {
  messages[currentMessageIndex] = {
    title: document.getElementById('title').value,
    content: document.getElementById('message').value
  };
  chrome.storage.sync.set({ "savedMessages": messages });
});

document.getElementById('copy').addEventListener('click', () => {
  const textArea = document.createElement('textarea');
  textArea.value = messages[currentMessageIndex].content;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
});


document.addEventListener("DOMContentLoaded", function() {
  var backBtn = document.getElementById("back");
  var forwardBtn = document.getElementById("forward");
  var textarea = document.getElementById("message");
  var input = document.getElementById("title");

  function disableNavigationButtons() {
    backBtn.disabled = true;
    forwardBtn.disabled = true;
  }

  function enableNavigationButtons() {
    backBtn.disabled = false;
    forwardBtn.disabled = false;
  }

  textarea.addEventListener("focus", disableNavigationButtons);
  textarea.addEventListener("blur", enableNavigationButtons);
  input.addEventListener("focus", disableNavigationButtons);
  input.addEventListener("blur", enableNavigationButtons);

  document.addEventListener('keydown', function (event) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
      const messageTextArea = document.getElementById('message');
      navigator.clipboard.writeText(messageTextArea.value);
    }
  });

  document.addEventListener('keydown', function (event) {
    switch (event.key) {
      case 'ArrowLeft':
        goBack();
        break;
      case 'ArrowRight':
        goForward();
        break;
      case 'ArrowDown':
        if (!isTextInputFocused()) {
          closeExtension();
        }
        break;
      default:
        break;
    }
  });
});

document.getElementById('back').addEventListener('click', () => {
  if (currentMessageIndex > 0) {
    currentMessageIndex--;
    updateUI();
  }
});

document.getElementById('forward').addEventListener('click', () => {
  if (currentMessageIndex < messages.length - 1) {
    currentMessageIndex++;
  } else {
    messages.push({ title: '', content: '' });
    currentMessageIndex++;
  }
  updateUI();
});

document.getElementById('delete').addEventListener('click', () => {
  if (messages.length > 1) {
    messages.splice(currentMessageIndex, 1);
    if (currentMessageIndex > 0) {
      currentMessageIndex--;
    }
  } else {
    messages[0] = { title: '', content: '' };
  }
  updateUI();
  chrome.storage.sync.set({ "savedMessages": messages });
});

function goBack() {
  var backButton = document.getElementById('back');
  if (!backButton.disabled) {
    backButton.click();
  }
}

function goForward() {
  var forwardButton = document.getElementById('forward');
  if (!forwardButton.disabled) {
    forwardButton.click();
  }
}

function closeExtension() {
  window.close();
}

function isTextInputFocused() {
  const activeElement = document.activeElement;
  return activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA');
}

function updateUI() {
    const currentMessage = messages[currentMessageIndex];
    document.getElementById('title').value = currentMessage && currentMessage.title ? currentMessage.title : '';
    document.getElementById('message').value = currentMessage && currentMessage.content ? currentMessage.content : '';
    document.getElementById('indexDisplay').innerText = `${currentMessageIndex + 1}/${messages.length}`;
    document.getElementById('back').disabled = currentMessageIndex === 0;
    document.getElementById('delete').disabled = messages.length === 0;
    document.getElementById('forward').disabled = false;
}

