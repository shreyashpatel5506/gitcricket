import {
  calculateBatting,
  calculateBowling,
  calculateFielding,
  calculateTechnique,
  calculateFitness,
  calculateExperience,
  determinePlayerRole,
  calculateOverall
} from './ratingEngine.js';

/**
 * Calculates current and longest streaks from the contribution calendar.
 */
function calculateStreaks(weeks) {
  if (!weeks || weeks.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Flatten weeks and weeks' contributionDays to a single sorted array of days
  const days = weeks
    .flatMap(w => w.contributionDays || [])
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (days.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // 1. Calculate Longest Streak
  let longestStreak = 0;
  let runningStreak = 0;

  for (const day of days) {
    if (day.contributionCount > 0) {
      runningStreak++;
      if (runningStreak > longestStreak) {
        longestStreak = runningStreak;
      }
    } else {
      runningStreak = 0;
    }
  }

  // 2. Calculate Current Streak (scanning backwards from today)
  let currentStreak = 0;
  let streakActive = true;
  const reversedDays = [...days].reverse();

  // Find start index: today (index 0) or yesterday (index 1)
  // If both today and yesterday have 0 commits, the streak is broken.
  let startIndex = 0;
  if (reversedDays.length > 0 && reversedDays[0].contributionCount === 0) {
    if (reversedDays.length > 1 && reversedDays[1].contributionCount > 0) {
      startIndex = 1;
    } else {
      streakActive = false;
    }
  }

  if (streakActive) {
    for (let i = startIndex; i < reversedDays.length; i++) {
      if (reversedDays[i].contributionCount > 0) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  return { currentStreak, longestStreak };
}

/**
 * Summarizes language size distributions from repository nodes.
 */
function aggregateLanguages(repoNodes) {
  const languageSizes = {};

  if (repoNodes && repoNodes.length > 0) {
    repoNodes.forEach(repo => {
      const edges = repo.languages?.edges || [];
      edges.forEach(edge => {
        const langName = edge.node?.name;
        const size = edge.size || 0;
        if (langName) {
          languageSizes[langName] = (languageSizes[langName] || 0) + size;
        }
      });
    });
  }

  // Sort languages by total size descending
  return Object.keys(languageSizes)
    .sort((a, b) => languageSizes[b] - languageSizes[a]);
}

/**
 * Parses location string and resolves clean country name. Defaults to India.
 */
const countryLookup = [
  {
    name: 'India',
    patterns: [
      'india', 'bharat', 'hindustan',
      // States & UTs
      'andhra pradesh', 'arunachal pradesh', 'assam', 'bihar', 'chhattisgarh', 'goa', 'gujarat', 'haryana', 
      'himachal pradesh', 'jharkhand', 'karnataka', 'kerala', 'madhya pradesh', 'maharashtra', 'manipur', 
      'meghalaya', 'mizoram', 'nagaland', 'odisha', 'orissa', 'punjab', 'rajasthan', 'sikkim', 'tamil nadu', 'telangana', 
      'tripura', 'uttar pradesh', 'uttarakhand', 'west bengal', 'delhi', 'new delhi', 'ncr', 'jammu', 'kashmir', 
      'ladakh', 'puducherry', 'pondicherry', 'chandigarh',
      // Indian cities
      'mumbai', 'bombay', 'bengaluru', 'bangalore', 'pune', 'hyderabad', 'chennai', 'madras', 'kolkata', 'calcutta', 
      'gurgaon', 'gurugram', 'noida', 'ghaziabad', 'faridabad', 'ahmedabad', 'jaipur', 'surat', 'lucknow', 'kanpur', 
      'nagpur', 'indore', 'thane', 'bhopal', 'visakhapatnam', 'vizag', 'patna', 'vadodara', 'ludhiana', 
      'agra', 'nashik', 'meerut', 'rajkot', 'varanasi', 'srinagar', 'aurangabad', 'dhanbad', 'amritsar', 
      'navi mumbai', 'allahabad', 'prayagraj', 'howrah', 'ranchi', 'gwalior', 'jabalpur', 'coimbatore', 
      'vijayawada', 'jodhpur', 'madurai', 'raipur', 'kota', 'guwahati', 'solapur', 'hubli', 'dharwad', 
      'bareilly', 'moradabad', 'mysore', 'aligarh', 'jalandhar', 'tiruchirappalli', 'bhubaneswar', 'salem', 
      'warangal', 'guntur', 'kochi', 'cochin', 'trivandrum', 'thiruvananthapuram', 'calicut', 'kozhikode', 
      'dehradun', 'deoghar', 'rourkela', 'durgapur', 'asansol', 'siliguri', 'gaya', 'ajmer', 'udaipur', 
      'belgaum', 'mangalore', 'mangaluru', 'shimoga', 'tumkur', 'davanagere', 'bellary', 'bijapur', 
      'gulbarga', 'panaji', 'panjim', 'shimla', 'haridwar', 'rishikesh', 'mathura', 'vrindavan', 'jhansi', 
      'tirupati', 'vellore', 'ernakulam', 'thrissur', 'kollam', 'alappuzha', 'kottayam', 'palakkad', 
      'malappuram', 'kannur', 'nagaland', 'manipur', 'shillong', 'aizawl', 'imphal', 'gangtok', 'itanagar',
      'port blair', 'silvassa', 'daman', 'diu', 'kavaratti'
    ]
  },
  {
    name: 'United States',
    patterns: [
      'united states', 'usa', 'u.s.a.', 'united states of america',
      // US States
      'alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado', 'connecticut', 'delaware', 'florida', 
      'georgia', 'hawaii', 'idaho', 'illinois', 'indiana', 'iowa', 'kansas', 'kentucky', 'louisiana', 'maine', 
      'maryland', 'massachusetts', 'michigan', 'minnesota', 'mississippi', 'missouri', 'montana', 'nebraska', 
      'nevada', 'new hampshire', 'new jersey', 'new mexico', 'new york', 'north carolina', 'north dakota', 'ohio', 
      'oklahoma', 'oregon', 'pennsylvania', 'rhode island', 'south carolina', 'south dakota', 'tennessee', 'texas', 
      'utah', 'vermont', 'virginia', 'washington', 'west virginia', 'wisconsin', 'wyoming',
      // US Cities
      'san francisco', 'sf', 'silicon valley', 'los angeles', 'la', 'seattle', 'chicago', 'boston', 'austin', 
      'new york city', 'nyc', 'houston', 'phoenix', 'philadelphia', 'san antonio', 'san diego', 'dallas', 'san jose', 
      'jacksonville', 'columbus', 'indianapolis', 'charlotte', 'denver', 'washington dc', 'washington d.c.', 
      'el paso', 'nashville', 'detroit', 'portland', 'las vegas', 'atlanta', 'miami', 'pittsburgh', 'minneapolis',
      'orlando', 'tampa', 'salt lake city', 'slc', 'baltimore', 'boston', 'cambridge', 'redmond', 'bellevue', 
      'cupertino', 'mountain view', 'palo alto', 'sunnyvale', 'santa clara', 'berkeley', 'oakland', 'fremont',
      'sacramento', 'pittsburgh', 'philadelphia', 'charlotte', 'raleigh', 'durham', 'chapel hill'
    ],
    stateCodes: [
      'al', 'ak', 'az', 'ar', 'ca', 'co', 'ct', 'de', 'fl', 'ga', 'hi', 'id', 'il', 'in', 'ia', 'ks', 'ky', 'la', 
      'me', 'md', 'ma', 'mi', 'mn', 'ms', 'mo', 'mt', 'ne', 'nv', 'nh', 'nj', 'nm', 'ny', 'nc', 'nd', 'oh', 'ok', 
      'or', 'pa', 'ri', 'sc', 'sd', 'tn', 'tx', 'ut', 'vt', 'va', 'wa', 'wv', 'wi', 'wy'
    ]
  },
  {
    name: 'United Kingdom',
    patterns: [
      'united kingdom', 'uk', 'u.k.', 'great britain', 'britain', 'england', 'scotland', 'wales', 'northern ireland',
      'london', 'manchester', 'birmingham', 'leeds', 'glasgow', 'edinburgh', 'liverpool', 'bristol', 'sheffield', 
      'newcastle', 'southampton', 'nottingham', 'leicester', 'coventry', 'belfast', 'cardiff', 'oxford', 'cambridge'
    ]
  },
  {
    name: 'Canada',
    patterns: [
      'canada',
      'ontario', 'quebec', 'british columbia', 'alberta', 'manitoba', 'saskatchewan', 'nova scotia', 'new brunswick', 
      'newfoundland', 'labrador', 'prince edward island', 'toronto', 'vancouver', 'montreal', 'calgary', 'ottawa', 
      'edmonton', 'winnipeg', 'quebec city', 'halifax'
    ]
  },
  {
    name: 'Australia',
    patterns: [
      'australia',
      'new south wales', 'nsw', 'victoria', 'queensland', 'western australia', 'south australia', 'tasmania',
      'sydney', 'melbourne', 'brisbane', 'perth', 'adelaide', 'gold coast', 'canberra'
    ]
  },
  {
    name: 'Germany',
    patterns: [
      'germany', 'deutschland',
      'berlin', 'munich', 'münchen', 'hamburg', 'frankfurt', 'cologne', 'köln', 'stuttgart', 'düsseldorf', 
      'dortmund', 'essen', 'leipzig', 'bremen', 'dresden', 'hanover', 'nuremberg'
    ]
  },
  {
    name: 'Pakistan',
    patterns: [
      'pakistan', 'pk',
      'karachi', 'lahore', 'islamabad', 'rawalpindi', 'faisalabad', 'peshawar', 'quetta', 'multan', 'sialkot', 'gujranwala'
    ]
  },
  {
    name: 'Bangladesh',
    patterns: [
      'bangladesh', 'bd',
      'dhaka', 'chittagong', 'sylhet', 'khulna', 'rajshahi', 'barisal', 'rangpur', 'comilla', 'gazipur'
    ]
  },
  {
    name: 'Sri Lanka',
    patterns: [
      'sri lanka', 'lk',
      'colombo', 'kandy', 'galle', 'jaffna', 'negombo', 'gampaha'
    ]
  },
  {
    name: 'Nepal',
    patterns: [
      'nepal', 'np',
      'kathmandu', 'pokhara', 'lalitpur', 'biratnagar', 'dharan',
      'bharatpur', 'birgunj', 'butwal', 'hetauda', 'janakpur', 'janakpurdham',
      'nepalgunj', 'nepalganj', 'itahari', 'dhangadhi', 'dhangadi', 'patan'
    ]
  },
  {
    name: 'France',
    patterns: [
      'france', 'fr',
      'paris', 'marseille', 'lyon', 'toulouse', 'nice', 'nantes', 'strasbourg', 'montpellier', 'bordeaux', 'lille'
    ]
  },
  {
    name: 'Japan',
    patterns: [
      'japan', 'jp',
      'tokyo', 'yokohama', 'osaka', 'nagoya', 'sapporo', 'kobe', 'kyoto', 'fukuoka', 'kawasaki', 'saitama'
    ]
  },
  {
    name: 'Netherlands',
    patterns: [
      'netherlands', 'holland', 'nl',
      'amsterdam', 'rotterdam', 'the hague', 'utrecht', 'eindhoven'
    ]
  },
  {
    name: 'Singapore',
    patterns: [
      'singapore', 'sg'
    ]
  },
  {
    name: 'Brazil',
    patterns: [
      'brazil', 'brasil', 'br',
      'sao paulo', 'são paulo', 'rio de janeiro', 'brasilia', 'salvador', 'fortaleza', 'belo horizonte', 'curitiba', 'porto alegre'
    ]
  },
  {
    name: 'Russia',
    patterns: [
      'russia', 'ru',
      'moscow', 'saint petersburg', 'novosibirsk', 'yekaterinburg', 'nizhny novgorod'
    ]
  },
  {
    name: 'China',
    patterns: [
      'china', 'cn',
      'beijing', 'shanghai', 'shenzhen', 'guangzhou', 'hangzhou', 'chengdu', 'wuhan', 'nanjing', 'xi\'an'
    ]
  },
  {
    name: 'South Africa',
    patterns: [
      'south africa', 'za',
      'johannesburg', 'cape town', 'durban', 'pretoria'
    ]
  },
  {
    name: 'New Zealand',
    patterns: [
      'new zealand', 'nz',
      'auckland', 'wellington', 'christchurch'
    ]
  },
  {
    name: 'Switzerland',
    patterns: [
      'switzerland', 'ch',
      'zurich', 'zürich', 'geneva', 'basel', 'bern', 'lausanne'
    ]
  },
  {
    name: 'Sweden',
    patterns: [
      'sweden', 'se',
      'stockholm', 'gothenburg', 'malmö'
    ]
  },
  {
    name: 'Spain',
   patterns: [
-      'spain', 'españa', 'es',
-      'madrid', 'barcelona', 'valencia', 'seville', 'sevilla', 'zaragoza', 'malaga', 'málaga'
+      'spain', 'españa', 'es',
+      'madrid', 'barcelona', 'valencia', 'seville', 'sevilla', 'zaragoza', 'malaga', 'málaga',
+      'bilbao', 'alicante', 'murcia', 'palma', 'las palmas', 'cordoba', 'córdoba',
+      'valladolid', 'vigo', 'gijon', 'gijón', 'granada', 'san sebastian', 'san sebastián',
+      'catalonia', 'cataluña', 'andalucia', 'andalucía', 'galicia', 'basque country', 'país vasco',
+      'oviedo', 'santander', 'salamanca', 'toledo', 'burgos', 'logroño', 'logrono', 'la rioja',
+      'pontevedra', 'ourense', 'orense', 'almeria', 'almería', 'jaen', 'jaén', 'huelva',
+      'tenerife', 'gran canaria', 'las palmas de gran canaria', 'canary islands', 'islas canarias',
+      'ibiza', 'eivissa', 'menorca', 'minorca', 'formentera', 'mallorca', 'palma de mallorca',
+      'asturias', 'cantabria', 'extremadura', 'navarra', 'comunidad valenciana', 'valencian community',
+      'lleida', 'lerida', 'tarragona', 'ceuta', 'melilla', 'soria', 'cuenca', 'segovia', 'ávila', 'avila'
     ]
  },
  {
    name: 'Italy',
    patterns: [
      'italy', 'italia', 'it',
      'rome', 'roma', 'milan', 'milano', 'naples', 'napoli', 'turin', 'torino', 'palermo', 'florence', 'firenze', 'bologna'
    ]
  },
  {
    name: 'Ukraine',
    patterns: [
      'ukraine', 'ua',
      'kyiv', 'kiev', 'kharkiv', 'lviv', 'odesa', 'dnipro'
    ]
  },
  {
    name: 'Poland',
    patterns: [
      'poland', 'pl',
      'warsaw', 'warszawa', 'krakow', 'kraków', 'wroclaw', 'wrocław', 'gdansk', 'gdańsk', 'poznan', 'poznań'
    ]
  },
  {
    name: 'Turkey',
    patterns: [
      'turkey', 'turkiye', 'türkiye', 'tr',
      'istanbul', 'ankara', 'izmir', 'bursa', 'antalya'
    ]
  },
  {
    name: 'Indonesia',
    patterns: [
      'indonesia', 'id',
      'jakarta', 'surabaya', 'bandung', 'medan', 'semarang'
    ]
  },
  {
    name: 'Vietnam',
    patterns: [
      'vietnam', 'vn',
      'ho chi minh', 'hanoi', 'da nang', 'saigon'
    ]
  },
  {
    name: 'Philippines',
    patterns: [
      'philippines', 'ph',
      'manila', 'quezon city', 'cebu', 'davao'
    ]
  },
  {
    name: 'Malaysia',
    patterns: [
      'malaysia', 'my',
      'kuala lumpur', 'kl', 'penang', 'johor bahru'
    ]
  },
  {
    name: 'Thailand',
    patterns: [
      'thailand', 'th',
      'bangkok', 'nonthaburi', 'chiang mai'
    ]
  },
  {
    name: 'South Korea',
    patterns: [
      'south korea', 'korea', 'kr',
      'seoul', 'busan', 'incheon', 'daegu'
    ]
  },
  {
    name: 'Nigeria',
    patterns: [
      'nigeria', 'ng',
      'lagos', 'abuja', 'ibadan', 'kano', 'portharcourt'
    ]
  },
  {
    name: 'Kenya',
    patterns: [
      'kenya', 'ke',
      'nairobi', 'mombasa'
    ]
  },
  {
    name: 'Egypt',
    patterns: [
      'egypt', 'eg',
      'cairo', 'alexandria', 'giza'
    ]
  },
  {
    name: 'Israel',
    patterns: [
      'israel', 'il',
      'tel aviv', 'jerusalem', 'haifa', 'beer sheva'
    ]
  },
  {
    name: 'Mexico',
    patterns: [
      'mexico', 'mx',
      'mexico city', 'guadalajara', 'monterrey', 'puebla', 'tijuana'
    ]
  },
  {
    name: 'Argentina',
    patterns: [
      'argentina', 'ar',
      'buenos aires', 'cordoba', 'córdoba', 'rosario'
    ]
  },
  {
    name: 'Colombia',
    patterns: [
      'colombia', 'co',
      'bogota', 'bogotá', 'medellin', 'medellín', 'cali'
    ]
  },
  {
    name: 'Ireland',
    patterns: [
      'ireland', 'ie',
      'dublin', 'cork', 'galway', 'limerick'
    ]
  },
  {
    name: 'Austria',
    patterns: [
      'austria', 'at',
      'vienna', 'wien', 'salzburg', 'graz', 'linz'
    ]
  },
  {
    name: 'Belgium',
    patterns: [
      'belgium', 'be',
      'brussels', 'antwerp', 'ghent', 'bruges', 'liege'
    ]
  },
  {
    name: 'Denmark',
    patterns: [
      'denmark', 'dk',
      'copenhagen', 'aarhus', 'odense'
    ]
  },
  {
    name: 'Finland',
    patterns: [
      'finland', 'fi',
      'helsinki', 'espoo', 'tampere', 'vantaa', 'oulu'
    ]
  },
  {
    name: 'Norway',
    patterns: [
      'norway', 'no',
      'oslo', 'bergen', 'trondheim', 'stavanger'
    ]
  },
  {
    name: 'Portugal',
    patterns: [
      'portugal', 'pt',
      'lisbon', 'lisboa', 'porto'
    ]
  },
  {
    name: 'Romania',
    patterns: [
      'romania', 'ro',
      'bucharest', 'bucuresti', 'cluj', 'timisoara', 'iasi'
    ]
  },
  {
    name: 'United Arab Emirates',
    patterns: [
      'united arab emirates', 'uae', 'ae',
      'dubai', 'abu dhabi', 'sharjah'
    ]
  },
  {
    name: 'Saudi Arabia',
    patterns: [
      'saudi arabia', 'sa',
      'riyadh', 'jeddah', 'mecca', 'medina', 'dammam'
    ]
  },
  {
    name: 'Greece',
    patterns: ['greece', 'gr', 'athens', 'thessaloniki', 'patras']
  },
  {
    name: 'Czech Republic',
    patterns: ['czech republic', 'czechia', 'cz', 'prague', 'brno', 'ostrava']
  },
  {
    name: 'Hungary',
    patterns: ['hungary', 'hu', 'budapest', 'debrecen', 'szeged']
  },
  {
    name: 'Taiwan',
    patterns: ['taiwan', 'tw', 'taipei', 'kaohsiung', 'hsinchu', 'taichung']
  },
  {
    name: 'Hong Kong',
    patterns: ['hong kong', 'hk']
  },
  {
    name: 'Iran',
    patterns: ['iran', 'ir', 'tehran', 'isfahan', 'shiraz', 'tabriz']
  },
  {
    name: 'Morocco',
    patterns: ['morocco', 'ma', 'casablanca', 'rabat', 'marrakech', 'fez']
  },
  {
    name: 'Algeria',
    patterns: ['algeria', 'dz', 'algiers', 'oran', 'constantine']
  },
  {
    name: 'Tunisia',
    patterns: ['tunisia', 'tn', 'tunis', 'sfax', 'sousse']
  },
  {
    name: 'Ghana',
    patterns: ['ghana', 'gh', 'accra', 'kumasi', 'tamale']
  },
  {
    name: 'Chile',
    patterns: ['chile', 'cl', 'santiago', 'valparaiso', 'concepcion']
  },
  {
    name: 'Peru',
    patterns: ['peru', 'pe', 'lima', 'arequipa', 'trujillo']
  },
  {
    name: 'Venezuela',
    patterns: ['venezuela', 've', 'caracas', 'maracaibo', 'valencia']
  },
  {
    name: 'Ecuador',
    patterns: ['ecuador', 'ec', 'quito', 'guayaquil', 'cuenca']
  },
  {
    name: 'Uruguay',
    patterns: ['uruguay', 'uy', 'montevideo']
  },
  {
    name: 'Costa Rica',
    patterns: ['costa rica', 'cr', 'san jose', 'san josé']
  },
  {
    name: 'Panama',
    patterns: ['panama', 'pa', 'panama city']
  },
  {
    name: 'Dominican Republic',
    patterns: ['dominican republic', 'do', 'santo domingo']
  },
  {
    name: 'Puerto Rico',
    patterns: ['puerto rico', 'pr', 'san juan']
  },
  {
    name: 'Cuba',
    patterns: ['cuba', 'cu', 'havana']
  },
  {
    name: 'Kazakhstan',
    patterns: ['kazakhstan', 'kz', 'almaty', 'astana', 'shymkent']
  },
  {
    name: 'Uzbekistan',
    patterns: ['uzbekistan', 'uz', 'tashkent', 'samarkand']
  },
  {
    name: 'Azerbaijan',
    patterns: ['azerbaijan', 'az', 'baku']
  },
  {
    name: 'Georgia',
    patterns: ['georgia', 'ge', 'tbilisi', 'batumi']
  },
  {
    name: 'Armenia',
    patterns: ['armenia', 'am', 'yerevan']
  },
  {
    name: 'Belarus',
    patterns: ['belarus', 'by', 'minsk', 'gomel']
  },
  {
    name: 'Bulgaria',
    patterns: ['bulgaria', 'bg', 'sofia', 'plovdiv', 'varna']
  },
  {
    name: 'Croatia',
    patterns: ['croatia', 'hr', 'zagreb', 'split', 'rijeka']
  },
  {
    name: 'Serbia',
    patterns: ['serbia', 'rs', 'belgrade', 'novi sad', 'nis']
  },
  {
    name: 'Slovakia',
    patterns: ['slovakia', 'sk', 'bratislava', 'kosice']
  },
  {
    name: 'Slovenia',
    patterns: ['slovenia', 'si', 'ljubljana', 'maribor']
  },
  {
    name: 'Lithuania',
    patterns: ['lithuania', 'lt', 'vilnius', 'kaunas']
  },
  {
    name: 'Latvia',
    patterns: ['latvia', 'lv', 'riga']
  },
  {
    name: 'Estonia',
    patterns: ['estonia', 'ee', 'tallinn', 'tartu']
  },
  {
    name: 'Iceland',
    patterns: ['iceland', 'is', 'reykjavik']
  },
  {
    name: 'Luxembourg',
    patterns: ['luxembourg', 'lu']
  },
  {
    name: 'Cyprus',
    patterns: ['cyprus', 'cy', 'nicosia', 'limassol']
  },
  {
    name: 'Malta',
    patterns: ['malta', 'mt', 'valletta']
  },
  {
    name: 'Iraq',
    patterns: ['iraq', 'iq', 'baghdad', 'erbil', 'basra']
  },
  {
    name: 'Jordan',
    patterns: ['jordan', 'jo', 'amman']
  },
  {
    name: 'Lebanon',
    patterns: ['lebanon', 'lb', 'beirut']
  },
  {
    name: 'Kuwait',
    patterns: ['kuwait', 'kw', 'kuwait city']
  },
  {
    name: 'Qatar',
    patterns: ['qatar', 'qa', 'doha']
  },
  {
    name: 'Oman',
    patterns: ['oman', 'om', 'muscat']
  },
  {
    name: 'Bahrain',
    patterns: ['bahrain', 'bh', 'manama']
  },
  {
    name: 'Myanmar',
    patterns: ['myanmar', 'mm', 'yangon', 'mandalay']
  },
  {
    name: 'Cambodia',
    patterns: ['cambodia', 'kh', 'phnom penh']
  },
  {
    name: 'Laos',
    patterns: ['laos', 'la', 'vientiane']
  },
  {
    name: 'Mongolia',
    patterns: ['mongolia', 'mn', 'ulaanbaatar']
  },
  {
    name: 'Jamaica',
    patterns: ['jamaica', 'jm', 'kingston']
  },
  {
    name: 'Trinidad and Tobago',
    patterns: ['trinidad', 'tobago', 'tt', 'port of spain']
  },
  {
    name: 'Zimbabwe',
    patterns: ['zimbabwe', 'zw', 'harare']
  },
  {
    name: 'Uganda',
    patterns: ['uganda', 'ug', 'kampala']
  },
  {
    name: 'Ethiopia',
    patterns: ['ethiopia', 'et', 'addis ababa']
  },
  {
    name: 'Tanzania',
    patterns: ['tanzania', 'tz', 'dar es salaam', 'dodoma']
  },
  {
    name: 'Senegal',
    patterns: ['senegal', 'sn', 'dakar']
  },
  {
    name: 'Ivory Coast',
    patterns: ['ivory coast', 'cote d\'ivoire', 'ci', 'abidjan']
  },
  {
    name: 'Cameroon',
    patterns: ['cameroon', 'cm', 'yaounde', 'douala']
  },
  {
    name: 'Angola',
    patterns: ['angola', 'ao', 'luanda']
  },
  {
    name: 'Mozambique',
    patterns: ['mozambique', 'mz', 'maputo']
  },
  {
    name: 'Madagascar',
    patterns: ['madagascar', 'mg', 'antananarivo']
  }
];

/**
 * Parses location string and resolves clean country name. Defaults to India.
 */
function extractCountry(location) {
  if (!location) return 'India';
  const locLower = location.toLowerCase().trim();

  // 1. Direct checks on the entire lowercase location string first
  if (locLower === 'india' || locLower === 'in' || locLower === 'ind' || locLower === 'bharat') return 'India';
  if (locLower === 'united states' || locLower === 'usa' || locLower === 'us' || locLower === 'united states of america') return 'United States';
  if (locLower === 'united kingdom' || locLower === 'uk' || locLower === 'great britain' || locLower === 'england') return 'United Kingdom';
  if (locLower === 'canada') return 'Canada';
  if (locLower === 'australia') return 'Australia';
  if (locLower === 'germany') return 'Germany';
  if (locLower === 'singapore') return 'Singapore';

  // 2. Tokenize by separators (comma, semicolon, slash)
  const parts = locLower.split(/[,;/]+/).map(p => p.trim()).filter(Boolean);

  // 3. Search for matching keywords in each part exactly
  for (const part of parts) {
    if (part === 'india' || part === 'in' || part === 'ind' || part === 'bharat') return 'India';
    if (part === 'united states' || part === 'usa' || part === 'us' || part === 'united states of america') return 'United States';
    if (part === 'united kingdom' || part === 'uk' || part === 'england' || part === 'great britain') return 'United Kingdom';
    if (part === 'canada') return 'Canada';
    if (part === 'australia') return 'Australia';
    if (part === 'germany' || part === 'deutschland') return 'Germany';
    if (part === 'singapore') return 'Singapore';
  }

  // 4. Search for cities/states in the patterns list
  // Check exact matches in the pre-defined patterns lists
  for (const part of parts) {
    for (const item of countryLookup) {
      if (item.patterns.includes(part)) {
        return item.name;
      }
    }
  }

  // 5. Check US state codes if any part is exactly a US state code
  for (const part of parts) {
    const usItem = countryLookup.find(c => c.name === 'United States');
    if (usItem && usItem.stateCodes && usItem.stateCodes.includes(part)) {
      return 'United States';
    }
  }

  // 6. Fallback checks: if the full string contains one of the major countries or patterns
  for (const item of countryLookup) {
    for (const pattern of item.patterns) {
      // Avoid matching short strings (<= 3 chars) to prevent false positives
      if (pattern.length > 3 && locLower.includes(pattern)) {
        return item.name;
      }
    }
  }

  // 7. Last resort: if there's a comma, check the last part
  if (parts.length > 1) {
    const lastPart = parts[parts.length - 1];
    const cleanLastPart = lastPart.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    const lowerLast = lastPart.toLowerCase();
    const isIndianState = countryLookup.find(c => c.name === 'India').patterns.includes(lowerLast);
    if (isIndianState) return 'India';
    
    const isUSState = countryLookup.find(c => c.name === 'United States').patterns.includes(lowerLast);
    if (isUSState) return 'United States';

    if (lastPart.length > 2) {
      return cleanLastPart;
    }
  }

  return 'India';
}

/**
 * Parses city and state from GitHub's location field.
 * Example: "Mumbai, Maharashtra, India" -> { city: "Mumbai", state: "Maharashtra" }
 * Example: "San Francisco, CA" -> { city: "San Francisco", state: "CA" }
 */
function parseCityAndState(location) {
  if (!location) return { city: null, state: null };
  const parts = location.split(',').map(p => p.trim());
  
  let city = null;
  let state = null;
  
  if (parts.length > 0) {
    city = parts[0];
  }
  if (parts.length > 1) {
    state = parts[1];
  }
  
  return { city, state };
}

/**
 * Classifies the company field into either a corporate company or a university/college.
 * If the string contains keywords like 'university', 'college', 'iit', 'school', etc.,
 * it classifies as a college. Otherwise, it cleans standard @ symbols and maps it as a company.
 */
function parseCompanyAndCollege(company) {
  if (!company) return { company: null, college: null };
  
  const cleanName = company.trim().replace(/^@/, '');
  const lower = cleanName.toLowerCase();
  
  const collegeKeywords = [
    'university', 'college', 'institute', 'school', 'iit', 'mit', 
    'iiit', 'bits', 'harvard', 'stanford', 'oxford', 'cambridge', 
    'polytechnic', 'acad', 'tech'
  ];
  
  const isCollege = collegeKeywords.some(keyword => lower.includes(keyword));
  
  if (isCollege) {
    return { company: null, college: cleanName };
  }
  
  return { company: cleanName, college: null };
}

/**
 * Transforms raw GitHub user data from GraphQL into structured profile cache and card ratings.
 */
export function transformGitHubData(user) {
  // 1. Core aggregations from repo nodes
  const repoNodes = user.repositories?.nodes || [];
  const totalStars = repoNodes.reduce((sum, r) => sum + (r.stargazerCount || 0), 0);
  const totalForks = repoNodes.reduce((sum, r) => sum + (r.forkCount || 0), 0);
  const sortedLanguages = aggregateLanguages(repoNodes);

  // 2. Contributions collection
  const contributions = user.contributionsCollection || {};
  const commitsCount = contributions.totalCommitContributions || 0;
  const prsCount = contributions.totalPullRequestContributions || 0;
  const issuesClosed = contributions.totalIssueContributions || 0;
  const prReviews = contributions.totalPullRequestReviewContributions || 0;

  // Calculate career commits across all repositories all-time
  const totalCommitsAllTime = repoNodes.reduce((sum, r) => {
    return sum + (r.defaultBranchRef?.target?.history?.totalCount || 0);
  }, 0);

  // Define totalContributions as career-wide sum (commits, PRs, issues, reviews)
  const totalContributions = Math.max(
    contributions.contributionCalendar?.totalContributions || 0,
    totalCommitsAllTime + prsCount + issuesClosed + prReviews
  );

  // 3. Streak calculations
  const calendarWeeks = contributions.contributionCalendar?.weeks || [];
  const { currentStreak, longestStreak } = calculateStreaks(calendarWeeks);

  // 4. Time calculations (Experience)
  const createdAtDate = new Date(user.createdAt);
  const diffTime = Math.abs(new Date() - createdAtDate);
  const yearsActive = Math.max(1, diffTime / (1000 * 60 * 60 * 24 * 365.25));

  // 5. Run Rating Calculations
  const batting = calculateBatting(totalContributions, totalStars);
  const bowling = calculateBowling(issuesClosed, totalForks);
  const fielding = calculateFielding(prReviews, user.following?.totalCount || 0);
  const technique = calculateTechnique(prsCount, commitsCount, sortedLanguages.length);
  const fitness = calculateFitness(currentStreak, longestStreak);
  const experience = calculateExperience(yearsActive);

  // 6. Determine Role
  const playerRole = determinePlayerRole({
    batting,
    bowling,
    fielding,
    technique,
    experience,
    prReviews,
    issuesClosed,
    orgCount: user.organizations?.totalCount || 0,
    followers: user.followers?.totalCount || 0,
    stars: totalStars,
    commitsCount,
    languages: sortedLanguages
  });

  // 7. Calculate Overall Rating
  const overall = calculateOverall(
    batting,
    bowling,
    fielding,
    technique,
    fitness,
    experience,
    playerRole
  );

  const { city, state } = parseCityAndState(user.location);
  const { company, college } = parseCompanyAndCollege(user.company);
  const primaryLang = sortedLanguages[0] || null;

  // Prepare profile cache schema
  const profileCache = {
    github_username: user.login,
    github_id: user.databaseId,
    name: user.name || user.login,
    avatar_url: user.avatarUrl,
    bio: user.bio || '',
    country: extractCountry(user.location),
    city,
    state,
    company,
    college,
    primary_language: primaryLang,
    followers: user.followers?.totalCount || 0,
    following: user.following?.totalCount || 0,
    public_repos: user.repositories?.totalCount || 0,
    total_stars: totalStars,
    total_forks: totalForks,
    contribution_count: totalContributions,
    current_streak: currentStreak,
    longest_streak: longestStreak,
    account_created_at: user.createdAt,
    raw_graphql: user,
    cached_at: new Date().toISOString()
  };

  // Prepare card ratings schema
  const cardRatings = {
    overall,
    batting,
    bowling,
    fielding,
    fitness,
    technique,
    experience,
    player_role: playerRole,
    favorite_shot: sortedLanguages[0] || 'Cover Drive', // default cover drive if no language
    languages: sortedLanguages
  };

  return {
    profileCache,
    cardRatings
  };
}
