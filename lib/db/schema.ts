import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const gameStatusEnum = pgEnum("game_status", ["waiting", "active", "finished"]);
export const gamePhaseEnum = pgEnum("game_phase", ["preflop", "flop", "turn", "river", "showdown"]);
export const moveActionEnum = pgEnum("move_action", ["check", "bet", "call", "raise", "fold"]);
export const cardTypeEnum = pgEnum("card_type", ["hole", "flop", "turn", "river"]);
export const notificationTypeEnum = pgEnum("notification_type", ["turn", "result", "invite"]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clerkId: text("clerk_id").notNull(),
    username: text("username").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    clerkIdIdx: uniqueIndex("users_clerk_id_idx").on(table.clerkId),
    usernameIdx: uniqueIndex("users_username_idx").on(table.username),
  }),
);

export const games = pgTable("games", {
  id: uuid("id").defaultRandom().primaryKey(),
  status: gameStatusEnum("status").default("waiting").notNull(),
  createdBy: uuid("created_by").notNull(),
  currentPlayerId: uuid("current_player_id"),
  pot: integer("pot").default(0).notNull(),
  phase: gamePhaseEnum("phase").default("preflop").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const gamePlayers = pgTable("game_players", {
  id: uuid("id").defaultRandom().primaryKey(),
  gameId: uuid("game_id").notNull(),
  userId: uuid("user_id").notNull(),
  stack: integer("stack")
    .default(2000)
    .notNull(),
  position: text("position").notNull(),
  folded: boolean("folded").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const moves = pgTable("moves", {
  id: uuid("id").defaultRandom().primaryKey(),
  gameId: uuid("game_id").notNull(),
  playerId: uuid("player_id").notNull(),
  phase: gamePhaseEnum("phase").default("preflop").notNull(),
  action: moveActionEnum("action").notNull(),
  amount: integer("amount").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const cards = pgTable("cards", {
  id: uuid("id").defaultRandom().primaryKey(),
  gameId: uuid("game_id").notNull(),
  playerId: uuid("player_id"),
  card: text("card").notNull(),
  type: cardTypeEnum("type").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  gameId: uuid("game_id"),
  type: notificationTypeEnum("type").default("turn").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  readAt: timestamp("read_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type InsertGame = typeof games.$inferInsert;
export type SelectGame = typeof games.$inferSelect;
