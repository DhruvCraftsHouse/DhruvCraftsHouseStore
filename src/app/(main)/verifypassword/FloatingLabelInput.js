
import { useState } from 'react';

const FloatingLabelInput = ({ label, type = 'text', register, autoComplete, errors }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`floating-label-input ${isFocused ? 'focused' : ''}`}>
      <input
        type={type}
        {...register}  // Use the register function directly
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoComplete={autoComplete}
      />
      <label>{label}</label>
      {errors && <p className="error">{errors.message}</p>}

      <style jsx>{`
        .floating-label-input {
          position: relative;
          margin-bottom: 20px;
        }

        input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          outline: none;
        }

        label {
          position: absolute;
          top: ${isFocused ? '-10px' : '10px'};
          left: 10px;
          font-size: ${isFocused ? '12px' : '16px'};
          color: ${isFocused ? 'blue' : 'black'};
          transition: 0.3s ease-in-out;
          pointer-events: none;
          background-color: white;
        }

        .error {
          color: red;
          margin-top: 5px;
        }
        `}</style>
        </div>
      );
    };
    
    export default FloatingLabelInput;