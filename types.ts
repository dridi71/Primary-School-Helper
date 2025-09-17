export interface Subject {
  id: 'arabic' | 'math' | 'science' | 'history' | 'art' | 'geography';
  name: string;
  icon: string;
  color: string;
  description: string;
}

export enum ContentType {
  Lesson = 'lesson',
  Exercise = 'exercise',
}

export enum Difficulty {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
}

export enum View {
    Subjects = 'subjects',
    Difficulty = 'difficulty',
    Options = 'options',
    Content = 'content',
}