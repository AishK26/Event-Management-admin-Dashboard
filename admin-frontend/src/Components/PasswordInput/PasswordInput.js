import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const PasswordField = ({
  id,
  name,
  placeholder,
  value,
  required = false,
  onChange,
  style,
  onInput,
  maxLength,
  label,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <TextField
      type={showPassword ? 'text' : 'password'} // Toggle input type
      id={id}
      name={name}
      value={value}
      required={required}
      onChange={onChange}
      onInput={onInput}
      inputProps={{ maxLength }} // maxLength attribute
      label={label}
      sx={{
        width: '100%', // Ensure it takes full width of its container
        '& .MuiOutlinedInput-root': {
          height: '3rem',
          backgroundColor: 'white',
          boxSizing: 'border-box',
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
      InputProps={{
        endAdornment: (
          <span
            onClick={handleClickShowPassword}
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              marginRight: '8px', // Adjust as needed
            }}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <FontAwesomeIcon
            style={{cursor : "pointer"}}
              icon={showPassword ? faEyeSlash : faEye}
            />
          </span>
        ),
      }}
      {...props}
    />
  );
};

export default PasswordField;
