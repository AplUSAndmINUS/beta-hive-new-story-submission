import React from 'react';

import { useAppSelector } from 'src/stores/store';

interface InputSelectionCardProps {
  handleSelection: (selection: string, isChecked?: boolean) => void;
  isDisabled: boolean;
  label: string;
  name: string;
  inputType: 'checkbox' | 'radio';
}

export const InputSelectionCard: React.FC<InputSelectionCardProps> = ({
  handleSelection,
  isDisabled,
  name,
  label,
  inputType,
}) => {
  const selectedValue = useAppSelector(
    (state) => state.storySubmission.contentWarning
  );
  const contentSensitivities: { name: string }[] = useAppSelector((state) =>
    state.storySubmission.contentSensitivities.map((name: string) => ({ name }))
  );
  const isInitiallyChecked = React.useMemo(() => {
    return inputType === 'radio'
      ? selectedValue === label
      : contentSensitivities.some(
          (item: { name: string }) => item.name === label
        );
  }, [inputType, selectedValue, contentSensitivities, label]);
  const [isChecked, setIsChecked] = React.useState<boolean>(isInitiallyChecked);

  React.useEffect(() => {
    if (inputType === 'radio') {
      setIsChecked(selectedValue === label);
    } else {
      setIsChecked(
        contentSensitivities.some(
          (item: { name: string }) => item.name === label
        )
      );
    }
  }, [selectedValue, contentSensitivities, label, inputType]);

  const handleCardClick = () => {
    if (inputType === 'radio') {
      handleSelection(label);
    } else if (inputType === 'checkbox') {
      const isChecked = contentSensitivities.some(
        (item: { name: string }) => item.name === label
      );
      handleSelection(label, !isChecked);
    }
  };

  return (
    <div
      className={`col-6 d-flex flex-wrap justify-content-between ${
        !isDisabled && 'cursor-pointer'
      }`}
      onClick={handleCardClick}
    >
      <div className='w-100'>
        <div className={`card p-2 mt-4 ${isChecked ? 'card-selected' : ''}`}>
          <div className='card-body'>
            <h5 className='card-title'>
              <label
                className='d-flex align-items-center'
                style={{
                  cursor: !isDisabled ? 'pointer' : 'auto',
                  textTransform: 'none',
                }}
                onClick={($e) => $e.stopPropagation()}
              >
                <input
                  disabled={isDisabled}
                  name={name}
                  type={inputType}
                  checked={isChecked}
                  onChange={() => handleCardClick()}
                  onClick={($e) => $e.stopPropagation()}
                  style={{
                    marginRight: '1rem',
                    width: '1.5rem',
                    height: '1.5rem',
                  }}
                />
                <span style={{ textTransform: 'none' }}>{label}</span>
              </label>
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputSelectionCard;
