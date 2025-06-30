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
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim().toLowerCase();

  if (!quoteText || !quoteCategory) {
    alert("Please enter both quote and category.");
    return;
  }

  quotes.push({ text: quoteText, category: quoteCategory });

  // Add category to dropdown if it doesn't already exist
  if (![...categorySelect.options].some(option => option.value === quoteCategory)) {
    const newOption = document.createElement("option");
    newOption.value = quoteCategory;
    newOption.textContent = quoteCategory.charAt(0).toUpperCase() + quoteCategory.slice(1);
    categorySelect.appendChild(newOption);
  }
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
