import React, { useState } from 'react';

const UploadSection = ({ onImagesSelected }) => {
  const handleFolderUpload = (e) => {
    const files = Array.from(e.target.files).filter((file) =>
      file.type.startsWith('image/')
    );
    onImagesSelected(files);
  };

  return (
    <div className="p-6 border border-gray-700 rounded-lg bg-gray-900 shadow-md">
      <h2 className="text-xl font-bold mb-4">Upload Folder of Images</h2>

      <input
        type="file"
        webkitdirectory="true"
        directory="true"
        multiple
        onChange={handleFolderUpload}
        className="block w-full text-white bg-gray-800 border border-gray-600 rounded px-4 py-2 cursor-pointer"
      />

      <p className="text-sm text-gray-400 mt-2">
        Select a folder that contains multiple image slices (e.g., CT or MRI stack).
      </p>
    </div>
  );
};

export default UploadSection;
