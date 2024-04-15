import { Session } from "@companieshouse/node-session-handler";
import { Request } from "express";
import { ANSWER_DATA } from "../common/__utils/constants";
import { saveDataInSession } from "main/common/__utils/sessionHelper";

interface AnswerData {
    key: { text: string},
    value: { text: string},
    actions?: object
}

export const addToCheckAnswers = (req: Request, keyText: string, valueText: string, linkRef?: string): void => {
    const session: Session = req.session as any as Session;
    const answersArray: AnswerData[] = session.getExtraData(ANSWER_DATA)!;

    // Check to see if user has gone back to update answer
    const duplicateAnswer = answersArray.find(object => object.key.text === keyText);

    // First entry for the answer
    if (duplicateAnswer === undefined) {
        let answerData: AnswerData;
        if (linkRef !== undefined) {
            answerData = {
                key: {
                    text: keyText
                },
                value: {
                    text: valueText
                },
                actions: {
                    items: [
                        {
                            href: linkRef,
                            text: "Change",
                            visuallyHiddenText: keyText
                        }
                    ]
                }
            };
        } else {
            answerData = {
                key: {
                    text: keyText
                },
                value: {
                    text: valueText
                }
            };
        }

        answersArray.push(answerData);
    } else {
        // Updating the answer if user has gone back to update it
        const duplicateIndex = answersArray.findIndex(object => object.key.text === keyText);
        duplicateAnswer.value.text = valueText;
        answersArray[duplicateIndex] = duplicateAnswer;
    }

    saveDataInSession(req, ANSWER_DATA, answersArray);

};
