// src/pages/FusionResult.jsx
import React, { useContext, useState, useEffect } from "react";
import { ImageContext } from "../contexts/ImageContext";

const API_BASE = "http://localhost:8000"; // backend base

function resolveUrl(p) {
  if (!p) return "";
  // already absolute
  if (p.startsWith("http://") || p.startsWith("https://")) {
    // fix accidental leading slash: "/http://..."
    if (p.startsWith("/http://") || p.startsWith("/https://")) {
      const fixed = p.slice(1);
      return `${fixed}?t=${Date.now()}`;
    }
    return `${p}?t=${Date.now()}`;
  }
  // starts with "/static/..."
  if (p.startsWith("/")) {
    return `${API_BASE}${p}?t=${Date.now()}`;
  }
  // relative like "static/xxx.jpg"
  return `${API_BASE}/${p}?t=${Date.now()}`;
}

const FusionResult = () => {
  const { inputSlices = [], outputSlices = [], gifUrl } = useContext(ImageContext);
  const [inputIndex, setInputIndex] = useState(0);
  const [outputIndex, setOutputIndex] = useState(0);

  useEffect(() => {
    console.log("FusionResult - inputSlices:", inputSlices);
    console.log("FusionResult - outputSlices:", outputSlices);
    console.log("FusionResult - gifUrl:", gifUrl);
  }, [inputSlices, outputSlices, gifUrl]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Fusion Results</h1>

      {/* Input Slices */}
      {inputSlices && inputSlices.length > 0 && (
        <div className="mb-8 bg-gray-800 p-4 rounded shadow">
          <h2 className="text-xl mb-2">Input Slice Preview</h2>
          <img
            src={resolveUrl(inputSlices[inputIndex])}
            alt="Input Slice"
            className="w-full max-w-lg mx-auto rounded shadow"
          />
          <input
            type="range"
            min="0"
            max={inputSlices.length - 1}
            value={inputIndex}
            onChange={(e) => setInputIndex(Number(e.target.value))}
            className="w-full mt-2"
          />
          <p className="text-center mt-1">
            Slice {inputIndex + 1} / {inputSlices.length}
          </p>
        </div>
      )}

      {/* Output Slices */}
      {outputSlices && outputSlices.length > 0 && (
        <div className="mb-8 bg-gray-800 p-4 rounded shadow">
          <h2 className="text-xl mb-2">Output Slice Preview</h2>
          <img
            src={resolveUrl(outputSlices[outputIndex])}
            alt="Output Slice"
            className="w-full max-w-lg mx-auto rounded shadow"
          />
          <input
            type="range"
            min="0"
            max={outputSlices.length - 1}
            value={outputIndex}
            onChange={(e) => setOutputIndex(Number(e.target.value))}
            className="w-full mt-2"
          />
          <p className="text-center mt-1">
            Slice {outputIndex + 1} / {outputSlices.length}
          </p>
        </div>
      )}

      {/* GIF Volume Rendering */}
      {gifUrl && (
        <div className="bg-gray-800 p-4 rounded shadow text-center">
          <h2 className="text-xl mb-2">Volume Rendering (GIF)</h2>
          <img src={resolveUrl(gifUrl)} alt="3D Volume Rendering" className="mx-auto rounded shadow" />
        </div>
      )}
    </div>
  );
};

export default FusionResult;

