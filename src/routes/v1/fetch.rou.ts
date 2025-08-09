import express, { Request, Response, Router } from 'express';
import FetchController from '#controller/v1/FetchController.cla.js';

const router: Router = express.Router();

router.get('/refetch', async (req: Request, res: Response) => {
    FetchController.appFetchData(req, res);
});

export default router;