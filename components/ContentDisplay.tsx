import React, { useState } from 'react';
import { GeneratedContent, Subject } from '../types';
import PrintIcon from './icons/PrintIcon';
import SaveIcon from './icons/SaveIcon';

// Declare html2pdf to use it from the global scope (CDN script)
declare const html2pdf: any;

interface ContentDisplayProps {
  content: GeneratedContent;
  subject: Subject | null;
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({ content, subject }) => {
  const { text, imageUrl } = content;
  const [answers, setAnswers] = useState<Record<number, { selected: number; isCorrect: boolean }>>({});

  const handleSave = () => {
    const element = document.getElementById('printable-content');
    if (!element) return;

    const filename = `${subject?.id || 'lesson'}-${new Date().toISOString().slice(0, 10)}.pdf`;

    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    html2pdf().from(element).set(opt).save();
  };

  const handleOptionSelect = (questionIndex: number, optionIndex: number, isCorrect: boolean) => {
    if (answers[questionIndex]) return; // Prevent changing answer
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: { selected: optionIndex, isCorrect }
    }));
  };

  const renderContentBlocks = (text: string) => {
    if (!text) return null;
    const blocks = text.split(/\n\s*\n/).filter(block => block.trim() !== '');

    return blocks.map((block, index) => {
      const lines = block.trim().split('\n');
      const questionRegex = /\*\*(.*?)\*\*/;
      const match = lines[0].match(questionRegex);

      if (match) { // It's a question block
        const question = match[1];
        const rawOptions = lines.slice(1);
        const correctAnswerIndex = rawOptions.findIndex(opt => opt.includes('[correct]'));
        const options = rawOptions.map(opt => opt.replace('[correct]', '').replace(/^\s*-\s*/, '').trim());
        const questionState = answers[index];

        return (
          <div key={`quiz-${index}`} className="not-prose my-6 p-4 bg-teal-50 border-r-4 border-teal-500 rounded-lg shadow-sm">
            <p className="font-bold text-lg text-teal-800 mb-4">{question}</p>
            <div className="flex flex-col gap-3">
              {options.map((option, optIndex) => {
                let buttonClass = "w-full text-right p-3 bg-white rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 text-base font-semibold text-gray-700";

                if (questionState) {
                  const isSelected = questionState.selected === optIndex;
                  const isCorrect = correctAnswerIndex === optIndex;

                  if (isCorrect) {
                     buttonClass += ' bg-green-100 border-green-400 text-green-800';
                  } else if (isSelected && !isCorrect) {
                     buttonClass += ' bg-red-100 border-red-400 text-red-800';
                  } else {
                     buttonClass += ' opacity-70 cursor-not-allowed';
                  }
                } else {
                   buttonClass += ' hover:bg-teal-100 hover:border-teal-400 cursor-pointer';
                }

                return (
                  <button
                    key={optIndex}
                    disabled={!!questionState}
                    onClick={() => handleOptionSelect(index, optIndex, correctAnswerIndex === optIndex)}
                    className={buttonClass}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        );
      } else {
        // It's a regular text block
        return (
          <div key={`text-${index}`} className="mb-4 whitespace-pre-wrap">
            {block}
          </div>
        );
      }
    });
  };

  return (
    <div>
       <div className="no-print flex items-center gap-4 mb-4">
        <button
          onClick={() => window.print()}
          aria-label="طباعة المحتوى"
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          <PrintIcon className="w-5 h-5" />
          <span>طباعة</span>
        </button>
        <button
          onClick={handleSave}
          aria-label="حفظ المحتوى كملف PDF"
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          <SaveIcon className="w-5 h-5" />
          <span>حفظ PDF</span>
        </button>
      </div>
      <div id="printable-content" className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border-t-4 border-teal-500">
        {imageUrl && (
          <div className="mb-8 overflow-hidden rounded-xl shadow-lg">
            <img
              src={imageUrl}
              alt="توضيح للدرس"
              className="w-full h-auto object-cover"
            />
          </div>
        )}
        <div className="prose prose-lg max-w-none text-right leading-loose">
          {renderContentBlocks(text)}
        </div>
      </div>
    </div>
  );
};

export default ContentDisplay;
