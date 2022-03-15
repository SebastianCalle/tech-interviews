import React, {useEffect, useState} from "react";
import {ISurveyResult} from "../entities/SurveyResponse";


const CountResponses = () => {
    const [responseList, setResponseList] = useState<ISurveyResult[]>([]);

    useEffect(() => {
        const loadSurveys = async (): Promise<void> => {
            const response = await fetch(`http://localhost:2047/api/responses/`);
            let data;
            try {
                data = await response.json();
                console.log(data)
            } catch (error) {
                console.error(error);
                data = null;
            }

            if (response.ok) {
                setResponseList(data.surveyResults)
            } else {
                console.error(`API failure: ${response.status}`, data);
            }
        }
        loadSurveys();
    }, []);


    return responseList ? (
        <div>
            <h2>Count Responses</h2>
            <div>
                {responseList.map(s => (
                    <div>
                        <h6>{s.question}</h6>
                        {s.answers?.map(ans => (
                            <div>
                                <span>Answer: {ans.answer} Count:{ans.count}</span>
                            </div>
                        ))}
                        <br/>
                    </div>
                ))}

            </div>
        </div>
    ) : (
        <div>Loading...</div>
    )
}

export default CountResponses;