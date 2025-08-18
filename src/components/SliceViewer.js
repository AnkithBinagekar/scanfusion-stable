import React, { useContext } from 'react';
import { ImageContext } from '../contexts/ImageContext';

const SliceViewer = () => {
  const {
    inputSlices,
    outputSlices,
    showOutput,
    setShowOutput,
    currentIndex,
    setCurrentIndex,
  } = useContext(ImageContext);

  const slicesToShow = showOutput ? outputSlices : inputSlices;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-white">Slice Viewer</h2>

      {slicesToShow.length === 0 ? (
        <div className="text-gray-400">No slices to preview yet.</div>
      ) : (
        <div className="text-white">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <label className="mr-4">
                <input
                  type="radio"
                  name="view"
                  checked={!showOutput}
                  onChange={() => setShowOutput(false)}
                  className="mr-1"
                />
                Input
              </label>
              <label>
                <input
                  type="radio"
                  name="view"
                  checked={showOutput}
                  onChange={() => setShowOutput(true)}
                  className="mr-1"
                />
                Output
              </label>
            </div>
            <div>
              Slice {currentIndex + 1} of {slicesToShow.length}
            </div>
          </div>

          <img
            src={slicesToShow[currentIndex]}
            alt="Slice Preview"
            className="w-full max-w-md mx-auto mb-4 rounded shadow"
          />

          <input
            type="range"
            min="0"
            max={slicesToShow.length - 1}
            value={currentIndex}
            onChange={(e) => setCurrentIndex(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};

export default SliceViewer;
