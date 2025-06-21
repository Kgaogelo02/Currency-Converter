// Wait for the DOM to be fully loaded before executing the script
document.addEventListener("DOMContentLoaded", () => {
  // Get all required DOM elements
  const fromSelect = document.getElementById("fromCurrency");  // "From" currency dropdown
  const toSelect = document.getElementById("toCurrency");      // "To" currency dropdown
  const amountInput = document.getElementById("amount");       // Amount input field
  const resultDiv = document.getElementById("result");         // Result display div
  const errorDiv = document.getElementById("error");           // Error message div
  const switchBtn = document.getElementById("switchBtn");      // Switch currencies button
  const form = document.getElementById("converterForm");       // Converter form

  // List of API endpoints to try (primary + fallback)
  const API_URLS = [
    "https://api.frankfurter.app/currencies",  // Primary API (no key needed)
    "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json"  // Fallback API
  ];

  /**
   * Loads available currencies from API and populates dropdowns
   * Tries multiple APIs in case one fails
   */
  async function loadCurrencies() {
    let currencies = null;
    let lastError = null;

    // Try each API endpoint until one succeeds
    for (const url of API_URLS) {
      try {
        // Fetch currency data from API
        const response = await fetch(url);
        
        // Check if response is successful (status 200-299)
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        
        // Handle different API response formats
        if (data.USD) {
          // Frankfurter.app format: { USD: "US Dollar", EUR: "Euro", ... }
          currencies = Object.keys(data);
        } else if (data.usd) {
          // fawazahmed0 format: { usd: { inr: 83.33 }, ... }
          currencies = Object.keys(data).map(c => c.toUpperCase());
        } else {
          throw new Error("API returned unexpected data format");
        }

        console.log("Successfully loaded currencies from:", url);
        break; // Exit loop if successful
        
      } catch (error) {
        console.error(`Failed to load from ${url}:`, error);
        lastError = error;
        continue; // Try next API
      }
    }

    // If all APIs failed
    if (!currencies) {
      const errorMessage = lastError 
        ? "Service temporarily unavailable. Please try again later." 
        : "Network error. Check your internet connection.";
      
      errorDiv.textContent = errorMessage;
      return;
    }

    // Populate both dropdown menus with currencies
    try {
      currencies.forEach(currency => {
        const option = new Option(currency, currency);
        fromSelect.add(option.cloneNode(true));
        toSelect.add(option);
      });

      // Set default selections (USD to EUR)
      fromSelect.value = "USD";
      toSelect.value = "EUR";
      errorDiv.textContent = ""; // Clear any previous errors
      
    } catch (error) {
      console.error("Error populating dropdowns:", error);
      errorDiv.textContent = "Failed to initialize converter. Please refresh the page.";
    }
  }

  /**
   * Converts currency using API and displays result
   */
  async function convertCurrency() {
    // Clear previous results and errors
    resultDiv.textContent = "";
    errorDiv.textContent = "";

    // Get user inputs
    const fromCurrency = fromSelect.value;
    const toCurrency = toSelect.value;
    const amount = parseFloat(amountInput.value);

    // Validate amount
    if (!amount || isNaN(amount)) {
      errorDiv.textContent = "Please enter a valid number.";
      return;
    }
    if (amount <= 0) {
      errorDiv.textContent = "Amount must be greater than zero.";
      return;
    }

    try {
      // Show loading state (optional)
      resultDiv.textContent = "Converting...";

      // Make API request
      const response = await fetch(
        `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
      );

      // Check for HTTP errors
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      // Validate API response
      if (!data.rates || !data.rates[toCurrency]) {
        throw new Error("API returned invalid conversion data");
      }

      // Calculate and display result
      const result = data.rates[toCurrency];
      resultDiv.textContent = `${amount} ${fromCurrency} = ${result.toFixed(2)} ${toCurrency}`;
      
    } catch (error) {
      console.error("Conversion error:", error);
      
      // User-friendly error messages
      if (error.message.includes("Failed to fetch")) {
        errorDiv.textContent = "Network error. Please check your connection and try again.";
      } else if (error.message.includes("status")) {
        errorDiv.textContent = "Service temporarily unavailable. Please try again later.";
      } else {
        errorDiv.textContent = "Conversion failed. Please try again with different currencies.";
      }
    }
  }

  // Event listener for currency switch button
  switchBtn.addEventListener("click", () => {
    try {
      // Swap selected currencies
      [fromSelect.value, toSelect.value] = [toSelect.value, fromSelect.value];
      errorDiv.textContent = ""; // Clear errors on swap
    } catch (error) {
      console.error("Error switching currencies:", error);
    }
  });

  // Form submission handler
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent page reload
    convertCurrency();
  });

  // Initialize the converter when page loads
  loadCurrencies();
});





