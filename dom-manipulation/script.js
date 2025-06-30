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

window.onload = function () {
  const storedQuotes = localStorage.getItem("quotes");
  const storedFilter = localStorage.getItem("selectedCategory");

  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [
      { text: "The journey of a thousand miles begins with one step.", category: "inspiration" },
      { text: "Life is what happens when you're busy making other plans.", category: "life" },
      { text: "Concentrate the mind on the present moment.", category: "mindfulness" }
    ];
    saveQuotes();
  }

  populateCategories();
  document.getElementById("categoryFilter").value = storedFilter || "all";
  filterQuotes();

  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    document.getElementById("filteredQuotes").textContent = lastQuote;
  }
};

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function getUniqueCategories() {
  return [...new Set(quotes.map(q => q.category.toLowerCase()))];
}

function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const options = getUniqueCategories();
  select.innerHTML = '<option value="all">All Categories</option>';
  options.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    select.appendChild(opt);
  });
}

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);

  const filtered = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selectedCategory);

  const container = document.getElementById("filteredQuotes");
  container.innerHTML = "";

  if (filtered.length === 0) {
    container.textContent = "No quotes found in this category.";
    return;
  }

  filtered.forEach(q => {
    const p = document.createElement("p");
    p.textContent = `"${q.text}" - (${q.category})`;
    container.appendChild(p);
  });
}

function showRandomQuote() {
  const currentCategory = document.getElementById("categoryFilter").value;
  const filteredQuotes = currentCategory === "all"
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === currentCategory);

  const quoteDisplay = document.getElementById("filteredQuotes");

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes found.";
    return;
  }

  const quote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  const text = `"${quote.text}" - (${quote.category})`;
  quoteDisplay.textContent = text;

  sessionStorage.setItem("lastQuote", text);
}

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim().toLowerCase();

  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  filterQuotes();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("Quote added successfully!");
}

function exportToJson() {
  const data = JSON.stringify(quotes, null, 2);
  const blob = new Blob([data], { type: "application/json" });
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
      if (!Array.isArray(importedQuotes)) throw new Error("Invalid format");

      importedQuotes.forEach(q => {
        if (q.text && q.category) {
          quotes.push({ text: q.text, category: q.category.toLowerCase() });
        }
      });

      saveQuotes();
      populateCategories();
      filterQuotes();
      alert("Quotes imported successfully!");
    } catch (err) {
      alert("Failed to import: " + err.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock API endpoint

// Sync interval (30 seconds)
setInterval(syncWithServer, 30000);
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const serverQuotes = await response.json();

    if (!Array.isArray(serverQuotes)) throw new Error("Invalid data format from server");

    return serverQuotes;
  } catch (error) {
    console.error("Error fetching quotes from server:", error);
    return []; // return empty array on failure
  }
}

// Sync function
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  let updated = false;

  serverQuotes.forEach(serverQuote => {
    const existsLocally = quotes.some(
      q => q.text === serverQuote.text && q.category === serverQuote.category
    );

    if (!existsLocally) {
      quotes.push(serverQuote);
      updated = true;
    }
  });

  if (updated) {
    saveQuotes();
    populateCategories();
    filterQuotes();
    notifyUser("Quotes synced from mock server. Server data has been prioritized.");
  }
}



// Optional: Send local quotes to server (if needed for 2-way sync)
async function pushLocalQuotesToServer() {
  for (const quote of quotes) {
    await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote)
    });
  }
}

// Notification banner
function notifyUser(message) {
  const notif = document.createElement("div");
  notif.textContent = message;
  notif.style.cssText = `
    background: #fffae6;
    color: #333;
    border: 1px solid #ffc107;
    padding: 10px;
    margin: 10px 0;
  `;
  document.body.insertBefore(notif, document.body.firstChild);

  setTimeout(() => notif.remove(), 5000);
}

