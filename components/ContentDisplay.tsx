import React from 'react';

interface ContentDisplayProps {
  content: string;
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({ content }) => {

  const renderContentBlocks = (text: string) => {
    if (!text) return null;

    // Split content into blocks based on one or more empty lines
    const blocks = text.split(/\n\s*\n/).filter(block => block.trim() !== '');

    return blocks.map((block, index) => {
      const lines = block.trim().split('\n');
      const questionRegex = /\*\*(.*?)\*\*/; // Matches text between **...**
      const optionRegex = /^\s*-\s*\((.+?)\)/; // Matches lines like "- (أ)"

      const firstLineIsQuestion = questionRegex.test(lines[0]);
      const hasOptions = lines.slice(1).some(line => optionRegex.test(line));

      // Check if the block is a quiz/question block
      if (firstLineIsQuestion && hasOptions) {
        const question = lines[0];
        const options = lines.slice(1);

        return (
          <div key={`quiz-${index}`} className="not-prose my-6 p-4 bg-teal-50 border-r-4 border-teal-500 rounded-lg shadow-sm">
            <p className="font-bold text-lg text-teal-800 mb-4">{question}</p>
            <div className="flex flex-col gap-3">
              {options.map((option, optIndex) => (
                <button
                  key={optIndex}
                  className="w-full text-right p-3 bg-white rounded-lg border-2 border-gray-200 hover:bg-teal-100 hover:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 text-base font-semibold text-gray-700"
                >
                  {option.replace(/^\s*-\s*/, '').trim()}
                </button>
              ))}
            </div>
          </div>
        );
      } else {
        // It's a regular text block, render with paragraphs
        return (
          <div key={`text-${index}`} className="mb-4 whitespace-pre-wrap">
            {block}
          </div>
        );
      }
    });
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border-t-4 border-teal-500">
      <div className="prose prose-lg max-w-none text-right leading-loose">
        {renderContentBlocks(content)}
      </div>
    </div>
  );
};

export default ContentDisplay;
