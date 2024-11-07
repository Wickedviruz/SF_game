// CropsList.tsx
import React from 'react';
import Crop from './Crop'; // Importera Crop-komponenten

// Använd samma typdefinition som i Land.tsx
interface Crop {
  name: string;
  plantedAt: number;
  growthTime: number;
}

interface CropsListProps {
  crops: Crop[];
  onHarvest: (index: number) => void;
}

const CropsList: React.FC<CropsListProps> = ({ crops, onHarvest }) => {
  return (
    <div className="crops-list">
      {crops.map((crop, index) => (
        <Crop
          key={index}
          name={crop.name}
          plantedAt={crop.plantedAt}
          growthTime={crop.growthTime}
          onHarvest={() => onHarvest(index)}
        />
      ))}
    </div>
  );
};

export default CropsList;
