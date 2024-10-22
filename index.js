const express = require("express")
const axios = require("axios")
const mongoose = require("mongoose")

const app = express();
const PORT = 3000;

mongoose.connect("mongodb://0.0.0.0:27017/weatherdb",{
    useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(()=>console.log("Mongo db connected"))
.catch((err)=>console.log("Failed to connect",err))

const weatherSchema = new mongoose.Schema({
    temp: Number,
    feels_like: Number,
    temp_min: Number,
    temp_max: Number,
    pressure: Number,
    humidity: Number,
    sea_level: Number,
    grnd_level: Number
  });

  const Weather = mongoose.model('Weather',weatherSchema);

  app.get('/save-data', async(req,res)=>{
    try{
        const apiKey = '0bfc5403563c73000b827cd0c4e00cc0';
        const city = req.query.city;

        if(!city){
            return res.status(400).json({error:"Please provide the city"})
        }

        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`

        const response = await axios.get(weatherUrl);

        const weatherData = response.data.main;

        const newWeather = new Weather({
            temp: weatherData.temp,
            feels_like: weatherData.feels_like,
            temp_min: weatherData.temp_min,
            temp_max: weatherData.temp_max,
            pressure: weatherData.pressure,
            humidity: weatherData.humidity,
            sea_level: weatherData.sea_level,
            grnd_level: weatherData.grnd_level
        });

        await newWeather.save();

        res.json({
            message : 'Weather data saved succesfully',
            weatherData : newWeather
        });
    }
    catch(error){
        console.error(error);
        res.status(500).json({error: 'Failed to fetch the data'})
    }
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

