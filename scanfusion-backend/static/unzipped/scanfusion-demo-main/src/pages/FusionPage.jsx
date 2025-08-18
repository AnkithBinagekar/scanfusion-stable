import React, { useState } from 'react';
import UploadSection from '../components/UploadSection';
import FusionOptions from '../components/FusionOptions';
import ImageSlider from '../components/ImageSlider';

const FusionPage = () => {
  const [uploadedImages, setUploadedImages] = useState([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white p-6">
      <h1 className="text-4xl font-bold text-center mb-2">Medical Image Fusion</h1>
      <p className="text-center text-gray-300 mb-8">
        Upload your folder of image slices and configure fusion settings.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <UploadSection onImagesSelected={setUploadedImages} />
        <FusionOptions />
      </div>

      {/* Uploaded Folder Preview */}
      {uploadedImages.length > 0 && (
        <div className="mt-12 max-w-3xl mx-auto">
          <ImageSlider images={uploadedImages} />
        </div>
      )}
    </div>
  );
};

export default FusionPage;
