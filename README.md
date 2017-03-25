# The Internet of Pings

Cloud connected ping-pong table with live scoreboard, persistent stats, RFID based auth and slack integration.

## "Architecture"
- Raspberry Pi / RFID reader connected to table
  - Pi has admin auth. It can do calculations client side and send to Firebase
  - Buttons for basic actions / user input (see Features)
  - RFID reader connected to Pi for player auth. Auth details:
    - Must login through RFID first time. Hash RFID code, save that value in DB, return player a one time use code
    - Player can use one time use code to connect their Slack name and edit profile
    - After first time, player can join table via Slack or RFID. Things like editing profile must be done through slack
    - Admin can easily override the RFID -> Slack connection in case people screw it up
    - RFID is nice because everyone has one in their pockets. If this is a security concern, can do Slack only
- Pure Firebase backend
  - Perform all calculations for stats on client side and send to Firebase
  - Only Pi + Admins should have auth for write access for ping pong data, everyone else read only
  - Exception is player metadata, which each player can update via slack bot
  - Firebase functions to handle recalculating everything in a sane way IE: if a game is inputted incorrectly
- Slack bot
  - Posts game status into a slack channel
  - Can post things like stats on demand
  - Essentially a text based front end
- Some kind of tape to attach Pi & buttons to ping pong table
  - Hopefully there's a power outlet nearby
  - Hopefully the WiFi isn't terrible

## "Features"
- Button based UX (think arcade buttons) controlled by Pi
  - Simple score up / down buttons for each player
  - Button to switch sides
  - Combination button press required for advanced actions like leaving table
  - Join table or queue via RFID or Slack
- Stat panels (ELO, +/-, W/L, matchup stats)
- Trash talk
- Tournament mode
- Some way to queue players
- Make it talk
- Admin panel
  - Simple score related settings (total score required to win, changing serves)
- Charts and graphs
- Anything else cheesy you can think of
