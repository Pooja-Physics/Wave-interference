export type LessonScores = {
  wordScramble: number;
  dragDrop: number;
  misconception: number;
  spotDifference: number;
  waveLab: number;
  conceptCheck: number;
  assessment: number;
  exitTicket: number;
};

export type TrafficLightValue = 'red' | 'amber' | 'green';

export interface SelfAssessmentData {
  objectives: {
    objective: string;
    status: TrafficLightValue;
  }[];
  teacherFeedback: string;
}

export interface LessonConfig {
  title: string;
  subtitle: string;
  schoolName: string;
  schoolVision: string;
  teacherName: string;
  logoUrl: string;
  learningObjectives: string[];
  starter: {
    title: string;
    description: string;
    questions: string[];
    objectiveIndex?: number;
  };
  wordScramble: {
    words: { word: string; hint: string }[];
    objectiveIndex?: number;
  };
  dragDrop: {
    imageUrl: string;
    labels: { id: string; text: string }[];
    objectiveIndex?: number;
  };
  misconceptions: {
    title: string;
    items: { statement: string; isFact: boolean; explanation: string }[];
    objectiveIndex?: number;
  };
  spotDifference: {
    title: string;
    question: string;
    mistake: string;
    correction: string;
    objectiveIndex?: number;
  };
  waveLab?: {
    objectiveIndex?: number;
    questions: {
      id: string;
      text: string;
      options: string[];
      correct: number;
    }[];
  };
  conceptCheck: {
    title: string;
    prompt: string;
    objectiveIndex?: number;
  };
  assessment: {
    easy: { question: string; options: string[]; correct: number }[];
    medium: { question: string; options: string[]; correct: number }[];
    hard: { question: string; options: string[]; correct: number }[];
    objectiveIndex?: number;
  };
  exitTicket: {
    questions: string[];
    objectiveIndex?: number;
  };
}
