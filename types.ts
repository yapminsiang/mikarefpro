
export enum TeamType {
  A = 'A',
  B = 'B'
}

export enum Side {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
}

export interface Player {
  id: string;
  name: string;
  initialSide: Side;
}

export interface Team {
  name: string;
  players: [Player, Player];
  score: number;
  gamesWon: number;
}

export interface MatchSettings {
  winAt: number;
  winByTwo: boolean; // false = Sudden Death
  bestOf: number; // 1, 3, or 5
}

export interface SavedTeam {
  id: string;
  name: string;
  p1: string;
  p2: string;
}

export interface GameState {
  teamA: Team;
  teamB: Team;
  servingTeam: TeamType;
  settings: MatchSettings;
  isGameOver: boolean;
  isMatchOver: boolean;
  history: Omit<GameState, 'history'>[];
}
