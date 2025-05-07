import ValidationError from './ValidationError';

export default function FormGroup({
  label,
  id,
  error,
  children,
  required,
  helperText
}) {
  return (
    <div className="space-y-1">
      {label && (
        <label 
          htmlFor={id}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {helperText && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
      <ValidationError error={error} />
    </div>
  );
}