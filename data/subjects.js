// Complete list of CSS subjects
// Compulsory: 6 subjects (600 marks)
// Optional: User's chosen 5 subjects (600 marks)

export const DEFAULT_SUBJECTS = [
  // COMPULSORY SUBJECTS
  {
    id: 'subj_essay',
    name: 'English Essay',
    type: 'compulsory',
    marks: 100,
    papers: 1,
    color: 'var(--subject-1)',
    difficulty: 4,
    previousExposure: 3,
    pastPaperImportance: 5,
    icon: '✍️'
  },
  {
    id: 'subj_precis',
    name: 'English Precis & Composition',
    type: 'compulsory',
    marks: 100,
    papers: 1,
    color: 'var(--subject-2)',
    difficulty: 4,
    previousExposure: 3,
    pastPaperImportance: 5,
    icon: '📝'
  },
  {
    id: 'subj_gsa',
    name: 'General Science & Ability',
    type: 'compulsory',
    marks: 100,
    papers: 1,
    color: 'var(--subject-3)',
    difficulty: 3,
    previousExposure: 2,
    pastPaperImportance: 4,
    icon: '🔬'
  },
  {
    id: 'subj_current',
    name: 'Current Affairs',
    type: 'compulsory',
    marks: 100,
    papers: 1,
    color: 'var(--subject-4)',
    difficulty: 3,
    previousExposure: 3,
    pastPaperImportance: 5,
    icon: '🌍'
  },
  {
    id: 'subj_pakaffairs',
    name: 'Pakistan Affairs',
    type: 'compulsory',
    marks: 100,
    papers: 1,
    color: 'var(--subject-5)',
    difficulty: 3,
    previousExposure: 4,
    pastPaperImportance: 5,
    icon: '🇵🇰'
  },
  {
    id: 'subj_islamiat',
    name: 'Islamic Studies',
    type: 'compulsory',
    marks: 100,
    papers: 1,
    color: 'var(--subject-6)',
    difficulty: 3,
    previousExposure: 4,
    pastPaperImportance: 4,
    icon: '☪️'
  },
  
  // OPTIONAL SUBJECTS
  {
    id: 'subj_polsci',
    name: 'Political Science',
    type: 'optional',
    marks: 200,
    papers: 2,
    color: 'var(--subject-7)',
    difficulty: 4,
    previousExposure: 3,
    pastPaperImportance: 5,
    icon: '⚖️'
  },
  {
    id: 'subj_criminology',
    name: 'Criminology',
    type: 'optional',
    marks: 100,
    papers: 1,
    color: 'var(--subject-8)',
    difficulty: 3,
    previousExposure: 2,
    pastPaperImportance: 4,
    icon: '🔍'
  },
  {
    id: 'subj_envsc',
    name: 'Environmental Science',
    type: 'optional',
    marks: 100,
    papers: 1,
    color: 'var(--subject-9)',
    difficulty: 3,
    previousExposure: 2,
    pastPaperImportance: 4,
    icon: '🌿'
  },
  {
    id: 'subj_sindhi',
    name: 'Sindhi',
    type: 'optional',
    marks: 100,
    papers: 1,
    color: 'var(--subject-10)',
    difficulty: 3,
    previousExposure: 4,
    pastPaperImportance: 3,
    icon: '📖'
  },
  {
    id: 'subj_islhist',
    name: 'Islamic History & Culture',
    type: 'optional',
    marks: 100,
    papers: 1,
    color: 'var(--subject-11)',
    difficulty: 3,
    previousExposure: 3,
    pastPaperImportance: 4,
    icon: '🕌'
  }
];

// Complete FPSC Syllabus Data broken into Mastery Topics
// This is the OFFICIAL FPSC CSS syllabus converted into study units
export const SYLLABUS_DATA = {
  'subj_polsci': [
    {
      name: 'Paper I — Western Political Thought',
      topics: [
        'Plato — Political philosophy & ideal state',
        'Plato — Concept of justice',
        'Aristotle — Classification of constitutions',
        'Aristotle — Concept of citizenship & political participation',
        'Machiavelli — The Prince & political realism',
        'Montesquieu — Separation of powers',
        'Hobbes — Social contract & Leviathan',
        'Locke — Natural rights & limited government',
        'Rousseau — General will & social contract',
        'Kant — Perpetual peace & moral politics',
        'Mill — On Liberty & utilitarianism in politics',
        'Bentham — Utilitarianism & legal positivism',
        'Hegel — Dialectics & philosophy of the state',
        'Marx — Historical materialism & class struggle',
        'Lenin — Imperialism & revolutionary theory',
        'Mao — People\'s war & Chinese Marxism',
        'Gramsci — Cultural hegemony',
        'Karl Popper — Open society & critique of historicism',
        'Pierre Bourdieu — Social & cultural capital',
        'John Rawls — Theory of justice',
        'Francis Fukuyama — End of history thesis',
        'Foucault — Power & knowledge',
        'Derrida — Deconstruction in political thought',
        'Kierkegaard — Existentialism in politics',
        'Jean-Paul Sartre — Existentialist political philosophy',
        'René Descartes — Rationalism & political implications'
      ]
    },
    {
      name: 'Paper I — Muslim Political Thought',
      topics: [
        'Al-Farabi — Virtuous city & political philosophy',
        'Al-Mawardi — Theory of the caliphate',
        'Ibn Rushd (Averroes) — Rationalism & political thought',
        'Imam Ghazali — Political ethics & revival',
        'Ibn Taymiyyah — Islamic governance & Shari\'ah',
        'Nizam-ul-Mulk Tusi — Siyasatnama & statecraft',
        'Ibn Khaldun — Asabiyyah & rise/fall of civilizations',
        'Shah Waliullah — Islamic reform & political thought',
        'Allama Muhammad Iqbal — Reconstruction of Islamic thought & Khudi',
        'Jamaluddin Afghani — Pan-Islamism & anti-colonialism',
        'Rashid Rida — Islamic modernism & reform'
      ]
    },
    {
      name: 'Paper I — State, Concepts & Institutions',
      topics: [
        'Nature & emergence of the modern nation-state',
        'Islamic concept of state & Ummah',
        'Sovereignty — Western & Islamic perspectives',
        'Justice — Western & Islamic perspectives',
        'Law — Western & Islamic perspectives',
        'Liberty, freedom & equality',
        'Rights, duties & human rights',
        'Political authority & power',
        'Political socialization & political culture',
        'Political development & political recruitment',
        'Social change & civil society',
        'Violence & terrorism in politics',
        'Gender & politics — women empowerment',
        'Political change & revolution',
        'Elections & electoral systems',
        'Public opinion & propaganda',
        'Political parties — theory & practice',
        'Pressure groups & lobbies',
        'Legislature — structure & functions',
        'Executive — types & functions',
        'Judiciary — role & independence',
        'Political elites — theory & practice',
        'Civil & military bureaucracy'
      ]
    },
    {
      name: 'Paper I — Forms of Government & Ideologies',
      topics: [
        'Monarchy — types & examples',
        'Democracy — theory & practice',
        'Dictatorship & totalitarian/authoritarian systems',
        'Unitary vs federal systems',
        'Confederation',
        'Presidential vs parliamentary government',
        'Capitalism as political ideology',
        'Marxism & communism',
        'Socialism — types & practice',
        'Totalitarianism & fascism',
        'Nationalism — theories & movements',
        'Islamic political ideology',
        'Local self-government — theory & practice (Pakistan)',
        'Public administration & public policy'
      ]
    },
    {
      name: 'Paper II — Comparative Political Systems',
      topics: [
        'Political system of USA',
        'Political system of UK',
        'Political system of France',
        'Political system of Germany',
        'Political system of Turkey',
        'Political system of Iran',
        'Political system of Malaysia',
        'Political system of India',
        'Political system of China'
      ]
    },
    {
      name: 'Paper II — Global & Regional Integration',
      topics: [
        'Globalization & politics',
        'Global civil society',
        'European Union (EU) — structure & integration',
        'SAARC — role & challenges',
        'ECO — structure & relevance',
        'IMF & WTO — international financial regimes'
      ]
    },
    {
      name: 'Paper II — Pakistan Movement & Government',
      topics: [
        'Rise of Muslim nationalism in South Asia',
        'Sir Syed Ahmed Khan — educational & political contributions',
        'Allama Iqbal — philosophical contributions to Pakistan Movement',
        'Quaid-i-Azam — leadership & Pakistan Movement',
        'Constitution making 1947–1956',
        '1956 Constitution — critical analysis',
        '1962 Constitution — critical analysis',
        '1973 Constitution — critical analysis',
        'Constitutional amendments up to date',
        'Federal structure & Centre–Province relations after 18th Amendment',
        'Political culture in Pakistan',
        'Civil & military bureaucracy in Pakistan',
        'Judiciary in Pakistan',
        'Feudalism & dynastic politics',
        'Political parties & interest groups in Pakistan',
        'Elections & voting behavior in Pakistan',
        'Religion & politics in Pakistan',
        'Ethnicity & national integration'
      ]
    },
    {
      name: 'Paper II — International Relations & Foreign Policy',
      topics: [
        'History of IR — Post WW-II period',
        'Pakistan\'s foreign policy — national interests & determinants',
        'Geography & security as determinants of foreign policy',
        'Role of ideology, press & public opinion in foreign policy',
        'Diplomacy & foreign policy-making in Pakistan',
        'External factors — international power structure & organizations',
        'Pakistan–India relations',
        'Pakistan–China relations',
        'Pakistan–Afghanistan relations',
        'Pakistan–US relations',
        'Pakistan & the Muslim world'
      ]
    }
  ],
  'subj_envsc': [
    {
      name: 'History of Environmental Thought',
      topics: [
        'Environment & sustainable development — concepts',
        'History of environmental movements',
        'Industrial & agricultural revolution — environmental impact',
        'UN Conference on Human Environment 1972',
        'Our Common Future 1987 (Brundtland Report)',
        'Rio Summit 1992 & Agenda 21',
        'World Summit on Sustainable Development 2002',
        'Rio+20 Summit 2012',
        'Millennium Development Goals & SDGs'
      ]
    },
    {
      name: 'Sustainable Development Issues',
      topics: [
        'Population growth & environment',
        'Poverty & environment',
        'Biodiversity loss & conservation',
        'Energy security — conservation & alternative resources',
        'Urbanization & sustainable cities',
        'Carrying capacity & ecological footprint',
        'Food security & sustainable agriculture',
        'Ecological restoration'
      ]
    },
    {
      name: 'Interdisciplinary Environmental Science',
      topics: [
        'Environmental Biology & Microbiology',
        'Environmental Chemistry & Toxicology',
        'Environmental Physics & Geology',
        'Environmental Economics',
        'Environmental Geography & Sociology',
        'Environmental Biotechnology'
      ]
    },
    {
      name: 'Environmental Pollution',
      topics: [
        'Air pollution — sources, effects & control',
        'Water pollution — types & treatment',
        'Soil pollution & degradation',
        'Noise pollution',
        'Solid waste management',
        'Water logging & salinity',
        'Deforestation & desertification',
        'Eutrophication',
        'Greenhouse effect & global warming',
        'Ozone depletion',
        'Acid rain'
      ]
    },
    {
      name: 'Climate Change',
      topics: [
        'Climate patterns — local, regional & global',
        'Climate change processes, drivers & indicators',
        'Effects on natural & societal systems',
        'Carbon footprint',
        'Climate change adaptation & mitigation',
        'Clean Development Mechanism (CDM) & REDD+',
        'Global environmental politics on climate change'
      ]
    },
    {
      name: 'Environmental Governance (Pakistan)',
      topics: [
        'National Conservation Strategy 1992',
        'National Environmental Policy Act 2005',
        'Environmental Protection Act 1997',
        'Pak-EPA IEE/EIA Regulations 2000',
        'Waste management rules & policies',
        'National Climate Change Policy 2012',
        'National Drinking Water Policy 2009'
      ]
    },
    {
      name: 'Global Environmental Initiatives',
      topics: [
        'Convention on Biological Diversity (CBD)',
        'CITES & Ramsar Convention',
        'Convention on Migratory Species (CMS)',
        'UNFCCC & Kyoto Protocol',
        'Montreal Protocol',
        'UNCCD'
      ]
    },
    {
      name: 'Environmental Assessment & Management',
      topics: [
        'Environmental Impact Assessment (EIA) & SEA',
        'Environmental Management Systems (ISO 14000)',
        'Occupational Health & Safety (OHSAS 18000)',
        'GIS & Remote Sensing in environment',
        'Disaster Risk Management',
        'Pollution control technologies',
        'Natural resources management'
      ]
    }
  ],
  'subj_criminology': [
    {
      name: 'Section I — Introduction & Theory',
      topics: [
        'Basic concepts — crime, criminality, criminal behavior',
        'Definition, meaning & scope of criminology',
        'Criminology & criminal law relationship',
        'Crime as social problem — deviance, norms, values',
        'Occasional, habitual & professional criminals',
        'White-collar crime & corporate crime',
        'Organized crime',
        'Biological theories of crime',
        'Psychological theories of crime',
        'Social disorganization theory',
        'Strain theory',
        'Social control theory',
        'Learning theory & labeling theory',
        'Islamic perspective on deviance & crime'
      ]
    },
    {
      name: 'Section II — Juvenile & Criminal Justice',
      topics: [
        'Juvenile delinquency — definitions & statistics',
        'Juvenile justice system — role of police',
        'Juvenile court process — pretrial, trial, sentencing',
        'Juvenile correctional institutions & alternatives',
        'Criminal justice system — role of police',
        'Trial & conviction of offenders — court procedures',
        'Prisons — types & conditions',
        'Probation & parole',
        'Corporal punishment & imprisonment',
        'Rehabilitation & reformative treatment'
      ]
    },
    {
      name: 'Section III — Criminal Investigation',
      topics: [
        'Principles of criminal investigation',
        'Manual of preliminary investigation',
        'Intelligence & database investigation',
        'Electronic & forensic investigation',
        'Information gathering techniques',
        'Interviewing & interrogation techniques',
        'Criminal investigation analysis',
        'Stop & frisk — arrest procedures',
        'Search & seizure — legal guidelines',
        'INTERPOL, EUROPOL, UNODC & international policing'
      ]
    },
    {
      name: 'Section IV — Contemporary Criminology',
      topics: [
        'Terrorism, radicalism & war on terror',
        'Media\'s representation of crime & CJS',
        'Intelligence-led policing & community policing',
        'Gender & crime in Pakistan',
        'Crime & urbanization',
        'Human rights abuses & protection',
        'Money laundering & cyber crime',
        'Role of NAB, FIA & ANF'
      ]
    }
  ],
  'subj_islhist': [
    {
      name: 'Part I — Pre-Islamic & Prophetic Era',
      topics: [
        'Pre-Islamic Near East — political & social conditions',
        'Pre-Islamic Arabia — cultural & religious conditions',
        'Prophet Muhammad (PBUH) — biography & chronology',
        'Prophet as Motivator (Da\'i)',
        'Prophet as Military Leader/Strategist',
        'Prophet as Political Leader/Head of State'
      ]
    },
    {
      name: 'Part I — The Pious Caliphate',
      topics: [
        'Caliph Abu Bakr — apostasy wars & consolidation',
        'Caliph Umar — administrative system & expansion',
        'Caliph Uthman — problems & issues',
        'Caliph Ali — rise of factionalism',
        'Imam Hasan\'s abdication & Umayyad establishment'
      ]
    },
    {
      name: 'Part I — Islamic Political System & Institutions',
      topics: [
        'Nature of Islamic state & form of government',
        'Functions of state — sovereignty of God',
        'Caliphate/vicegerency — appointment of Caliph & Shura',
        'Law & judiciary in early Islam',
        'Administration & state conduct',
        'Defense & financial administration',
        'Educational system & propagation of Islam'
      ]
    },
    {
      name: 'Part I — The Umayyads',
      topics: [
        'Umayyad political history (660–749)',
        'Umayyad statecraft & administration',
        'Society & development of Arabic literature',
        'Umayyad cultural achievements'
      ]
    },
    {
      name: 'Part II — The Abbasids',
      topics: [
        'Abbasid revolution & establishment',
        'Abbasid administrative structure',
        'Scientific knowledge under Abbasids',
        'Muslim philosophy under Abbasids',
        'Abbasid cultural achievements'
      ]
    },
    {
      name: 'Part II — Spain, Crusades & Ottomans',
      topics: [
        'Muslim Spain — Arab & Moorish rule',
        'Muslim Spain — political fragmentation & fall of Granada',
        'Muslim Spain — arts, architecture & cultural contribution',
        'Crusades — major encounters (1092–1228)',
        'Crusades — impact on Muslim-Christian relations',
        'Ottoman Empire — rise (1299–1453)',
        'Ottoman Empire — zenith & administration',
        'Ottoman Empire — decline & fall (to 1923)',
        'Ottoman treatment of religious minorities',
        'Ottoman architecture & culture'
      ]
    },
    {
      name: 'Part II — Sufism & Modernity',
      topics: [
        'Sufism — origin & development',
        'Sufism — contribution to civilization',
        'Sufism — relationship with state & politics',
        'Islam & modernity — emergence of Islamic modernism',
        'Intellectual & political aspects of Islamic modernism',
        'Dissemination of Muslim learning in the West'
      ]
    }
  ],
  'subj_current': [
    {
      name: 'Pakistan Domestic Affairs',
      topics: [
        'Pakistan\'s political developments (current)',
        'Pakistan\'s economic situation (current)',
        'Pakistan\'s social issues (current)'
      ]
    },
    {
      name: 'Pakistan External Affairs',
      topics: [
        'Pakistan–India relations (current)',
        'Pakistan–China relations (current)',
        'Pakistan–Afghanistan relations (current)',
        'Pakistan–Russia relations (current)',
        'Pakistan–Iran relations',
        'Pakistan–Saudi Arabia relations',
        'Pakistan–Turkey relations',
        'Pakistan–US relations (current)',
        'Pakistan & UN',
        'Pakistan & SAARC',
        'Pakistan & ECO',
        'Pakistan & OIC',
        'Pakistan & WTO/GCC'
      ]
    },
    {
      name: 'Global Issues',
      topics: [
        'International security issues',
        'International political economy',
        'Human rights issues globally',
        'Global warming & environmental agreements',
        'World population trends & policies',
        'Terrorism & counter-terrorism',
        'Global energy politics',
        'Nuclear proliferation & nuclear politics in South Asia',
        'International trade — WTO & rounds',
        'Cooperation in Arabian Sea, Indian & Pacific Oceans',
        'Millennium/Sustainable Development Goals — status',
        'Globalization — trends & impact',
        'Middle East crisis',
        'Kashmir issue',
        'Palestine issue'
      ]
    }
  ],
  'subj_islamiat': [
    {
      name: 'Introduction to Islam',
      topics: [
        'Islam — fundamental beliefs (Tawheed, Risalat, Akhirah)',
        'Islamic worships (Salat, Zakat, Saum, Hajj)',
        'Articles of faith'
      ]
    },
    {
      name: 'Sirah of Prophet Muhammad (PBUH)',
      topics: [
        'Prophet as role model — personal character',
        'Prophet as leader & statesman',
        'Prophet\'s dealings with non-Muslims',
        'Prophet\'s social reforms'
      ]
    },
    {
      name: 'Human Rights & Status of Women',
      topics: [
        'Human rights in Islam',
        'Status of women in Islam',
        'Rights of minorities in Islamic state'
      ]
    },
    {
      name: 'Islamic Civilization & Culture',
      topics: [
        'Islamic civilization — contributions to knowledge',
        'Islamic culture — art, architecture & sciences',
        'Muslim contributions to science & philosophy'
      ]
    },
    {
      name: 'Islam & the World',
      topics: [
        'Islam & the West — historical relations',
        'Islam & modern challenges',
        'Islamic economic system'
      ]
    },
    {
      name: 'Public Administration & Governance in Islam',
      topics: [
        'Good governance in Islam — principles',
        'Hazrat Umar\'s letters on administration',
        'Hazrat Ali\'s letter to Malik al-Ashtar',
        'Hisbah system — accountability in Islam',
        'Ijma & Ijtihad'
      ]
    }
  ],
  'subj_pakaffairs': [
    {
      name: 'Ideology & Pakistan Movement',
      topics: [
        'Ideology of Pakistan — concept & foundations',
        'Sheikh Ahmad Sirhindi & Shah Waliullah — reform movements',
        'Sir Syed Ahmad Khan — Aligarh movement',
        'Allama Iqbal — concept of separate Muslim state',
        'Quaid-i-Azam — leadership of Pakistan Movement',
        'Pakistan Resolution 1940 & creation of Pakistan'
      ]
    },
    {
      name: 'Land, People & Society',
      topics: [
        'Geography & natural resources of Pakistan',
        'Population, demographics & social structure',
        'Social problems — poverty, illiteracy, health',
        'Ethnic diversity & national integration'
      ]
    },
    {
      name: 'Constitutional & Political Development',
      topics: [
        'Constitutional development 1947–1973',
        '18th Amendment & its implications',
        'Civil-military relations in Pakistan',
        'Post-1971 political evolution',
        'Democracy & democratic institutions'
      ]
    },
    {
      name: 'Economy & Development',
      topics: [
        'Economic survey & budget analysis',
        'Agriculture & industrial development',
        'Water resources & hydropolitics',
        'Energy crisis & solutions',
        'CPEC & regional connectivity'
      ]
    },
    {
      name: 'Foreign Policy & Security',
      topics: [
        'Nuclear program of Pakistan',
        'Post-9/11 foreign policy challenges',
        'Kashmir issue — Pakistan\'s perspective',
        'Pakistan & international organizations',
        'Regional security environment'
      ]
    }
  ],
  'subj_gsa': [
    {
      name: 'Physical Sciences',
      topics: [
        'Laws of motion & thermodynamics',
        'Electricity, magnetism & electronics basics',
        'Atomic structure & nuclear physics',
        'Chemical bonding & reactions',
        'Environmental chemistry'
      ]
    },
    {
      name: 'Biological Sciences',
      topics: [
        'Cell biology & genetics',
        'Human body systems',
        'Diseases — viral, bacterial & genetic',
        'Biotechnology & genetic engineering',
        'Evolution & ecology basics'
      ]
    },
    {
      name: 'Environmental & Earth Sciences',
      topics: [
        'Climate change & global warming',
        'Natural disasters — types & management',
        'Renewable energy sources',
        'Space exploration & astronomy'
      ]
    },
    {
      name: 'IT & Computer Science',
      topics: [
        'Computer fundamentals & networking',
        'Internet & cybersecurity',
        'Artificial intelligence & robotics',
        'Telecom & mobile technology'
      ]
    },
    {
      name: 'Quantitative Ability',
      topics: [
        'Basic arithmetic & algebra',
        'Percentages, ratios & proportions',
        'Data interpretation — graphs & tables',
        'Geometry & mensuration basics'
      ]
    },
    {
      name: 'Logical & Analytical Reasoning',
      topics: [
        'Logical reasoning & syllogisms',
        'Analytical reasoning — series & patterns',
        'Mental abilities & problem solving',
        'Critical thinking'
      ]
    }
  ],
  'subj_precis': [
    {
      name: 'Precis Writing',
      topics: [
        'Precis writing — technique & practice',
        'Comprehension & summary skills'
      ]
    },
    {
      name: 'Grammar & Vocabulary',
      topics: [
        'English grammar — tenses & structures',
        'Sentence correction & transformation',
        'Vocabulary building — word pairs & usage',
        'Grouping of words — analogies'
      ]
    },
    {
      name: 'Composition',
      topics: [
        'Reading comprehension strategies',
        'Translation — Urdu to English'
      ]
    }
  ],
  'subj_essay': [
    {
      name: 'Essay Writing Skills',
      topics: [
        'Essay structure & planning',
        'Introduction & thesis writing',
        'Body paragraphs & argumentation',
        'Conclusion writing',
        'CSS essay categories — social, political, philosophical',
        'Research & quotation integration',
        'Practice essays — current topics'
      ]
    }
  ],
  'subj_sindhi': [
    {
      name: 'Sindhi Language & Literature',
      topics: [
        'History & origin of Sindhi language',
        'Sindhi dialects & script',
        'Sindhi folk literature — traditions & forms',
        'Classical Sindhi poetry — Shah Abdul Latif Bhittai',
        'Classical Sindhi poetry — Sachal Sarmast',
        'Classical Sindhi poetry — other major poets',
        'Modern Sindhi prose — novel & afsana',
        'Modern Sindhi prose — drama & safarnama',
        'Sindhi literary history & criticism',
        'Translation — Sindhi to English/Urdu'
      ]
    }
  ]
};
