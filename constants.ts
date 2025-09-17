import React from 'react';
import { Subject } from './types';
import ArtIcon from './components/icons/ArtIcon';
import HistoryIcon from './components/icons/HistoryIcon';
import GeographyIcon from './components/icons/GeographyIcon';

export const SUBJECTS: Subject[] = [
  {
    id: 'arabic',
    name: 'اللغة العربية',
    icon: '📖',
    color: '#ef4444',
    description: 'تعلم قواعد اللغة، القراءة، والكتابة بطرق ممتعة.',
  },
  {
    id: 'math',
    name: 'الرياضيات',
    icon: '🔢',
    color: '#3b82f6',
    description: 'استكشف عالم الأرقام، الجمع، والطرح، وحل الألغاز.',
  },
  {
    id: 'science',
    name: 'العلوم',
    icon: '🔬',
    color: '#22c55e',
    description: 'اكتشف أسرار الطبيعة، الكائنات الحية، والكون من حولنا.',
  },
  {
    id: 'history',
    name: 'التاريخ',
    // FIX: Replaced JSX with React.createElement to support .ts files that are not configured to parse JSX.
    icon: React.createElement(HistoryIcon, { className: "w-16 h-16" }),
    color: '#f59e0b',
    description: 'نسافر عبر الزمن لنتعرف على قصص الأبطال والأحداث المهمة.',
  },
  {
    id: 'art',
    name: 'التربية الفنية',
    // FIX: Replaced JSX with React.createElement to support .ts files that are not configured to parse JSX.
    icon: React.createElement(ArtIcon, { className: "w-16 h-16" }),
    color: '#8b5cf6',
    description: 'نطلق العنان لإبداعنا بالرسم، التلوين، وتشكيل الأعمال الفنية.',
  },
  {
    id: 'geography',
    name: 'الجغرافيا',
    // FIX: Replaced JSX with React.createElement to support .ts files that are not configured to parse JSX.
    icon: React.createElement(GeographyIcon, { className: "w-16 h-16" }),
    color: '#f97316',
    description: 'نكتشف قارات العالم، بلدانها، وجبالها وأنهارها في رحلة حول الكوكب.',
  },
  {
    id: 'science_experiments',
    name: 'تجارب علمية',
    icon: '🧪',
    color: '#14b8a6',
    description: 'نطبق العلوم بأنفسنا عبر تجارب بسيطة ومدهشة يمكن القيام بها في المنزل.',
  },
  {
    id: 'health',
    name: 'التربية الصحية',
    icon: '❤️',
    color: '#ec4899',
    description: 'نتعلم كيف نحافظ على صحتنا ونظافتنا الشخصية من خلال عادات يومية سليمة.',
  },
];