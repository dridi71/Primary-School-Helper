import React, { useState } from 'react';
import { Subject, View, Difficulty, ContentType, GeneratedContent } from './types';
import { SUBJECTS } from './constants';
import { generateContent } from './services/geminiService';
import SubjectCard from './components/SubjectCard';
import ContentDisplay from './components/ContentDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import BackArrowIcon from './components/icons/BackArrowIcon';
import BookIcon from './components/icons/BookIcon';
import PencilIcon from './components/icons/PencilIcon';
import LogoIcon from './components/icons/LogoIcon';

const difficultyLabels: { [key in Difficulty]: string } = {
  [Difficulty.Easy]: 'سهل 🐣',
  [Difficulty.Medium]: 'متوسط 🦊',
  [Difficulty.Hard]: 'صعب 🦉',
};

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.Subjects);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [selectedContentType, setSelectedContentType] = useState<ContentType | null>(null);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubjectSelect = (subject: Subject) => {
    setSelectedSubject(subject);
    setView(View.Difficulty);
  };

  const handleDifficultySelect = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    setView(View.Options);
  };

  const handleContentTypeSelect = async (contentType: ContentType) => {
    setSelectedContentType(contentType);
    setView(View.Content);
    setIsLoading(true);
    setError(null);
    setContent(null);

    if (selectedSubject && selectedDifficulty) {
      try {
        const generated = await generateContent(selectedSubject.id, contentType, selectedDifficulty);
        setContent(generated);
      } catch (err) {
        setError('حدث خطأ أثناء إعداد المحتوى. الرجاء المحاولة مرة أخرى.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    setError(null);
    if (view === View.Content) {
      setView(View.Subjects);
      setSelectedSubject(null);
      setSelectedDifficulty(null);
      setSelectedContentType(null);
      setContent(null);
    } else if (view === View.Options) {
      setView(View.Difficulty);
    } else if (view === View.Difficulty) {
      setView(View.Subjects);
      setSelectedSubject(null);
    }
  };

  const renderContent = () => {
    switch (view) {
      case View.Subjects:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {SUBJECTS.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} onSelect={handleSubjectSelect} />
            ))}
          </div>
        );
      case View.Difficulty:
        if (!selectedSubject) return null;
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold" style={{ color: selectedSubject.color }}>
                اختر مستوى الصعوبة
              </h2>
              <button onClick={handleBack} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <BackArrowIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {Object.values(Difficulty).map((level) => (
                <button
                  key={level}
                  onClick={() => handleDifficultySelect(level)}
                  className="w-full text-right p-4 bg-gray-50 rounded-lg border-2 border-transparent hover:border-teal-400 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 text-lg font-semibold"
                >
                  {difficultyLabels[level]}
                </button>
              ))}
            </div>
          </div>
        );
      case View.Options:
        if (!selectedSubject) return null;
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold" style={{ color: selectedSubject.color }}>
                ماذا تريد أن تفعل؟
              </h2>
              <button onClick={handleBack} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <BackArrowIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => handleContentTypeSelect(ContentType.Lesson)}
                className="flex flex-col items-center justify-center gap-4 p-8 bg-blue-50 text-blue-700 rounded-xl border-2 border-transparent hover:border-blue-400 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              >
                <BookIcon className="w-16 h-16" />
                <span className="text-2xl font-bold">درس جديد</span>
              </button>
              <button
                onClick={() => handleContentTypeSelect(ContentType.Exercise)}
                className="flex flex-col items-center justify-center gap-4 p-8 bg-green-50 text-green-700 rounded-xl border-2 border-transparent hover:border-green-400 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
              >
                <PencilIcon className="w-16 h-16" />
                <span className="text-2xl font-bold">تمرين</span>
              </button>
            </div>
          </div>
        );
      case View.Content:
        return (
          <div className="w-full">
            <div className="mb-6 no-print">
              <button onClick={handleBack} className="flex items-center gap-2 text-gray-600 hover:text-teal-600 font-semibold transition-colors">
                <BackArrowIcon className="w-5 h-5" />
                <span>ابدأ من جديد</span>
              </button>
            </div>
            {isLoading && <LoadingSpinner />}
            {error && <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>}
            {!isLoading && !error && content && <ContentDisplay content={content} subject={selectedSubject} contentType={selectedContentType} />}
          </div>
        );
      default:
        return <div>Invalid view</div>;
    }
  };

  return (
    <div dir="rtl" className="bg-gray-50 min-h-screen font-sans text-gray-800 p-4 sm:p-8 flex flex-col items-center">
      <header className="w-full max-w-4xl mb-8 text-center no-print">
        <LogoIcon className="w-24 h-24 mx-auto text-teal-500 mb-2" />
        <h1 className="text-4xl sm:text-5xl font-bold text-teal-600">مغامراتي التعليمية</h1>
        <p className="text-lg text-gray-500 mt-2">استكشف، تعلم، والعب في عالم المعرفة!</p>
      </header>
      <main className="w-full max-w-4xl flex justify-center flex-grow">
        {renderContent()}
      </main>
      <footer className="w-full text-center py-4 mt-8 no-print">
        <p className="text-sm text-gray-500">
          Création de Mohamed Dridi © 2024. Conçu avec ❤️ pour l'éducation.
        </p>
      </footer>
    </div>
  );
};

export default App;