const asyncRequest = require("async-request");
const express = require("express");
const path = require("path");


const getWeather = async (location) => {
    const access_key = "cc5d488ffb432576249bdff9d00cd1c";
    const url = `http://api.weatherstack.com/current?access_key=${access_key}6&query=${location}`;
    try {
        const res = await asyncRequest(url);
        const data = JSON.parse(res.body);
        let weather = {
            region: data.location.name,
            country: data.location.country,
            temperature: data.current.temperature,
            wind_speed: data.current.wind_speed,
            precip: data.current.precip,
            cloudcover: data.current.cloudcover
        }
        return weather;
    } catch (error) {
        console.log(error);
        return {
            isSuccess: false,
            error
        }
    }


}
// getWeather("HaNoi");
const app = express();
const port = 5000;


//setup static file
const pathPublic = path.join(__dirname, "./public")
app.use(express.static(pathPublic));

app.set("view engine", "hbs");//pug

// http://localhost:5000/
app.get('/', async (req, res) => {
    const params = req.query;
    const location = params.address;
    const weather = await getWeather(location);
    if (location) {
        console.log(weather);
        res.render("weather", {
            status: true,
            region: weather.region,
            country: weather.country,
            temperature: weather.temperature,
            wind_speed: weather.wind_speed,
            precip: weather.precip,
            cloudcover: weather.cloudcover,
        });
    }else{
        res.render("weather", {
            status: false,
        })
    }
})



app.listen(port, () => {
    console.log(`app run on port ${port}`);
})