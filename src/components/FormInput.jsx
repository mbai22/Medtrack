import React from 'react';

const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
  placeholder = '',
  className = '',
  options = [],
  error = '',
}) => {
  if (type === 'textarea') {
    return (
      <div className={className}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={4}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent transition-colors text-base ${
            error ? 'border-danger' : 'border-gray-300'
          }`}
        />
        {error && <p className="text-danger text-sm mt-1">{error}</p>}
      </div>
    );
  }

  if (type === 'select') {
    return (
      <div className={className}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent transition-colors text-base appearance-none bg-white ${
            error ? 'border-danger' : 'border-gray-300'
          }`}
        >
          <option value="">Sélectionnez une option</option>
          {options.map((opt) => {
            if (typeof opt === 'string') {
              return (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              );
            } else {
              return (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              );
            }
          })}
        </select>
        {error && <p className="text-danger text-sm mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-danger">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent transition-colors text-base ${
          error ? 'border-danger' : 'border-gray-300'
        }`}
      />
      {error && <p className="text-danger text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FormInput;
