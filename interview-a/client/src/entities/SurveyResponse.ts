interface IQuestion {
    question: string;
    answer: string;
}
interface IContent {
    questions: IQuestion[]
}
export interface ISurveyResponse {
    id: number;
    content: IContent;
}

export interface IAnswerCount {
    answer?: string;
    count?: number;
}

export interface ISurveyResult {
    question?: string;
    answers?: IAnswerCount[]
}

class SurveyResponse implements ISurveyResponse {

    public id: number;
    public content: IContent;

    constructor(idOrResponse: number | ISurveyResponse, content?: IContent) {
        if (typeof idOrResponse === 'number') {
            this.id = idOrResponse || -1;
            this.content = content || {"questions":[]};
        } else {
            this.content = idOrResponse.content;
            this.id = idOrResponse.id;
        }
    }
}

export default SurveyResponse;
