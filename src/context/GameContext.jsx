import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const GameContext = createContext(null);

const PLAYER_KEY = 'sakura21-player';
const ROUND_HISTORY_KEY = 'sakura21-round-history';

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function GameProvider({ children }) {
  const [playerName, setPlayerNameState] = useState(() => readStorage(PLAYER_KEY, ''));
  const [completedRounds, setCompletedRounds] = useState(() => readStorage(ROUND_HISTORY_KEY, []));

  useEffect(() => {
    localStorage.setItem(PLAYER_KEY, JSON.stringify(playerName));
  }, [playerName]);

  useEffect(() => {
    localStorage.setItem(ROUND_HISTORY_KEY, JSON.stringify(completedRounds));
  }, [completedRounds]);

  const setPlayerName = (name) => {
    setPlayerNameState(name.trim());
  };

  const addCompletedRound = (round) => {
    setCompletedRounds((current) => [round, ...current].slice(0, 25));
  };

  const getRoundById = (id) => completedRounds.find((round) => round.id === id);

  const clearLocalHistory = () => setCompletedRounds([]);

  const value = useMemo(
    () => ({
      playerName,
      setPlayerName,
      completedRounds,
      addCompletedRound,
      getRoundById,
      clearLocalHistory,
    }),
    [completedRounds, playerName],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame debe usarse dentro de GameProvider');
  }

  return context;
}
