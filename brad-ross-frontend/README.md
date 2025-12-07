# TV5MONDE AI Personalization POC

**Bradley Ross Submission for the Agentics Foundation Hackathon**

---

## Overview

This proof-of-concept demonstrates a paradigm shift in broadcast television personalization. Traditional recommendation algorithms assume **one profile = one person**, but real-world viewing is far more complex. Families share remotes, accounts serve multiple viewers, and viewing contexts change throughout the day.

Our AI-powered solution introduces **Invisible Design** - inferring distinct viewer segments from behavioral patterns without requiring explicit profile switching or user input.

## The Problem

Standard broadcast recommendation systems fail in shared-account scenarios:

- **Chaotic Recommendations**: A "Top Picks" row mixing Dad's sci-fi with kids' cartoons and teen dramas
- **Profile Confusion**: Algorithms treat all viewing history as belonging to a single persona
- **Context Blindness**: No awareness of temporal patterns (e.g., Friday date nights vs. Saturday morning cartoons)

## The Solution: Multi-Segment Personalization

Our AI engine analyzes viewing behavior to identify **Micro-Segments** within a single profile:

| Segment | Example Content | Behavioral Signals |
|---------|-----------------|-------------------|
| **Dad Solo** (50%) | The Expanse, Cosmos, Interstellar | Late-night viewing, sci-fi genres |
| **Co-Viewing** (25%) | Bluey, PAW Patrol, Peppa Pig | Weekend mornings, kids content |
| **Teen** (15%) | Stranger Things, Euphoria | Evening viewing, drama genres |
| **Date Night** (10%) | The Notebook, Love Actually | Friday/Saturday evenings, romcoms |

## Features

### 1. Standard vs Personalized View Comparison
- **Standard View**: Shows the "before" state - chaotic, mixed recommendations
- **Personalized View**: Demonstrates segment-aware recommendations with AI reasoning

### 2. Interactive 3D Data Visualization
- Real-time 3D scatter plot of viewing events
- Toggle between "Raw Data" (chaos) and "AI Segments" (clustered)
- Click any data point to see AI classification details

### 3. AI-Powered Recommendations
- Powered by **Google Gemini 2.5 Flash**
- Real-time personalized content generation
- Segment-aware recommendation logic

### 4. Concept Demo Video
- Embedded video demonstration on the home page
- Visual explanation of the personalization concept

## Technical Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Three.js** / React Three Fiber for 3D visualizations
- **Lucide React** for icons

### AI Integration
- **Google Generative AI SDK** (`@google/genai`)
- **Model**: Gemini 2.5 Flash
- **Structured JSON responses** with schema validation

### Key Components

| Component | Purpose |
|-----------|---------|
| `App.tsx` | Main application router and view management |
| `Hero.tsx` | Landing page hero section with concept video |
| `HowTo.tsx` | Interactive 3D visualization and algorithm explanation |
| `DataCluster.tsx` | Three.js 3D scatter plot visualization |
| `VideoCard.tsx` | Content card component for recommendations |
| `Header.tsx` | Navigation and view switching |
| `gemini.ts` | Google Gemini API integration service |

### Data Flow

```
Viewing History → AI Analysis → Segment Classification → Personalized Recommendations
       ↓                ↓                  ↓                        ↓
   Raw Events    Vector Embedding    Cluster Assignment    Context-Aware Content
```

## Project Structure

```
brad-ross-frontend/
├── assets/
│   └── hackathon - I want with others.mp4    # Concept demo video
├── components/
│   ├── DataCluster.tsx     # 3D visualization
│   ├── Header.tsx          # Navigation
│   ├── Hero.tsx            # Landing hero with video
│   ├── HowTo.tsx           # Algorithm explanation
│   ├── TopicSelector.tsx   # Interest selection
│   └── VideoCard.tsx       # Content cards
├── services/
│   └── gemini.ts           # Gemini AI integration
├── App.tsx                 # Main application
├── index.tsx               # Entry point
├── index.html              # HTML template
├── types.ts                # TypeScript interfaces
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
└── vite.config.ts          # Vite configuration
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- Google Gemini API Key

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure your API key in `.env.local`:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

### Build for Production

```bash
npm run build
npm run preview
```

## Key Insights

### Invisible Design Principles

1. **Outliers are NOT Errors**: When "Dad" watches Paw Patrol, the AI identifies a Co-Viewing segment rather than treating it as noise

2. **Temporal Context Matters**: The "Date Night" cluster activates specifically on Friday/Saturday evenings

3. **No Explicit Profiles Required**: The system infers segments from behavior without requiring users to manage multiple profiles

### Business Value

- **Improved Engagement**: Relevant recommendations increase watch time
- **Reduced Churn**: Better UX for shared accounts reduces frustration
- **Operational Efficiency**: No manual profile management overhead
- **Competitive Advantage**: Novel approach to the shared-account problem

## Demo Walkthrough

1. **Home Page**: Watch the concept demo video explaining the personalization approach
2. **Standard (Before)**: See the chaotic mixed recommendations typical of standard algorithms
3. **Personalized (After)**: Experience segment-aware recommendations with AI reasoning visible
4. **How It Works**: Interact with the 3D visualization to understand the clustering algorithm

## Future Enhancements

- Real-time segment detection during playback
- Cross-device viewing pattern analysis
- Household member prediction models
- A/B testing framework for recommendation strategies
- Integration with live TV scheduling

---

**Built for TV5MONDE** | Powered by Google Gemini | Agentics Foundation Hackathon 2024
