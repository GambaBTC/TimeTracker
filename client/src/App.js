import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ActivityButton from './components/ActivityButton';
import TimeChart from './components/TimeChart';

const App = () => {
  const [currentActivity, setCurrentActivity] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [currentDuration, setCurrentDuration] = useState(0);
  const [dailyLogs, setDailyLogs] = useState({});

  // Fetch current activity and logs on mount
  useEffect(() => {
    const fetchCurrent = async () => {
      const res = await axios.get('http://localhost:5000/api/current');
      setCurrentActivity(res.data.currentActivity);
      setStartTime(res.data.startTime ? new Date(res.data.startTime) : null);
    };

    const fetchLogs = async () => {
      const res = await axios.get('http://localhost:5000/api/logs');
      setDailyLogs(res.data);
    };

    fetchCurrent();
    fetchLogs();
  }, []);

  // Update current duration every second
  useEffect(() => {
    if (currentActivity && startTime) {
      const interval = setInterval(() => {
        setCurrentDuration((new Date() - startTime) / 1000);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCurrentDuration(0);
    }
  }, [currentActivity, startTime]);

  const startActivity = async (activity) => {
    const res = await axios.post('http://localhost:5000/api/start', { activity });
    setCurrentActivity(res.data.currentActivity);
    setStartTime(new Date(res.data.startTime));
    // Refresh logs
    const logsRes = await axios.get('http://localhost:5000/api/logs');
    setDailyLogs(logsRes.data);
  };

  const stopActivity = async () => {
    const res = await axios.post('http://localhost:5000/api/stop');
    setCurrentActivity(res.data.currentActivity);
    setStartTime(null);
    // Refresh logs
    const logsRes = await axios.get('http://localhost:5000/api/logs');
    setDailyLogs(logsRes.data);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">TimeTracker</h1>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <ActivityButton title="Work" currentActivity={currentActivity} onClick={() => startActivity('Work')} />
        <ActivityButton title="Otium" currentActivity={currentActivity} onClick={() => startActivity('Otium')} />
        <ActivityButton title="Eating" currentActivity={currentActivity} onClick={() => startActivity('Eating')} />
        <ActivityButton title="Exercise" currentActivity={currentActivity} onClick={() => startActivity('Exercise')} />
      </div>
      <div className="text-center mb-8">
        <button
          onClick={stopActivity}
          disabled={!currentActivity}
          className={`px-6 py-3 rounded-lg shadow-md text-white font-semibold transition-all duration-300 transform hover:scale-105 ${
            currentActivity ? 'bg-red-500' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Stop
        </button>
      </div>
      {currentActivity && (
        <p className="text-center text-lg text-gray-700 mb-8">
          Current: {currentActivity} - {currentDuration.toFixed(1)}s
        </p>
      )}
      <TimeChart data={dailyLogs} />
    </div>
  );
};

export default App;
