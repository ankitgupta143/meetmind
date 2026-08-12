import "dotenv/config";

import app from "./app.js";
import {connectDatabase} from "./config/database.js";

const PORT = process.env.PORT || 5000;

async function startServer(){
    await connectDatabase();

    app.listen(PORT, () => {
        console.log(`MeetMind API is running on port ${PORT}`);
    });
}

startServer();