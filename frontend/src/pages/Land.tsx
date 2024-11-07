import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CropsList from '../components/Crops/CropsList';
import '../css/Land.css';

interface Crop {
  name: string;
  plantedAt: number;
  growthTime: number;
}

interface PlayerData {
  crops: Crop[];
  buildings: string[];
  progress: number;
}

const gridSize = 5; // 5x5 grid

const Land: React.FC = () => {
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [resources, setResources] = useState<number>(100);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authorization token found');
          return;
        }

        const response = await axios.get('http://localhost:5000/land', {
          headers: { Authorization: token },
        });
        setPlayerData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error fetching player data');
      }
    };

    fetchPlayerData();
  }, []);

  const savePlayerData = async (updatedData: PlayerData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await axios.put('http://localhost:5000/land', updatedData, {
        headers: { Authorization: token },
      });
    } catch (err) {
      console.error('Error saving player data:', err);
    }
  };

  const plantCrop = () => {
    if (resources >= 10) {
      const newCrop: Crop = {
        name: 'Sunflower',
        plantedAt: Date.now(),
        growthTime: 60,
      };
      const updatedData = {
        ...playerData!,
        crops: [...playerData!.crops, newCrop],
      };
      setPlayerData(updatedData);
      setResources(resources - 10);
      savePlayerData(updatedData);
    } else {
      alert('Not enough resources!');
    }
  };

  const harvestCrop = (index: number) => {
    if (playerData) {
      const crop = playerData.crops[index];
      const timeElapsed = (Date.now() - crop.plantedAt) / 1000;

      if (timeElapsed >= crop.growthTime) {
        const updatedData = {
          ...playerData,
          crops: playerData.crops.filter((_, i) => i !== index),
        };
        setResources(resources + 20);
        setPlayerData(updatedData);
        savePlayerData(updatedData);
      } else {
        alert('Crop is not ready yet!');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  if (error) {
    return <div className="land-container"><p className="error-message">{error}</p></div>;
  }

  if (!playerData) {
    return <div className="land-container"><p>Loading...</p></div>;
  }

  // Skapa ett grid baserat på gridSize
  const grid = Array.from({ length: gridSize * gridSize }, (_, index) => {
    const crop = playerData.crops[index];
    return (
      <div
        key={index}
        className="grid-cell"
        style={{
          backgroundColor: crop ? '#ffeb3b' : '#d3d3d3', // Färga grödan gul om den är planterad
        }}
        onClick={() => {
          if (!crop) {
            plantCrop(); // Plantera gröda om rutan är tom
          } else {
            harvestCrop(index); // Skörda gröda om den finns
          }
        }}
      >
        {crop ? crop.name : ''}
      </div>
    );
  });

  return (
    <div className="land-container">
      <h1>Welcome to Your Land</h1>
      <button onClick={handleLogout}>Log Out</button>
      <p>Progress: {playerData.progress}%</p>
      <p>Resources: {resources}</p>
      <div className="grid">{grid}</div>
      <CropsList crops={playerData.crops} onHarvest={harvestCrop} />
      <div className="buildings-list">
        <h2>Your Buildings:</h2>
        {playerData.buildings.length > 0 ? (
          <ul>
            {playerData.buildings.map((building, index) => (
              <li key={index}>{building}</li>
            ))}
          </ul>
        ) : (
          <p>No buildings constructed yet.</p>
        )}
      </div>
    </div>
  );
};

export default Land;
