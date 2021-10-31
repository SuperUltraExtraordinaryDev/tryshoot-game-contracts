import { BinaryReader, BinaryWriter } from 'borsh';
import base58 from 'bs58';
import { PublicKey } from '@solana/web3.js';
import * as BufferLayout from 'buffer-layout';
import { rustEnum, bool, u8, publicKey, str, vec, option, struct } from '@project-serum/borsh'
import { u16, u32 } from 'buffer-layout';

type StringPublicKey = string;

import BN from 'bn.js';

export class Stats {
  health: number;
  attack: number;
  defense: number;
  speed: number;
  agility: number;

  constructor(args: {
    health: number;
    attack: number;
    defense: number;
    speed: number;
    agility: number;
  }) {
    this.health = args.health;
    this.attack = args.attack;
    this.defense = args.defense;
    this.speed = args.speed;
    this.agility = args.agility;
  }
}

export class Move {
  move_id: number;
  damage_modifier: number;
  status_effect_chance: number;
  status_effect: number;

  constructor(args: {
    move_id: number;
    damage_modifier: number;
    status_effect_chance: number;
    status_effect: number;
  }) {
    this.move_id = args.move_id;
    this.damage_modifier = args.damage_modifier;
    this.status_effect_chance = args.status_effect_chance;
    this.status_effect = args.status_effect;
  }
}

export class Player {
  wallet: PublicKey;
  team_member0: PublicKey;
  team_member1: PublicKey;
  team_member2: PublicKey;
  current_move: Move;
  active_team_member: u8;

  constructor(args: {
    wallet: PublicKey;
    team_member0: PublicKey;
    team_member1: PublicKey;
    team_member2: PublicKey;
    current_move: Move;
    active_team_member: u8;
  }) {
    this.wallet = args.wallet;
    this.team_member0 = args.team_member0;
    this.team_member1 = args.team_member1;
    this.team_member2 = args.team_member2;
    this.current_move = args.current_move;
    this.active_team_member = args.active_team_member;
  }
}

export class CreateBattleArgs {
  instruction: number = 0;
  date: String;

  constructor(args: { date: String; }) {
    this.date = args.date;
  }
}

export class JoinBattleArgs {
  instruction: number = 1;

  constructor(args: {}) {
  }
}

export const BATTLE_SCHEMA = new Map<any, any>([
  [
    CreateBattleArgs,
    {
      kind: 'struct',
      fields: [
        ['instruction', 'u8'],
        ['date', 'string'],
      ],
    },
  ],
  [
    JoinBattleArgs,
    {
      kind: 'struct',
      fields: [
        ['instruction', 'u8'],
      ],
    },
  ],
]);

const STATS_LAYOUT = struct([
  u16('health'),
  u16('attack'),
  u16('defense'),
  u16('speed'),
  u16('agility'),
])

const MOVE_LAYOUT = struct([
  u8('move_id'),
  u8('damage_modifier'),
  u8('status_effect_chance'),
  u8('status_effect'),
])

const PLAYER_LAYOUT = struct([
  publicKey('wallet'),
  publicKey('teamMember0'),
  publicKey('teamMember1'),
  publicKey('teamMember2'),
  MOVE_LAYOUT.replicate('currentMove'),
  u8('activeTeamMember'),
])

const BATTLE_LAYOUT = struct([
  str('date'),
  publicKey('updateAuthority'),
  PLAYER_LAYOUT.replicate("player1"),
  PLAYER_LAYOUT.replicate("player2"),
  u8("status"),
  u8('roundNumber'),
]);

export interface Battle {
  date: String;
  updateAuthority: PublicKey;
  player_1: Player;
  player_2: Player;
  status: u8;
  round_number: u8;
}

// eslint-disable-next-line no-control-regex
const BATTLE_REPLACE = new RegExp('\x00', '');

export function decodeBattle(buffer: Buffer): Battle {
  const battle: any = BATTLE_LAYOUT.decode(buffer);
  battle.updateAuthority = battle.updateAuthority.toString();
  battle.player1.wallet = battle.player1.wallet.toString();
  battle.player1.teamMember0 = battle.player1.teamMember0.toString();
  battle.player1.teamMember1 = battle.player1.teamMember1.toString();
  battle.player1.teamMember2 = battle.player1.teamMember2.toString();
  battle.player2.wallet = battle.player2.wallet.toString();
  battle.player2.teamMember0 = battle.player2.teamMember0.toString();
  battle.player2.teamMember1 = battle.player2.teamMember1.toString();
  battle.player2.teamMember2 = battle.player2.teamMember2.toString();
  battle.date = battle.date.replace(BATTLE_REPLACE, '');
  return battle;
};