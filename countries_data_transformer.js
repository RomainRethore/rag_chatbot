import fs from 'fs';

function transformCountriesData(rawData) {
    // Créer un tableau pour stocker les pays transformés
    const transformedCountries = [];

    // Parcourir chaque pays dans les données brutes
    for (const [countryName, countryData] of Object.entries(rawData)) {
        // Créer l'objet au format désiré pour chaque pays
        const transformedCountry = {
            country: countryName,
            data: countryData
        };

        // Ajouter l'objet transformé au tableau
        transformedCountries.push(transformedCountry);
    }

    return transformedCountries;
}
const rawCountriesData = JSON.parse(fs.readFileSync('./data/The World Factbook by CIA dataset/countries.json', 'utf-8'));

const transformedData = transformCountriesData(rawCountriesData);


fs.writeFileSync('./data/The World Factbook by CIA dataset/transformed_countries.json', JSON.stringify(transformedData, null, 2));
