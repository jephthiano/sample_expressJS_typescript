import express from 'express';
import applyMiddleware from '#config/applyMiddleware.js';
import v1RouteEntry from '#route/v1/index.rou.js';
const app = express();
app.get("/", (req, res) => {
    res.send("Hello testing");
});
// Apply middlewares
applyMiddleware(app);
// Register routes
app.use('/api/v1', v1RouteEntry);
export default app;
