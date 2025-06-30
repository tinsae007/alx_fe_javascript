// Initial quotes
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Believe you can and you're halfway there.", category: "Motivation" },
  { text: "Do or do not. There is no try.", category: "Wisdom" }
];

let lastCategory = localStorage.getItem("lastCategory") || "all";
document.getElementById("categoryFilter").value = lastCategory;

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show a random quote
function showRandomQuote() {
  const category = document.getElementById("categoryFilter").value;
  const filtered = (category === "all") ? quotes : quotes.filter(q => q.category === category);

  if (filtered.length === 0) {
    document.getElementById("quoteDisplay").innerText = "No quotes in this category.";
    return;
  }

  const randomQuote = filtered[Math.floor(Math.random() * filtered.length)];
  document.getElementById("quoteDisplay").innerText = `"${randomQuote.text}" — ${randomQuote.category}`;
  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}

// Add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) return alert("Please fill in both fields.");

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  showNotification("Quote added successfully.");
}

// Populate categories dynamically
function populateCategories() {
  const dropdown = document.getElementById("categoryFilter");
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];

  dropdown.innerHTML = `<option value="all">All Categories</option>`;
  uniqueCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.innerText = cat;
    dropdown.appendChild(option);
  });

  dropdown.value = lastCategory;
}

// Filter and update quotes
function filterQuotes() {
  const category = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastCategory", category);
  lastCategory = category;
  showRandomQuote();
}

// Export to JSON
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import from JSON
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        showNotification("Quotes imported successfully.");
      } else {
        showNotification("Invalid JSON format.", true);
      }
    } catch (err) {
      showNotification("Error parsing JSON file.", true);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Show notifications
function showNotification(message, isError = false) {
  const notification = document.getElementById("notification");
  notification.innerText = message;
  notification.style.backgroundColor = isError ? "#f8d7da" : "#e3f2fd";
  notification.style.color = isError ? "#721c24" : "#0d47a1";
  notification.style.display = "block";
  setTimeout(() => {
    notification.style.display = "none";
  }, 4000);
}

// 🟡 Sync Section

// Fetch mock data from server
function fetchQuotesFromServer() {
  return fetch("https://jsonplaceholder.typicode.com/posts")
    .then(res => res.json())
    .then(data => {
      // Simulate quote from server
      const newQuote = {
        text: `Server quote ${new Date().toLocaleTimeString()}`,
        category: "Server"
      };
      return [newQuote];
    });
}

// Post data to server (mock)
function postQuoteToServer(quote) {
  return fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify(quote),
    headers: { "Content-type": "application/json; charset=UTF-8" }
  }).then(res => res.json());
}

// Sync quotes with mock server
function syncQuotes() {
  fetchQuotesFromServer().then(serverQuotes => {
    let updated = false;
    serverQuotes.forEach(serverQuote => {
      const exists = quotes.some(localQuote => localQuote.text === serverQuote.text);
      if (!exists) {
        quotes.push(serverQuote); // Conflict resolution: Server wins
        updated = true;
      }
    });

    if (updated) {
      saveQuotes();
      populateCategories();
      showNotification("New quotes synced from server.");
    }
  });
}

// Periodically sync every 30s
setInterval(syncQuotes, 30000);

// On page load
populateCategories();
showRandomQuote();
