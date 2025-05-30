# Consumer Behavior Analysis Framework

A comprehensive data analysis framework that generates synthetic consumer profiles and purchase behavior data based on LEGO product analysis from their official website. This framework uses MCP firecrawl tools architecture and outputs structured CSV datasets for business intelligence and machine learning applications.

## 🎯 Overview

This framework creates realistic consumer behavior datasets by:
- Analyzing product information from LEGO's website structure
- Generating synthetic consumer profiles across different market segments  
- Simulating purchase transactions with realistic patterns
- Performing comprehensive behavioral analysis
- Exporting all data to CSV format for further analysis

## 📊 Data Sources & Features

### Product Categories (Based on LEGO.com)
- **Architecture Series**: High-end sets for adult collectors
- **NINJAGO**: Popular action-themed sets across age groups  
- **Star Wars**: Licensed premium franchise products
- **Harry Potter**: Fantasy-themed licensed products
- **Technic**: Engineering and mechanical build sets
- **Creator 3-in-1**: Versatile building experiences
- **Friends**: Sets targeted toward younger builders
- **City**: Urban-themed community building sets

### Consumer Segments
1. **Adult Collectors** (25-65 years)
   - High spending capacity ($450 avg)
   - Low price sensitivity
   - Monthly purchase frequency
   - Prefer Architecture, Technic, Star Wars

2. **Parents** (28-50 years)
   - Moderate spending ($180 avg)
   - Medium price sensitivity
   - Quarterly purchases
   - Strong seasonal patterns (holidays, birthdays)

3. **Teens and Young Adults** (13-24 years)
   - Lower spending capacity ($120 avg)
   - High price sensitivity
   - Biannual purchases
   - Prefer licensed themes

4. **Gift Buyers** (25-70 years)
   - Moderate spending ($95 avg)
   - Highly seasonal purchasing patterns
   - Lower loyalty scores
   - Focus on popular/accessible themes

5. **Serious Builders** (18-55 years)
   - Highest spending capacity ($650 avg)
   - Very low price sensitivity
   - Highest loyalty scores
   - Premium product preferences

## 🏗️ Data Structure

### Consumer Profiles (`consumer_profiles.csv`)
```csv
Consumer_ID,Segment,Age,Region,Country,Annual_Spending_Capacity,
Loyalty_Score,Price_Sensitivity,Preferred_Categories,Purchase_Frequency,
Registration_Date,Total_Lifetime_Purchases,Average_Order_Value,Last_Purchase_Date
```

### Purchase History (`purchase_history.csv`)
```csv
Transaction_ID,Consumer_ID,Product_Name,Category,Age_Group,Complexity,
Build_Time,Quantity,Unit_Price,Total_Original_Price,Discount_Applied_Percent,
Final_Price,Purchase_Date,Purchase_Month,Purchase_Year,Season,
Purchase_Channel,Payment_Method,Shipping_Cost,Customer_Satisfaction,Review_Score
```

### Analytics Summary (`analytics_summary.csv`)
```csv
Metric,Value
Total Revenue,1234567.89
Total Transactions,25000
Average Order Value,98.76
Top Category by Revenue,starwars
Most Valuable Segment,Serious Builders
```

## 🚀 Usage

### Installation
```bash
npm install
```

### Run the Analysis
```bash
node consumer-behavior-analysis.js
```

### Use as Module
```javascript
import { runConsumerBehaviorAnalysis } from './consumer-behavior-analysis.js';

const { profiles, purchases, analytics } = await runConsumerBehaviorAnalysis();
```

## 📈 Key Features

### Realistic Behavior Modeling
- **Seasonal Patterns**: Holiday spikes, back-to-school trends, birthday seasonality
- **Price Sensitivity**: Different segments respond differently to price points
- **Loyalty Programs**: Discount calculations based on customer loyalty scores
- **Geographic Distribution**: Global market representation across regions
- **Payment Preferences**: Diverse payment method distributions

### Advanced Analytics
- **Revenue Analysis**: Total revenue, transaction counts, average order values
- **Category Performance**: Revenue share, transaction volume by product category
- **Segment Analysis**: Customer lifetime value, loyalty scores by segment
- **Seasonal Trends**: Purchase pattern analysis across different seasons
- **Geographic Distribution**: Regional market performance metrics

### Data Quality Features
- **Realistic Constraints**: Age-appropriate product selections
- **Behavioral Consistency**: Purchase patterns match segment characteristics
- **Time Series Data**: Multi-year transaction history (2022-2024)
- **Missing Data Handling**: Realistic patterns of missing/null values
- **Data Validation**: Built-in checks for data integrity

## 🔧 Configuration Options

### Adjust Dataset Size
```javascript
// Generate different dataset sizes
const profiles = generateConsumerProfiles(10000);  // 10K consumers
const purchases = generatePurchaseHistory(profiles, 50000);  // 50K transactions
```

### Customize Consumer Segments
```javascript
// Modify segment characteristics in CONSUMER_SEGMENTS object
"Adult Collectors": {
  ageRange: [25, 65],
  avgSpending: 450,
  preferredCategories: ["architecture", "technic", "starwars"],
  // ... other properties
}
```

### Add New Product Categories
```javascript
// Extend LEGO_PRODUCTS object with new categories
const LEGO_PRODUCTS = {
  // ... existing categories
  newCategory: [
    { name: "Product Name", price: 99.99, ageGroup: "12+", complexity: "medium" }
  ]
};
```

## 📊 Sample Output

```
🚀 Starting Consumer Behavior Analysis Framework...
👥 Generating consumer profiles...
🛒 Generating purchase history...
📈 Analyzing purchase behavior...
💾 Exporting data to CSV files...

✅ All CSV files have been generated successfully!
📊 Files created:
  - consumer_profiles.csv
  - purchase_history.csv
  - analytics_summary.csv

📊 ANALYSIS SUMMARY:
======================
Total Consumers: 5000
Total Transactions: 18943
Total Revenue: $1,876,543
Average Order Value: $99.12

🏆 TOP PERFORMING CATEGORIES:
  starwars: $421,234 (22.5%)
  architecture: $387,654 (20.7%)
  technic: $298,765 (15.9%)
  ninjago: $245,678 (13.1%)
  harrypotter: $189,432 (10.1%)

👥 CUSTOMER SEGMENTS:
  Serious Builders: 1,023 customers, $487 avg LTV
  Adult Collectors: 978 customers, $356 avg LTV  
  Parents: 1,245 customers, $154 avg LTV
  Teens and Young Adults: 892 customers, $98 avg LTV
  Gift Buyers: 862 customers, $67 avg LTV
```

## 🎯 Use Cases

### Business Intelligence
- Customer segmentation analysis
- Product performance optimization
- Seasonal demand forecasting
- Pricing strategy development

### Machine Learning
- Customer lifetime value prediction
- Recommendation system training
- Churn prediction modeling
- Market basket analysis

### Academic Research
- Consumer behavior studies
- E-commerce pattern analysis
- Retail analytics research
- Market simulation studies

## 🛠️ Technical Architecture

Built on the MCP firecrawl framework architecture:
- **Modular Design**: Separate functions for data generation, analysis, and export
- **Scalable Processing**: Efficient handling of large datasets
- **CSV Export**: Industry-standard format compatibility
- **Error Handling**: Robust error management and logging
- **Memory Optimization**: Efficient data structures for large-scale processing

## 📋 Requirements

- Node.js 14+
- csv-writer package
- ES6 module support

## 🤝 Contributing

This framework is designed to be extensible. Key areas for contribution:
- Additional consumer segments
- New product categories
- Enhanced behavioral models
- Advanced analytics functions
- Export format options

## 📝 License

MIT License - Feel free to use this framework for commercial and research purposes.

---

*This consumer behavior analysis framework provides realistic synthetic data for testing, development, and research purposes while respecting privacy and data protection principles.* 