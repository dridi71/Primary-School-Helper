import React from 'react';

export interface Subject {
  id: 'arabic' | 'math' | 'science' | 'history' | 'art' | 'geography' | 'science_experiments' | 'health';
  name: string;
  icon: React.ReactNode;
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

export interface GeneratedContent {
  text: string;
  imageUrl: string | null;
}

export type ProgressRecord = {
  [subjectId in Subject['id']]?: {
    [difficulty in Difficulty]?: {
      [contentType in ContentType]?: boolean;
    };
  };
};