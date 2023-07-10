const haversine = require('haversine-distance');

class Property {
    constructor(name, lat, lng, ner, walkscore, constructionType) {
        this.name = name;
        this.lat = lat;
        this.lng = lng;
        this.ner = ner;
        this.walkscore = walkscore;
        this.constructionType = constructionType;
    }
}

function normalize(value, min, max) {
    return (value - min) / (max - min);
}

function calculateSimilarity(subject, comp, weights) {
    const loc1 = { lat: subject.lat, lng: subject.lng };
    const loc2 = { lat: comp.lat, lng: comp.lng };
    
    const maxNER = Math.max(subject.ner, comp.ner);
    const maxWalkscore = Math.max(subject.walkscore, comp.walkscore);
    
    const physicalDiff = weights.physicalDistance * normalize(haversine(loc1, loc2), 0, maxPhysicalDistance);
    const nerDiff = weights.ner * normalize(Math.abs(subject.ner - comp.ner), 0, maxNER);
    const walkscoreDiff = weights.walkscore * normalize(Math.abs(subject.walkscore - comp.walkscore), 0, maxWalkscore);
    const constructionDiff = (subject.constructionType === comp.constructionType) ? 0 : weights.constructionType;

    const similarityScore = (1 - ((physicalDiff + nerDiff + walkscoreDiff + constructionDiff) / 100)) * 100;
    return similarityScore;
}

let subjectProperty = new Property("Waterfront Mansions", 50.8503, 4.3517, 1000, 80, 'brick');
let otherProperties = [
    new Property("Downtown Heights", 51.2093, 3.2247, 1500, 85, 'concrete'),
    new Property("Riverside Residences", 51.5074, 0.1278, 1200, 70, 'brick'),
    new Property("City Center Lofts", 52.5200, 13.4050, 1000, 90, 'brick'),
    new Property("Test", 50.8503, 4.3517, 1000, 80, 'brick')
];

let weights = {
    physicalDistance: 40,
    walkscore: 10,
    constructionType: 40,
    ner: 20
};

// Calculate the max physical distance for normalization
let maxPhysicalDistance = 0;
for (let i = 0; i < otherProperties.length; i++) {
    const loc1 = { lat: subjectProperty.lat, lng: subjectProperty.lng };
    const loc2 = { lat: otherProperties[i].lat, lng: otherProperties[i].lng };
    const distance = haversine(loc1, loc2);
    if (distance > maxPhysicalDistance) maxPhysicalDistance = distance;
}

// Calculate similarity scores and store them along with the properties
let similarityScores = otherProperties.map(property => {
    return {
        property: property,
        similarity: calculateSimilarity(subjectProperty, property, weights)
    };
});

// Sort the scores in descending order
similarityScores.sort((a, b) => b.similarity - a.similarity);

// Print the results
console.log("Properties ranked by similarity to the subject property:");
similarityScores.forEach(score => {
    console.log(`Property Name: ${score.property.name}`);
    console.log(`Similarity: ${score.similarity.toFixed(2)}%`);
    console.log(`Location: (${score.property.lat}, ${score.property.lng}), NER: ${score.property.ner}, Walkscore: ${score.property.walkscore}, Construction Type: ${score.property.constructionType}`);
    console.log();
});
