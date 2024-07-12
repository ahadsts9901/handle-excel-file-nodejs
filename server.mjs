import express from 'express';

import routes from './routes/main.mjs'

const app = express();

app.use(express.json());

app.use("/api/v1", routes)

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})