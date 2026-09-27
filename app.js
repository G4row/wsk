const imageInput = document.getElementById('imageInput');
const processBtn = document.getElementById('processBtn');
const statusDiv = document.getElementById('status');
const resultText = document.getElementById('resultText');

imageInput.addEventListener('change', () => {
  if (imageInput.files.length > 0) {
    processBtn.disabled = false;
  }
});

async function processImage() {
  const file = imageInput.files[0];
  if (!file) return;

  statusDiv.innerText = "Čitanje slike u tijeku (ovo može potrajati par sekundi)...";
  processBtn.disabled = true;

  try {
    // Tesseract.js prepoznaje tekst sa slike
    const worker = await Tesseract.createWorker('eng'); // Možeš dodati i 'hrv' po potrebi
    const ret = await worker.recognize(file);
    await worker.terminate();

    // Razdvajanje po linijama i čišćenje praznina
    const lines = ret.data.text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    // Spajanje svih pronađenih kodova/tekstova zarezom
    const formattedResult = lines.join(', ');
    resultText.value = formattedResult;

    statusDiv.innerText = "Obrada završena!";
    generateQR(); // Automatski generiraj QR kod nakon obrade
  } catch (err) {
    console.error(err);
    statusDiv.innerText = "Greška prilikom obrade slike.";
  } finally {
    processBtn.disabled = false;
  }
}

function generateQR() {
  const qrContainer = document.getElementById('qrcode');
  qrContainer.innerHTML = ''; // Očisti prethodni QR kod

  const text = resultText.value.trim();
  if (!text) {
    alert("Nema teksta za generiranje QR koda!");
    return;
  }

  // Generiranje QR koda (širina i visina po potrebi)
  new QRCode(qrContainer, {
    text: text,
    width: 256,
    height: 256,
    correctLevel: QRCode.CorrectLevel.M
  });
}