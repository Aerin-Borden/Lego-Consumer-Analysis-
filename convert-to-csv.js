import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Complete data structure with all 250 countries from the website
// This matches the actual data from https://www.scrapethissite.com/pages/simple/
const sampleData = {
  countries: [
    { name: "Andorra", capital: "Andorra la Vella", population: 84000, area: 468.0 },
    { name: "United Arab Emirates", capital: "Abu Dhabi", population: 4975593, area: 82880.0 },
    { name: "Afghanistan", capital: "Kabul", population: 29121286, area: 647500.0 },
    { name: "Antigua and Barbuda", capital: "St. John's", population: 86754, area: 443.0 },
    { name: "Anguilla", capital: "The Valley", population: 13254, area: 102.0 },
    { name: "Albania", capital: "Tirana", population: 2986952, area: 28748.0 },
    { name: "Armenia", capital: "Yerevan", population: 2968000, area: 29800.0 },
    { name: "Angola", capital: "Luanda", population: 13068161, area: 1246700.0 },
    { name: "Antarctica", capital: "None", population: 0, area: 14000000.0 },
    { name: "Argentina", capital: "Buenos Aires", population: 41343201, area: 2766890.0 },
    { name: "American Samoa", capital: "Pago Pago", population: 57881, area: 199.0 },
    { name: "Austria", capital: "Vienna", population: 8205000, area: 83858.0 },
    { name: "Australia", capital: "Canberra", population: 21515754, area: 7686850.0 },
    { name: "Aruba", capital: "Oranjestad", population: 71566, area: 193.0 },
    { name: "Åland", capital: "Mariehamn", population: 26711, area: 1580.0 },
    { name: "Azerbaijan", capital: "Baku", population: 8303512, area: 86600.0 },
    { name: "Bosnia and Herzegovina", capital: "Sarajevo", population: 4590000, area: 51129.0 },
    { name: "Barbados", capital: "Bridgetown", population: 285653, area: 431.0 },
    { name: "Bangladesh", capital: "Dhaka", population: 156118464, area: 144000.0 },
    { name: "Belgium", capital: "Brussels", population: 10403000, area: 30510.0 },
    { name: "Burkina Faso", capital: "Ouagadougou", population: 16241811, area: 274200.0 },
    { name: "Bulgaria", capital: "Sofia", population: 7148785, area: 110910.0 },
    { name: "Bahrain", capital: "Manama", population: 738004, area: 665.0 },
    { name: "Burundi", capital: "Bujumbura", population: 9863117, area: 27830.0 },
    { name: "Benin", capital: "Porto-Novo", population: 9056010, area: 112620.0 },
    { name: "Saint Barthélemy", capital: "Gustavia", population: 8450, area: 21.0 },
    { name: "Bermuda", capital: "Hamilton", population: 65365, area: 53.0 },
    { name: "Brunei", capital: "Bandar Seri Begawan", population: 395027, area: 5770.0 },
    { name: "Bolivia", capital: "Sucre", population: 9947418, area: 1098580.0 },
    { name: "Bonaire", capital: "Kralendijk", population: 18012, area: 328.0 },
    { name: "Brazil", capital: "Brasília", population: 201103330, area: 8511965.0 },
    { name: "Bahamas", capital: "Nassau", population: 301790, area: 13940.0 },
    { name: "Bhutan", capital: "Thimphu", population: 699847, area: 47000.0 },
    { name: "Bouvet Island", capital: "None", population: 0, area: 49.0 },
    { name: "Botswana", capital: "Gaborone", population: 2029307, area: 600370.0 },
    { name: "Belarus", capital: "Minsk", population: 9685000, area: 207600.0 },
    { name: "Belize", capital: "Belmopan", population: 314522, area: 22966.0 },
    { name: "Canada", capital: "Ottawa", population: 33679000, area: 9984670.0 },
    { name: "Cocos [Keeling] Islands", capital: "West Island", population: 628, area: 14.0 },
    { name: "Democratic Republic of the Congo", capital: "Kinshasa", population: 70916439, area: 2345410.0 },
    { name: "Central African Republic", capital: "Bangui", population: 4844927, area: 622984.0 },
    { name: "Republic of the Congo", capital: "Brazzaville", population: 3039126, area: 342000.0 },
    { name: "Switzerland", capital: "Bern", population: 7581000, area: 41290.0 },
    { name: "Ivory Coast", capital: "Yamoussoukro", population: 21058798, area: 322460.0 },
    { name: "Cook Islands", capital: "Avarua", population: 21388, area: 240.0 },
    { name: "Chile", capital: "Santiago", population: 16746491, area: 756950.0 },
    { name: "Cameroon", capital: "Yaoundé", population: 19294149, area: 475440.0 },
    { name: "China", capital: "Beijing", population: 1330044000, area: 9596960.0 },
    { name: "Colombia", capital: "Bogotá", population: 47790000, area: 1138910.0 },
    { name: "Costa Rica", capital: "San José", population: 4516220, area: 51100.0 },
    { name: "Cuba", capital: "Havana", population: 11423000, area: 110860.0 },
    { name: "Cape Verde", capital: "Praia", population: 508659, area: 4033.0 },
    { name: "Curacao", capital: "Willemstad", population: 141766, area: 444.0 },
    { name: "Christmas Island", capital: "Flying Fish Cove", population: 1500, area: 135.0 },
    { name: "Cyprus", capital: "Nicosia", population: 1102677, area: 9250.0 },
    { name: "Czech Republic", capital: "Prague", population: 10476000, area: 78866.0 },
    { name: "Germany", capital: "Berlin", population: 81802257, area: 357021.0 },
    { name: "Djibouti", capital: "Djibouti", population: 740528, area: 23000.0 },
    { name: "Denmark", capital: "Copenhagen", population: 5484000, area: 43094.0 },
    { name: "Dominica", capital: "Roseau", population: 72813, area: 754.0 },
    { name: "Dominican Republic", capital: "Santo Domingo", population: 9823821, area: 48730.0 },
    { name: "Algeria", capital: "Algiers", population: 34586184, area: 2381740.0 },
    { name: "Ecuador", capital: "Quito", population: 14790608, area: 283560.0 },
    { name: "Estonia", capital: "Tallinn", population: 1291170, area: 45226.0 },
    { name: "Egypt", capital: "Cairo", population: 80471869, area: 1001450.0 },
    { name: "Western Sahara", capital: "El Aaiún", population: 273008, area: 266000.0 },
    { name: "Eritrea", capital: "Asmara", population: 5792984, area: 121320.0 },
    { name: "Spain", capital: "Madrid", population: 46505963, area: 504782.0 },
    { name: "Ethiopia", capital: "Addis Ababa", population: 88013491, area: 1127127.0 },
    { name: "Finland", capital: "Helsinki", population: 5244000, area: 337030.0 },
    { name: "Fiji", capital: "Suva", population: 875983, area: 18270.0 },
    { name: "Falkland Islands", capital: "Stanley", population: 2638, area: 12173.0 },
    { name: "Micronesia", capital: "Palikir", population: 107708, area: 702.0 },
    { name: "Faroe Islands", capital: "Tórshavn", population: 48228, area: 1399.0 },
    { name: "France", capital: "Paris", population: 64768389, area: 547030.0 },
    { name: "Gabon", capital: "Libreville", population: 1545255, area: 267667.0 },
    { name: "United Kingdom", capital: "London", population: 62348447, area: 244820.0 },
    { name: "Grenada", capital: "St. George's", population: 107818, area: 344.0 },
    { name: "Georgia", capital: "Tbilisi", population: 4630000, area: 69700.0 },
    { name: "French Guiana", capital: "Cayenne", population: 195506, area: 83534.0 },
    { name: "Guernsey", capital: "St. Peter Port", population: 65228, area: 78.0 },
    { name: "Ghana", capital: "Accra", population: 24339838, area: 239460.0 },
    { name: "Gibraltar", capital: "Gibraltar", population: 27884, area: 6.5 },
    { name: "Greenland", capital: "Nuuk", population: 56375, area: 2166086.0 },
    { name: "Gambia", capital: "Banjul", population: 1593256, area: 11300.0 },
    { name: "Guinea", capital: "Conakry", population: 10324025, area: 245857.0 },
    { name: "Guadeloupe", capital: "Basse-Terre", population: 443000, area: 1780.0 },
    { name: "Equatorial Guinea", capital: "Malabo", population: 1014999, area: 28051.0 },
    { name: "Greece", capital: "Athens", population: 11000000, area: 131940.0 },
    { name: "South Georgia and the South Sandwich Islands", capital: "Grytviken", population: 30, area: 3903.0 },
    { name: "Guatemala", capital: "Guatemala City", population: 13550440, area: 108890.0 },
    { name: "Guam", capital: "Hagåtña", population: 159358, area: 549.0 },
    { name: "Guinea-Bissau", capital: "Bissau", population: 1565126, area: 36120.0 },
    { name: "Guyana", capital: "Georgetown", population: 748486, area: 214970.0 },
    { name: "Hong Kong", capital: "Hong Kong", population: 6898686, area: 1092.0 },
    { name: "Heard Island and McDonald Islands", capital: "None", population: 0, area: 412.0 },
    { name: "Honduras", capital: "Tegucigalpa", population: 7989415, area: 112090.0 },
    { name: "Croatia", capital: "Zagreb", population: 4284889, area: 56542.0 },
    { name: "Haiti", capital: "Port-au-Prince", population: 9648924, area: 27750.0 },
    { name: "Hungary", capital: "Budapest", population: 9982000, area: 93030.0 },
    { name: "Indonesia", capital: "Jakarta", population: 242968342, area: 1919440.0 },
    { name: "Ireland", capital: "Dublin", population: 4622917, area: 70280.0 },
    { name: "Israel", capital: "Jerusalem", population: 7353985, area: 20770.0 },
    { name: "Isle of Man", capital: "Douglas", population: 75049, area: 572.0 },
    { name: "India", capital: "New Delhi", population: 1173108018, area: 3287590.0 },
    { name: "British Indian Ocean Territory", capital: "Diego Garcia", population: 4000, area: 60.0 },
    { name: "Iraq", capital: "Baghdad", population: 29671605, area: 437072.0 },
    { name: "Iran", capital: "Tehran", population: 76923300, area: 1648000.0 },
    { name: "Iceland", capital: "Reykjavik", population: 308910, area: 103000.0 },
    { name: "Italy", capital: "Rome", population: 60340328, area: 301230.0 },
    { name: "Jersey", capital: "Saint Helier", population: 90812, area: 116.0 },
    { name: "Jamaica", capital: "Kingston", population: 2847232, area: 10991.0 },
    { name: "Jordan", capital: "Amman", population: 6407085, area: 92300.0 },
    { name: "Japan", capital: "Tokyo", population: 127288000, area: 377835.0 },
    { name: "Kenya", capital: "Nairobi", population: 40046566, area: 582650.0 },
    { name: "Kyrgyzstan", capital: "Bishkek", population: 5776500, area: 198500.0 },
    { name: "Cambodia", capital: "Phnom Penh", population: 14453680, area: 181040.0 },
    { name: "Kiribati", capital: "Tarawa", population: 92533, area: 811.0 },
    { name: "Comoros", capital: "Moroni", population: 773407, area: 2170.0 },
    { name: "Saint Kitts and Nevis", capital: "Basseterre", population: 51134, area: 261.0 },
    { name: "North Korea", capital: "Pyongyang", population: 22912177, area: 120540.0 },
    { name: "South Korea", capital: "Seoul", population: 48422644, area: 98480.0 },
    { name: "Kuwait", capital: "Kuwait City", population: 2789132, area: 17820.0 },
    { name: "Cayman Islands", capital: "George Town", population: 44270, area: 262.0 },
    { name: "Kazakhstan", capital: "Astana", population: 15340000, area: 2717300.0 },
    { name: "Laos", capital: "Vientiane", population: 6368162, area: 236800.0 },
    { name: "Lebanon", capital: "Beirut", population: 4125247, area: 10400.0 },
    { name: "Saint Lucia", capital: "Castries", population: 160922, area: 616.0 },
    { name: "Liechtenstein", capital: "Vaduz", population: 35000, area: 160.0 },
    { name: "Sri Lanka", capital: "Colombo", population: 21513990, area: 65610.0 },
    { name: "Liberia", capital: "Monrovia", population: 3685076, area: 111370.0 },
    { name: "Lesotho", capital: "Maseru", population: 1919552, area: 30355.0 },
    { name: "Lithuania", capital: "Vilnius", population: 2944459, area: 65200.0 },
    { name: "Luxembourg", capital: "Luxembourg", population: 497538, area: 2586.0 },
    { name: "Latvia", capital: "Riga", population: 2217969, area: 64589.0 },
    { name: "Libya", capital: "Tripoli", population: 6461454, area: 1759540.0 },
    { name: "Morocco", capital: "Rabat", population: 31627428, area: 446550.0 },
    { name: "Monaco", capital: "Monaco", population: 32965, area: 2.02 },
    { name: "Moldova", capital: "Chișinău", population: 4324000, area: 33843.0 },
    { name: "Montenegro", capital: "Podgorica", population: 666730, area: 13812.0 },
    { name: "Saint Martin", capital: "Marigot", population: 35925, area: 53.0 },
    { name: "Madagascar", capital: "Antananarivo", population: 21281844, area: 587040.0 },
    { name: "Marshall Islands", capital: "Majuro", population: 65859, area: 181.0 },
    { name: "Macedonia", capital: "Skopje", population: 2061000, area: 25333.0 },
    { name: "Mali", capital: "Bamako", population: 13796354, area: 1240000.0 },
    { name: "Myanmar", capital: "Naypyidaw", population: 53414374, area: 678500.0 },
    { name: "Mongolia", capital: "Ulaanbaatar", population: 3086918, area: 1565000.0 },
    { name: "Macao", capital: "Macao", population: 449198, area: 254.0 },
    { name: "Northern Mariana Islands", capital: "Saipan", population: 53883, area: 477.0 },
    { name: "Martinique", capital: "Fort-de-France", population: 432900, area: 1180.0 },
    { name: "Mauritania", capital: "Nouakchott", population: 3205060, area: 1030700.0 },
    { name: "Montserrat", capital: "Plymouth", population: 9341, area: 102.0 },
    { name: "Malta", capital: "Valletta", population: 403000, area: 316.0 },
    { name: "Mauritius", capital: "Port Louis", population: 1294104, area: 2040.0 },
    { name: "Maldives", capital: "Malé", population: 395650, area: 300.0 },
    { name: "Malawi", capital: "Lilongwe", population: 15447500, area: 118480.0 },
    { name: "Mexico", capital: "Mexico City", population: 112468855, area: 1972550.0 },
    { name: "Malaysia", capital: "Kuala Lumpur", population: 28274729, area: 329750.0 },
    { name: "Mozambique", capital: "Maputo", population: 22061451, area: 801590.0 },
    { name: "Namibia", capital: "Windhoek", population: 2128471, area: 825418.0 },
    { name: "New Caledonia", capital: "Nouméa", population: 216494, area: 18575.0 },
    { name: "Niger", capital: "Niamey", population: 15878271, area: 1267000.0 },
    { name: "Norfolk Island", capital: "Kingston", population: 1828, area: 34.6 },
    { name: "Nigeria", capital: "Abuja", population: 154000000, area: 923768.0 },
    { name: "Nicaragua", capital: "Managua", population: 5995928, area: 129494.0 },
    { name: "Netherlands", capital: "Amsterdam", population: 16645000, area: 41526.0 },
    { name: "Norway", capital: "Oslo", population: 5009150, area: 324220.0 },
    { name: "Nepal", capital: "Kathmandu", population: 28951852, area: 140800.0 },
    { name: "Nauru", capital: "Yaren", population: 10065, area: 21.0 },
    { name: "Niue", capital: "Alofi", population: 2166, area: 260.0 },
    { name: "New Zealand", capital: "Wellington", population: 4252277, area: 268680.0 },
    { name: "Oman", capital: "Muscat", population: 2967717, area: 212460.0 },
    { name: "Panama", capital: "Panama City", population: 3410676, area: 78200.0 },
    { name: "Peru", capital: "Lima", population: 29907003, area: 1285220.0 },
    { name: "French Polynesia", capital: "Papeete", population: 270485, area: 4167.0 },
    { name: "Papua New Guinea", capital: "Port Moresby", population: 6064515, area: 462840.0 },
    { name: "Philippines", capital: "Manila", population: 99900177, area: 300000.0 },
    { name: "Pakistan", capital: "Islamabad", population: 184404791, area: 803940.0 },
    { name: "Poland", capital: "Warsaw", population: 38500000, area: 312685.0 },
    { name: "Saint Pierre and Miquelon", capital: "Saint-Pierre", population: 7012, area: 242.0 },
    { name: "Pitcairn", capital: "Adamstown", population: 46, area: 47.0 },
    { name: "Puerto Rico", capital: "San Juan", population: 3916632, area: 9104.0 },
    { name: "Palestine", capital: "East Jerusalem", population: 3800000, area: 5970.0 },
    { name: "Portugal", capital: "Lisbon", population: 10676000, area: 92391.0 },
    { name: "Palau", capital: "Ngerulmud", population: 19907, area: 458.0 },
    { name: "Paraguay", capital: "Asunción", population: 6375830, area: 406750.0 },
    { name: "Qatar", capital: "Doha", population: 840926, area: 11437.0 },
    { name: "Réunion", capital: "Saint-Denis", population: 776948, area: 2517.0 },
    { name: "Romania", capital: "Bucharest", population: 21959278, area: 237500.0 },
    { name: "Serbia", capital: "Belgrade", population: 7344847, area: 88361.0 },
    { name: "Russia", capital: "Moscow", population: 140702000, area: 17100000.0 },
    { name: "Rwanda", capital: "Kigali", population: 11055976, area: 26338.0 },
    { name: "Saudi Arabia", capital: "Riyadh", population: 25731776, area: 1960582.0 },
    { name: "Solomon Islands", capital: "Honiara", population: 559198, area: 28450.0 },
    { name: "Seychelles", capital: "Victoria", population: 88340, area: 455.0 },
    { name: "Sudan", capital: "Khartoum", population: 35000000, area: 1861484.0 },
    { name: "Sweden", capital: "Stockholm", population: 9828655, area: 449964.0 },
    { name: "Singapore", capital: "Singapore", population: 4701069, area: 692.7 },
    { name: "Saint Helena", capital: "Jamestown", population: 7460, area: 410.0 },
    { name: "Slovenia", capital: "Ljubljana", population: 2007000, area: 20273.0 },
    { name: "Svalbard and Jan Mayen", capital: "Longyearbyen", population: 2550, area: 62049.0 },
    { name: "Slovakia", capital: "Bratislava", population: 5455000, area: 48845.0 },
    { name: "Sierra Leone", capital: "Freetown", population: 5245695, area: 71740.0 },
    { name: "San Marino", capital: "San Marino", population: 31477, area: 61.2 },
    { name: "Senegal", capital: "Dakar", population: 12323252, area: 196190.0 },
    { name: "Somalia", capital: "Mogadishu", population: 10112453, area: 637657.0 },
    { name: "Suriname", capital: "Paramaribo", population: 492829, area: 163270.0 },
    { name: "South Sudan", capital: "Juba", population: 8260490, area: 644329.0 },
    { name: "São Tomé and Príncipe", capital: "São Tomé", population: 175808, area: 1001.0 },
    { name: "El Salvador", capital: "San Salvador", population: 6052064, area: 21040.0 },
    { name: "Sint Maarten", capital: "Philipsburg", population: 37429, area: 21.0 },
    { name: "Syria", capital: "Damascus", population: 22198110, area: 185180.0 },
    { name: "Swaziland", capital: "Mbabane", population: 1354051, area: 17363.0 },
    { name: "Turks and Caicos Islands", capital: "Cockburn Town", population: 20556, area: 430.0 },
    { name: "Chad", capital: "N'Djamena", population: 10543464, area: 1284000.0 },
    { name: "French Southern Territories", capital: "Port-aux-Français", population: 140, area: 7829.0 },
    { name: "Togo", capital: "Lomé", population: 6587239, area: 56785.0 },
    { name: "Thailand", capital: "Bangkok", population: 67089500, area: 514000.0 },
    { name: "Tajikistan", capital: "Dushanbe", population: 7487489, area: 143100.0 },
    { name: "Tokelau", capital: "None", population: 1466, area: 10.0 },
    { name: "East Timor", capital: "Dili", population: 1154625, area: 15007.0 },
    { name: "Turkmenistan", capital: "Ashgabat", population: 4940916, area: 488100.0 },
    { name: "Tunisia", capital: "Tunis", population: 10589025, area: 163610.0 },
    { name: "Tonga", capital: "Nuku'alofa", population: 122580, area: 748.0 },
    { name: "Turkey", capital: "Ankara", population: 77804122, area: 780580.0 },
    { name: "Trinidad and Tobago", capital: "Port of Spain", population: 1228691, area: 5128.0 },
    { name: "Tuvalu", capital: "Funafuti", population: 10472, area: 26.0 },
    { name: "Taiwan", capital: "Taipei", population: 22894384, area: 35980.0 },
    { name: "Tanzania", capital: "Dodoma", population: 41892895, area: 945087.0 },
    { name: "Ukraine", capital: "Kiev", population: 45415596, area: 603700.0 },
    { name: "Uganda", capital: "Kampala", population: 33398682, area: 236040.0 },
    { name: "U.S. Minor Outlying Islands", capital: "None", population: 0, area: 0.0 },
    { name: "United States", capital: "Washington", population: 310232863, area: 9629091.0 },
    { name: "Uruguay", capital: "Montevideo", population: 3477000, area: 176220.0 },
    { name: "Uzbekistan", capital: "Tashkent", population: 27865738, area: 447400.0 },
    { name: "Vatican City", capital: "Vatican City", population: 921, area: 0.44 },
    { name: "Saint Vincent and the Grenadines", capital: "Kingstown", population: 104217, area: 389.0 },
    { name: "Venezuela", capital: "Caracas", population: 27223228, area: 912050.0 },
    { name: "British Virgin Islands", capital: "Road Town", population: 21730, area: 153.0 },
    { name: "U.S. Virgin Islands", capital: "Charlotte Amalie", population: 108708, area: 352.0 },
    { name: "Vietnam", capital: "Hanoi", population: 89571130, area: 329560.0 },
    { name: "Vanuatu", capital: "Port Vila", population: 221552, area: 12200.0 },
    { name: "Wallis and Futuna", capital: "Mata-Utu", population: 16025, area: 274.0 },
    { name: "Samoa", capital: "Apia", population: 192001, area: 2944.0 },
    { name: "Kosovo", capital: "Pristina", population: 1800000, area: 10908.0 },
    { name: "Yemen", capital: "Sanaa", population: 23495361, area: 527970.0 },
    { name: "Mayotte", capital: "Mamoudzou", population: 159042, area: 374.0 },
    { name: "South Africa", capital: "Pretoria", population: 49000000, area: 1219912.0 },
    { name: "Zambia", capital: "Lusaka", population: 13460305, area: 752614.0 },
    { name: "Zimbabwe", capital: "Harare", population: 11651858, area: 390580.0 }
  ]
};

// Function using simple string concatenation (no external dependencies)
function convertToCSV(jsonData, outputFilename = 'countries-data.csv') {
  try {
    // Create CSV header
    const headers = ['Country Name', 'Capital City', 'Population', 'Area (km²)'];
    let csvContent = headers.join(',') + '\n';
    
    // Add data rows
    jsonData.countries.forEach(country => {
      const row = [
        `"${country.name.replace(/"/g, '""')}"`,     // Escape quotes and wrap in quotes
        `"${country.capital.replace(/"/g, '""')}"`,  // Handle commas and quotes properly
        country.population,
        country.area
      ];
      csvContent += row.join(',') + '\n';
    });
    
    // Write to file
    fs.writeFileSync(outputFilename, csvContent, 'utf8');
    console.log(`✅ CSV file created successfully: ${outputFilename}`);
    console.log(`📊 Total countries exported: ${jsonData.countries.length}`);
    
    return outputFilename;
  } catch (error) {
    console.error('❌ Error creating CSV file:', error);
    throw error;
  }
}

// Function to load scraped data from a JSON file (if you have it saved)
function loadScrapedData(jsonFilename) {
  try {
    const data = fs.readFileSync(jsonFilename, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Error loading JSON file:', error);
    console.log('Using sample data instead...');
    return sampleData;
  }
}

// Main execution function
async function main() {
  try {
    console.log('🚀 Starting CSV conversion...');
    
    // Try to load actual scraped data, fall back to sample data
    let data;
    
    // Check if scraped data file exists
    if (fs.existsSync('scraped-countries.json')) {
      console.log('📂 Loading data from scraped-countries.json...');
      data = loadScrapedData('scraped-countries.json');
    } else {
      console.log('📂 No scraped data found, using sample data...');
      console.log('💡 Run your firecrawl scraper first and save the results as "scraped-countries.json"');
      data = sampleData;
    }
    
    // Convert to CSV
    const csvFilename = convertToCSV(data, 'countries-data.csv');
    
    console.log('\n🎉 Conversion complete!');
    console.log(`📁 CSV file saved as: ${csvFilename}`);
    
    // Show a preview of the CSV content
    console.log('\n📄 Preview of CSV content:');
    const csvContent = fs.readFileSync(csvFilename, 'utf8');
    const lines = csvContent.split('\n').slice(0, 6); // Show first 5 data rows + header
    lines.forEach(line => {
      if (line.trim()) console.log(line);
    });
    
  } catch (error) {
    console.error('❌ Conversion failed:', error);
  }
}

// Export functions for use in other scripts
export { convertToCSV, loadScrapedData };

// Get current file path to check if this is the main module
const __filename = fileURLToPath(import.meta.url);
const isMainModule = process.argv[1] === __filename;

// Run the conversion if this script is executed directly
if (isMainModule) {
  main();
} 