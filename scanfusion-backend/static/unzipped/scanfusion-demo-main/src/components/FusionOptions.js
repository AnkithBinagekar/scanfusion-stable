import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FusionOptions = () => {
  const [fusionType, setFusionType] = useState('MRI + CT');
  const [noiseLevel, setNoiseLevel] = useState(50);
  const [enhanceContrast, setEnhanceContrast] = useState(false);

  const navigate = useNavigate();

  const handleFusion = () => {
    console.log('Fusing with options:', {
      fusionType,
      noiseLevel,
      enhanceContrast,
    });

    // In future: Trigger your actual fusion API here

    // Navigate to Results Page
    navigate('/results');
  };

  return (
    <div className="p-6 border border-gray-700 rounded-lg bg-gray-900 shadow-md">
      <h2 className="text-xl font-bold mb-4">Fusion Options</h2>

      <div className="mb-4">
        <p className="mb-2">Fusion Type</p>
        <div className="space-y-2">
          {['MRI + CT', 'CT + PET', 'MRI + PET'].map((option) => (
            <label key={option} className="block cursor-pointer">
              <input
                type="radio"
                value={option}
                checked={fusionType === option}
                onChange={() => setFusionType(option)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Noise Reduction</label>
        <input
          type="range"
          min="0"
          max="100"
          value={noiseLevel}
          onChange={(e) => setNoiseLevel(Number(e.target.value))}
          className="w-full"
        />
        <p className="text-sm text-gray-400 mt-1">{noiseLevel}%</p>
      </div>

      <div className="mb-6 flex items-center">
        <input
          type="checkbox"
          checked={enhanceContrast}
          onChange={(e) => setEnhanceContrast(e.target.checked)}
          className="mr-2"
        />
        <label>Enhance Contrast</label>
      </div>

      <button
        onClick={handleFusion}
        className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
      >
        ⚡ Fuse Images
      </button>
    </div>
  );
};

export default FusionOptions;
