const express = require("express");
const cors = require("cors");
const fs = require("fs");

//creating an API
const app = express();
app.use(cors());
app.use(express.json());

//------------------------------------------------------------------------

const Welcome_txt = fs.readFileSync("./welcome.txt");
app.get("/", (req, res) => {
    res.write(Welcome_txt);
    res.end();
});

const airports_json = fs.readFileSync("./JSON/airports.json", "utf8");
var airports_string = JSON.parse(airports_json);

const runways_json = fs.readFileSync("./JSON/runways.json", "utf8");
var runways_string = JSON.parse(runways_json);

const countries_json = fs.readFileSync("./JSON/contryCodes.json", "utf8");
var countries_string = JSON.parse(countries_json);

app.get("/:icao", (req, res) => {
    var AirportData = airports_string.filter((obj) => {
        return obj.ident === req.params.icao;
      });

      const runways = runways_string.filter(obj => obj.airport_ident === req.params.icao);

      var newObj = {
        "ICAO": AirportData[0].ident,
        "Name": AirportData[0].name,
        "lat": AirportData[0].latitude_deg,
        "lon": AirportData[0].longitude_deg,
        "elevation": AirportData[0].elevation_ft,
        "country": countries_string[AirportData[0].iso_country],
        "City": AirportData[0].municipality,
        "Runways": runways.map(({ id, airport_ref, le_displaced_threshold_ft, he_displaced_threshold_ft, airport_ident, ...rest }) => rest)
      }
    res.write(JSON.stringify(newObj));
    res.end();
  });

//------------------------------------------------------------------------

var listener = app.listen(8080, function () {
    console.log("Listening on port " + listener.address().port);
});
