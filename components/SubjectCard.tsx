import React from 'react';
import { Subject } from '../types';
import CheckIcon from './icons/CheckIcon';

interface SubjectCardProps {
  subject: Subject;
  onSelect: (subject: Subject) => void;
  isCompleted?: boolean;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, onSelect, isCompleted }) => {
  const isEmoji = typeof subject.icon === 'string';

  return (
    <div
      className="relative w-72 h-80 bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 flex flex-col items-center justify-start text-center cursor-pointer transform hover:-translate-y-2 transition-all duration-300"
      onClick={() => onSelect(subject)}
      style={{ borderBottom: `8px solid ${subject.color}` }}
    >
      {isCompleted && (
        <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full p-1 shadow-md">
          <CheckIcon className="w-4 h-4" />
        </div>
      )}
      <div
        className={`mb-4 flex items-center justify-center w-16 h-16 ${isEmoji ? 'text-6xl' : ''}`}
        style={{ color: subject.color }}
      >
        {subject.icon}
      </div>
      <h3 className="text-2xl font-bold mb-2" style={{ color: subject.color }}>
        {subject.name}
      </h3>
      <p className="text-gray-600 flex-grow mt-2">{subject.description}</p>
    </div>
  );
};

export default SubjectCard;