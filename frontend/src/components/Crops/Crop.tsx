import React, { useEffect, useState } from 'react';

interface CropProps {
  name: string;
  plantedAt: number;
  growthTime: number;
  onHarvest: () => void;
}

const Crop: React.FC<CropProps> = ({ name, plantedAt, growthTime, onHarvest }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkGrowth = () => {
      const timeElapsed = (Date.now() - plantedAt) / 1000;
      if (timeElapsed >= growthTime) {
        setIsReady(true);
      }
    };

    // Kontrollera tillväxtstatus var 1 sekund
    const interval = setInterval(checkGrowth, 1000);
    return () => clearInterval(interval);
  }, [plantedAt, growthTime]);

  return (
    <div className="crop">
      <p>{name}</p>
      <p>Status: {isReady ? 'Ready to harvest' : 'Growing...'}</p>
      <button onClick={onHarvest} disabled={!isReady}>
        Harvest
      </button>
    </div>
  );
};


export default Crop;
