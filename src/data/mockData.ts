export interface Word {
  id: string;
  word: string;
  definition: string;
  pronunciation: string;
  audioUrl: string;
  examples: string[];
  origin: string;
  synonyms: string[];
  antonyms: string[];
  difficulty: "easy" | "medium" | "hard";
}

export interface User {
  id: string;
  username: string;
  streak: number;
  points: number;
  badges: Badge[];
  savedWords: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface Quiz {
  id: string;
  type: "multiple-choice" | "fill-blank" | "listening";
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  audioUrl?: string;
}

export const mockWords: Word[] = [
  {
    id: "1",
    word: "Ephemeral",
    definition: "Lasting for a very short time",
    pronunciation: "ih-fem-er-uhl",
    audioUrl: "/audio/ephemeral.mp3",
    examples: [
      "The ephemeral nature of cherry blossoms makes them more beautiful.",
      "Social media posts often have an ephemeral impact on public opinion.",
    ],
    origin: 'From Greek ephēmeros, meaning "lasting only one day"',
    synonyms: ["fleeting", "transient", "momentary", "brief"],
    antonyms: ["permanent", "eternal", "enduring", "everlasting"],
    difficulty: "medium",
  },
  {
    id: "2",
    word: "Serendipity",
    definition:
      "The occurrence of finding pleasant or valuable things by chance",
    pronunciation: "ser-uhn-dip-i-tee",
    audioUrl: "/audio/serendipity.mp3",
    examples: [
      "Meeting my best friend was pure serendipity.",
      "Many scientific discoveries happened by serendipity.",
    ],
    origin:
      'Coined by Horace Walpole in 1754 from the Persian fairy tale "The Three Princes of Serendip"',
    synonyms: ["chance", "fortune", "luck", "destiny"],
    antonyms: ["misfortune", "design", "plan"],
    difficulty: "hard",
  },
];

export const mockUser: User = {
  id: "1",
  username: "WordLearner",
  streak: 7,
  points: 1250,
  badges: [
    {
      id: "1",
      name: "Week Warrior",
      description: "Maintained a 7-day streak",
      imageUrl: `data:image/svg+xml,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="38" fill="#FEF3C7" stroke="#F59E0B" stroke-width="4"/>
          <path d="M40 15L44.9 30.2H61L47.8 39.6L52.7 54.8L40 45.4L27.3 54.8L32.2 39.6L19 30.2H35.1L40 15Z" fill="#F59E0B"/>
          <circle cx="40" cy="40" r="28" stroke="#F59E0B" stroke-width="2" stroke-dasharray="4 4"/>
          <text x="40" y="65" text-anchor="middle" font-family="Arial" font-size="10" fill="#B45309">7 DAYS</text>
        </svg>
      `)}`,
    },
    {
      id: "2",
      name: "Vocabulary Master",
      description: "Learned 50 words",
      imageUrl: `data:image/svg+xml,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="38" fill="#DBEAFE" stroke="#3B82F6" stroke-width="4"/>
          <path d="M25 30H55M25 30V50C25 51.1046 25.8954 52 27 52H53C54.1046 52 55 51.1046 55 50V30M25 30L30 20H50L55 30" stroke="#3B82F6" stroke-width="3"/>
          <path d="M35 38H45M35 44H45" stroke="#3B82F6" stroke-width="2"/>
          <text x="40" y="65" text-anchor="middle" font-family="Arial" font-size="10" fill="#1D4ED8">50 WORDS</text>
        </svg>
      `)}`,
    },
    {
      id: "3",
      name: "Quiz Champion",
      description: "Achieved 100% in 5 quizzes",
      imageUrl: `data:image/svg+xml,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="38" fill="#FCE7F3" stroke="#EC4899" stroke-width="4"/>
          <path d="M30 42L38 50L50 30" stroke="#EC4899" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="40" cy="40" r="25" stroke="#EC4899" stroke-width="2"/>
          <text x="40" y="65" text-anchor="middle" font-family="Arial" font-size="10" fill="#9D174D">PERFECT 5</text>
        </svg>
      `)}`,
    },
    {
      id: "4",
      name: "Early Bird",
      description: "Completed daily word before 8 AM",
      imageUrl: `data:image/svg+xml,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="38" fill="#E0E7FF" stroke="#6366F1" stroke-width="4"/>
          <path d="M40 25V40L50 45" stroke="#6366F1" stroke-width="4" stroke-linecap="round"/>
          <circle cx="40" cy="40" r="20" stroke="#6366F1" stroke-width="3"/>
          <path d="M40 15L45 20L40 25L35 20L40 15Z" fill="#6366F1"/>
          <text x="40" y="65" text-anchor="middle" font-family="Arial" font-size="10" fill="#4338CA">EARLY 8AM</text>
        </svg>
      `)}`,
    },
    {
      id: "5",
      name: "Polyglot Path",
      description: "Learned words from 3 different origins",
      imageUrl: `data:image/svg+xml,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="38" fill="#D1FAE5" stroke="#059669" stroke-width="4"/>
          <circle cx="30" cy="35" r="10" fill="#059669"/>
          <circle cx="50" cy="35" r="10" fill="#059669" fill-opacity="0.7"/>
          <circle cx="40" cy="45" r="10" fill="#059669" fill-opacity="0.4"/>
          <text x="40" y="65" text-anchor="middle" font-family="Arial" font-size="10" fill="#065F46">3 ORIGINS</text>
        </svg>
      `)}`,
    },
  ],
  savedWords: ["1", "2"],
};

export const mockQuizzes: Quiz[] = [
  {
    id: "1",
    type: "multiple-choice",
    question: 'What does "ephemeral" mean?',
    options: [
      "Lasting for a very short time",
      "Permanent and unchanging",
      "Extremely powerful",
      "Mysteriously beautiful",
    ],
    correctAnswer: "Lasting for a very short time",
    explanation:
      'Ephemeral comes from the Greek word "ephēmeros" meaning lasting only one day. It describes things that are fleeting or short-lived.',
  },
  {
    id: "2",
    type: "fill-blank",
    question: "The _______ beauty of the sunset made everyone stop and stare.",
    correctAnswer: "ephemeral",
    explanation:
      "Ephemeral is perfect here because sunsets are beautiful but last only for a short time.",
  },
  {
    id: "3",
    type: "listening",
    question: "Type the word you hear",
    audioUrl: "/audio/serendipity.mp3",
    correctAnswer: "serendipity",
    explanation:
      "The word you heard was 'serendipity', which means finding pleasant or valuable things by chance.",
  },
];
