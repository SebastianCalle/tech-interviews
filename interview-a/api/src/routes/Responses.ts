import StatusCodes from 'http-status-codes';
import { Request, Response } from 'express';

import ResponseDao from '@daos/Response/ResponseDao.mock';
import { paramMissingError } from '@shared/constants';
import { ISurveyResult } from "@entities/SurveyResponse";

const responseDao = new ResponseDao();
const { BAD_REQUEST, CREATED, OK, NOT_FOUND } = StatusCodes;


/**
 * Add a response.
 *
 * @param req The Express Request.
 * @param res The Express Response.
 * @returns
 *   On success returns 201 created with an empty body.
 *   If the parameters are invalid, returns a 400 with an JSON object describing the error.
 */
 export async function addResponse(req: Request, res: Response) {
    const { response } = req.body;
    if (!response) {
        return res.status(BAD_REQUEST)
                  .json({error: paramMissingError});
    }
    await responseDao.add(response);
    return res.status(CREATED).end();
}

/**
 * Get responses.
 *
 * @param req The Express Request.
 * @param res The Express Response.
 * @returns
 *   On success returns 200 with body with response.
 *   If the parameters are invalid, returns a 400 with an JSON object describing the error.
 */
export async function getResponse(req: Request, res: Response) {
    try{

        const responses = await responseDao.getAll();

        const results: any = {}

        responses.forEach(response => {
            response.content.questions.forEach(obj => {
                const question = `${obj.question}`;
                const answer = `${obj.answer}`;
                if (!results[question]) {
                    results[question] = {[answer]: 0,};
                }
                if (!results[question].hasOwnProperty(answer)) {
                    results[question] = {...results[question], [answer]: 0,};
                }
                results[question][answer] += 1;
            });
        });

        let questionCount: ISurveyResult = {}
        const surveyResults: ISurveyResult[] = []

        for (const [key, value] of Object.entries(results)) {
            questionCount['question'] = key
            questionCount['answers'] = []
            for (const [k, v] of Object.entries(value as ISurveyResult)) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                questionCount['answers'].push({
                    answer: k,
                    count: v
                })
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            surveyResults.push(questionCount)
            questionCount = {}
        }

        return res.status(OK)
            .json({surveyResults});
    } catch (e) {
        return res.status(NOT_FOUND)
            .json({'error': 'Data not found'});

    }
}

