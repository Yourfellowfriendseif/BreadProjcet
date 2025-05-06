import { useState, useRef } from 'react';
import { uploadAPI } from '../../api/uploadAPI';
import Button from './Button';

export default function ImageUpload({
  onChange,
  multiple = false,
  value = [],
  maxFiles = 10,
  maxSize = 5 * 1024 * 1024, // 5MB
  accept = "image/jpeg,image/png,image/jpg"
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    // Validate number of files
    if (multiple && files.length + value.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} images`);
      return;
    }

    // Validate file sizes
    const invalidFiles = files.filter(file => file.size > maxSize);
    if (invalidFiles.length > 0) {
      setError(`Some files are larger than ${maxSize / 1024 / 1024}MB`);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      let uploadedImages;
      if (multiple) {
        uploadedImages = await uploadAPI.uploadMultipleImages(files);
      } else {
        uploadedImages = [await uploadAPI.uploadSingleImage(files[0])];
      }

      if (onChange) {
        onChange(multiple ? [...value, ...uploadedImages] : uploadedImages[0]);
      }
    } catch (err) {
      setError(err.message || 'Failed to upload images');
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (index) => {
    if (!onChange) return;

    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(multiple ? newValue : null);
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex flex-wrap gap-4">
        {value?.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={typeof image === 'string' ? image : uploadAPI.getImageUrl(image.filename)}
              alt={`Uploaded ${index + 1}`}
              className="h-24 w-24 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <svg
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <Button
        type="button"
        variant="secondary"
        onClick={() => fileInputRef.current?.click()}
        loading={loading}
        disabled={loading || (multiple && value?.length >= maxFiles)}
      >
        {loading ? 'Uploading...' : 'Upload Image'}
      </Button>

      {multiple && (
        <p className="text-sm text-gray-500">
          You can upload up to {maxFiles} images (max {maxSize / 1024 / 1024}MB each)
        </p>
      )}
    </div>
  );
}