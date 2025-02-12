import { Router, type Request, type Response } from "express";
import fs from "node:fs"
const router = Router();

// import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post("/", async (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  // TODO: save city to search history

  const cityName = req.body.cityName;

  console.log(cityName);

  const parsedWeatherData = await WeatherService.getWeatherForCity(cityName)

    res.json(parsedWeatherData)

          // res.send("You've reached the post route!");
   
});

// TODO: GET search history
router.get('/history', async (req: Request, res: Response) => {

  const data = await fs.readFileSync("./db/db.json", "utf-8");

  const parsedData = JSON.parse(data);

  res.json(parsedData)


});

// * BONUS TODO: DELETE city from search history
// router.delete('/history/:id', async (req: Request, res: Response) => {});

export default router;
