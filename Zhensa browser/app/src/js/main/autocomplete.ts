// SPDX-License-Identifier: MIT

import { assertElement, http, listen, settings } from "../core/toolkit.ts";

const fetchResults = async (qInput: HTMLInputElement, query: string): Promise<void> => {
  try {
    let res: Response;

    if (settings.method === "GET") {
      res = await http("GET", `./autocompleter?q=${query}`);
    } else {
      res = await http("POST", "./autocompleter", { body: new URLSearchParams({ q: query }) });
    }

    const results = await res.json();

    const autocomplete = document.querySelector<HTMLElement>(".autocomplete");
    assertElement(autocomplete);

    const autocompleteList = document.querySelector<HTMLUListElement>(".autocomplete ul");
    assertElement(autocompleteList);

    autocomplete.classList.add("open");
    autocompleteList.replaceChildren();

    // show an error message that no result was found
    if (results?.[1]?.length === 0) {
      const noItemFoundMessage = Object.assign(document.createElement("li"), {
        className: "no-item-found",
        textContent: settings.translations?.no_item_found ?? "No results found"
      });
      autocompleteList.append(noItemFoundMessage);
      return;
    }

    const fragment = new DocumentFragment();

    for (const result of results[1]) {
      const li = Object.assign(document.createElement("li"), { textContent: result });

      listen("mousedown", li, () => {
        qInput.value = result;

        const form = document.querySelector<HTMLFormElement>("#search");
        form?.submit();

        autocomplete.classList.remove("open");
      });

      fragment.append(li);
    }

    autocompleteList.append(fragment);
  } catch (error) {
    console.error("Error fetching autocomplete results:", error);
  }
};

const qInput = document.getElementById("q") as HTMLInputElement | null;
assertElement(qInput);

let timeoutId: number;

// Search history and trending functionality
const searchHistory: string[] = [];
const MAX_HISTORY = 10;

const trendingSearches = [
  "artificial intelligence",
  "machine learning",
  "web development",
  "python programming",
  "data science",
  "cryptocurrency",
  "climate change",
  "electric vehicles",
  "remote work",
  "blockchain technology"
];

function saveSearchHistory(query: string) {
  if (!query.trim()) return;

  // Remove if already exists
  const index = searchHistory.indexOf(query);
  if (index > -1) {
    searchHistory.splice(index, 1);
  }

  // Add to beginning
  searchHistory.unshift(query);

  // Keep only max items
  if (searchHistory.length > MAX_HISTORY) {
    searchHistory.splice(MAX_HISTORY);
  }

  // Save to localStorage
  localStorage.setItem('zhensa_search_history', JSON.stringify(searchHistory));
}

function loadSearchHistory(): string[] {
  try {
    const stored = localStorage.getItem('zhensa_search_history');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function removeHistoryItem(index: number) {
  const history = loadSearchHistory();
  if (index >= 0 && index < history.length) {
    history.splice(index, 1);
    localStorage.setItem('zhensa_search_history', JSON.stringify(history));
    // Refresh the suggestions
    showSearchSuggestions();
  }
}

function clearAllHistory() {
  localStorage.removeItem('zhensa_search_history');
  searchHistory.length = 0;
  // Refresh the suggestions
  showSearchSuggestions();
}

function showSearchSuggestions() {
  const suggestionsDiv = document.querySelector('.search-suggestions') as HTMLElement;
  const historyList = document.getElementById('history-list') as HTMLUListElement;
  const trendingList = document.getElementById('trending-list') as HTMLUListElement;

  if (!suggestionsDiv || !historyList || !trendingList) return;

  // Clear existing content
  historyList.innerHTML = '';
  trendingList.innerHTML = '';

  // Load and display history
  const history = loadSearchHistory();
  if (history.length > 0) {
    history.forEach((query, index) => {
      const li = document.createElement('li');

      // Create text span
      const textSpan = document.createElement('span');
      textSpan.textContent = query;
      textSpan.className = 'history-text';

      // Create delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-history-item';
      deleteBtn.textContent = '×';
      deleteBtn.title = 'Remove from history';
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeHistoryItem(index);
      });

      li.appendChild(textSpan);
      li.appendChild(deleteBtn);

      li.addEventListener('click', () => {
        qInput!.value = query;
        saveSearchHistory(query);
        hideSearchSuggestions();
        const form = document.querySelector('#search') as HTMLFormElement;
        form?.submit();
      });
      historyList.appendChild(li);
    });
    suggestionsDiv.classList.add('show');
  }

  // Display trending searches
  trendingSearches.forEach(query => {
    const li = document.createElement('li');
    li.textContent = query;
    li.addEventListener('click', () => {
      qInput!.value = query;
      saveSearchHistory(query);
      hideSearchSuggestions();
      const form = document.querySelector('#search') as HTMLFormElement;
      form?.submit();
    });
    trendingList.appendChild(li);
  });

  if (history.length > 0 || trendingSearches.length > 0) {
    suggestionsDiv.classList.add('show');
  }
}

function hideSearchSuggestions() {
  const suggestionsDiv = document.querySelector('.search-suggestions') as HTMLElement;
  if (suggestionsDiv) {
    suggestionsDiv.classList.remove('show');
  }
}

// Initialize search history from localStorage
searchHistory.push(...loadSearchHistory());

// Focus/blur events for search suggestions
listen("focus", qInput, () => {
  if (qInput!.value.length === 0) {
    showSearchSuggestions();
  }
});

listen("blur", qInput, () => {
  // Delay hiding to allow click events on suggestions
  setTimeout(() => {
    hideSearchSuggestions();
  }, 150);
});

// Save search history when form is submitted
const searchForm = document.getElementById("search") as HTMLFormElement;
if (searchForm) {
  listen("submit", searchForm, () => {
    const query = qInput!.value.trim();
    if (query) {
      saveSearchHistory(query);
    }
  });
}

// Clear all history button
const clearHistoryBtn = document.getElementById("clear-history");
if (clearHistoryBtn) {
  listen("click", clearHistoryBtn, (e) => {
    e.preventDefault();
    e.stopPropagation();
    clearAllHistory();
  });
}

listen("input", qInput, () => {
  clearTimeout(timeoutId);

  const query = qInput.value;
  const minLength = settings.autocomplete_min ?? 2;

  if (query.length < minLength) {
    // Hide autocomplete when input is too short
    const autocomplete = document.querySelector<HTMLElement>(".autocomplete");
    if (autocomplete) {
      autocomplete.classList.remove("open");
    }
    // Show search suggestions when input is empty
    if (query.length === 0) {
      showSearchSuggestions();
    } else {
      hideSearchSuggestions();
    }
    return;
  }

  // Hide search suggestions when user starts typing
  hideSearchSuggestions();

  timeoutId = window.setTimeout(async () => {
    if (query === qInput.value) {
      await fetchResults(qInput, query);
    }
  }, 0);
});

const autocomplete: HTMLElement | null = document.querySelector<HTMLElement>(".autocomplete");
const autocompleteList: HTMLUListElement | null = document.querySelector<HTMLUListElement>(".autocomplete ul");
if (autocompleteList) {
  listen("keyup", qInput, (event: KeyboardEvent) => {
    const listItems = [...autocompleteList.children] as HTMLElement[];

    const currentIndex = listItems.findIndex((item) => item.classList.contains("active"));
    let newCurrentIndex = -1;

    switch (event.key) {
      case "ArrowUp": {
        const currentItem = listItems[currentIndex];
        if (currentItem && currentIndex >= 0) {
          currentItem.classList.remove("active");
        }
        // we need to add listItems.length to the index calculation here because the JavaScript modulos
        // operator doesn't work with negative numbers
        newCurrentIndex = (currentIndex - 1 + listItems.length) % listItems.length;
        break;
      }
      case "ArrowDown": {
        const currentItem = listItems[currentIndex];
        if (currentItem && currentIndex >= 0) {
          currentItem.classList.remove("active");
        }
        newCurrentIndex = (currentIndex + 1) % listItems.length;
        break;
      }
      case "Tab":
      case "Enter":
        if (autocomplete) {
          autocomplete.classList.remove("open");
        }
        break;
      default:
        break;
    }

    if (newCurrentIndex !== -1) {
      const selectedItem = listItems[newCurrentIndex];
      if (selectedItem) {
        selectedItem.classList.add("active");

        if (!selectedItem.classList.contains("no-item-found")) {
          const qInput = document.getElementById("q") as HTMLInputElement | null;
          if (qInput) {
            qInput.value = selectedItem.textContent ?? "";
          }
        }
      }
    }
  });
}
