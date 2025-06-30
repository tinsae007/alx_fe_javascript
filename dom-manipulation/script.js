let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Believe you can and you're halfway there.", category: "Motivation" },
  { text: "Do or do not. There is no try.", category: "Wisdom" },
];

let lastCategory = localStorage.getItem("lastCategory") || "all";
document.getElementById("categoryFilter").value = lastCategory;

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function showRandomQuote() {
  let category = document.getElementById("categoryFilter").value;
  let filtered = (category === "all") ? quotes : quotes.filter(q => q.category === category);
  if (filtered.length === 0) {
    document.getElementById("quoteDisplay").innerText = "No quotes in this category.";
    return;
  }
  const randomQuote = filtered[Math.floor(Math.random() * filtered.length)];
  document.getElementById("quoteDisplay").innerText = `"${randomQuote.text}" — ${randomQuote.category}`;
  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}

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
  alert("Quote added!");
}

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

function filterQuotes() {
  const category = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastCategory", category);
  lastCategory = category;
  showRandomQuote();
}

function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch (err) {
      alert("Failed to parse JSON.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// On page load
populateCategories();
showRandomQuote();
