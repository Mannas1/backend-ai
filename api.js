import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import cors from "cors";
import fetch from 'node-fetch';
import { createClient } from 'pexels';
import fs from 'fs';



dotenv.config();

const app = express();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})




app.use(cors());

app.use(express.json());







app.post("/api/openai", async (req, res) => {
    try {
        console.log(req.body);
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a travel advisor who knows a lot about the most underrated places in India that are budget friendle" },
                { role: "system", content: "You can suggest places to the user based on their preferences and budget" },
                { role: "system", content: "You have to send a list of 5 places according to the user's opinion in JSON" },
                { role: "system", content: "You have to also send description of the given place in JSON" },

                // {role: "assistant", content: "I can help you with that. What kind of place are you looking for? And what is your budget?"},
                { role: "assistant", content: "I can suggest you some places that are budget friendly and are not very crowded. What kind of place are you looking for? And what is your budget?" },

                { role: "user", content: req.body.input },
            ],

            model: "gpt-3.5-turbo-0125",
            response_format: { "type": "json_object" }
        });

        const suggestedPlaces = completion.choices[0].message.content.split('\n');

        // console.log(suggestedPlaces);
        const data = suggestedPlaces
        const jsonString = data.join('');

        // Parse the string as JSON
        const jsonData = JSON.parse(jsonString);

        // Stringify the JSON with proper indentation
        const formattedJson = JSON.stringify(jsonData, null, 2);

        // Print the formatted JSON
        const placeNames = formattedJson.places.map(place => place.name);

// Log the extracted place names
        console.log(placeNames);
        // res.send(formattedJson.places[0].name);
        // res.send(suggestedPlaces);


        // const image = await fetch("http://localhost:3000/api/getimage", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify({ input: suggestedPlaces[1] })
        // })

        // const imageData =  await image.json();
        // console.log(imageData);


    } catch (error) {
        console.log(error);
    }
})




app.post('/api/getimage', async (req, res) => {
    try {
        const client = createClient("wRl4saeUbwiV1pQwPvk4PGqFhP1ylz1BZ6Whvv6dm85sSZtd40ecn1Vx");
        const query = req.body.input;
        client.photos.search({ query, per_page: 1 }).then(photos => {
            // Add your code logic here
            // For example:
            // console.log(photos);
            res.send(photos);
        });
    } catch (error) {
        console.log(error)
    }



})




app.listen('3000', () => {
    console.log("server started lmao")
})