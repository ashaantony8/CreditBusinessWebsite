import React, { useState } from 'react';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';

import { questions } from '../../utils/data';

const FAQSection: React.FC = () => {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const toggleQuestion = (questionIndex: number) => {
    setOpenQuestion(openQuestion === questionIndex ? null : questionIndex);
  };

  return (
    <section className="bg-[#EDF3FF]">
      <>
        <div className="container mx-auto space-y-4 bg-[#EDF3FF] p-6 py-12 lg:px-12">
          {questions.map((question, index) => (
            <div
              key={index}
              className="cursor-pointer border border-gray-200 bg-white shadow-lg transition-all duration-200 hover:bg-gray-50"
              onClick={() => toggleQuestion(index)}
            >
              <button
                type="button"
                className="flex w-full items-center justify-between px-4 py-5 sm:p-6"
              >
                <span className="flex text-lg font-semibold text-black">
                  {question.title}
                </span>

                {openQuestion === index ? (
                  <IoIosArrowDown />
                ) : (
                  <IoIosArrowForward />
                )}
              </button>
              <div
                className={`px-4 pb-5 transition-all duration-200 sm:px-6 sm:pb-6 ${
                  openQuestion === index ? 'block' : 'hidden'
                }`}
              >
                <p>{question.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </>
    </section>
  );
};

export default FAQSection;
