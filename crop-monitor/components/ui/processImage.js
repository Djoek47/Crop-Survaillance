// frontend/src/api.js
export const processImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
  
    const response = await fetch('/api/analyze-plants', {
      method: 'POST',
      body: formData,
    });
  
    if (!response.ok) {
      throw new Error('Failed to analyze image');
    }
  
    const result = await response.json();
    return {
      plantCount: result.plantCount,
      vitality: result.vitality,
      location: result.location,
    };
  };
  