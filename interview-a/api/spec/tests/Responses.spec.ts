import supertest from 'supertest';
import StatusCodes from 'http-status-codes';
import {SuperTest, Test} from 'supertest';

import app from '@server';
import ResponseDao from '@daos/Response/ResponseDao.mock';
import {pErr} from '@shared/functions';
import {paramMissingError} from '@shared/constants';
import {IReqBody, IResponse, IResponseSurveyList} from '../support/types';
import SurveyResponse, {ISurveyResult, IAnswerCount, ISurveyResponse} from '@entities/SurveyResponse';
import Survey from "@entities/Survey";
import SurveyDao from "@daos/Survey/SurveyDao.mock";
import {json, text} from "express";


describe('Responses Routes', () => {

    const responsesPath = '/api/responses';
    const addResponsesPath = `${responsesPath}/`;

    const {BAD_REQUEST, CREATED, OK, NOT_FOUND} = StatusCodes;
    let agent: SuperTest<Test>;

    beforeAll((done) => {
        agent = supertest.agent(app);
        done();
    });

    describe(`"POST:${addResponsesPath}"`, () => {

        const callApi = (reqBody: IReqBody) => {
            return agent.post(addResponsesPath).type('form').send(reqBody);
        };

        const responseData = {
            response: new SurveyResponse(
                -1,
                {"questions": [{"question": "What's your favorite number?", "answer": "1"}]}
            ),
        };

        it(`returns a status code of "${CREATED}" if the request was successful.`, (done) => {
            // Setup Spy
            spyOn(ResponseDao.prototype, 'add').and.returnValue(Promise.resolve());
            // Call API
            agent.post(addResponsesPath).type('form').send(responseData)
                .end((err: Error, res: IResponse) => {
                    pErr(err);
                    expect(res.status).toBe(CREATED);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });

        it(`returns a JSON object with an error message of "${paramMissingError}" and a status
            code of "${BAD_REQUEST}" if the response param was missing.`, (done) => {
            // Call API
            callApi({})
                .end((err: Error, res: IResponse) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(paramMissingError);
                    done();
                });
        });

        it(`returns a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {
            // Setup spy
            const errMsg = 'TEST: Could not add response.';
            spyOn(ResponseDao.prototype, 'add').and.throwError(errMsg);
            // Call API
            callApi(responseData)
                .end((err: Error, res: IResponse) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(errMsg);
                    done();
                });
        });
    });

    describe(`"GET:${responsesPath}"`, () => {
        const callApi = () => {
            return agent.get(responsesPath);
        };

        it(`returns a JSON object with all the responses with counts of the answers and a status code of "${OK}" if the
            request was successful.`, (done) => {
            // Setup spy
            const responseSurveyOne: ISurveyResponse = { "id": 77747295293, "content": { "questions": [ { "question": "How likely are you to recommend our product?", "answer": "6" } ] }, "completed": new Date() }
            const responseSurveyTwo: ISurveyResponse = { "id": 77747295293, "content": { "questions": [ { "question": "How likely are you to recommend our product?", "answer": "5" } ] }, "completed": new Date() }

            spyOn(ResponseDao.prototype, 'getAll').and.returnValue(Promise.resolve([responseSurveyOne, responseSurveyTwo, responseSurveyOne]));
            // Call API
            callApi()
                .end((err: Error, res: IResponse) => {
                    pErr(err);
                    expect(res.status).toBe(OK);
                    const respSurveys = JSON.parse(res.text).surveyResults;
                    const answerOne = respSurveys[0].answers[0]
                    const answerTwo = respSurveys[0].answers[1]
                    expect(answerOne).toEqual({ answer: '5', count: 1 });
                    expect(answerTwo).toEqual({ answer: '6', count: 2 });
                    done();
                });
        });

        it(`returns a JSON object containing an error message and a status code of
            "${NOT_FOUND}" if not found data.`, (done) => {
            // Setup spy
            const errMsg = 'Data not found';
            spyOn(ResponseDao.prototype, 'getAll').and.throwError(errMsg)
            // Call API
            callApi()
                .end((err: Error, res: IResponse) => {
                    pErr(err);
                    expect(res.status).toBe(NOT_FOUND);
                    expect(res.body.error).toBe(errMsg);
                    done();
                });
        });
    });
});
