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
let quotes = [];

// Load quotes from localStorage on page load
window.onload = function () {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
    populateCategories();
  } else {
    // Default quotes
    quotes = [
      { text: "The journey of a thousand miles begins with one step.", category: "inspiration" },
      { text: "Life is what happens when you're busy making other plans.", category: "life" },
      { text: "Concentrate the mind on the present moment.", category: "mindfulness" }
    ];
    saveQuotes();
    populateCategories();
  }

  // Restore last quote from sessionStorage
  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    document.getElementById("quoteDisplay").textContent = lastQuote;
  }
};

function populateCategories() {
  const categorySelect = document.getElementById("categorySelect");
  const categories = [...new Set(quotes.map(q => q.category))];
  categorySelect.innerHTML = `<option value="all">All</option>`;
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    categorySelect.appendChild(option);
  });
}

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function showRandomQuote() {
  const selectedCategory = document.getElementById("categorySelect").value;
  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());

  const display = document.getElementById("quoteDisplay");

  if (filteredQuotes.length === 0) {
    display.textContent = "No quotes found for this category.";
    return;
  }

  const quote = getRandomItem(filteredQuotes);
  const text = `"${quote.text}" - (${quote.category})`;
  display.textContent = text;

  // Save last quote to sessionStorage
  sessionStorage.setItem("lastQuote", text);
}

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim().toLowerCase();

  if (!text || !category) {
    alert("Please enter both a quote and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("Quote added successfully!");
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function exportToJson() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        importedQuotes.forEach(q => {
          if (q.text && q.category) {
            quotes.push({ text: q.text, category: q.category.toLowerCase() });
          }
        });
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid file format.");
      }
    } catch (error) {
      alert("Error parsing JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

