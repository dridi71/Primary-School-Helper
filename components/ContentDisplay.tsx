import React, { useState, useEffect, useRef } from 'react';
import { GeneratedContent, Subject, ContentType } from '../types';
import { playSound } from '../utils/audio';
import PrintIcon from './icons/PrintIcon';
import SaveIcon from './icons/SaveIcon';
import SpeakerOnIcon from './icons/SpeakerOnIcon';
import SpeakerOffIcon from './icons/SpeakerOffIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import XCircleIcon from './icons/XCircleIcon';

// Declare html2pdf to use it from the global scope (CDN script)
declare const html2pdf: any;

interface ContentDisplayProps {
  content: GeneratedContent;
  subject: Subject | null;
  contentType: ContentType | null;
  onRetry: () => void;
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({ content, subject, contentType, onRetry }) => {
  const { text, imageUrl } = content;
  const [answers, setAnswers] = useState<Record<number, { selected: number; isCorrect: boolean }>>({});
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [quizCompleteSoundPlayed, setQuizCompleteSoundPlayed] = useState(false);

  // Parse content to find total questions and reset state when new content arrives
  useEffect(() => {
    if (contentType === ContentType.Exercise && text) {
      const blocks = text.split(/\n\s*\n/).filter(block => block.trim() !== '');
      const questionCount = blocks.filter(block => block.match(/\*\*(.*?)\*\*/)).length;
      setTotalQuestions(questionCount);
    } else {
      setTotalQuestions(0);
    }
    // Reset answers and sound state for new content
    setAnswers({});
    setQuizCompleteSoundPlayed(false);
    
    // Cleanup speech on component unmount or content change
    return () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [text, contentType]);
  

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
  
  const handleToggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (utteranceRef.current) {
        utteranceRef.current.onend = null;
    }
    
    const cleanText = text.replace(/\*\*(.*?)\*\*/g, '$1');
    const newUtterance = new SpeechSynthesisUtterance(cleanText);
    newUtterance.lang = 'ar-SA';
    newUtterance.rate = 0.9;
    newUtterance.pitch = 1.1;
    newUtterance.onend = () => setIsSpeaking(false);
    newUtterance.onerror = (event) => {
        console.error('SpeechSynthesisUtterance.onerror', event);
        setIsSpeaking(false);
    }
    
    utteranceRef.current = newUtterance;
    window.speechSynthesis.speak(newUtterance);
    setIsSpeaking(true);
  };

  const handleOptionSelect = (questionIndex: number, optionIndex: number, isCorrect: boolean) => {
    if (answers[questionIndex]) return;

    // Play sound for correct or incorrect answer
    playSound(isCorrect ? 'correct' : 'incorrect');

    setAnswers(prev => ({
      ...prev,
      [questionIndex]: { selected: optionIndex, isCorrect }
    }));
  };

  const answeredQuestionsCount = Object.keys(answers).length;
  const isQuizComplete = totalQuestions > 0 && answeredQuestionsCount === totalQuestions;
  const score = Object.values(answers).filter(a => a.isCorrect).length;
  
  // Effect to play completion sound once
  useEffect(() => {
    if (isQuizComplete && !quizCompleteSoundPlayed) {
      playSound('complete');
      setQuizCompleteSoundPlayed(true);
    }
  }, [isQuizComplete, quizCompleteSoundPlayed]);

  const renderContentBlocks = (text: string) => {
    if (!text) return null;
    const blocks = text.split(/\n\s*\n/).filter(block => block.trim() !== '');
    let questionCounter = -1;

    return blocks.map((block, index) => {
      const lines = block.trim().split('\n');
      const questionRegex = /\*\*(.*?)\*\*/;
      const match = lines[0].match(questionRegex);

      if (match && contentType === ContentType.Exercise) {
        questionCounter++;
        const currentQuestionIndex = questionCounter;
        const question = match[1];
        const rawOptions = lines.slice(1);
        const correctAnswerIndex = rawOptions.findIndex(opt => opt.includes('[correct]'));
        const options = rawOptions.map(opt => opt.replace('[correct]', '').replace(/^\s*-\s*/, '').trim());
        const questionState = answers[currentQuestionIndex];

        return (
          <div key={`quiz-${index}`} className="not-prose my-6 p-4 bg-teal-50 border-r-4 border-teal-500 rounded-lg shadow-sm">
            <p className="font-bold text-lg text-teal-800 mb-4">{question}</p>
            <div className="flex flex-col gap-3">
              {options.map((option, optIndex) => {
                let buttonClass = "w-full text-right p-3 bg-white rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 text-base font-semibold text-gray-700 flex items-center justify-between";
                let feedbackIcon = null;

                if (questionState) {
                  const isSelected = questionState.selected === optIndex;
                  const isCorrectOption = correctAnswerIndex === optIndex;

                  if (isCorrectOption) {
                     buttonClass += ' bg-green-100 border-green-400 text-green-800';
                     feedbackIcon = <CheckCircleIcon className="w-6 h-6 text-green-600" />;
                  } else if (isSelected && !isCorrectOption) {
                     buttonClass += ' bg-red-100 border-red-400 text-red-800';
                     feedbackIcon = <XCircleIcon className="w-6 h-6 text-red-600" />;
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
                    onClick={() => handleOptionSelect(currentQuestionIndex, optIndex, correctAnswerIndex === optIndex)}
                    className={buttonClass}
                  >
                    <span className="flex-grow">{option}</span>
                    {feedbackIcon}
                  </button>
                );
              })}
            </div>
          </div>
        );
      } else {
        return (
          <div key={`text-${index}`} className="mb-4 whitespace-pre-wrap">
            {block.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-teal-700">$1</strong>')}
          </div>
        );
      }
    });
  };
  
  const renderFormattedText = (text: string) => {
      if (!text) return null;
       const blocks = text.split(/\n\s*\n/).filter(block => block.trim() !== '');
       return blocks.map((block, index) => (
           <p key={index} className="mb-4" dangerouslySetInnerHTML={{ __html: block.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-teal-700">$1</strong>') }} />
       ));
  };

  return (
    <div>
       <div className="no-print flex items-center gap-4 mb-4">
        {contentType === ContentType.Lesson && (
          <button
            onClick={handleToggleSpeech}
            aria-label={isSpeaking ? "إيقاف السرد" : "تشغيل السرد الصوتي"}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            {isSpeaking ? <SpeakerOffIcon className="w-5 h-5" /> : <SpeakerOnIcon className="w-5 h-5" />}
            <span>{isSpeaking ? "إيقاف" : "استمع"}</span>
          </button>
        )}
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
          {contentType === ContentType.Exercise ? renderContentBlocks(text) : renderFormattedText(text)}
        </div>
      </div>

      {isQuizComplete && (
        <div className="no-print mt-8 p-6 bg-yellow-100 border-t-4 border-yellow-400 rounded-lg text-center shadow-lg animate-fade-in-up">
          <h3 className="text-2xl font-bold text-yellow-800">أحسنت! لقد أكملت التمرين.</h3>
          <p className="text-xl text-yellow-700 mt-2">
            نتيجتك هي: <span className="font-extrabold text-2xl">{score}</span> من <span className="font-extrabold text-2xl">{totalQuestions}</span>
          </p>
          <button
            onClick={onRetry}
            className="mt-6 px-8 py-3 bg-teal-500 text-white font-bold rounded-lg hover:bg-teal-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            جرب تمرينا جديدا
          </button>
        </div>
      )}
    </div>
  );
};

export default ContentDisplay;