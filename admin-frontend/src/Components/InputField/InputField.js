import React from 'react';
import TextField from '@mui/material/TextField';

// CustomTextField component
const InputField = ({
  type = 'text',
  id,
  name,
  value,
  required = false,
  onChange,
  style,
  onInput,
  maxLength,
  label,
  readOnly,
  ...props
}) => {
  return (
    <TextField
      type={type}
      id={id}
      name={name}
      value={value}
      required={required}
      onChange={onChange}
      readOnly={readOnly}
      onInput={onInput}
      inputProps={{ maxLength, readOnly }} // maxLength attribute
      label={label}
      sx={{
        width: '100%', // Ensure it takes full width of its container
        '& .MuiOutlinedInput-root': {
          height: '3rem',
          backgroundColor: 'white',
          boxSizing: 'border-box',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Added default shadow color
          '& fieldset': {
            borderColor: 'black',
            transition: 'border-color 0.3s ease',
          },
          '&:hover fieldset': {
            borderColor: 'blue',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'blue',
          },
          '& input': {
            color: 'black',
            height: '100%',
            padding: '0.5rem',
            boxSizing: 'border-box',
          },
          '& .MuiInputAdornment-root': {
            cursor: 'pointer',
            '& svg': {
              color: 'black',
              transition: 'color 0.3s ease',
              '&:hover': {
                color: 'blue',
              },
            },
          },
        },
        '& .MuiFormLabel-root': {
          color: 'black',
          fontWeight: 'bold',
        },
        ...style, // Apply additional styles
      }}
      {...props}
    />
  );
};

export default InputField;
