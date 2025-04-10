import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

export type Result = {
  name: string;
  imageUri: string; // store URI only
  timestamp: string;
  pH: number | null, //
  healthState: string, //
};

type ResultsContextType = {
  results: Result[];
  addResult: (result: Result) => Promise<void>;
  clearResults: () => Promise<void>;
};

const ResultsContext = createContext<ResultsContextType | undefined>(undefined);

export const ResultsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const data = await AsyncStorage.getItem('results');
      if (data) {
        const parsed: Result[] = JSON.parse(data);
        setResults(parsed);
      }
    } catch (error) {
      console.error('Failed to load results:', error);
    }
  };

  const saveResults = async (newResults: Result[]) => {
    try {
      await AsyncStorage.setItem('results', JSON.stringify(newResults));
    } catch (error) {
      console.error('Failed to save results:', error);
    }
  };

  const addResult = async (result: Result) => {
    try {
      const updated = [...results, result].slice(0, 10); // newest on top, max 10
      setResults(updated);
      await saveResults(updated);
    } catch (error) {
      console.error('Failed to add result:', error);
    }
  };

  const clearResults = async () => {
    try {
      setResults([]);
      await AsyncStorage.removeItem('results');
    } catch (error) {
      console.error('Failed to clear results:', error);
    }
  };

  return (
    <ResultsContext.Provider value={{ results, addResult, clearResults }}>
      {children}
    </ResultsContext.Provider>
  );
};

export const useResults = () => {
  const context = useContext(ResultsContext);
  if (!context) {
    throw new Error('useResults must be used within a ResultsProvider');
  }
  return context;
};
