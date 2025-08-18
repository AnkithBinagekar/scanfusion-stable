import React from 'react';

function SliceViewer({ slices }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg h-[400px] overflow-y-scroll shadow-inner">
      <h3 className="text-lg font-semibold text-white mb-4">🖼️ Slice Viewer</h3>
      <div className="flex flex-col gap-4">
        {slices.length > 0 ? (
          slices.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Slice ${index}`}
              className="rounded border border-gray-600"
            />
          ))
        ) : (
          <p className="text-gray-400">No slices uploaded</p>
        )}
      </div>
    </div>
  );
}

export default SliceViewer;
