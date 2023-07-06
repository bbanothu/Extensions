let currentMessageIndex = 0;
let messages = [{title: '', content: ''}];

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
    chrome.storage.sync.set({"savedMessages": messages});
});

document.getElementById('paste').addEventListener('click', () => {
    const textArea = document.createElement('textarea');
    textArea.value = messages[currentMessageIndex].content;
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
    if (currentMessageIndex < messages.length - 1) {
        currentMessageIndex++;
    } else {
        messages.push({title: '', content: ''});
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
        messages[0] = {title: '', content: ''};
    }
    updateUI();
    chrome.storage.sync.set({"savedMessages": messages});
});

document.addEventListener('keydown', function(event) {
    // Check if Ctrl or Command is pressed along with C
    if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
        const messageTextArea = document.getElementById('message');
        // Copy the content of the text area to clipboard
        navigator.clipboard.writeText(messageTextArea.value);
    }
});


function updateUI() {
    const currentMessage = messages[currentMessageIndex];
    document.getElementById('title').value = currentMessage && currentMessage.title ? currentMessage.title : '';
    document.getElementById('message').value = currentMessage && currentMessage.content ? currentMessage.content : '';
    document.getElementById('indexDisplay').innerText = `${currentMessageIndex + 1}/${messages.length}`;
    document.getElementById('back').disabled = currentMessageIndex === 0;
    document.getElementById('delete').disabled = messages.length === 0;
    document.getElementById('forward').disabled = false;
}

