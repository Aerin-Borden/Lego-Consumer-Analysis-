import fs from 'fs';
import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import { createObjectCsvWriter } from 'csv-writer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Triplet extraction functions
function extractConsumerProfileTriplets(profile) {
  const triplets = [];
  const consumerId = profile.Consumer_ID;
  
  // Basic demographic triplets
  triplets.push({
    subject: consumerId,
    predicate: "hasSegment",
    object: profile.Segment,
    confidence: 1.0,
    source: "consumer_profiles",
    type: "demographic"
  });
  
  triplets.push({
    subject: consumerId,
    predicate: "hasAge",
    object: profile.Age,
    confidence: 1.0,
    source: "consumer_profiles",
    type: "demographic"
  });
  
  triplets.push({
    subject: consumerId,
    predicate: "livesIn",
    object: profile.Country,
    confidence: 1.0,
    source: "consumer_profiles",
    type: "geographic"
  });
  
  triplets.push({
    subject: consumerId,
    predicate: "belongsToRegion",
    object: profile.Region,
    confidence: 1.0,
    source: "consumer_profiles",
    type: "geographic"
  });
  
  // Behavioral triplets
  triplets.push({
    subject: consumerId,
    predicate: "hasLoyaltyScore",
    object: profile.Loyalty_Score,
    confidence: 1.0,
    source: "consumer_profiles",
    type: "behavioral"
  });
  
  triplets.push({
    subject: consumerId,
    predicate: "hasPriceSensitivity",
    object: profile.Price_Sensitivity,
    confidence: 1.0,
    source: "consumer_profiles",
    type: "behavioral"
  });
  
  triplets.push({
    subject: consumerId,
    predicate: "purchasesWithFrequency",
    object: profile.Purchase_Frequency,
    confidence: 1.0,
    source: "consumer_profiles",
    type: "behavioral"
  });
  
  // Financial triplets
  triplets.push({
    subject: consumerId,
    predicate: "hasSpendingCapacity",
    object: profile.Annual_Spending_Capacity,
    confidence: 1.0,
    source: "consumer_profiles",
    type: "financial"
  });
  
  if (profile.Average_Order_Value && parseFloat(profile.Average_Order_Value) > 0) {
    triplets.push({
      subject: consumerId,
      predicate: "hasAverageOrderValue",
      object: profile.Average_Order_Value,
      confidence: 1.0,
      source: "consumer_profiles",
      type: "financial"
    });
  }
  
  if (profile.Total_Lifetime_Purchases && parseFloat(profile.Total_Lifetime_Purchases) > 0) {
    triplets.push({
      subject: consumerId,
      predicate: "hasLifetimeValue",
      object: profile.Total_Lifetime_Purchases,
      confidence: 1.0,
      source: "consumer_profiles",
      type: "financial"
    });
  }
  
  // Preference triplets - split preferred categories
  if (profile.Preferred_Categories) {
    const categories = profile.Preferred_Categories.split(', ');
    categories.forEach(category => {
      triplets.push({
        subject: consumerId,
        predicate: "prefers",
        object: category.trim(),
        confidence: 0.8,
        source: "consumer_profiles",
        type: "preference"
      });
    });
  }
  
  // Temporal triplets
  if (profile.Registration_Date) {
    const regDate = new Date(profile.Registration_Date);
    triplets.push({
      subject: consumerId,
      predicate: "registeredIn",
      object: regDate.getFullYear().toString(),
      confidence: 1.0,
      source: "consumer_profiles",
      type: "temporal"
    });
    
    triplets.push({
      subject: consumerId,
      predicate: "registeredOn",
      object: profile.Registration_Date.split(' ')[0], // Just the date part
      confidence: 1.0,
      source: "consumer_profiles",
      type: "temporal"
    });
  }
  
  if (profile.Last_Purchase_Date && profile.Last_Purchase_Date !== 'null') {
    triplets.push({
      subject: consumerId,
      predicate: "lastPurchasedOn",
      object: profile.Last_Purchase_Date,
      confidence: 1.0,
      source: "consumer_profiles",
      type: "temporal"
    });
  }
  
  // Derived analytical triplets
  const loyaltyScore = parseFloat(profile.Loyalty_Score);
  if (loyaltyScore >= 0.8) {
    triplets.push({
      subject: consumerId,
      predicate: "isClassifiedAs",
      object: "HighLoyaltyCustomer",
      confidence: 0.9,
      source: "consumer_profiles",
      type: "analytical"
    });
  } else if (loyaltyScore >= 0.6) {
    triplets.push({
      subject: consumerId,
      predicate: "isClassifiedAs",
      object: "MediumLoyaltyCustomer",
      confidence: 0.9,
      source: "consumer_profiles",
      type: "analytical"
    });
  } else {
    triplets.push({
      subject: consumerId,
      predicate: "isClassifiedAs",
      object: "LowLoyaltyCustomer",
      confidence: 0.9,
      source: "consumer_profiles",
      type: "analytical"
    });
  }
  
  // Age group classification
  const age = parseInt(profile.Age);
  let ageGroup;
  if (age < 18) ageGroup = "Minor";
  else if (age < 25) ageGroup = "YoungAdult";
  else if (age < 35) ageGroup = "Millennial";
  else if (age < 50) ageGroup = "GenX";
  else if (age < 65) ageGroup = "BabyBoomer";
  else ageGroup = "Senior";
  
  triplets.push({
    subject: consumerId,
    predicate: "belongsToAgeGroup",
    object: ageGroup,
    confidence: 0.95,
    source: "consumer_profiles",
    type: "analytical"
  });
  
  // Spending capacity classification
  const spendingCapacity = parseFloat(profile.Annual_Spending_Capacity);
  let spendingTier;
  if (spendingCapacity >= 500) spendingTier = "HighSpender";
  else if (spendingCapacity >= 300) spendingTier = "MediumSpender";
  else spendingTier = "LowSpender";
  
  triplets.push({
    subject: consumerId,
    predicate: "isClassifiedAs",
    object: spendingTier,
    confidence: 0.85,
    source: "consumer_profiles",
    type: "analytical"
  });
  
  return triplets;
}

// Enhanced triplet extraction with relationships
function extractEnhancedTriplets(profiles) {
  const allTriplets = [];
  const segmentCounts = {};
  const regionCounts = {};
  
  // Process individual profiles
  profiles.forEach(profile => {
    const profileTriplets = extractConsumerProfileTriplets(profile);
    allTriplets.push(...profileTriplets);
    
    // Count segments and regions for aggregate triplets
    segmentCounts[profile.Segment] = (segmentCounts[profile.Segment] || 0) + 1;
    regionCounts[profile.Region] = (regionCounts[profile.Region] || 0) + 1;
  });
  
  // Add aggregate/statistical triplets
  Object.entries(segmentCounts).forEach(([segment, count]) => {
    allTriplets.push({
      subject: segment,
      predicate: "hasCustomerCount",
      object: count.toString(),
      confidence: 1.0,
      source: "consumer_profiles",
      type: "statistical"
    });
    
    allTriplets.push({
      subject: "ConsumerBase",
      predicate: "includesSegment",
      object: segment,
      confidence: 1.0,
      source: "consumer_profiles",
      type: "statistical"
    });
  });
  
  Object.entries(regionCounts).forEach(([region, count]) => {
    allTriplets.push({
      subject: region,
      predicate: "hasCustomerCount",
      object: count.toString(),
      confidence: 1.0,
      source: "consumer_profiles",
      type: "statistical"
    });
    
    allTriplets.push({
      subject: "ConsumerBase",
      predicate: "includesRegion",
      object: region,
      confidence: 1.0,
      source: "consumer_profiles",
      type: "statistical"
    });
  });
  
  // Cross-reference triplets (relationships between entities)
  profiles.forEach(profile => {
    // Segment-Region relationships
    allTriplets.push({
      subject: profile.Segment,
      predicate: "isFoundIn",
      object: profile.Region,
      confidence: 0.7,
      source: "consumer_profiles",
      type: "relationship"
    });
    
    // Country-Region relationships
    allTriplets.push({
      subject: profile.Country,
      predicate: "belongsToRegion",
      object: profile.Region,
      confidence: 1.0,
      source: "consumer_profiles",
      type: "relationship"
    });
  });
  
  return allTriplets;
}

// Load and process consumer profiles
async function loadConsumerProfiles() {
  console.log('📊 Loading consumer profiles...');
  const profiles = [];
  
  const stream = createReadStream('consumer_profiles.csv')
    .pipe(parse({ columns: true, skip_empty_lines: true }));
  
  for await (const record of stream) {
    profiles.push(record);
  }
  
  console.log(`✅ Loaded ${profiles.length} consumer profiles`);
  return profiles;
}

// Export triplets to CSV
async function exportTripletsToCSV(triplets) {
  console.log('💾 Exporting triplets to CSV...');
  
  const csvWriter = createObjectCsvWriter({
    path: join(__dirname, 'consumer_profile_triplets.csv'),
    header: [
      { id: 'subject', title: 'Subject' },
      { id: 'predicate', title: 'Predicate' },
      { id: 'object', title: 'Object' },
      { id: 'confidence', title: 'Confidence' },
      { id: 'source', title: 'Source' },
      { id: 'type', title: 'Type' }
    ]
  });
  
  try {
    await csvWriter.writeRecords(triplets);
    console.log('✅ Consumer profile triplets exported successfully!');
    console.log(`📄 File: consumer_profile_triplets.csv`);
    console.log(`📊 Total triplets: ${triplets.length}`);
    
    return triplets;
  } catch (error) {
    console.error('❌ Error exporting triplets:', error);
    throw error;
  }
}

// Analyze triplet patterns
function analyzeTripletPatterns(triplets) {
  console.log('\n🔍 Analyzing triplet patterns...');
  
  const analysis = {
    totalTriplets: triplets.length,
    predicateDistribution: {},
    typeDistribution: {},
    confidenceDistribution: {},
    subjectTypes: new Set(),
    objectTypes: new Set()
  };
  
  triplets.forEach(triplet => {
    // Predicate distribution
    analysis.predicateDistribution[triplet.predicate] = 
      (analysis.predicateDistribution[triplet.predicate] || 0) + 1;
    
    // Type distribution
    analysis.typeDistribution[triplet.type] = 
      (analysis.typeDistribution[triplet.type] || 0) + 1;
    
    // Confidence distribution
    const confRange = Math.floor(triplet.confidence * 10) / 10;
    analysis.confidenceDistribution[confRange] = 
      (analysis.confidenceDistribution[confRange] || 0) + 1;
    
    // Subject and object types
    analysis.subjectTypes.add(triplet.subject.toString().split('_')[0]);
    analysis.objectTypes.add(typeof triplet.object);
  });
  
  console.log('📊 TRIPLET ANALYSIS:');
  console.log('====================');
  console.log(`Total Triplets: ${analysis.totalTriplets}`);
  
  console.log('\n🏷️ Top Predicates:');
  Object.entries(analysis.predicateDistribution)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .forEach(([predicate, count]) => {
      console.log(`  ${predicate}: ${count}`);
    });
  
  console.log('\n📂 Type Distribution:');
  Object.entries(analysis.typeDistribution)
    .sort(([,a], [,b]) => b - a)
    .forEach(([type, count]) => {
      console.log(`  ${type}: ${count} (${(count/analysis.totalTriplets*100).toFixed(1)}%)`);
    });
  
  console.log('\n🎯 Confidence Distribution:');
  Object.entries(analysis.confidenceDistribution)
    .sort(([a,], [b,]) => b - a)
    .forEach(([conf, count]) => {
      console.log(`  ${conf}: ${count} triplets`);
    });
  
  return analysis;
}

// Main execution function
async function extractConsumerTriplets() {
  console.log('🚀 Starting Consumer Profile Triplet Extraction...');
  console.log('===================================================');
  
  try {
    // Load consumer profiles
    const profiles = await loadConsumerProfiles();
    
    // Extract triplets
    console.log('🔄 Extracting triplets from consumer profiles...');
    const triplets = extractEnhancedTriplets(profiles);
    
    // Analyze patterns
    const analysis = analyzeTripletPatterns(triplets);
    
    // Export to CSV
    await exportTripletsToCSV(triplets);
    
    console.log('\n✅ Triplet extraction completed successfully!');
    console.log(`📊 Generated ${triplets.length} triplets from ${profiles.length} consumer profiles`);
    
    return { triplets, analysis, profiles };
    
  } catch (error) {
    console.error('❌ Error in triplet extraction:', error);
    throw error;
  }
}

// Export functions for use in other modules
export { 
  extractConsumerProfileTriplets, 
  extractEnhancedTriplets, 
  analyzeTripletPatterns, 
  extractConsumerTriplets 
};

// Run if executed directly
if (import.meta.url.includes(process.argv[1])) {
  extractConsumerTriplets()
    .then(() => {
      console.log('\n🎉 Consumer triplet extraction completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Triplet extraction failed:', error);
      process.exit(1);
    });
} 