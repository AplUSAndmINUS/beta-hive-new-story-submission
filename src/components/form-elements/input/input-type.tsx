import React from 'react';

interface InputTypeProps {
  calendarDate?: string;
  isDisabled: boolean;
  isImageUpload?: boolean;
  isCalendar?: boolean;
  isPrompts?: boolean;
  imgName?: string;
  name: string;
  flex?: string;
  value?: any;
  label: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isRequired?: boolean;
  min?: string;
  max?: string;
  pattern?: string;
  placeholder?: string;
  valueDesc?: string;
  type?: string;
}

export const InputType: React.FC<InputTypeProps> = ({
  calendarDate,
  isDisabled = false,
  isImageUpload = false,
  isCalendar = false,
  isPrompts = false,
  imgName,
  name,
  flex,
  value,
  isRequired = false,
  label,
  onChange,
  min,
  max,
  pattern,
  placeholder,
  valueDesc,
  type,
}) => {
  return (
    <div
      className={`col-6 d-flex flex-wrap ${flex === 'start' && 'ps-0'} ${
        type === 'number' ? 'justify-content-start' : 'justify-content-between'
      }`}
    >
      <div className={type === 'number' ? 'w-75' : 'w-100'}>
        <div className='card mt-4 me-3'>
          <div className='card-body'>
            <h5 className='card-title'>
              <label
                htmlFor={name}
                className='d-flex flex-column align-items-start'
              >
                <span>
                  {label}
                  {isRequired && <span className='text-danger'> *</span>}
                </span>
                <input
                  className='form-control mt-3'
                  disabled={isDisabled}
                  value={value || ''}
                  onChange={onChange}
                  type={type}
                  min={min}
                  max={max}
                  pattern={pattern}
                  placeholder={placeholder}
                  required={isRequired}
                  name={name}
                  id={name}
                  style={{
                    marginRight: '1rem',
                    height: '2rem',
                  }}
                />
              </label>
            </h5>
            {isCalendar && (
              <label
                htmlFor={`${name}1`}
                className='d-flex flex-column align-items-start'
              >
                <span>Date</span>
                <input
                  className='form-control mt-3'
                  disabled={isDisabled}
                  value={calendarDate}
                  onChange={onChange}
                  type='date'
                  required={isRequired}
                  name={`${name}1`}
                  id={`${name}1`}
                  style={{
                    marginRight: '1rem',
                  }}
                />
              </label>
            )}
            {(isPrompts || isCalendar) && (
              <label
                htmlFor={`${name}2`}
                className='d-flex flex-column align-items-start'
              >
                <span>Description</span>
                <input
                  className='form-control mt-3'
                  disabled={isDisabled}
                  value={valueDesc || ''}
                  onChange={onChange}
                  required={false}
                  name={`${name}2`}
                  id={`${name}2`}
                  style={{
                    marginRight: '1rem',
                  }}
                />
              </label>
            )}
            {isImageUpload && (
              <div className='d-flex justify-content-start align-items-center input-group mb-3'>
                <button className='btn btn-primary' type='button'>
                  Upload Image
                </button>
                <p className='text-muted ps-4 pt-2'>Image name: {imgName}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputType;
