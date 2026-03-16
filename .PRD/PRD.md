Below is a complete PRD-style prompt you can paste into GitHub Copilot (or Copilot Chat / Copilot Workspace).
It is written so Copilot can generate the entire project structure and core implementation for the app.
The PRD is intentionally very explicit and implementation-oriented so the AI can scaffold most of the code.

PRODUCT REQUIREMENTS DOCUMENT (PRD)
Project Name
SlowPoker
Product Type
Progressive Web Application (PWA)
Description
SlowPoker is an asynchronous Texas Hold’em poker web application where players take turns making moves over extended periods of time (minutes, hours, or days). The game is designed similarly to correspondence chess applications where users can manage multiple games simultaneously and receive notifications when it is their turn.
The application is a study and experimental project built for educational purposes. The game uses no real money and is strictly for entertainment.

1. Goals
Primary Goal
Build a minimal asynchronous poker game platform where players can play Texas Hold’em at their own pace.
Key Characteristics
Turn-based asynchronous gameplay


Simple minimal UI


Mobile-first design


Installable as a PWA


Multiple games simultaneously


Notifications when it is the player’s turn



2. Technology Stack
The application MUST use the following stack:
Frontend:
Next.js (App Router)


React


TypeScript


Tailwind CSS


Backend:
Next.js API routes or Server Actions


Authentication:
Clerk


Database:
Neon PostgreSQL


ORM:
Drizzle ORM


Poker logic:
pokersolver


poker-evaluator


Hosting:
Vercel


Application Type:
Progressive Web App (PWA)



3. Core Features
3.1 Authentication
Authentication is handled by Clerk.
Requirements:
Users must be able to:
Sign up


Sign in


Sign out


Have a unique user ID


Have a username


User object fields:
id
clerkId
username
createdAt

3.2 Dashboard
The dashboard is the main screen after login.
It should show:
Sections:
Games where it is the user’s turn


Games waiting for opponents


Finished games


Each game card should display:
Opponent name
Game status
Pot size
Last move
Your turn indicator
Example layout:
Your Turn
Game vs Alex
Pot: 120
Flop: K♠ 8♥ 3♦
[Open Game]

Waiting
Game vs Maria
Waiting for opponent

3.3 Game Creation
Users can create a new game.
Flow:
Click “New Game”


Select opponent


Create game


Game settings for MVP:
Texas Hold'em
2 players
Default blinds
When game is created:
A deck is shuffled


Hole cards are dealt


Game state is stored



3.4 Game Screen
Game screen displays:
Opponent area
Opponent Name
[Card Back] [Card Back]
Stack
Community cards
Flop
Turn
River
Pot
Pot: 120
Player area
Your Cards
[A♠] [A♦]
Actions
CHECK
BET
CALL
RAISE
FOLD

3.5 Turn-Based System
The game engine must support asynchronous play.
Rules:
Only the current player can act


Moves are stored in database


Turn switches after move


Opponent receives notification


Move types:
check
bet
call
raise
fold

3.6 Poker Engine
Use the libraries:
pokersolver


poker-evaluator


Responsibilities:
evaluate hands


determine winner


handle showdown


Deck format:
As
Kd
Th
7c

3.7 Notifications
Users must be notified when it is their turn.
Initial MVP options:
In-app notifications


Optional browser push notifications


Notification message example:
It's your turn in SlowPoker vs Alex

3.8 Multiple Concurrent Games
Users should be able to play multiple games simultaneously.
Dashboard should highlight:
Your Turn (3)
Waiting (5)
Finished (10)

4. Database Schema
Use Drizzle ORM.
Tables:
Users
id
clerkId
username
createdAt

Games
id
status (waiting | active | finished)
createdBy
currentPlayerId
pot
phase (preflop | flop | turn | river | showdown)
createdAt

GamePlayers
id
gameId
userId
stack
position
folded

Moves
Stores move history.
id
gameId
playerId
action
amount
createdAt

Cards
Stores card assignments.
id
gameId
playerId
card
type (hole | flop | turn | river)

5. Card UI Design
Cards must be minimal and lightweight.
Do NOT use images.
Use Unicode suits:
♠
♥
♦
♣
Example card component:
┌─────────┐
A       ♠

    ♠

♠       A
└─────────┘
Hidden card:
┌─────────┐
░░░░░░░░░░
░░░░░░░░░░
░░░░░░░░░░
└─────────┘

6. UI Design Principles
Minimal design.
Color palette:
Background
zinc-950
Table
zinc-900
Cards
white
Text
zinc-100
Red suits
red-500
Mobile-first layout.

7. PWA Requirements
The app must be installable.
Required files:
manifest.json
name: SlowPoker
short_name: SlowPoker
display: standalone
theme_color: #09090b
background_color: #09090b
Icons:
192x192
512x512
Include service worker for caching.
Show “Install App” button when beforeinstallprompt event fires.

8. Legal Pages
The app must include three pages.
Routes:
/privacy
/terms
/imprint
Footer links:
Privacy
Terms
Contact
Privacy policy must mention:
data collection


hosting


authentication provider


Terms must include:
educational project disclaimer


no warranty


limitation of liability


no real money gambling


Include statement:
SlowPoker is a play-for-fun game.
No real money gambling is involved.

9. Folder Structure
Example structure:
app
  dashboard
  game/[id]
  new-game
  privacy
  terms
  imprint

components
  Card.tsx
  CardBack.tsx
  PokerTable.tsx
  PlayerHand.tsx
  CommunityCards.tsx
  ActionButtons.tsx

lib
  db
  poker
  deck

api
  games
  moves

10. Game Engine Flow
Steps:
1 Shuffle deck
2 Deal hole cards
3 Preflop betting
4 Flop
5 Turn
6 River
7 Showdown
8 Determine winner
All steps must be persisted in database.

11. Security Requirements
Deck must be generated server-side.
Never trust client actions.
All move validation must occur on server.

12. Non-Goals (for MVP)
Do NOT implement:
real money gambling


tournaments


AI players


animations


chat


Focus only on stable asynchronous gameplay.

13. Success Criteria
The MVP is successful if users can:
sign up


create games


play Texas Hold’em asynchronously


make moves over hours/days


see game state updates


install the app as a PWA



Final Instruction for Copilot
Generate a fully working Next.js project implementing the requirements described in this PRD including:
project structure


database schema


UI components


API routes


poker engine integration


PWA configuration


minimal Tailwind design.


The result should run locally with:
npm install
npm run dev
and be deployable to Vercel.

