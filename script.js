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
  // Updated for 2026 with more reliable APIs
  const API_URLS = [
    "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json",  // Primary: Most comprehensive (200+)
    "https://api.frankfurter.app/currencies",  // Secondary: Reliable but fewer (170+)
    "https://open.er-api.com/v6/latest/USD"    // Tertiary: Alternative rate source
  ];

  // Cache for currency data to reduce API calls
  let currencyCache = {
    data: null,
    timestamp: null,
    expiry: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
  };

  // Supported cryptocurrencies in 2026 (added as stable options)
  const CRYPTO_CURRENCIES = [
    { code: "BTC", name: "Bitcoin" },
    { code: "ETH", name: "Ethereum" },
    { code: "USDT", name: "Tether" },
    { code: "XRP", name: "Ripple" },
    { code: "ADA", name: "Cardano" },
    { code: "SOL", name: "Solana" }
  ];

  /**
   * Updates the currency counter display
   * @param {number} count - Number of currencies loaded
   */
  function updateCurrencyCounter(count) {
    const counterElement = document.getElementById("currencyCounter");
    if (counterElement) {
      counterElement.textContent = `Supports ${count} currencies`;
    }
    console.log(`🌍 Currency Converter 2026: Loaded ${count} currencies`);
  }

  /**
   * Checks if cached currency data is still valid
   * @returns {boolean} - True if cache is valid
   */
  function isCacheValid() {
    if (!currencyCache.data || !currencyCache.timestamp) return false;
    const now = Date.now();
    return (now - currencyCache.timestamp) < currencyCache.expiry;
  }

  /**
   * Loads available currencies from API with caching
   * Tries multiple APIs in case one fails
   */
  async function loadCurrencies() {
    // Check cache first
    if (isCacheValid()) {
      console.log("📦 Using cached currency data");
      populateDropdowns(currencyCache.data.currencies, currencyCache.data.names);
      updateCurrencyCounter(currencyCache.data.currencies.length);
      return;
    }

    let currencies = null;
    let currencyNames = {};
    let lastError = null;
    let apiSource = "";

    // Try each API endpoint until one succeeds
    for (const url of API_URLS) {
      try {
        console.log(`🔄 Attempting to fetch from: ${url}`);
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'CurrencyConverter2026/1.0'
          }
        });
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        
        // Handle different API response formats
        if (url.includes('fawazahmed0')) {
          // Format: { "usd": "United States Dollar", "eur": "Euro", ... }
          const entries = Object.entries(data);
          currencies = entries.map(([code, name]) => code.toUpperCase());
          entries.forEach(([code, name]) => {
            currencyNames[code.toUpperCase()] = name;
          });
          apiSource = "fawazahmed0";
          
        } else if (url.includes('frankfurter')) {
          // Format: { "USD": "United States Dollar", "EUR": "Euro", ... }
          currencies = Object.keys(data);
          currencyNames = data;
          apiSource = "Frankfurter";
          
        } else if (url.includes('er-api')) {
          // Format: { "rates": { "USD": 1, "EUR": 0.85, ... }, "base": "USD" }
          currencies = Object.keys(data.rates);
          currencies.forEach(code => {
            // Generate display names from codes (could be improved)
            const name = code.length === 3 ? 
              `${code} Currency` : 
              `Digital: ${code}`;
            currencyNames[code] = name;
          });
          apiSource = "ExchangeRate-API";
        }

        if (currencies && currencies.length > 0) {
          console.log(`✅ Successfully loaded ${currencies.length} currencies from ${apiSource}`);
          
          // Add popular cryptocurrencies (2026 update)
          CRYPTO_CURRENCIES.forEach(crypto => {
            if (!currencies.includes(crypto.code)) {
              currencies.push(crypto.code);
              currencyNames[crypto.code] = `Crypto: ${crypto.name}`;
            }
          });

          // Cache the data
          currencyCache = {
            data: { currencies, names: currencyNames },
            timestamp: Date.now(),
            expiry: 24 * 60 * 60 * 1000
          };

          // Save to localStorage for offline fallback
          try {
            localStorage.setItem('currencyCache2026', JSON.stringify(currencyCache));
            localStorage.setItem('lastCurrencyUpdate', new Date().toISOString());
          } catch (e) {
            console.warn("Could not save to localStorage:", e);
          }
          
          break; // Exit loop if successful
        }
        
      } catch (error) {
        console.error(`❌ Failed to load from ${url}:`, error.message);
        lastError = error;
        continue; // Try next API
      }
    }

    // If all APIs failed, try localStorage
    if (!currencies || currencies.length === 0) {
      console.log("🌐 No API connection, trying localStorage cache...");
      try {
        const cached = localStorage.getItem('currencyCache2026');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.data && parsed.data.currencies) {
            currencies = parsed.data.currencies;
            currencyNames = parsed.data.names;
            console.log(`📂 Loaded ${currencies.length} currencies from localStorage cache`);
          }
        }
      } catch (e) {
        console.error("Failed to load from localStorage:", e);
      }
    }

    // If still no currencies, use a hardcoded fallback list
    if (!currencies || currencies.length === 0) {
      console.log("⚠️ Using fallback currency list");
      currencies = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "INR", "BRL", "MXN"];
      currencyNames = {
        "USD": "United States Dollar",
        "EUR": "Euro",
        "GBP": "British Pound",
        "JPY": "Japanese Yen",
        "CAD": "Canadian Dollar",
        "AUD": "Australian Dollar",
        "CHF": "Swiss Franc",
        "CNY": "Chinese Yuan",
        "INR": "Indian Rupee",
        "BRL": "Brazilian Real",
        "MXN": "Mexican Peso"
      };
      
      // Add cryptocurrencies to fallback
      CRYPTO_CURRENCIES.forEach(crypto => {
        currencies.push(crypto.code);
        currencyNames[crypto.code] = `Crypto: ${crypto.name}`;
      });
    }

    // Populate dropdowns
    populateDropdowns(currencies, currencyNames);
    updateCurrencyCounter(currencies.length);
  }

  /**
   * Populates both dropdown menus with currencies
   * @param {Array} currencies - Array of currency codes
   * @param {Object} currencyNames - Object mapping codes to names
   */
  function populateDropdowns(currencies, currencyNames) {
    try {
      // Clear dropdowns
      fromSelect.innerHTML = '';
      toSelect.innerHTML = '';

      // Remove duplicates and sort alphabetically
      const uniqueCurrencies = [...new Set(currencies)]
        .filter(code => code && code.length >= 3) // Filter out invalid codes
        .sort((a, b) => {
          // Sort popular currencies first
          const popular = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD"];
          const aIndex = popular.indexOf(a);
          const bIndex = popular.indexOf(b);
          
          if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
          if (aIndex !== -1) return -1;
          if (bIndex !== -1) return 1;
          
          return a.localeCompare(b);
        });

      // Create option groups for better organization (2026 enhancement)
      const fiatGroup = document.createElement('optgroup');
      fiatGroup.label = 'Traditional Currencies';
      
      const cryptoGroup = document.createElement('optgroup');
      cryptoGroup.label = 'Cryptocurrencies (2026)';

      // Populate groups
      uniqueCurrencies.forEach(currency => {
        const isCrypto = CRYPTO_CURRENCIES.some(c => c.code === currency) || 
                        currencyNames[currency]?.includes('Crypto');
        
        const displayName = currencyNames[currency] 
          ? `${currency} - ${currencyNames[currency]}`
          : currency;
        
        const option = new Option(displayName, currency);
        
        if (isCrypto) {
          option.style.fontWeight = 'bold';
          cryptoGroup.appendChild(option);
        } else {
          fiatGroup.appendChild(option);
        }
      });

      // Add groups to dropdowns
      fromSelect.appendChild(fiatGroup.cloneNode(true));
      fromSelect.appendChild(cryptoGroup.cloneNode(true));
      
      toSelect.appendChild(fiatGroup);
      toSelect.appendChild(cryptoGroup.cloneNode(true));

      // Set smart defaults based on likely location (2026 enhancement)
      setSmartDefaults();

      // Clear any previous errors
      errorDiv.textContent = "";
      
    } catch (error) {
      console.error("Error populating dropdowns:", error);
      errorDiv.textContent = "Failed to initialize converter. Please refresh the page.";
    }
  }

  /**
   * Sets smart default currency selections based on user location
   */
  function setSmartDefaults() {
    try {
      // Try to get user's country from browser
      const userLocale = navigator.language || 'en-US';
      const countryCode = userLocale.split('-')[1];
      
      // Default mappings (2026 updated)
      const countryCurrencyMap = {
        'US': 'USD',
        'GB': 'GBP',
        'EU': 'EUR',
        'DE': 'EUR',
        'FR': 'EUR',
        'IT': 'EUR',
        'ES': 'EUR',
        'JP': 'JPY',
        'CA': 'CAD',
        'AU': 'AUD',
        'IN': 'INR',
        'CN': 'CNY',
        'BR': 'BRL',
        'MX': 'MXN'
      };

      const defaultFrom = countryCurrencyMap[countryCode] || 'USD';
      
      // Set "from" currency
      if (fromSelect.querySelector(`option[value="${defaultFrom}"]`)) {
        fromSelect.value = defaultFrom;
      } else {
        fromSelect.value = "USD";
      }

      // Set "to" currency (most traded against user's currency)
      const toCurrencyMap = {
        'USD': 'EUR',
        'EUR': 'USD',
        'GBP': 'EUR',
        'JPY': 'USD',
        'CAD': 'USD',
        'AUD': 'USD',
        'CNY': 'USD',
        'INR': 'USD'
      };

      const defaultTo = toCurrencyMap[defaultFrom] || 
                       (defaultFrom === 'USD' ? 'EUR' : 'USD');
      
      if (toSelect.querySelector(`option[value="${defaultTo}"]`)) {
        toSelect.value = defaultTo;
      } else {
        toSelect.value = defaultFrom === 'USD' ? 'EUR' : 'USD';
      }

    } catch (error) {
      console.warn("Could not set smart defaults:", error);
      // Fallback to standard defaults
      fromSelect.value = "USD";
      toSelect.value = "EUR";
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
      amountInput.focus();
      return;
    }
    if (amount <= 0) {
      errorDiv.textContent = "Amount must be greater than zero.";
      amountInput.focus();
      return;
    }
    if (amount > 1000000000) { // 1 billion limit
      errorDiv.textContent = "Amount is too large for conversion.";
      amountInput.focus();
      return;
    }

    // Check if converting to same currency
    if (fromCurrency === toCurrency) {
      resultDiv.textContent = `${amount} ${fromCurrency} = ${amount.toFixed(2)} ${toCurrency} (Same currency)`;
      resultDiv.style.color = '#666';
      return;
    }

    try {
      // Show loading state with animation
      resultDiv.innerHTML = `<span class="loading">Converting... <span class="spinner"></span></span>`;
      resultDiv.style.color = '#333';

      // 2026: Try multiple exchange rate APIs for best accuracy
      const conversionAPIs = [
        `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`,
        `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromCurrency.toLowerCase()}.json`,
        `https://open.er-api.com/v6/latest/${fromCurrency}`
      ];

      let conversionResult = null;
      let conversionSource = "";

      for (const apiUrl of conversionAPIs) {
        try {
          const response = await fetch(apiUrl, { 
            signal: AbortSignal.timeout(5000) // 5 second timeout
          });
          
          if (!response.ok) continue;
          
          const data = await response.json();
          
          if (apiUrl.includes('frankfurter')) {
            conversionResult = data.rates?.[toCurrency];
            conversionSource = "Frankfurter.app";
          } else if (apiUrl.includes('fawazahmed0')) {
            conversionResult = data[fromCurrency.toLowerCase()]?.[toCurrency.toLowerCase()];
            if (conversionResult) conversionResult *= amount;
            conversionSource = "Currency-API.com";
          } else if (apiUrl.includes('er-api')) {
            conversionResult = data.rates?.[toCurrency] * amount;
            conversionSource = "ExchangeRate-API.com";
          }
          
          if (conversionResult) break;
          
        } catch (apiError) {
          console.log(`API ${apiUrl} failed:`, apiError.message);
          continue;
        }
      }

      // If no API worked, use fallback calculation
      if (!conversionResult) {
        throw new Error("All conversion APIs failed");
      }

      // Display result with source attribution
      const formattedResult = conversionResult.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6
      });
      
      const formattedAmount = amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      
      resultDiv.innerHTML = `
        <div class="result-main">
          ${formattedAmount} ${fromCurrency} = 
          <strong>${formattedResult} ${toCurrency}</strong>
        </div>
        <div class="result-source">
          Rate source: ${conversionSource} • Updated: ${new Date().toLocaleTimeString()}
        </div>
      `;
      
      // Add to conversion history (2026 feature)
      saveToHistory({
        from: fromCurrency,
        to: toCurrency,
        amount: amount,
        result: conversionResult,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error("Conversion error:", error);
      
      // User-friendly error messages for 2026
      if (error.name === 'AbortError' || error.message.includes('timeout')) {
        errorDiv.textContent = "Request timed out. Please try again.";
      } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorDiv.textContent = "Network error. Please check your internet connection.";
      } else if (error.message.includes('All conversion APIs failed')) {
        errorDiv.textContent = "Service temporarily unavailable. Please try again in a moment.";
      } else {
        errorDiv.textContent = `Conversion failed: ${error.message}`;
      }
      
      // Show last successful conversion if available
      const lastConversion = getLastConversion();
      if (lastConversion) {
        resultDiv.innerHTML = `
          <div style="color: #666; font-size: 0.9em;">
            <strong>Offline Estimate:</strong><br>
            ${amount} ${fromCurrency} ≈ ${(amount * lastConversion.rate).toFixed(2)} ${toCurrency}<br>
            <em>(Based on last conversion rate: 1 ${lastConversion.from} = ${lastConversion.rate} ${lastConversion.to})</em>
          </div>
        `;
      }
    }
  }

  /**
   * Saves conversion to history (localStorage)
   * @param {Object} conversion - Conversion data
   */
  function saveToHistory(conversion) {
    try {
      const history = JSON.parse(localStorage.getItem('conversionHistory2026') || '[]');
      history.unshift(conversion); // Add to beginning
      
      // Keep only last 50 conversions
      if (history.length > 50) {
        history.pop();
      }
      
      localStorage.setItem('conversionHistory2026', JSON.stringify(history));
      localStorage.setItem('lastConversionRate', JSON.stringify({
        from: conversion.from,
        to: conversion.to,
        rate: conversion.result / conversion.amount,
        timestamp: conversion.timestamp
      }));
    } catch (e) {
      console.warn("Could not save to history:", e);
    }
  }

  /**
   * Gets the last successful conversion for offline estimates
   * @returns {Object|null} Last conversion data
   */
  function getLastConversion() {
    try {
      return JSON.parse(localStorage.getItem('lastConversionRate'));
    } catch (e) {
      return null;
    }
  }

  /**
   * Event listener for currency switch button
   */
  switchBtn.addEventListener("click", () => {
    try {
      // Swap selected currencies
      [fromSelect.value, toSelect.value] = [toSelect.value, fromSelect.value];
      
      // Trigger conversion if there's an amount
      if (amountInput.value && !isNaN(parseFloat(amountInput.value))) {
        convertCurrency();
      }
      
      errorDiv.textContent = ""; // Clear errors on swap
    } catch (error) {
      console.error("Error switching currencies:", error);
    }
  });

  /**
   * Form submission handler
   */
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent page reload
    convertCurrency();
  });

  /**
   * Real-time conversion as user types (2026 enhancement)
   */
  let convertTimeout;
  amountInput.addEventListener("input", () => {
    clearTimeout(convertTimeout);
    
    const amount = parseFloat(amountInput.value);
    if (amount && amount > 0 && amount <= 1000000000) {
      convertTimeout = setTimeout(convertCurrency, 500); // Debounce 500ms
    }
  });

  /**
   * Keyboard shortcuts (2026 enhancement)
   */
  document.addEventListener("keydown", (e) => {
    // Ctrl/Cmd + Enter to convert
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      convertCurrency();
    }
    // Ctrl/Cmd + S to swap
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      switchBtn.click();
    }
    // Ctrl/Cmd + L to clear
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
      e.preventDefault();
      amountInput.value = '';
      resultDiv.textContent = '';
      errorDiv.textContent = '';
      amountInput.focus();
    }
  });

  // Initialize the converter when page loads
  console.log("🚀 Currency Converter 2026 v2.0 Initializing...");
  loadCurrencies();
  
  // Display initial message
  resultDiv.textContent = "Enter an amount to convert currencies";
  resultDiv.style.color = '#666';
});
