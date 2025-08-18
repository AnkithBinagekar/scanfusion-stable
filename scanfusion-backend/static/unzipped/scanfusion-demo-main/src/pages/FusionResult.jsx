// src/pages/FusionResult.jsx

import React, { useState } from 'react';
import ImageSlider from '../components/ImageSlider';

const FusionResult = () => {
  const [activeTab, setActiveTab] = useState('Images');

  // Simulated result image slices
  const dummyImages = [
    'https://www.nlm.nih.gov/research/visible/image/mri/m_vm6463.t1.png',
    'https://www.nlm.nih.gov/research/visible/image/mri/m_vm6463.t2.png',
    'https://www.nlm.nih.gov/research/visible/image/mri/m_vm6463.pd.png',
  ];

  // Convert image URLs into fake File objects for reuse in ImageSlider
  const dummyFileList = dummyImages.map((url, i) => {
    return new File([''], `slice_${i}.png`, { type: 'image/png' });
  });

  // Tabs for layout
  const tabs = ['Images', 'Comparison', 'Quality Metrics'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🧠 Fusion Results</h1>
        <a href="/fusion" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded">
          ← Back to Fusion
        </a>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-600 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium transition ${
              activeTab === tab
                ? 'border-b-2 border-white text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'Images' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">📁 Uploaded Slices (Preview)</h2>
            <ImageSlider images={dummyFileList} />
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">🧪 Fused Result</h2>
            <img
              src="https://ui-test-mev.s3.ap-south-1.amazonaws.com/mri_sample.gif"
              alt="Fused Result"
              className="rounded w-full h-auto shadow"
            />
          </div>
        </div>
      )}

      {activeTab === 'Comparison' && (
        <div className="text-center text-gray-400 mt-8">🔄 Coming soon…</div>
      )}
      {activeTab === 'Quality Metrics' && (
        <div className="text-center text-gray-400 mt-8">📊 Coming soon…</div>
      )}
    </div>
  );
};

export default FusionResult;
