import React from 'react';

import { useAppSelector } from 'src/stores/store';

interface InputSelectionCardProps {
  handleSelection: (selection: string, isChecked?: boolean) => void;
  isBetaHIVE?: boolean;
  imgSource?: string;
  description?: string;
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
  isBetaHIVE = false,
  imgSource,
  description,
}) => {
  const contentWarnings: { name: string }[] = useAppSelector((state) =>
    state.storySubmission.system.contentWarnings.map((name: string) => ({
      name,
    }))
  );
  const HIVE = useAppSelector((state) => state.storySubmission.system.HIVE);
  const isContentSensitive = useAppSelector(
    (state) => state.storySubmission.isContentSensitive
  );

  const isChecked = React.useMemo(() => {
    if (isBetaHIVE) {
      return HIVE === label;
    }
    return inputType === 'radio'
      ? isContentSensitive === (label === 'Yes')
      : contentWarnings.some((item: { name: string }) => item.name === label);
  }, [HIVE, contentWarnings, isContentSensitive, inputType, isBetaHIVE, label]);

  const handleCardClick = () => {
    if (inputType === 'radio') {
      handleSelection(label);
    } else if (inputType === 'checkbox') {
      const isChecked = contentWarnings.some(
        (item: { name: string }) => item.name === label
      );
      handleSelection(label, !isChecked);
    }
  };

  return (
    <div
      className={`${isBetaHIVE ? 'col-12' : 'col-6'} d-flex flex-wrap justify-content-between ${
        !isDisabled && 'cursor-pointer'
      }`}
      onClick={handleCardClick}
    >
      <div className={`${isBetaHIVE ? 'w-75' : 'w-100'}`}>
        <div className={`card p-2 mt-4 ${isChecked ? 'card-selected' : ''}`}>
          <div className='card-body'>
            <h5 className='card-title' style={{ textTransform: 'none' }}>
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
                {isBetaHIVE ? (
                  <>
                    <img
                      src={imgSource}
                      alt={label}
                      style={{ height: '10rem', width: '10rem' }}
                      className={`me-4 ${isChecked ? 'img-selected' : ''}`}
                    />
                    <div className='d-flex flex-column'>
                      <h3>{label}</h3>
                      <span className='text-muted'>{description}</span>
                    </div>
                  </>
                ) : (
                  <span style={{ textTransform: 'none' }}>{label}</span>
                )}
              </label>
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputSelectionCard;
