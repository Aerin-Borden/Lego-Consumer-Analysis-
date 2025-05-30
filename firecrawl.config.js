export default {
  // Target URL to scrape
  url: "https://www.scrapethissite.com/pages/simple/",
  
  // Extraction configuration
  extract: {
    // Extract all countries as an array
    countries: {
      selector: "div.col-md-4", // Each country appears to be in a column div
      many: true, // Extract multiple items
      fields: {
        // Country name (treating as "product name")
        name: {
          selector: "h3",
          attribute: "text"
        },
        // Capital city
        capital: {
          selector: "span.country-capital",
          attribute: "text",
          // Fallback selector if span doesn't work
          fallback: {
            selector: "div",
            attribute: "text",
            transform: (text) => {
              const match = text.match(/Capital:\s*([^\n\r]+)/);
              return match ? match[1].trim() : null;
            }
          }
        },
        // Population (treating as "price" equivalent)
        population: {
          selector: "span.country-population", 
          attribute: "text",
          fallback: {
            selector: "div",
            attribute: "text", 
            transform: (text) => {
              const match = text.match(/Population:\s*(\d+)/);
              return match ? parseInt(match[1]) : null;
            }
          }
        },
        // Area in km2
        area: {
          selector: "span.country-area",
          attribute: "text",
          fallback: {
            selector: "div", 
            attribute: "text",
            transform: (text) => {
              const match = text.match(/Area \(km2\):\s*([\d.E]+)/);
              return match ? parseFloat(match[1]) : null;
            }
          }
        }
      }
    }
  },

  // Output format configuration
  output: {
    format: "json",
    structure: {
      countries: "array",
      total_count: "countries.length"
    }
  },

  // Additional scraping options
  options: {
    waitFor: 2000, // Wait 2 seconds for page to load
    includeHtml: false, // Don't include raw HTML
    onlyMainContent: true, // Focus on main content area
    
    // Custom extraction logic for better data cleaning
    customExtraction: {
      // Clean up the extracted data
      postProcess: (data) => {
        if (data.countries) {
          data.countries = data.countries.map(country => ({
            name: country.name?.trim() || "Unknown",
            capital: country.capital?.trim() || "Unknown", 
            population: typeof country.population === 'number' ? country.population : parseInt(country.population) || 0,
            area: typeof country.area === 'number' ? country.area : parseFloat(country.area) || 0
          })).filter(country => country.name !== "Unknown");
        }
        return data;
      }
    }
  },

  // Fallback extraction strategy using CSS selectors
  fallbackSelectors: {
    countryBlocks: "h3", // If main selector fails, find country headers
    extractFromText: true // Parse from text content if structured selectors fail
  },

  // Manual selector mapping as backup
  manualExtraction: {
    enabled: true,
    strategy: "text-parsing",
    patterns: {
      country: /^###\s+(.+)$/m,
      capital: /\*\*Capital:\*\*\s*(.+)$/m, 
      population: /\*\*Population:\*\*\s*(\d+)$/m,
      area: /\*\*Area \(km2\):\*\*\s*([\d.E]+)$/m
    }
  }
}; 