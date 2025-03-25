import React from 'react';

import { useAppSelector } from '../../../../../src/stores/store';
interface PromptCardProps {
  handleSelection: (selection: string) => void;
  isStorySelection?: boolean;
  prompt: string;
  promptText?: string;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  handleSelection,
  isStorySelection,
  prompt,
  promptText,
}) => {
  const { promptSelections } = useAppSelector((state) => state.storySubmission);

  const isSelected =
    promptSelections.find((selection) => selection === prompt) !== undefined;

  return (
    <div
      className='col-6 d-flex flex-wrap justify-content-between'
      onClick={
        isStorySelection
          ? () => handleSelection('')
          : () => handleSelection(prompt)
      }
    >
      <div className='w-100 me-3'>
        <div className={`card p-2 mt-4 ${isSelected && 'card-selected'}`}>
          <div className='card-body'>
            <h5 className='card-title'>{prompt}</h5>
            <p className='card-text'>
              {promptText ||
                `Lorem ipsum dolor sit amet, consectetur adipiscing elit 
              Nullam nec purus et nunc fermentum aliquam. Nam nec turpis nec
              eros tincidunt ultricies.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptCard;
