import { LessonConfig } from './types';

export const LESSON_CONFIG: LessonConfig = {
  title: "Interference of Light",
  subtitle: "Physics: Module 17, Lesson 1",
  schoolName: "Al Rashidiya Secondary School for Girls",
  schoolVision: "To lead in education that focuses on values, fosters creativity, and prepares a generation to compete in a changing future.",
  teacherName: "Ms. Pooja Naik",
  logoUrl: "https://upload.wikimedia.org/wikipedia/en/f/f5/Ministry_of_Education_%28United_Arab_Emirates%29_logo.png",
  learningObjectives: [
    "Define coherent and incoherent light and explain how to convert between them.",
    "Describe the conditions necessary for double-slit interference to occur.",
    "Explain the formation of interference fringes (bright and dark bands).",
    "Apply the double-slit equation (λ = xd/L) to solve problems involving wavelength, slit separation, and screen distance."
  ],
  
  starter: {
    title: "Focus Question",
    description: "Have you ever noticed the vibrant colors on the surface of a soap bubble or an oil slick? This isn't just a simple reflection.",
    questions: [
      "How do bubbles produce a rainbow effect?",
      "What happens when two light waves overlap in the same space?"
    ],
    objectiveIndex: 0
  },

  wordScramble: {
    words: [
      { word: 'COHERENT', hint: 'Light waves with the same wavelength and in phase' },
      { word: 'INCOHERENT', hint: 'Light waves with chaotic, out-of-phase relationships' },
      { word: 'MONOCHROMATIC', hint: 'Light consisting of only one wavelength' },
      { word: 'FRINGES', hint: 'The pattern of bright and dark bands on a screen' },
      { word: 'DIFFRACTION', hint: 'The bending of light around a barrier or through a slit' }
    ],
    objectiveIndex: 0
  },

  dragDrop: {
    imageUrl: "", // Using SVG drawing
    labels: [
      { id: 'source', text: 'Monochromatic Source' },
      { id: 'single-slit', text: 'Single Slit (Coherence)' },
      { id: 'double-slit', text: 'Double Slit (Interference)' },
      { id: 'screen', text: 'Observation Screen' },
      { id: 'fringes', text: 'Interference Fringes' }
    ],
    objectiveIndex: 1
  },

  misconceptions: {
    title: "Constructive vs Destructive",
    items: [
      {
        statement: "Constructive interference occurs when a crest meets a trough.",
        isFact: false,
        explanation: "Constructive interference occurs when crest meets crest (or trough meets trough), resulting in a bright band."
      },
      {
        statement: "Destructive interference results in dark bands on the screen.",
        isFact: true,
        explanation: "Correct! When waves arrive out of phase, they cancel each other out, creating darkness."
      },
      {
        statement: "White light from a standard bulb is coherent.",
        isFact: false,
        explanation: "Standard bulbs produce incoherent light because the waves are emitted at different times and phases."
      },
      {
        statement: "A single slit can convert incoherent monochromatic light to coherent light.",
        isFact: true,
        explanation: "Yes, diffraction through a narrow slit creates nearly cylindrical, synchronized wavefronts."
      }
    ],
    objectiveIndex: 2
  },

  spotDifference: {
    title: "Spot the Mistake",
    question: "One of these wave diagrams shows destructive interference incorrectly. Click on the incorrect one.",
    mistake: "Diagram B shows two waves in phase (crest to crest) but claims they are destructive.",
    correction: "Destructive interference requires waves to be 180 degrees out of phase (crest to trough) so they cancel out.",
    objectiveIndex: 2
  },

  waveLab: {
    objectiveIndex: 3,
    questions: [
      {
        id: 'q1',
        text: "What happens to the fringe separation (x) when you increase the wavelength (λ)?",
        options: ["Fringes get closer together", "Fringes spread further apart", "No change", "Fringes disappear"],
        correct: 1
      },
      {
        id: 'q2',
        text: "If you decrease the slit separation (d), how does the pattern change?",
        options: ["Fringes get closer", "Fringes spread out", "Pattern becomes brighter", "Pattern becomes dimmer"],
        correct: 1
      },
      {
        id: 'q3',
        text: "Moving the screen further away (increasing L) causes the fringes to:",
        options: ["Spread out", "Contract", "Stay the same", "Blur completely"],
        correct: 0
      }
    ]
  },

  conceptCheck: {
    title: "Concept Checking Question",
    prompt: "Explain why we use a single slit before the double slits when starting with a monochromatic incoherent light source.",
    objectiveIndex: 1
  },

  assessment: {
    easy: [
      { question: "Which light has waves of the same wavelength that are in phase?", options: ["Coherent", "Incoherent", "White Light", "Diffuse"], correct: 0 },
      { question: "How can monochromatic light be made coherent?", options: ["Pass through a filter", "Pass through a single narrow slit", "Reflect off a mirror", "Increase its intensity"], correct: 1 },
      { question: "The pattern of bright and dark bands is called...", options: ["Diffraction rings", "Interference fringes", "Refraction lines", "Shadows"], correct: 1 }
    ],
    medium: [
      { question: "In the equation λ = xd/L, what does 'd' represent?", options: ["Distance to screen", "Distance between slits", "Distance to first band", "Wavelength"], correct: 1 },
      { question: "What occurs at a bright fringe?", options: ["Constructive interference", "Destructive interference", "Total absorption", "Refraction"], correct: 0 },
      { question: "If the screen distance (L) increases, what happens to the fringe separation (x)?", options: ["Increases", "Decreases", "Stays the same", "Becomes zero"], correct: 0 }
    ],
    hard: [
      { question: "Violet light falls on two slits (d=1.9e-5m). A first-order band is 13.2mm away on a screen 0.6m away. What is λ?", options: ["418 nm", "550 nm", "632 nm", "700 nm"], correct: 0 },
      { question: "Orange light (λ=610nm) falls on slits (d=2.5e-5m). Screen is 0.5m away. Find x.", options: ["0.0122 m", "0.0244 m", "0.0061 m", "0.122 m"], correct: 0 },
      { question: "Which phenomenon explains the rainbow colors on a soap bubble?", options: ["Thin-film interference", "Polarization", "Photoelectric effect", "Compton scattering"], correct: 0 }
    ],
    objectiveIndex: 3
  },

  exitTicket: {
    questions: [
      "What is the main difference between coherent and incoherent light?",
      "How does changing the slit separation (d) affect the interference pattern?"
    ],
    objectiveIndex: 3
  }
};
