import fs from 'fs';
import { createObjectCsvWriter } from 'csv-writer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// LEGO Product Categories and Price Ranges (based on the LEGO website)
const LEGO_PRODUCTS = {
  // Architecture Series
  architecture: [
    { name: "Eiffel Tower", price: 629.99, ageGroup: "18+", complexity: "high", buildTime: "8-12 hours" },
    { name: "Statue of Liberty", price: 99.99, ageGroup: "16+", complexity: "medium", buildTime: "4-6 hours" },
    { name: "Tokyo Skyline", price: 59.99, ageGroup: "12+", complexity: "medium", buildTime: "2-4 hours" },
    { name: "Great Wall of China", price: 49.99, ageGroup: "12+", complexity: "medium", buildTime: "2-3 hours" }
  ],
  
  // NINJAGO Series
  ninjago: [
    { name: "NINJAGO City Workshops", price: 249.99, ageGroup: "14+", complexity: "high", buildTime: "6-8 hours" },
    { name: "Dragon Stone Shrine", price: 119.99, ageGroup: "13+", complexity: "medium", buildTime: "3-5 hours" },
    { name: "Arc Dragon of Focus", price: 99.99, ageGroup: "9+", complexity: "medium", buildTime: "2-4 hours" },
    { name: "Thunderfang Dragon of Chaos", price: 74.99, ageGroup: "8+", complexity: "medium", buildTime: "2-3 hours" },
    { name: "Lloyd's Green Forest Dragon", price: 19.99, ageGroup: "6+", complexity: "low", buildTime: "1-2 hours" }
  ],
  
  // Star Wars Series
  starwars: [
    { name: "Millennium Falcon", price: 849.99, ageGroup: "16+", complexity: "high", buildTime: "10-15 hours" },
    { name: "Imperial Star Destroyer", price: 699.99, ageGroup: "16+", complexity: "high", buildTime: "8-12 hours" },
    { name: "X-Wing Starfighter", price: 49.99, ageGroup: "9+", complexity: "medium", buildTime: "2-3 hours" },
    { name: "Baby Yoda", price: 79.99, ageGroup: "10+", complexity: "medium", buildTime: "2-4 hours" }
  ],
  
  // Harry Potter Series
  harrypotter: [
    { name: "Hogwarts Castle", price: 469.99, ageGroup: "16+", complexity: "high", buildTime: "8-12 hours" },
    { name: "Diagon Alley", price: 399.99, ageGroup: "16+", complexity: "high", buildTime: "6-10 hours" },
    { name: "Dobby the House-Elf", price: 29.99, ageGroup: "8+", complexity: "low", buildTime: "1-2 hours" },
    { name: "Hogwarts Express", price: 89.99, ageGroup: "8+", complexity: "medium", buildTime: "2-4 hours" }
  ],
  
  // Technic Series
  technic: [
    { name: "McLaren P1", price: 449.99, ageGroup: "18+", complexity: "high", buildTime: "8-12 hours" },
    { name: "Liebherr Excavator", price: 479.99, ageGroup: "11+", complexity: "high", buildTime: "6-10 hours" },
    { name: "Ducati Panigale V4 R", price: 69.99, ageGroup: "10+", complexity: "medium", buildTime: "2-4 hours" }
  ],
  
  // Creator 3-in-1 Series
  creator: [
    { name: "Deep Sea Creatures", price: 79.99, ageGroup: "7+", complexity: "medium", buildTime: "2-4 hours" },
    { name: "Cyber Drone", price: 39.99, ageGroup: "8+", complexity: "medium", buildTime: "1-3 hours" },
    { name: "Supersonic Jet", price: 99.99, ageGroup: "9+", complexity: "medium", buildTime: "3-5 hours" }
  ],
  
  // Friends Series
  friends: [
    { name: "Heartlake City School", price: 79.99, ageGroup: "6+", complexity: "medium", buildTime: "2-4 hours" },
    { name: "Emma's Art Studio", price: 29.99, ageGroup: "6+", complexity: "low", buildTime: "1-2 hours" },
    { name: "Olivia's Space Academy", price: 99.99, ageGroup: "8+", complexity: "medium", buildTime: "3-5 hours" }
  ],
  
  // City Series
  city: [
    { name: "Police Station", price: 89.99, ageGroup: "5+", complexity: "medium", buildTime: "2-4 hours" },
    { name: "Fire Station", price: 119.99, ageGroup: "6+", complexity: "medium", buildTime: "3-5 hours" },
    { name: "Airport Passenger Terminal", price: 129.99, ageGroup: "6+", complexity: "medium", buildTime: "3-6 hours" }
  ]
};

// Consumer Demographics and Behavior Patterns
const CONSUMER_SEGMENTS = {
  "Adult Collectors": {
    ageRange: [25, 65],
    avgSpending: 450,
    preferredCategories: ["architecture", "technic", "starwars"],
    purchaseFrequency: "monthly",
    seasonality: { holiday: 1.8, birthday: 1.2, regular: 1.0 },
    loyaltyScore: 0.85,
    pricesensitivity: "low"
  },
  
  "Parents": {
    ageRange: [28, 50],
    avgSpending: 180,
    preferredCategories: ["city", "friends", "creator", "ninjago"],
    purchaseFrequency: "quarterly",
    seasonality: { holiday: 2.5, birthday: 2.0, backtoschool: 1.3, regular: 0.8 },
    loyaltyScore: 0.72,
    pricesensitivity: "medium"
  },
  
  "Teens and Young Adults": {
    ageRange: [13, 24],
    avgSpending: 120,
    preferredCategories: ["starwars", "ninjago", "harrypotter", "technic"],
    purchaseFrequency: "biannually",
    seasonality: { holiday: 1.5, birthday: 1.8, regular: 0.9 },
    loyaltyScore: 0.65,
    pricesensitivity: "high"
  },
  
  "Gift Buyers": {
    ageRange: [25, 70],
    avgSpending: 95,
    preferredCategories: ["friends", "city", "creator", "harrypotter"],
    purchaseFrequency: "seasonally",
    seasonality: { holiday: 3.2, birthday: 2.8, graduation: 1.5, regular: 0.3 },
    loyaltyScore: 0.45,
    pricesensitivity: "medium"
  },
  
  "Serious Builders": {
    ageRange: [18, 55],
    avgSpending: 650,
    preferredCategories: ["architecture", "technic", "starwars"],
    purchaseFrequency: "monthly",
    seasonality: { holiday: 1.4, newrelease: 2.1, regular: 1.0 },
    loyaltyScore: 0.92,
    pricesensitivity: "low"
  }
};

// Geographic and Demographic Data
const LOCATIONS = [
  { region: "North America", countries: ["USA", "Canada", "Mexico"], marketSize: 0.35 },
  { region: "Europe", countries: ["Germany", "UK", "France", "Italy", "Spain", "Netherlands"], marketSize: 0.28 },
  { region: "Asia Pacific", countries: ["Japan", "Australia", "South Korea", "Singapore"], marketSize: 0.22 },
  { region: "Emerging Markets", countries: ["Brazil", "India", "China", "Russia"], marketSize: 0.15 }
];

// Generate Consumer Profiles
function generateConsumerProfiles(count = 10000) {
  const profiles = [];
  const segments = Object.keys(CONSUMER_SEGMENTS);
  
  for (let i = 0; i < count; i++) {
    const segment = segments[Math.floor(Math.random() * segments.length)];
    const segmentData = CONSUMER_SEGMENTS[segment];
    const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    const country = location.countries[Math.floor(Math.random() * location.countries.length)];
    
    const profile = {
      consumer_id: `LEGO_${String(i + 1).padStart(6, '0')}`,
      segment: segment,
      age: Math.floor(Math.random() * (segmentData.ageRange[1] - segmentData.ageRange[0] + 1)) + segmentData.ageRange[0],
      region: location.region,
      country: country,
      annual_spending_capacity: Math.floor(segmentData.avgSpending * (0.7 + Math.random() * 0.6)),
      loyalty_score: Math.round((segmentData.loyaltyScore + (Math.random() - 0.5) * 0.2) * 100) / 100,
      price_sensitivity: segmentData.pricesensitivity,
      preferred_categories: segmentData.preferredCategories.join(", "),
      purchase_frequency: segmentData.purchaseFrequency,
      registration_date: generateRandomDate(new Date(2020, 0, 1), new Date(2024, 11, 31)),
      total_lifetime_purchases: 0,
      average_order_value: 0,
      last_purchase_date: null
    };
    
    profiles.push(profile);
  }
  
  return profiles;
}

// Generate Purchase History
function generatePurchaseHistory(consumerProfiles, transactionCount = 50000) {
  const purchases = [];
  const allProducts = [];
  
  // Flatten all products
  Object.keys(LEGO_PRODUCTS).forEach(category => {
    LEGO_PRODUCTS[category].forEach(product => {
      allProducts.push({ ...product, category });
    });
  });
  
  for (let i = 0; i < transactionCount; i++) {
    const consumer = consumerProfiles[Math.floor(Math.random() * consumerProfiles.length)];
    const segmentData = CONSUMER_SEGMENTS[consumer.segment];
    
    // Select product based on consumer preferences
    const preferredCategories = consumer.preferred_categories.split(", ");
    const availableProducts = allProducts.filter(p => 
      preferredCategories.includes(p.category)
    );
    
    const product = availableProducts.length > 0 
      ? availableProducts[Math.floor(Math.random() * availableProducts.length)]
      : allProducts[Math.floor(Math.random() * allProducts.length)];
    
    // Apply price sensitivity
    let purchaseProbability = 1.0;
    if (consumer.price_sensitivity === "high" && product.price > 100) {
      purchaseProbability = 0.3;
    } else if (consumer.price_sensitivity === "medium" && product.price > 200) {
      purchaseProbability = 0.6;
    }
    
    if (Math.random() > purchaseProbability) continue;
    
    // Generate seasonal variations
    const purchaseDate = generateRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31));
    const season = getSeasonFromDate(purchaseDate);
    const seasonalMultiplier = segmentData.seasonality[season] || 1.0;
    
    // Determine quantity (usually 1, but can be more for gifts)
    const quantity = Math.random() < 0.15 ? Math.floor(Math.random() * 3) + 2 : 1;
    
    // Calculate discount based on loyalty and season
    const baseDiscount = consumer.loyalty_score > 0.8 ? 0.1 : 0;
    const seasonalDiscount = season === "holiday" ? 0.15 : 0;
    const totalDiscount = Math.min(baseDiscount + seasonalDiscount, 0.25);
    
    const originalPrice = product.price * quantity;
    const finalPrice = originalPrice * (1 - totalDiscount);
    
    const purchase = {
      transaction_id: `TXN_${String(i + 1).padStart(8, '0')}`,
      consumer_id: consumer.consumer_id,
      product_name: product.name,
      category: product.category,
      age_group: product.ageGroup,
      complexity: product.complexity,
      build_time: product.buildTime,
      quantity: quantity,
      unit_price: product.price,
      total_original_price: Math.round(originalPrice * 100) / 100,
      discount_applied: Math.round(totalDiscount * 100),
      final_price: Math.round(finalPrice * 100) / 100,
      purchase_date: purchaseDate.toISOString().split('T')[0],
      purchase_month: purchaseDate.getMonth() + 1,
      purchase_year: purchaseDate.getFullYear(),
      season: season,
      purchase_channel: Math.random() < 0.7 ? "online" : "retail_store",
      payment_method: getRandomPaymentMethod(),
      shipping_cost: Math.random() < 0.3 ? Math.round(Math.random() * 15 + 5) : 0,
      customer_satisfaction: Math.round((4 + Math.random()) * 10) / 10,
      review_score: Math.floor(Math.random() * 2) + 4 // 4-5 stars mostly
    };
    
    purchases.push(purchase);
    
    // Update consumer profile
    consumer.total_lifetime_purchases += finalPrice;
    consumer.last_purchase_date = purchase.purchase_date;
  }
  
  // Calculate average order values
  consumerProfiles.forEach(consumer => {
    const consumerPurchases = purchases.filter(p => p.consumer_id === consumer.consumer_id);
    if (consumerPurchases.length > 0) {
      consumer.average_order_value = Math.round(
        (consumerPurchases.reduce((sum, p) => sum + p.final_price, 0) / consumerPurchases.length) * 100
      ) / 100;
    }
  });
  
  return purchases;
}

// Helper Functions
function generateRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getSeasonFromDate(date) {
  const month = date.getMonth() + 1;
  if (month >= 11 || month <= 1) return "holiday";
  if (month >= 8 && month <= 9) return "backtoschool";
  if (month >= 3 && month <= 5) return "birthday";
  if (month === 6) return "graduation";
  return "regular";
}

function getRandomPaymentMethod() {
  const methods = ["credit_card", "debit_card", "paypal", "apple_pay", "google_pay", "bank_transfer"];
  return methods[Math.floor(Math.random() * methods.length)];
}

// Analytics Functions
function analyzePurchaseBehavior(purchases, profiles) {
  const analytics = {
    totalRevenue: purchases.reduce((sum, p) => sum + p.final_price, 0),
    totalTransactions: purchases.length,
    averageOrderValue: 0,
    categoryPerformance: {},
    segmentAnalysis: {},
    seasonalTrends: {},
    geographicDistribution: {},
    loyaltyImpact: {}
  };
  
  // Calculate average order value
  analytics.averageOrderValue = Math.round((analytics.totalRevenue / analytics.totalTransactions) * 100) / 100;
  
  // Category performance
  const categoryStats = {};
  purchases.forEach(p => {
    if (!categoryStats[p.category]) {
      categoryStats[p.category] = { revenue: 0, transactions: 0, units: 0 };
    }
    categoryStats[p.category].revenue += p.final_price;
    categoryStats[p.category].transactions += 1;
    categoryStats[p.category].units += p.quantity;
  });
  
  Object.keys(categoryStats).forEach(category => {
    analytics.categoryPerformance[category] = {
      revenue: Math.round(categoryStats[category].revenue * 100) / 100,
      transactions: categoryStats[category].transactions,
      units: categoryStats[category].units,
      avgOrderValue: Math.round((categoryStats[category].revenue / categoryStats[category].transactions) * 100) / 100,
      revenueShare: Math.round((categoryStats[category].revenue / analytics.totalRevenue) * 10000) / 100
    };
  });
  
  // Segment analysis
  const segmentStats = {};
  profiles.forEach(p => {
    if (!segmentStats[p.segment]) {
      segmentStats[p.segment] = { 
        customers: 0, 
        totalSpending: 0, 
        avgLifetimeValue: 0,
        avgLoyalty: 0 
      };
    }
    segmentStats[p.segment].customers += 1;
    segmentStats[p.segment].totalSpending += p.total_lifetime_purchases;
    segmentStats[p.segment].avgLoyalty += p.loyalty_score;
  });
  
  Object.keys(segmentStats).forEach(segment => {
    const stats = segmentStats[segment];
    analytics.segmentAnalysis[segment] = {
      customerCount: stats.customers,
      totalSpending: Math.round(stats.totalSpending * 100) / 100,
      avgLifetimeValue: Math.round((stats.totalSpending / stats.customers) * 100) / 100,
      avgLoyaltyScore: Math.round((stats.avgLoyalty / stats.customers) * 100) / 100,
      customerShare: Math.round((stats.customers / profiles.length) * 10000) / 100
    };
  });
  
  return analytics;
}

// Export to CSV
async function exportToCSV(profiles, purchases, analytics) {
  // Consumer Profiles CSV
  const profileWriter = createObjectCsvWriter({
    path: join(__dirname, 'consumer_profiles.csv'),
    header: [
      { id: 'consumer_id', title: 'Consumer_ID' },
      { id: 'segment', title: 'Segment' },
      { id: 'age', title: 'Age' },
      { id: 'region', title: 'Region' },
      { id: 'country', title: 'Country' },
      { id: 'annual_spending_capacity', title: 'Annual_Spending_Capacity' },
      { id: 'loyalty_score', title: 'Loyalty_Score' },
      { id: 'price_sensitivity', title: 'Price_Sensitivity' },
      { id: 'preferred_categories', title: 'Preferred_Categories' },
      { id: 'purchase_frequency', title: 'Purchase_Frequency' },
      { id: 'registration_date', title: 'Registration_Date' },
      { id: 'total_lifetime_purchases', title: 'Total_Lifetime_Purchases' },
      { id: 'average_order_value', title: 'Average_Order_Value' },
      { id: 'last_purchase_date', title: 'Last_Purchase_Date' }
    ]
  });
  
  // Purchase History CSV
  const purchaseWriter = createObjectCsvWriter({
    path: join(__dirname, 'purchase_history.csv'),
    header: [
      { id: 'transaction_id', title: 'Transaction_ID' },
      { id: 'consumer_id', title: 'Consumer_ID' },
      { id: 'product_name', title: 'Product_Name' },
      { id: 'category', title: 'Category' },
      { id: 'age_group', title: 'Age_Group' },
      { id: 'complexity', title: 'Complexity' },
      { id: 'build_time', title: 'Build_Time' },
      { id: 'quantity', title: 'Quantity' },
      { id: 'unit_price', title: 'Unit_Price' },
      { id: 'total_original_price', title: 'Total_Original_Price' },
      { id: 'discount_applied', title: 'Discount_Applied_Percent' },
      { id: 'final_price', title: 'Final_Price' },
      { id: 'purchase_date', title: 'Purchase_Date' },
      { id: 'purchase_month', title: 'Purchase_Month' },
      { id: 'purchase_year', title: 'Purchase_Year' },
      { id: 'season', title: 'Season' },
      { id: 'purchase_channel', title: 'Purchase_Channel' },
      { id: 'payment_method', title: 'Payment_Method' },
      { id: 'shipping_cost', title: 'Shipping_Cost' },
      { id: 'customer_satisfaction', title: 'Customer_Satisfaction' },
      { id: 'review_score', title: 'Review_Score' }
    ]
  });
  
  // Analytics Summary CSV
  const analyticsData = [
    { metric: 'Total Revenue', value: analytics.totalRevenue },
    { metric: 'Total Transactions', value: analytics.totalTransactions },
    { metric: 'Average Order Value', value: analytics.averageOrderValue },
    { metric: 'Top Category by Revenue', value: Object.keys(analytics.categoryPerformance).reduce((a, b) => 
      analytics.categoryPerformance[a].revenue > analytics.categoryPerformance[b].revenue ? a : b) },
    { metric: 'Most Valuable Segment', value: Object.keys(analytics.segmentAnalysis).reduce((a, b) => 
      analytics.segmentAnalysis[a].avgLifetimeValue > analytics.segmentAnalysis[b].avgLifetimeValue ? a : b) }
  ];
  
  const analyticsWriter = createObjectCsvWriter({
    path: join(__dirname, 'analytics_summary.csv'),
    header: [
      { id: 'metric', title: 'Metric' },
      { id: 'value', title: 'Value' }
    ]
  });
  
  try {
    await profileWriter.writeRecords(profiles);
    await purchaseWriter.writeRecords(purchases);
    await analyticsWriter.writeRecords(analyticsData);
    
    console.log('✅ All CSV files have been generated successfully!');
    console.log('📊 Files created:');
    console.log('  - consumer_profiles.csv');
    console.log('  - purchase_history.csv'); 
    console.log('  - analytics_summary.csv');
    
    return { profiles, purchases, analytics };
  } catch (error) {
    console.error('❌ Error writing CSV files:', error);
    throw error;
  }
}

// Main execution function
async function runConsumerBehaviorAnalysis() {
  console.log('🚀 Starting Consumer Behavior Analysis Framework...');
  console.log('📊 Generating synthetic consumer data based on LEGO product analysis...');
  
  try {
    // Generate data
    console.log('👥 Generating consumer profiles...');
    const profiles = generateConsumerProfiles(5000);
    
    console.log('🛒 Generating purchase history...');
    const purchases = generatePurchaseHistory(profiles, 25000);
    
    console.log('📈 Analyzing purchase behavior...');
    const analytics = analyzePurchaseBehavior(purchases, profiles);
    
    console.log('💾 Exporting data to CSV files...');
    await exportToCSV(profiles, purchases, analytics);
    
    // Display summary statistics
    console.log('\n📊 ANALYSIS SUMMARY:');
    console.log('======================');
    console.log(`Total Consumers: ${profiles.length}`);
    console.log(`Total Transactions: ${analytics.totalTransactions}`);
    console.log(`Total Revenue: $${analytics.totalRevenue.toLocaleString()}`);
    console.log(`Average Order Value: $${analytics.averageOrderValue}`);
    
    console.log('\n🏆 TOP PERFORMING CATEGORIES:');
    Object.entries(analytics.categoryPerformance)
      .sort(([,a], [,b]) => b.revenue - a.revenue)
      .slice(0, 5)
      .forEach(([category, stats]) => {
        console.log(`  ${category}: $${stats.revenue.toLocaleString()} (${stats.revenueShare}%)`);
      });
    
    console.log('\n👥 CUSTOMER SEGMENTS:');
    Object.entries(analytics.segmentAnalysis)
      .sort(([,a], [,b]) => b.avgLifetimeValue - a.avgLifetimeValue)
      .forEach(([segment, stats]) => {
        console.log(`  ${segment}: ${stats.customerCount} customers, $${stats.avgLifetimeValue} avg LTV`);
      });
    
    return { profiles, purchases, analytics };
    
  } catch (error) {
    console.error('❌ Error in consumer behavior analysis:', error);
    throw error;
  }
}

// Export for use in other modules
export { runConsumerBehaviorAnalysis, generateConsumerProfiles, generatePurchaseHistory, analyzePurchaseBehavior };

// Run if this file is executed directly
if (import.meta.url === `file://${__filename}`) {
  runConsumerBehaviorAnalysis()
    .then(() => {
      console.log('\n✅ Consumer Behavior Analysis completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Analysis failed:', error);
      process.exit(1);
    });
} 