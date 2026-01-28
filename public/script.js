const submitBtn = document.getElementById('submitBtn');
const contentInput = document.getElementById('content');
const ttlInput = document.getElementById('ttl');
const viewsInput = document.getElementById('views');
const resultDiv = document.getElementById('result');
const shareUrlInput = document.getElementById('shareUrl');
const copyBtn = document.getElementById('copyBtn');

submitBtn.addEventListener('click', async () => {
    const content = contentInput.value;
    const ttl_seconds = ttlInput.value;
    const max_views = viewsInput.value;

    if (!content.trim()) {
        alert("Please enter some text!");
        return;
    }

    const payload = { content };
    if (ttl_seconds) payload.ttl_seconds = parseInt(ttl_seconds);
    if (max_views) payload.max_views = parseInt(max_views);

    try {
        const response = await fetch('/api/pastes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            shareUrlInput.value = data.url;
            resultDiv.classList.remove('hidden');
        } else {
            alert("Error: " + data.error);
        }
    } catch (error) {
        console.error("Submission failed:", error);
        alert("Could not connect to the server.");
    }
});

copyBtn.addEventListener('click', () => {
    shareUrlInput.select();
    document.execCommand('copy');
    alert("URL copied to clipboard!");
});