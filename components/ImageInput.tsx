import React, { useRef } from 'react';
import { Geolocation } from '../types';

interface ImageInputProps {
  onImageAdded: (file: File, location: Geolocation | null) => void;
  disabled?: boolean;
}

const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </svg>
);


const ImageInput: React.FC<ImageInputProps> = ({ onImageAdded, disabled }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      // Get geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location: Geolocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            onImageAdded(file, location);
          },
          (error) => {
            console.warn("Error getting geolocation: ", error.message);
            // Proceed without location
            onImageAdded(file, null);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        console.warn("Geolocation is not supported by this browser.");
        onImageAdded(file, null);
      }

      // Reset input value to allow selecting the same file again
      event.target.value = '';
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        capture="environment" // Prioritizes the rear camera on mobile devices
        disabled={disabled}
      />
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
      >
        <CameraIcon />
        Agregar Foto y Descripción
      </button>
    </>
  );
};

export default ImageInput;