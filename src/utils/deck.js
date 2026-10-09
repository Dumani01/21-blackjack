const SUITS = [
  { key: 'hearts', symbol: '♥', label: 'Sakura', accent: '#ef476f' },
  { key: 'diamonds', symbol: '♦', label: 'Kintsugi', accent: '#f2c14e' },
  { key: 'clubs', symbol: '♣', label: 'Bambú', accent: '#55a630' },
  { key: 'spades', symbol: '♠', label: 'Shogun', accent: '#4ea8de' },
];

const RANKS = [
  { rank: 'A', value: 11, title: 'As' },
  { rank: '2', value: 2, title: 'Dos' },
  { rank: '3', value: 3, title: 'Tres' },
  { rank: '4', value: 4, title: 'Cuatro' },
  { rank: '5', value: 5, title: 'Cinco' },
  { rank: '6', value: 6, title: 'Seis' },
  { rank: '7', value: 7, title: 'Siete' },
  { rank: '8', value: 8, title: 'Ocho' },
  { rank: '9', value: 9, title: 'Nueve' },
  { rank: '10', value: 10, title: 'Diez' },
  { rank: 'J', value: 10, title: 'Jota' },
  { rank: 'Q', value: 10, title: 'Reina' },
  { rank: 'K', value: 10, title: 'Rey' },
];

export function createDeck() {
  return SUITS.flatMap((suit) =>
    RANKS.map((card) => ({
      id: `${suit.key}-${card.rank}`,
      suit: suit.key,
      suitLabel: suit.label,
      suitSymbol: suit.symbol,
      accent: suit.accent,
      rank: card.rank,
      title: card.title,
      value: card.value,
    })),
  );
}

export function shuffleDeck(deck) {
  const cards = [...deck];
  for (let i = cards.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

export function drawCard(deck) {
  if (!deck.length) {
    return { card: null, nextDeck: [] };
  }

  const [card, ...nextDeck] = deck;
  return { card, nextDeck };
}

export function calculateHandValue(cards) {
  let total = cards.reduce((sum, card) => sum + card.value, 0);
  let aces = cards.filter((card) => card.rank === 'A').length;

  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }

  return total;
}

export function formatRoundScore(outcome, playerTotal) {
  switch (outcome) {
    case 'BLACKJACK':
      return 121;
    case 'WIN':
      return 100 + playerTotal;
    case 'PUSH':
      return 80 + playerTotal;
    case 'LOSE':
      return 40 + playerTotal;
    case 'BUST':
      return playerTotal;
    default:
      return playerTotal;
  }
}
