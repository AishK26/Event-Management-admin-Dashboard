import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

// Custom SelectField component
const SelectField = ({
  id,
  name,
  label,
  value,
  onChange,
  options,
  required = false,
  style,
  ...props
}) => {
  return (
    <FormControl
      required={required}
      sx={{
        width: '100%', // Ensure it takes full width of its container
        '& .MuiOutlinedInput-root': {
          height: '3rem',
          backgroundColor: 'white',
          boxSizing: 'border-box',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Default shadow
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
        },
        '& .MuiFormLabel-root': {
          color: 'black',
          fontWeight: 'bold',
        },
        ...style, // Apply additional styles
      }}
      {...props}
    >
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <Select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        label={label}
        displayEmpty
        inputProps={{ 'aria-label': label }}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 200, // Set the dropdown height (200px) before scrolling
            },
          },
        }}
      >
        <MenuItem value="">
          <em>{`Select ${label}`}</em>
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};



export default SelectField;
