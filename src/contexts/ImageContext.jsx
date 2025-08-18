import React, { createContext, useState } from 'react';

export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [inputSlices, setInputSlices] = useState([]);
  const [outputSlices, setOutputSlices] = useState([]);
  const [showOutput, setShowOutput] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <ImageContext.Provider
      value={{
        uploadedFile, setUploadedFile,
        inputSlices, setInputSlices,
        outputSlices, setOutputSlices,
        showOutput, setShowOutput,
        currentIndex, setCurrentIndex
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};
