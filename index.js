const fs = require('fs');

// Read the JSON file
const rawComps = fs.readFileSync('./comps.json');
const comps = JSON.parse(rawComps);

console.log(comps);

function calculateMinkowskiDistance(property1, property2, weights, p = 2) {
  let distance = 0;

  const rentPrice1 = property1.rentPrice;
  const rentPrice2 = property2.rentPrice;
  const rentPriceWeight = weights.rentPrice;
  distance += rentPriceWeight * Math.abs(rentPrice1 - rentPrice2);

  const constructionType1 = property1.constructionType;
  const constructionType2 = property2.constructionType;
  const constructionTypeWeight = weights.constructionType;
  if (constructionType1 !== constructionType2) {
    distance += constructionTypeWeight;
  }

  // Add more attributes and their respective calculations as needed

  distance = Math.pow(distance, 1 / p);
  return distance;
}

function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371; // Radius of the Earth in kilometers

  const degToRad = (degrees) => degrees * (Math.PI / 180);
  const deltaLat = degToRad(lat2 - lat1);
  const deltaLon = degToRad(lon2 - lon1);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(degToRad(lat1)) *
      Math.cos(degToRad(lat2)) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;

  return distance;
}
function calculateSimilarityScore(property1, potentialComps, weights, p = 2) {
  const maxDistance = 10; // Maximum possible distance based on your attribute range

  const similarityScores = potentialComps.map((comp) => {
    const minkowskiDistance = calculateMinkowskiDistance(
      property1,
      comp,
      weights,
      p
    );
    const haversineDistance = calculateHaversineDistance(
      property1.latitude,
      property1.longitude,
      comp.latitude,
      comp.longitude
    );

    // Combine the Minkowski and Haversine distances
    const distance = minkowskiDistance + haversineDistance;

    const similarity = 1 - distance / (maxDistance + 2);
    const similarityScore = Math.round(similarity * 100);
    return similarityScore;
  });

  return similarityScores;
}

// Example usage
const property1 = {
  rentPrice: 1500,
  constructionType: 'Apartment',
  latitude: 52.52,
  longitude: 13.405,
};

const potentialComps = [
  {
    rentPrice: 1800,
    constructionType: 'House',
    latitude: 48.8566,
    longitude: 2.3522,
  },
  {
    rentPrice: 1400,
    constructionType: 'Apartment',
    latitude: 51.5074,
    longitude: -0.1278,
  },
  // Add more potential comps as needed
];

const weights = {
  rentPrice: 5,
  constructionType: 2,
  // Add more attribute weights as needed
};

const similarityScores = calculateSimilarityScore(
  property1,
  potentialComps,
  weights
);
console.log('Similarity Scores:');
similarityScores.forEach((score, index) => {
  console.log(`Comp ${index + 1}: ${score}`);
});
