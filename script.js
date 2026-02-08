/**
 * Professional Currency Converter Application
 * Version: 3.1 - Full 163+ Currency Support
 * Features: 163+ world currencies, cryptocurrencies, metals with real-time rates
 * Author: Mabutsi Kgaogelo
 */

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

const CONFIG = {
  // API endpoints with fallback support
  API_ENDPOINTS: {
    primary: 'https://api.frankfurter.app',
    fallback1: 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1',
    fallback2: 'https://open.er-api.com/v6/latest'
  },
  
  // Cache settings
  CACHE: {
    EXPIRY: 24 * 60 * 60 * 1000, // 24 hours
    KEY_PREFIX: 'currencyConverter_',
    CURRENCY_LIST_KEY: 'currencies',
    RATES_KEY: 'exchangeRates',
    HISTORY_KEY: 'conversionHistory'
  },
  
  // Request settings
  REQUEST: {
    TIMEOUT: 5000, // 5 seconds
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000 // 1 second
  },
  
  // UI settings
  UI: {
    DEBOUNCE_DELAY: 500,
    MAX_HISTORY_ITEMS: 50,
    ANIMATION_DURATION: 300
  },
  
  // Validation
  VALIDATION: {
    MIN_AMOUNT: 0.01,
    MAX_AMOUNT: 999999999,
    DECIMAL_PLACES: 2
  }
};

// ============================================================================
// COMPREHENSIVE CURRENCY DATABASE - 163+ CURRENCIES
// ============================================================================

const COMPREHENSIVE_CURRENCIES = {
  currencies: [
    'AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'ARS_PA', 'AUD', 'AWG',
    'AZN', 'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB',
    'BRL', 'BSD', 'BTC', 'BTN', 'BWP', 'BYN', 'BZD', 'CAD', 'CDF', 'CHF',
    'CLP', 'CNH', 'CNY', 'COP', 'CRC', 'CUP', 'CVE', 'CZK', 'DJF', 'DKK',
    'DOP', 'DZD', 'EGP', 'ERN', 'ETB', 'ETH', 'EUR', 'FJD', 'FKP', 'GBP',
    'GEL', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HTG',
    'HUF', 'IDR', 'ILS', 'INR', 'IQD', 'IRR', 'ISK', 'JMD', 'JOD', 'JPY',
    'KES', 'KGS', 'KHR', 'KMF', 'KPW', 'KRW', 'KWD', 'KYD', 'KZT', 'LAK',
    'LBP', 'LKR', 'LRD', 'LSL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK',
    'MNT', 'MOP', 'MRU', 'MUR', 'MVR', 'MWK', 'MXN', 'MYR', 'MZN', 'NAD',
    'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP',
    'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD',
    'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 'SLE', 'SLL', 'SOS', 'SRD', 'SSP',
    'STN', 'SVC', 'SYP', 'SZL', 'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRY',
    'TTD', 'TWD', 'TZS', 'UAH', 'UGX', 'USD', 'UYU', 'UZS', 'VES', 'VND',
    'VUV', 'WST', 'XAF', 'XAG', 'XAU', 'XCD', 'XCG', 'XDR', 'XOF', 'XPF',
    'YER', 'ZAR', 'ZMW', 'ZWG'
  ],
  
  names: {
    'AED': 'UAE Dirham', 'AFN': 'Afghani', 'ALL': 'Lek', 'AMD': 'Armenian Dram',
    'ANG': 'Netherlands Antillean Guilder', 'AOA': 'Kwanza', 'ARS': 'Argentine Peso',
    'ARS_PA': 'Argentine Peso (parallel \'Dollar Blue\')', 'AUD': 'Australian Dollar',
    'AWG': 'Aruban Florin', 'AZN': 'Azerbaijani Manat', 'BAM': 'Convertible Mark',
    'BBD': 'Barbados Dollar', 'BDT': 'Taka', 'BGN': 'Bulgarian Lev',
    'BHD': 'Bahraini Dinar', 'BIF': 'Burundian Franc', 'BMD': 'Bermudian Dollar',
    'BND': 'Brunei Dollar', 'BOB': 'Boliviano', 'BRL': 'Brazilian Real',
    'BSD': 'Bahamian Dollar', 'BTC': 'Bitcoin', 'BTN': 'Ngultrum',
    'BWP': 'Pula', 'BYN': 'Belarusian Ruble', 'BZD': 'Belize Dollar',
    'CAD': 'Canadian Dollar', 'CDF': 'Congolese Franc', 'CHF': 'Swiss Franc',
    'CLP': 'Chilean Peso', 'CNH': 'Yuan Renminbi (offshore)', 'CNY': 'Yuan Renminbi',
    'COP': 'Colombian Peso', 'CRC': 'Costa Rican Colon', 'CUP': 'Cuban Peso',
    'CVE': 'Cape Verde Escudo', 'CZK': 'Czech Koruna', 'DJF': 'Djiboutian Franc',
    'DKK': 'Danish Krone', 'DOP': 'Dominican Peso', 'DZD': 'Algerian Dinar',
    'EGP': 'Egyptian Pound', 'ERN': 'Nakfa', 'ETB': 'Ethiopian Birr',
    'ETH': 'Ethereum', 'EUR': 'Euro', 'FJD': 'Fiji Dollar',
    'FKP': 'Falkland Islands Pound', 'GBP': 'Pound Sterling', 'GEL': 'Lari',
    'GHS': 'Ghanaian Cedi', 'GIP': 'Gibraltar Pound', 'GMD': 'Dalasi',
    'GNF': 'Guinean Franc', 'GTQ': 'Quetzal', 'GYD': 'Guyanese Dollar',
    'HKD': 'Hong Kong Dollar', 'HNL': 'Lempira', 'HTG': 'Gourde',
    'HUF': 'Forint', 'IDR': 'Rupiah', 'ILS': 'Israeli Shekel',
    'INR': 'Indian Rupee', 'IQD': 'Iraqi Dinar', 'IRR': 'Iranian Rial',
    'ISK': 'Iceland Krona', 'JMD': 'Jamaican Dollar', 'JOD': 'Jordanian Dinar',
    'JPY': 'Japanese Yen', 'KES': 'Kenyan Shilling', 'KGS': 'Kyrgyzstani Som',
    'KHR': 'Cambodian Riel', 'KMF': 'Comorian Franc', 'KPW': 'North Korean Won',
    'KRW': 'South Korean Won', 'KWD': 'Kuwaiti Dinar', 'KYD': 'Cayman Islands Dollar',
    'KZT': 'Kazakhstani Tenge', 'LAK': 'Lao Kip', 'LBP': 'Lebanese Pound',
    'LKR': 'Sri Lankan Rupee', 'LRD': 'Liberian Dollar', 'LSL': 'Lesotho Loti',
    'LYD': 'Libyan Dinar', 'MAD': 'Moroccan Dirham', 'MDL': 'Moldovan Leu',
    'MGA': 'Malagasy Ariary', 'MKD': 'Macedonian Denar', 'MMK': 'Myanmar Kyat',
    'MNT': 'Mongolian Tugrik', 'MOP': 'Macanese Pataca', 'MRU': 'Mauritanian Ouguiya',
    'MUR': 'Mauritian Rupee', 'MVR': 'Maldivian Rufiyaa', 'MWK': 'Malawian Kwacha',
    'MXN': 'Mexican Peso', 'MYR': 'Malaysian Ringgit', 'MZN': 'Mozambican Metical',
    'NAD': 'Namibian Dollar', 'NGN': 'Nigerian Naira', 'NIO': 'Nicaraguan Córdoba',
    'NOK': 'Norwegian Krone', 'NPR': 'Nepalese Rupee', 'NZD': 'New Zealand Dollar',
    'OMR': 'Omani Rial', 'PAB': 'Panamanian Balboa', 'PEN': 'Peruvian Sol',
    'PGK': 'Papua New Guinean Kina', 'PHP': 'Philippine Peso', 'PKR': 'Pakistani Rupee',
    'PLN': 'Polish Złoty', 'PYG': 'Paraguayan Guaraní', 'QAR': 'Qatari Riyal',
    'RON': 'Romanian Leu', 'RSD': 'Serbian Dinar', 'RUB': 'Russian Ruble',
    'RWF': 'Rwandan Franc', 'SAR': 'Saudi Riyal', 'SBD': 'Solomon Islands Dollar',
    'SCR': 'Seychellois Rupee', 'SDG': 'Sudanese Pound', 'SEK': 'Swedish Krona',
    'SGD': 'Singapore Dollar', 'SHP': 'Saint Helena Pound', 'SLE': 'Sierra Leonean Leone',
    'SLL': 'Sierra Leonean Leone (old)', 'SOS': 'Somali Shilling', 'SRD': 'Surinamese Dollar',
    'SSP': 'South Sudanese Pound', 'STN': 'São Tomé and Príncipe Dobra', 'SVC': 'Salvadoran Colón',
    'SYP': 'Syrian Pound', 'SZL': 'Swazi Lilangeni', 'THB': 'Thai Baht',
    'TJS': 'Tajikistani Somoni', 'TMT': 'Turkmenistani Manat', 'TND': 'Tunisian Dinar',
    'TOP': 'Tongan Paʻanga', 'TRY': 'Turkish Lira', 'TTD': 'Trinidad and Tobago Dollar',
    'TWD': 'New Taiwan Dollar', 'TZS': 'Tanzanian Shilling', 'UAH': 'Ukrainian Hryvnia',
    'UGX': 'Ugandan Shilling', 'USD': 'US Dollar', 'UYU': 'Uruguayan Peso',
    'UZS': 'Uzbekistani Som', 'VES': 'Venezuelan Bolívar Soberano', 'VND': 'Vietnamese Đồng',
    'VUV': 'Vanuatu Vatu', 'WST': 'Samoan Tala', 'XAF': 'CFA Franc BEAC',
    'XAG': 'Silver (troy ounce)', 'XAU': 'Gold (troy ounce)', 'XCD': 'East Caribbean Dollar',
    'XCG': 'Caribbean Guilder', 'XDR': 'Special Drawing Rights (SDR)', 'XOF': 'CFA Franc BCEAO',
    'XPF': 'CFP Franc (Franc Pacifique)', 'YER': 'Yemeni Rial', 'ZAR': 'South African Rand',
    'ZMW': 'Zambian Kwacha', 'ZWG': 'Zimbabwe Gold'
  }
};

// Popular currency pairs for quick access
const POPULAR_PAIRS = [
  { from: 'USD', to: 'ZAR' },
  { from: 'EUR', to: 'USD' },
  { from: 'GBP', to: 'USD' },
  { from: 'USD', to: 'JPY' },
  { from: 'USD', to: 'CNY' },
  { from: 'USD', to: 'INR' },
  { from: 'USD', to: 'CAD' },
  { from: 'USD', to: 'AUD' },
  { from: 'EUR', to: 'GBP' },
  { from: 'USD', to: 'EUR' }
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Utility class for common operations
 */
class Utils {
  /**
   * Format currency for display
   */
  static formatCurrency(amount, decimals = 2) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(amount);
  }
  
  /**
   * Format date/time for display
   */
  static formatDateTime(date) {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  }
  
  /**
   * Debounce function calls
   */
  static debounce(func, delay) {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }
  
  /**
   * Validate amount input
   */
  static validateAmount(amount) {
    const num = parseFloat(amount);
    if (isNaN(num)) {
      return { valid: false, error: 'Please enter a valid number' };
    }
    if (num < CONFIG.VALIDATION.MIN_AMOUNT) {
      return { valid: false, error: `Amount must be at least ${CONFIG.VALIDATION.MIN_AMOUNT}` };
    }
    if (num > CONFIG.VALIDATION.MAX_AMOUNT) {
      return { valid: false, error: `Amount cannot exceed ${CONFIG.VALIDATION.MAX_AMOUNT}` };
    }
    return { valid: true, value: num };
  }
  
  /**
   * Generate unique ID
   */
  static generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  
  /**
   * Sleep function for retry delays
   */
  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Sanitize currency code
   */
  static sanitizeCurrencyCode(code) {
    if (!code) return '';
    return code.toString().toUpperCase().replace(/[^A-Z_]/g, '');
  }
  
  /**
   * Get currency category
   */
  static getCurrencyCategory(code) {
    const cryptos = ['BTC', 'ETH'];
    const metals = ['XAU', 'XAG', 'XPD', 'XPT'];
    const special = ['XDR', 'XCG', 'XAF', 'XOF', 'XPF', 'XCD'];
    
    if (cryptos.includes(code)) return 'crypto';
    if (metals.includes(code)) return 'metal';
    if (special.includes(code) || code.startsWith('X')) return 'special';
    return 'fiat';
  }
}

// ============================================================================
// CACHE MANAGER
// ============================================================================

/**
 * Manages local storage caching for currencies and rates
 */
class CacheManager {
  constructor() {
    this.prefix = CONFIG.CACHE.KEY_PREFIX;
  }
  
  /**
   * Get item from cache
   */
  get(key) {
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) return null;
      
      const parsed = JSON.parse(item);
      
      // Check if expired
      if (parsed.expiry && Date.now() > parsed.expiry) {
        this.remove(key);
        return null;
      }
      
      return parsed.data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }
  
  /**
   * Set item in cache with expiry
   */
  set(key, data, expiryMs = CONFIG.CACHE.EXPIRY) {
    try {
      const item = {
        data,
        expiry: Date.now() + expiryMs,
        timestamp: Date.now()
      };
      localStorage.setItem(this.prefix + key, JSON.stringify(item));
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }
  
  /**
   * Remove item from cache
   */
  remove(key) {
    try {
      localStorage.removeItem(this.prefix + key);
      return true;
    } catch (error) {
      console.error('Cache remove error:', error);
      return false;
    }
  }
  
  /**
   * Clear all cache
   */
  clearAll() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Cache clear error:', error);
      return false;
    }
  }
}

// ============================================================================
// API CLIENT - UPDATED TO USE COMPREHENSIVE LIST DIRECTLY
// ============================================================================

/**
 * Handles all API requests with error handling and retry logic
 */
class APIClient {
  constructor() {
    this.cache = new CacheManager();
  }
  
  /**
   * Fetch with timeout support
   */
  async fetchWithTimeout(url, options = {}, timeout = CONFIG.REQUEST.TIMEOUT) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'CurrencyConverter/3.1',
          ...options.headers
        }
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
  
  /**
   * Fetch with retry logic
   */
  async fetchWithRetry(url, options = {}, retries = CONFIG.REQUEST.MAX_RETRIES) {
    let lastError;
    
    for (let i = 0; i < retries; i++) {
      try {
        const response = await this.fetchWithTimeout(url, options);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
      } catch (error) {
        lastError = error;
        console.warn(`Attempt ${i + 1} failed:`, error.message);
        
        if (i < retries - 1) {
          await Utils.sleep(CONFIG.REQUEST.RETRY_DELAY * (i + 1));
        }
      }
    }
    
    throw lastError;
  }
  
  /**
   * Fetch available currencies - NOW USES COMPREHENSIVE LIST DIRECTLY
   */
  async fetchCurrencies() {
    console.log('🔄 Loading comprehensive currency list...');
    
    // Always use our comprehensive list as the primary source
    const comprehensiveData = {
      currencies: COMPREHENSIVE_CURRENCIES.currencies,
      names: COMPREHENSIVE_CURRENCIES.names,
      count: COMPREHENSIVE_CURRENCIES.currencies.length
    };
    
    // Try to enhance with API data if available
    try {
      const apiUrl = `${CONFIG.API_ENDPOINTS.primary}/currencies`;
      console.log(`→ Attempting to enhance with API data from ${apiUrl}`);
      
      const apiData = await this.fetchWithRetry(apiUrl);
      
      if (apiData && typeof apiData === 'object') {
        console.log(`✓ API returned ${Object.keys(apiData).length} currencies`);
        
        // Merge API names with our comprehensive names
        Object.keys(apiData).forEach(code => {
          const upperCode = code.toUpperCase();
          if (!comprehensiveData.names[upperCode] && apiData[code]) {
            comprehensiveData.names[upperCode] = apiData[code];
          }
        });
      }
    } catch (apiError) {
      console.log('⚠ API unavailable, using comprehensive list only');
    }
    
    // Cache the result
    this.cache.set(CONFIG.CACHE.CURRENCY_LIST_KEY, comprehensiveData);
    
    console.log(`✓ Total currencies loaded: ${comprehensiveData.count}`);
    return comprehensiveData;
  }
  
  /**
   * Fetch exchange rate between two currencies
   */
  async fetchExchangeRate(from, to, amount = 1) {
    // Sanitize currency codes
    const sanitizedFrom = Utils.sanitizeCurrencyCode(from);
    const sanitizedTo = Utils.sanitizeCurrencyCode(to);
    
    // Check if same currency
    if (sanitizedFrom === sanitizedTo) {
      return {
        rate: 1,
        amount: amount,
        source: 'Same currency',
        date: new Date().toISOString().split('T')[0]
      };
    }
    
    // Check for cached rate first
    const cachedRate = this.getCachedExchangeRate(sanitizedFrom, sanitizedTo);
    if (cachedRate) {
      console.log('✓ Using cached exchange rate');
      return {
        rate: cachedRate,
        amount: cachedRate * amount,
        source: 'Cached',
        date: 'N/A'
      };
    }
    
    const endpoints = [
      {
        url: `${CONFIG.API_ENDPOINTS.primary}/latest?from=${sanitizedFrom}&to=${sanitizedTo}`,
        parser: (data) => ({
          rate: data.rates[sanitizedTo],
          amount: data.rates[sanitizedTo] * amount,
          source: 'Frankfurter.app',
          date: data.date
        })
      },
      {
        url: `${CONFIG.API_ENDPOINTS.fallback1}/currencies/${sanitizedFrom.toLowerCase()}.json`,
        parser: (data) => {
          const rate = data[sanitizedFrom.toLowerCase()]?.[sanitizedTo.toLowerCase()];
          return {
            rate,
            amount: rate * amount,
            source: 'Currency-API',
            date: data.date || new Date().toISOString().split('T')[0]
          };
        }
      }
    ];
    
    // Try each endpoint
    for (const endpoint of endpoints) {
      try {
        console.log(`→ Fetching rate from ${endpoint.url}`);
        const data = await this.fetchWithRetry(endpoint.url);
        const result = endpoint.parser(data);
        
        if (result.rate && result.amount) {
          console.log(`✓ Rate: 1 ${sanitizedFrom} = ${result.rate} ${sanitizedTo}`);
          
          // Cache the rate
          this.cacheExchangeRate(sanitizedFrom, sanitizedTo, result.rate);
          
          return result;
        }
      } catch (error) {
        console.error(`✗ Failed to fetch rate:`, error.message);
      }
    }
    
    // Try USD as base for conversion
    if (sanitizedFrom !== 'USD' && sanitizedTo !== 'USD') {
      try {
        console.log(`→ Trying USD-based conversion for ${sanitizedFrom} → ${sanitizedTo}`);
        
        // Get from → USD rate
        const fromToUSD = await this.fetchExchangeRate(sanitizedFrom, 'USD', 1);
        const usdToTo = await this.fetchExchangeRate('USD', sanitizedTo, 1);
        
        const crossRate = fromToUSD.rate * usdToTo.rate;
        
        if (crossRate && !isNaN(crossRate)) {
          console.log(`✓ Cross-rate via USD: 1 ${sanitizedFrom} = ${crossRate} ${sanitizedTo}`);
          
          this.cacheExchangeRate(sanitizedFrom, sanitizedTo, crossRate);
          
          return {
            rate: crossRate,
            amount: crossRate * amount,
            source: 'USD Cross-rate',
            date: new Date().toISOString().split('T')[0]
          };
        }
      } catch (error) {
        console.error('Cross-rate conversion failed:', error);
      }
    }
    
    throw new Error(`Unable to fetch exchange rate for ${sanitizedFrom}/${sanitizedTo}`);
  }
  
  /**
   * Cache exchange rate
   */
  cacheExchangeRate(from, to, rate) {
    const key = `${CONFIG.CACHE.RATES_KEY}_${from}_${to}`;
    this.cache.set(key, rate, 60 * 60 * 1000); // 1 hour expiry
  }
  
  /**
   * Get cached exchange rate
   */
  getCachedExchangeRate(from, to) {
    const key = `${CONFIG.CACHE.RATES_KEY}_${from}_${to}`;
    const rate = this.cache.get(key);
    
    // Also check reverse rate
    if (!rate) {
      const reverseKey = `${CONFIG.CACHE.RATES_KEY}_${to}_${from}`;
      const reverseRate = this.cache.get(reverseKey);
      if (reverseRate && !isNaN(reverseRate) && reverseRate > 0) {
        return 1 / reverseRate;
      }
    }
    
    return rate;
  }
}

// ============================================================================
// HISTORY MANAGER
// ============================================================================

/**
 * Manages conversion history
 */
class HistoryManager {
  constructor() {
    this.cache = new CacheManager();
    this.maxItems = CONFIG.UI.MAX_HISTORY_ITEMS;
  }
  
  /**
   * Add conversion to history
   */
  add(conversion) {
    try {
      const history = this.getAll();
      history.unshift({
        ...conversion,
        id: Utils.generateId(),
        timestamp: new Date().toISOString()
      });
      
      // Keep only max items
      const trimmed = history.slice(0, this.maxItems);
      
      this.cache.set(CONFIG.CACHE.HISTORY_KEY, trimmed, null); // No expiry
      return true;
    } catch (error) {
      console.error('Failed to add to history:', error);
      return false;
    }
  }
  
  /**
   * Get all history
   */
  getAll() {
    return this.cache.get(CONFIG.CACHE.HISTORY_KEY) || [];
  }
  
  /**
   * Clear all history
   */
  clear() {
    return this.cache.remove(CONFIG.CACHE.HISTORY_KEY);
  }
  
  /**
   * Get recent conversions (last 5)
   */
  getRecent(count = 5) {
    return this.getAll().slice(0, count);
  }
}

// ============================================================================
// UI MANAGER - UPDATED TO SHOW ALL CURRENCIES
// ============================================================================

/**
 * Manages all UI interactions and updates
 */
class UIManager {
  constructor() {
    this.elements = this.getElements();
    this.setupEventListeners();
  }
  
  /**
   * Get all DOM elements
   */
  getElements() {
    return {
      // Form elements
      form: document.getElementById('converterForm'),
      fromCurrency: document.getElementById('fromCurrency'),
      toCurrency: document.getElementById('toCurrency'),
      amount: document.getElementById('amount'),
      switchBtn: document.getElementById('switchBtn'),
      convertBtn: document.getElementById('convertBtn'),
      
      // Display elements
      result: document.getElementById('result'),
      error: document.getElementById('error'),
      currencyCounter: document.getElementById('currencyCounter'),
      statusIndicator: document.getElementById('statusIndicator'),
      currencyCount: document.getElementById('currencyCount'),
      
      // Feature elements
      historySection: document.getElementById('historySection'),
      historyList: document.getElementById('historyList'),
      clearHistoryBtn: document.getElementById('clearHistoryBtn'),
      popularPairs: document.getElementById('popularPairs'),
      
      // Loading overlay
      loadingOverlay: document.getElementById('loadingOverlay')
    };
  }
  
  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Form submission
    this.elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleConvert();
    });
    
    // Switch currencies
    this.elements.switchBtn.addEventListener('click', () => {
      this.handleSwitch();
    });
    
    // Real-time conversion
    this.elements.amount.addEventListener('input', 
      Utils.debounce(() => this.handleRealtimeConvert(), CONFIG.UI.DEBOUNCE_DELAY)
    );
    
    // Clear history
    if (this.elements.clearHistoryBtn) {
      this.elements.clearHistoryBtn.addEventListener('click', () => {
        this.handleClearHistory();
      });
    }
    
    // Popular pairs
    if (this.elements.popularPairs) {
      this.elements.popularPairs.addEventListener('click', (e) => {
        if (e.target.classList.contains('pair-btn')) {
          this.handlePopularPair(e.target);
        }
      });
    }
    
    // Keyboard shortcuts
    this.setupKeyboardShortcuts();
  }
  
  /**
   * Setup keyboard shortcuts
   */
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + Enter: Convert
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        this.handleConvert();
      }
      
      // Ctrl/Cmd + S: Switch
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        this.handleSwitch();
      }
      
      // Ctrl/Cmd + L: Clear
      if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        this.clearForm();
      }
      
      // Ctrl/Cmd + H: Show history
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        this.toggleHistory();
      }
    });
  }
  
  /**
   * Handle convert action
   */
  async handleConvert() {
    if (window.app && window.app.convert) {
      await window.app.convert();
    }
  }
  
  /**
   * Handle realtime convert
   */
  async handleRealtimeConvert() {
    const amount = parseFloat(this.elements.amount.value);
    if (amount && amount > 0) {
      await this.handleConvert();
    }
  }
  
  /**
   * Handle switch currencies
   */
  handleSwitch() {
    const temp = this.elements.fromCurrency.value;
    this.elements.fromCurrency.value = this.elements.toCurrency.value;
    this.elements.toCurrency.value = temp;
    
    // Convert if amount exists
    if (this.elements.amount.value) {
      this.handleConvert();
    }
    
    this.clearError();
  }
  
  /**
   * Handle popular pair click
   */
  handlePopularPair(button) {
    const from = button.dataset.from;
    const to = button.dataset.to;
    
    this.elements.fromCurrency.value = from;
    this.elements.toCurrency.value = to;
    
    if (this.elements.amount.value) {
      this.handleConvert();
    } else {
      this.elements.amount.value = '1';
      this.elements.amount.focus();
    }
  }
  
  /**
   * Handle clear history
   */
  handleClearHistory() {
    if (window.app && window.app.clearHistory) {
      window.app.clearHistory();
    }
  }
  
  /**
   * Toggle history visibility
   */
  toggleHistory() {
    const historySection = document.getElementById('historySection');
    if (historySection) {
      historySection.style.display = historySection.style.display === 'none' ? 'block' : 'none';
    }
  }
  
  /**
   * Populate currency dropdowns - FIXED TO SHOW ALL CURRENCIES
   */
  populateDropdowns(currencies, names) {
    console.log(`📊 Populating dropdowns with ${currencies.length} currencies`);
    
    // Clear dropdowns first
    this.elements.fromCurrency.innerHTML = '';
    this.elements.toCurrency.innerHTML = '';
    
    // Add default option
    const defaultOption = new Option('-- Select Currency --', '');
    this.elements.fromCurrency.add(defaultOption.cloneNode(true));
    this.elements.toCurrency.add(defaultOption.cloneNode(true));
    
    // First, add popular currencies
    const popular = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL', 'BTC', 'ETH', 'XAU', 'XAG'];
    const popularCurrencies = currencies.filter(c => popular.includes(c));
    
    // Add separator for popular currencies
    const popularSeparator = new Option('─── Popular Currencies ───', '', true, true);
    popularSeparator.disabled = true;
    this.elements.fromCurrency.add(popularSeparator.cloneNode(true));
    this.elements.toCurrency.add(popularSeparator.cloneNode(true));
    
    // Add popular currencies
    popularCurrencies.forEach(code => {
      this.addCurrencyOption(code, names);
    });
    
    // Add separator for all currencies
    const allSeparator = new Option('─── All Currencies ───', '', true, true);
    allSeparator.disabled = true;
    this.elements.fromCurrency.add(allSeparator.cloneNode(true));
    this.elements.toCurrency.add(allSeparator.cloneNode(true));
    
    // Add all other currencies sorted alphabetically
    const otherCurrencies = currencies
      .filter(c => !popular.includes(c))
      .sort((a, b) => {
        const nameA = (names[a] || a).toLowerCase();
        const nameB = (names[b] || b).toLowerCase();
        return nameA.localeCompare(nameB);
      });
    
    otherCurrencies.forEach(code => {
      this.addCurrencyOption(code, names);
    });
    
    // Set default values
    this.elements.fromCurrency.value = 'USD';
    this.elements.toCurrency.value = 'EUR';
    
    // Update counters
    if (this.elements.currencyCount) {
      this.elements.currencyCount.textContent = currencies.length;
    }
    
    console.log(`✓ Dropdowns populated with ${popularCurrencies.length} popular + ${otherCurrencies.length} other = ${currencies.length} total currencies`);
  }
  
  /**
   * Add currency option to dropdowns
   */
  addCurrencyOption(code, names) {
    const name = names[code] || code;
    const category = Utils.getCurrencyCategory(code);
    
    let displayName = `${code} - ${name}`;
    let className = '';
    
    // Add emoji indicators and styling
    switch(category) {
      case 'crypto':
        displayName = `₿ ${displayName}`;
        className = 'currency-crypto';
        break;
      case 'metal':
        displayName = `⚖️ ${displayName}`;
        className = 'currency-metal';
        break;
      case 'special':
        displayName = `✨ ${displayName}`;
        className = 'currency-special';
        break;
    }
    
    const option1 = new Option(displayName, code);
    const option2 = new Option(displayName, code);
    
    if (className) {
      option1.className = className;
      option2.className = className;
    }
    
    this.elements.fromCurrency.add(option1);
    this.elements.toCurrency.add(option2);
  }
  
  /**
   * Update currency counter
   */
  updateCounter(count) {
    if (this.elements.currencyCounter) {
      this.elements.currencyCounter.textContent = `${count}+ currencies supported`;
    }
  }
  
  /**
   * Show loading state
   */
  showLoading() {
    this.elements.convertBtn.disabled = true;
    this.elements.convertBtn.querySelector('.btn-text').style.display = 'none';
    this.elements.convertBtn.querySelector('.btn-loading').style.display = 'inline';
    
    this.elements.result.innerHTML = '<div class="loading">Converting... <span class="spinner"></span></div>';
    this.clearError();
  }
  
  /**
   * Hide loading state
   */
  hideLoading() {
    this.elements.convertBtn.disabled = false;
    this.elements.convertBtn.querySelector('.btn-text').style.display = 'inline';
    this.elements.convertBtn.querySelector('.btn-loading').style.display = 'none';
  }
  
  /**
   * Show result
   */
  showResult(data) {
    const { from, to, amount, result, rate, source, date } = data;
    
    const formattedAmount = Utils.formatCurrency(amount, 2);
    const formattedResult = Utils.formatCurrency(result, CONFIG.VALIDATION.DECIMAL_PLACES);
    const formattedRate = Utils.formatCurrency(rate, CONFIG.VALIDATION.DECIMAL_PLACES);
    
    // Get currency categories for styling
    const fromCategory = Utils.getCurrencyCategory(from);
    const toCategory = Utils.getCurrencyCategory(to);
    
    let fromEmoji = '', toEmoji = '';
    if (fromCategory === 'crypto') fromEmoji = '₿ ';
    if (fromCategory === 'metal') fromEmoji = '⚖️ ';
    if (toCategory === 'crypto') toEmoji = '₿ ';
    if (toCategory === 'metal') toEmoji = '⚖️ ';
    
    this.elements.result.innerHTML = `
      <div class="result-main">
        ${fromEmoji}${formattedAmount} ${from} = 
        <strong>${toEmoji}${formattedResult} ${to}</strong>
      </div>
      <div class="result-source">
        Rate: 1 ${from} = ${formattedRate} ${to}<br>
        Source: ${source} • Updated: ${Utils.formatDateTime(new Date())}
      </div>
    `;
    
    this.hideLoading();
    this.clearError();
  }
  
  /**
   * Show error
   */
  showError(message) {
    this.elements.error.textContent = message;
    this.hideLoading();
  }
  
  /**
   * Clear error
   */
  clearError() {
    this.elements.error.textContent = '';
  }
  
  /**
   * Clear form
   */
  clearForm() {
    this.elements.amount.value = '';
    this.elements.result.textContent = '';
    this.clearError();
    this.elements.amount.focus();
  }
  
  /**
   * Update status indicator
   */
  updateStatus(online) {
    if (this.elements.statusIndicator) {
      if (online) {
        this.elements.statusIndicator.classList.remove('offline');
        this.elements.statusIndicator.title = 'Connected';
        this.elements.statusIndicator.style.color = 'var(--success-color)';
      } else {
        this.elements.statusIndicator.classList.add('offline');
        this.elements.statusIndicator.title = 'Offline - using cached data';
        this.elements.statusIndicator.style.color = 'var(--error-color)';
      }
    }
  }
  
  /**
   * Show/hide loading overlay
   */
  setLoadingOverlay(visible) {
    if (this.elements.loadingOverlay) {
      if (visible) {
        this.elements.loadingOverlay.classList.remove('hidden');
      } else {
        this.elements.loadingOverlay.classList.add('hidden');
      }
    }
  }
  
  /**
   * Update history display
   */
  updateHistory(history) {
    if (!this.elements.historyList || !this.elements.historySection) return;
    
    if (history.length === 0) {
      this.elements.historySection.style.display = 'none';
      return;
    }
    
    this.elements.historySection.style.display = 'block';
    this.elements.historyList.innerHTML = '';
    
    history.slice(0, 5).forEach(item => {
      const div = document.createElement('div');
      div.className = 'history-item';
      div.innerHTML = `
        <span>${Utils.formatCurrency(item.amount, 2)} ${item.from} → ${Utils.formatCurrency(item.result, 2)} ${item.to}</span>
        <span style="font-size: 0.75rem; opacity: 0.7;">${new Date(item.timestamp).toLocaleTimeString()}</span>
      `;
      
      div.addEventListener('click', () => {
        this.elements.fromCurrency.value = item.from;
        this.elements.toCurrency.value = item.to;
        this.elements.amount.value = item.amount;
        this.handleConvert();
      });
      
      this.elements.historyList.appendChild(div);
    });
  }
  
  /**
   * Get form data
   */
  getFormData() {
    return {
      from: this.elements.fromCurrency.value,
      to: this.elements.toCurrency.value,
      amount: this.elements.amount.value
    };
  }
}

// ============================================================================
// MAIN APPLICATION
// ============================================================================

/**
 * Main application class
 */
class CurrencyConverter {
  constructor() {
    this.api = new APIClient();
    this.history = new HistoryManager();
    this.ui = new UIManager();
    this.isInitialized = false;
  }
  
  /**
   * Initialize the application
   */
  async initialize() {
    try {
      console.log('🚀 Initializing Currency Converter v3.1 - 163+ Currencies...');
      
      this.ui.setLoadingOverlay(true);
      
      // Fetch currencies - this now uses our comprehensive list
      const currencyData = await this.api.fetchCurrencies();
      const currencyCount = currencyData.currencies.length;
      
      // Populate UI with ALL currencies
      this.ui.populateDropdowns(currencyData.currencies, currencyData.names);
      this.ui.updateCounter(currencyCount);
      this.ui.updateStatus(true);
      
      // Update the stat counter
      if (this.ui.elements.currencyCount) {
        this.ui.elements.currencyCount.textContent = currencyCount;
      }
      
      // Load history
      this.updateHistoryDisplay();
      
      this.isInitialized = true;
      
      console.log(`✓ Currency Converter initialized with ${currencyCount} currencies`);
      
      this.ui.setLoadingOverlay(false);
      
      // Show welcome message
      this.ui.elements.result.innerHTML = `
        <div style="text-align: center;">
          <div style="font-size: 1.2rem; margin-bottom: 8px; color: var(--accent-color);">
            🎉 Ready to convert!
          </div>
          <div style="font-size: 0.9rem; opacity: 0.8;">
            Supports ${currencyCount} currencies including Bitcoin, Gold, and 150+ countries
          </div>
        </div>
      `;
      
    } catch (error) {
      console.error('✗ Initialization error:', error);
      this.ui.setLoadingOverlay(false);
      this.ui.showError('Failed to initialize. Please refresh the page.');
      this.ui.updateStatus(false);
    }
  }
  
  /**
   * Perform currency conversion
   */
  async convert() {
    if (!this.isInitialized) {
      this.ui.showError('App is still initializing. Please wait...');
      return;
    }
    
    // Get form data
    const { from, to, amount } = this.ui.getFormData();
    
    // Validate inputs
    if (!from || !to) {
      this.ui.showError('Please select currencies');
      return;
    }
    
    const validation = Utils.validateAmount(amount);
    if (!validation.valid) {
      this.ui.showError(validation.error);
      return;
    }
    
    // Check if same currency
    if (from === to) {
      const category = Utils.getCurrencyCategory(from);
      let emoji = '';
      if (category === 'crypto') emoji = '₿ ';
      if (category === 'metal') emoji = '⚖️ ';
      
      this.ui.elements.result.innerHTML = `
        <div class="result-main">
          ${emoji}${Utils.formatCurrency(validation.value, 2)} ${from} = 
          <strong>${emoji}${Utils.formatCurrency(validation.value, 2)} ${to}</strong>
        </div>
        <div class="result-source" style="color: var(--text-secondary);">
          Same currency conversion
        </div>
      `;
      this.ui.clearError();
      return;
    }
    
    try {
      this.ui.showLoading();
      
      // Fetch exchange rate
      const rateData = await this.api.fetchExchangeRate(from, to, validation.value);
      
      // Show result
      this.ui.showResult({
        from,
        to,
        amount: validation.value,
        result: rateData.amount,
        rate: rateData.rate,
        source: rateData.source,
        date: rateData.date
      });
      
      // Add to history
      this.history.add({
        from,
        to,
        amount: validation.value,
        result: rateData.amount,
        rate: rateData.rate
      });
      
      // Update history display
      this.updateHistoryDisplay();
      
      this.ui.updateStatus(true);
      
    } catch (error) {
      console.error('Conversion error:', error);
      
      // User-friendly error messages
      let errorMessage = 'Conversion failed. Please try again.';
      
      if (error.message.includes('timeout') || error.name === 'AbortError') {
        errorMessage = 'Request timed out. Please check your connection and try again.';
      } else if (error.message.includes('fetch') || error.message.includes('Network')) {
        errorMessage = 'Network error. Please check your internet connection.';
        this.ui.updateStatus(false);
      } else if (error.message.includes('Unable to fetch')) {
        errorMessage = `Unable to convert ${from} to ${to}. Please try a different currency pair.`;
      } else if (error.message.includes('Cross-rate')) {
        errorMessage = `Converted via USD intermediate rate. Rate may not be exact.`;
        // Still show the result if we have it
      }
      
      this.ui.showError(errorMessage);
    }
  }
  
  /**
   * Clear conversion history
   */
  clearHistory() {
    if (confirm('Are you sure you want to clear all conversion history?')) {
      this.history.clear();
      this.updateHistoryDisplay();
      console.log('✓ History cleared');
    }
  }
  
  /**
   * Update history display
   */
  updateHistoryDisplay() {
    const history = this.history.getRecent(5);
    this.ui.updateHistory(history);
  }
}

// ============================================================================
// APPLICATION INITIALIZATION
// ============================================================================

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Create and initialize app
    window.app = new CurrencyConverter();
    await window.app.initialize();
  } catch (error) {
    console.error('Failed to start application:', error);
  }
});

// Handle online/offline events
window.addEventListener('online', () => {
  console.log('✓ Connection restored');
  if (window.app) {
    window.app.ui.updateStatus(true);
  }
});

window.addEventListener('offline', () => {
  console.log('⚠ Connection lost - using cached data');
  if (window.app) {
    window.app.ui.updateStatus(false);
  }
});

// Export for debugging
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CurrencyConverter, APIClient, Utils, COMPREHENSIVE_CURRENCIES };
}
