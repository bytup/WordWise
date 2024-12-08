# WordWise - AI-Powered Vocabulary Learning Platform

WordWise is a modern web application designed to enhance vocabulary learning through AI-generated content and interactive features. The platform leverages both OpenAI GPT-3.5 and Google Gemini AI to provide comprehensive vocabulary learning experiences.

## Features

### AI-Powered Word Generation
- Dual AI integration (OpenAI GPT-3.5 and Google Gemini)
- Smart fallback system between AI providers
- Performance monitoring for AI response times
- Comprehensive word information including:
  - Definitions
  - Pronunciations
  - Example sentences
  - Etymology
  - Synonyms and antonyms
  - Difficulty levels (easy, medium, hard)

### User Features
- Google Authentication
- Personal progress tracking
- Saved words collection
- Learning history
- Daily word challenges
- Quiz system with progress tracking
- Interactive word saving and review

## Tech Stack

### Frontend
- Next.js 15.0.3 with App Router
- React 19
- TypeScript
- Tailwind CSS

### Backend
- MongoDB with Mongoose
- NextAuth.js
- Server Actions

### AI Integration
- OpenAI GPT-3.5 Turbo
- Google Gemini AI

## Getting Started

1. **Clone the repository**
```bash
git clone [repository-url]
cd wordwise
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file with the following:
```env
# Authentication
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# AI APIs
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
src/
├── actions/         # Server actions
├── app/            # Next.js app router pages
├── components/     # React components
├── lib/           # Utility functions and AI integrations
├── models/        # MongoDB models
└── types/         # TypeScript types
```

### Key Components
- `dashboard/`: Main user interface with word display and interactions
- `lib/openai.ts`: OpenAI integration for word generation
- `lib/gemini.ts`: Google Gemini integration for word generation
- `models/Word.ts`: Word data model and methods
- `models/Quiz.ts`: Quiz system data model
- `models/User.ts`: User profile and progress tracking

## Features in Detail

### Word Generation
- AI-powered word generation with fallback system
- Comprehensive word information
- Difficulty categorization
- Performance monitoring

### User Management
- Google Authentication
- Progress tracking
- Word saving functionality
- Learning history

### Quiz System
- Progress tracking
- Performance metrics
- Adaptive difficulty

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for GPT-3.5 API
- Google for Gemini AI API
- Next.js team for the amazing framework
- MongoDB team for the database
