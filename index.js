const haversine = require('haversine-distance');

class Property {
    constructor(name, lat, lng, ner, walkscore, constructionType, type) {
        this.name = name;
        this.lat = lat;
        this.lng = lng;
        this.ner = ner;
        this.walkscore = walkscore;
        this.constructionType = constructionType;
        this.type = type || 'comp';
    }
}

function normalize(value, min, max) {
    return (value - min) / (max - min);
}

function calculateSimilarity(subject, comp, weights) {
    const loc1 = { lat: subject.lat, lng: subject.lng };
    const loc2 = { lat: comp.lat, lng: comp.lng };
    
    const maxNER = Math.max(subject.ner, comp.ner);
    const maxWalkscore = Math.max(subject.wlkscore, comp.walkscore);
    
    const physicalDiff = weights.physicalDistance * normalize(haversine(loc1, loc2), 0, maxPhysicalDistance);
    const nerDiff = weights.ner * normalize(Math.abs(subject.ner - comp.ner), 0, maxNER);
    const walkscoreDiff = weights.walkscore * normalize(Math.abs(subject.walkscore - comp.walkscore), 0, maxWalkscore);
    const constructionDiff = (subject.constructionType === comp.constructionType) ? 0 : weights.constructionType;

    const similarityScore = (1 - ((physicalDiff + nerDiff + walkscoreDiff + constructionDiff) / 100)) * 100;
    return similarityScore;
}

const constructionTypes = ["BTR/SFR", "Garden", "Platform", "Wrap", "Mid-rise", "High-rise"];


// Generate random values
const name = "Subject Property"; // You can also make it random if you want
const lat = getRandomInRange(-90, 90); // Latitude is in the range of -90 to 90
const lng = getRandomInRange(-180, 180); // Longitude is in the range of -180 to 180
const ner = Math.round(getRandomInRange(500, 2000)); // NER is in the range of 500 to 2000
const walkscore = Math.round(getRandomInRange(10, 100)); // Walkscore is in the range of 10 to 100
const constructionType = constructionTypes[Math.floor(Math.random() * constructionTypes.length)]; // Select a random construction type

// Create the subject property with the generated values
let subjectProperty = new Property(name, lat, lng, ner, walkscore, constructionType, 'Subject');


// Array of common names
const commonNames = ["Waterfront Mansions", "Downtown Heights", "Riverside Residences", "City Center Lofts", "Suburban Villas", "Metropolitan Towers", "Cosmopolitan Condos", "Skyline Apartments", "Sunset Gardens", "Lakeside Cottages", "Oceanview Estates", "Mountain Peaks", "Seaside Townhomes", "Parkside Flats", "Highland Suites", "Bayview Complex", "Horizon Hills", "Countryside Communities", "Forest Grove", "Prairie Homes"];

// Array of construction types

// Array to hold properties
let properties = [];

// Function to generate a random number in a range
function getRandomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

for(let i = 0; i < 20; i++) {
    // Generate random values
    const name = commonNames[i]; // Assign names from the array in order
    const lat = getRandomInRange(-90, 90); // Latitude is in the range of -90 to 90
    const lng = getRandomInRange(-180, 180); // Longitude is in the range of -180 to 180
    const ner = Math.round(getRandomInRange(500, 2000)); // NER is in the range of 500 to 2000
    const walkscore = Math.round(getRandomInRange(10, 100)); // Walkscore is in the range of 10 to 100
    const constructionType = constructionTypes[Math.floor(Math.random() * constructionTypes.length)]; // Select a random construction type

    // Create a new property with the generated values and add it to the array
    properties.push(new Property(name, lat, lng, ner, walkscore, constructionType, 'Comp'));
}

let weights = {
    physicalDistance: 40,
    walkscore: 10,
    constructionType: 40,
    ner: 20
};

// Calculate the max physical distance for normalization
let maxPhysicalDistance = 0;
for (let i = 0; i < properties.length; i++) {
    const loc1 = { lat: subjectProperty.lat, lng: subjectProperty.lng };
    const loc2 = { lat: properties[i].lat, lng: properties[i].lng };
    const distance = haversine(loc1, loc2);
    if (distance > maxPhysicalDistance) maxPhysicalDistance = distance;
}

// Calculate similarity scores and store them along with the properties

properties.unshift(subjectProperty);

let similarityScores = properties.map(property => {
  return {
      'Property Name': property.name,
      'Similarity (%)': calculateSimilarity(subjectProperty, property, weights).toFixed(2),
      'Type': property.type,
      'Location': `(${property.lat}, ${property.lng})`,
      'NER': property.ner,
      'Walkscore': property.walkscore,
      'Construction Type': property.constructionType
  };
});

// Sort the scores in descending order
similarityScores.sort((a, b) => b['Similarity (%)'] - a['Similarity (%)']);

// Print the results
console.log("Properties ranked by similarity to the subject property:");
console.table(similarityScores);
