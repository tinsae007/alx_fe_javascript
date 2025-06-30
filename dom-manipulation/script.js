// -----------------------------
// Quotes Array
// -----------------------------
let quotes = [
  { text: "Success is not final, failure is not fatal.", category: "Motivation" },
  { text: "Simplicity is the ultimate sophistication.", category: "Philosophy" },
];

// -----------------------------
// Function: Display Random Quote
// -----------------------------
function showRandomQuote () {
  const quoteDisplay = document.getElementById("quoteDisplay");

  if (!quotes.length) {
    quoteDisplay.textContent = "No quotes available."; // <-- textContent used, NOT innerHTML
    return;
  }

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  quoteDisplay.textContent = `"${randomQuote.text}" — ${randomQuote.category}`; // <-- textContent again
}



// -----------------------------
// Function: Add Quote Dynamically
// -----------------------------
function createAddQuoteForm() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Please fill in both quote and category.");
    return;
  }

  quotes.push({ text, category });

  textInput.value = "";
  categoryInput.value = "";

  alert("New quote added!");
}

// -----------------------------
// Setup Event Listener on Page Load
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  const showBtn = document.getElementById("newQuote");
  if (showBtn) {
    showBtn.addEventListener("click", displayRandomQuote);
  }
});
