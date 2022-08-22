const express = require("express");

const { open } = require("sqlite");

const sqlite3 = require("sqlite3");

const app = express();

const path = require("path");

app.use(express.json());
let db = null;

const dbPath = path.join(__dirname, "cricketTeam.db");

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();

//API 1
app.get("/players/", (request, response) => {
    const getPlayerTeams = `
        select *
        from cricket_team
        order by player_id;
    `;
    const playerTeamsArray = await db.all(getPlayerTeams);
    response.send(playerTeamsArray);
});

//API 2
app.post("/players/", async (request, response) => {
    const teamDetails = request.body;
    const {
            playerName,
            jerseyNumber,
            role
            } = teamDetails;
    const addTeamQuery = `
    INSERT INTO 
    cricket_team (playerName,jerseyNumber,role)
    VALUES 
    (
        `${playerName}`,
         ${jerseyNumber},
         `${role}`
    );`;
    const dbResponse = await db.run(addTeamQuery);
    response.send("Player Added to Team");
});

//API 3
app.get("/players/:playerId/", async (request, response) => {
    const { playerId } = request.params;
    const getTeamQuery = `
        SELECT *
        FROM cricket_team
        WHERE player_id = ${ playerId }
    `;
    const player = await db.get(getTeamQuery);
    response.send(player);

});

//API 4
app.put("/players/:playerId/", async (request, response) => {
     const { playerId } = request.params;
     const playerDetails = request.body;
     const {
         playerName,
         jerseyNumber,
         role
     } = playerDetails;
     const updateTeamQuery = `
        UPDATE cricket_team 
        SET playerName = `${playerName}`,
            jerseyNumber = ${jerseyNumber},
            role = `${role}`
        WHERE player_id = playerId;
        `;
    await db.run(updateTeamQuery);
    response.send("Player Details Updated");
});

//API 5
app.delete("/players/:playerId/", async (request, response) => {
    const { playerId } = request.params;
    const deleteTeamQuery = `
        delete from 
            cricket_team
        where
            player_id = ${playerId};
    `;
    await db.run(deleteTeamQuery);
    response.send("Player Removed");

});


module.exports = app;