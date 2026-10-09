import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ControlPanel from '../components/game/ControlPanel';
import HandView from '../components/game/HandView';
import ResultBanner from '../components/game/ResultBanner';
import ScoreBoard from '../components/game/ScoreBoard';
import { useGame } from '../context/GameContext';
import { saveLeaderboardEntry, sendResultToWebhook } from '../services/api';
import { calculateHandValue, createDeck, drawCard, formatRoundScore, shuffleDeck } from '../utils/deck';

function getOutcomeCopy(outcome, playerTotal, dealerTotal) {
  switch (outcome) {
    case 'BLACKJACK':
      return {
        title: '¡Blackjack!',
        message: `Lograste 21. Tú: ${playerTotal} · Dealer: ${dealerTotal}.`,
      };
    case 'WIN':
      return {
        title: 'Ganaste la ronda',
        message: `Tu mano superó al dealer. Tú: ${playerTotal} · Dealer: ${dealerTotal}.`,
      };
    case 'PUSH':
      return {
        title: 'Empate',
        message: `Ambos terminaron con ${playerTotal}.`,
      };
    case 'BUST':
      return {
        title: 'Te pasaste de 21',
        message: `Tu mano terminó en ${playerTotal}. El dealer gana la ronda.`,
      };
    default:
      return {
        title: 'Perdiste la ronda',
        message: `El dealer se quedó más cerca de 21. Tú: ${playerTotal} · Dealer: ${dealerTotal}.`,
      };
  }
}

export default function PlayPage() {
  const navigate = useNavigate();
  const { playerName, addCompletedRound, completedRounds } = useGame();
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameStatus, setGameStatus] = useState('loading');
  const [revealDealer, setRevealDealer] = useState(false);
  const [resultInfo, setResultInfo] = useState({ title: 'Preparando la mesa...', message: 'Barajando cartas.' });
  const [saveState, setSaveState] = useState('Pendiente');
  const [syncError, setSyncError] = useState('');
  const [lastRoundId, setLastRoundId] = useState('');
  const finishGuardRef = useRef(false);

  useEffect(() => {
    if (!playerName) {
      navigate('/');
    }
  }, [navigate, playerName]);

  const playerTotal = useMemo(() => calculateHandValue(playerHand), [playerHand]);
  const dealerTotal = useMemo(() => calculateHandValue(dealerHand), [dealerHand]);
  const visibleDealerTotal = useMemo(() => {
    if (revealDealer) return dealerTotal;
    return dealerHand[0] ? calculateHandValue([dealerHand[0]]) : 0;
  }, [dealerHand, dealerTotal, revealDealer]);

  const startRound = useCallback(() => {
    finishGuardRef.current = false;
    setSyncError('');
    setSaveState('Pendiente');
    setRevealDealer(false);
    setGameStatus('player-turn');

    let freshDeck = shuffleDeck(createDeck());

    const drawn = [];
    for (let i = 0; i < 4; i += 1) {
      const { card, nextDeck } = drawCard(freshDeck);
      drawn.push(card);
      freshDeck = nextDeck;
    }

    setPlayerHand([drawn[0], drawn[2]]);
    setDealerHand([drawn[1], drawn[3]]);
    setDeck(freshDeck);
    setResultInfo({ title: 'Ronda iniciada', message: 'Busca acercarte a 21 sin pasarte.' });
  }, []);

  useEffect(() => {
    startRound();
  }, [startRound]);

  const finishRound = useCallback(
    async (playerCardsSnapshot, dealerCardsSnapshot, forcedOutcome = '') => {
      if (finishGuardRef.current) return;
      finishGuardRef.current = true;

      let finalDealerCards = [...dealerCardsSnapshot];
      let remainingDeck = [...deck];
      const currentPlayerTotal = calculateHandValue(playerCardsSnapshot);

      if (!forcedOutcome) {
        while (calculateHandValue(finalDealerCards) < 17) {
          const { card, nextDeck } = drawCard(remainingDeck);
          if (!card) break;
          finalDealerCards = [...finalDealerCards, card];
          remainingDeck = nextDeck;
        }
      }

      const finalDealerTotal = calculateHandValue(finalDealerCards);
      let outcome = forcedOutcome;

      if (!outcome) {
        if (currentPlayerTotal === 21 && playerCardsSnapshot.length === 2 && finalDealerTotal !== 21) {
          outcome = 'BLACKJACK';
        } else if (finalDealerTotal > 21) {
          outcome = 'WIN';
        } else if (currentPlayerTotal > finalDealerTotal) {
          outcome = 'WIN';
        } else if (currentPlayerTotal === finalDealerTotal) {
          outcome = 'PUSH';
        } else {
          outcome = 'LOSE';
        }
      }

      const copy = getOutcomeCopy(outcome, currentPlayerTotal, finalDealerTotal);
      const roundId = `round-${Date.now()}`;
      const score = formatRoundScore(outcome, currentPlayerTotal);
      const timestamp = new Date().toISOString();
      const entry = {
        player: playerName,
        score,
        outcome,
        playerTotal: currentPlayerTotal,
        dealerTotal: finalDealerTotal,
        roundId,
        createdAt: timestamp,
      };

      setDealerHand(finalDealerCards);
      setDeck(remainingDeck);
      setRevealDealer(true);
      setGameStatus('finished');
      setResultInfo(copy);
      setLastRoundId(roundId);

      addCompletedRound({
        id: roundId,
        playerName,
        outcome,
        playerTotal: currentPlayerTotal,
        dealerTotal: finalDealerTotal,
        score,
        createdAt: timestamp,
        playerHand: playerCardsSnapshot,
        dealerHand: finalDealerCards,
      });

      try {
        setSaveState('Guardando puntuación...');
        await saveLeaderboardEntry(entry);
        await sendResultToWebhook(entry);
        setSaveState('Sincronizado');
      } catch (error) {
        setSaveState('Guardado localmente');
        setSyncError(error.message || 'No se pudo sincronizar la partida con el servidor.');
      }
    },
    [addCompletedRound, deck, playerName],
  );

  useEffect(() => {
    if (gameStatus !== 'player-turn') return;

    if (playerTotal > 21) {
      finishRound(playerHand, dealerHand, 'BUST');
    } else if (playerTotal === 21) {
      finishRound(playerHand, dealerHand);
    }
  }, [dealerHand, finishRound, gameStatus, playerHand, playerTotal]);

  const handleHit = () => {
    if (gameStatus !== 'player-turn') return;
    const { card, nextDeck } = drawCard(deck);
    if (!card) return;
    setPlayerHand((current) => [...current, card]);
    setDeck(nextDeck);
  };

  const handleStand = () => {
    if (gameStatus !== 'player-turn') return;
    setGameStatus('dealer-turn');
    finishRound(playerHand, dealerHand);
  };

  const handleSummary = () => {
    if (!lastRoundId) return;
    navigate(`/round/${lastRoundId}`);
  };

  return (
    <div className="stack-lg">
      <ScoreBoard
        playerName={playerName}
        roundStatus={gameStatus === 'finished' ? 'Finalizada' : 'En juego'}
        roundCount={completedRounds.length}
        saveState={saveState}
      />

      <ResultBanner title={resultInfo.title} message={resultInfo.message} error={Boolean(syncError)} />
      {syncError ? <p className="inline-error">{syncError}</p> : null}

      <div className="table-scene">
        <div className="table-label"><span>SAKURA 21</span><small>MESA DE JUEGO</small></div>
        <div className="deck-stack" aria-hidden="true"><span>和</span></div>
        <div className="dealing-hand" aria-hidden="true">
          <span className="hand-glow" />
          <img className="hand-art" src="/assets/dealer-hand.png" alt="" />
        </div>
        <div className="play-grid">
          <HandView
            title="Dealer"
            cards={dealerHand}
            hideSecondCard={!revealDealer}
            total={visibleDealerTotal}
            subtitle="El dealer roba hasta llegar a 17 o más."
          />
          <HandView
            title={playerName || 'Jugador'}
            cards={playerHand}
            total={playerTotal}
            subtitle="Acércate a 21 sin pasarte."
          />
        </div>
      </div>

      <ControlPanel
        canHit={gameStatus === 'player-turn'}
        canStand={gameStatus === 'player-turn'}
        onHit={handleHit}
        onStand={handleStand}
        onRestart={startRound}
        onSummary={handleSummary}
        finished={gameStatus === 'finished'}
      />
    </div>
  );
}
