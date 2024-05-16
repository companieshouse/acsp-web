import { NextFunction, Request, Response } from "express";
import { selectLang, getLocalesService, getLocaleInfo, addLangToUrl } from "../../../utils/localise";
import * as config from "../../../config";
import { AML_MEMBERSHIP_NUMBER, BASE_URL, CHECK_YOUR_ANSWERS, AML_BODY_DETAILS_CONFIRM, CONFIRMATION } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { ACSPData } from "../../../model/ACSPData";
import { ANSWER_DATA, SUBMISSION_ID, USER_DATA } from "../../../common/__utils/constants";
import { Answers } from "../../../model/Answers";
import { closeTransaction } from "../../../services/transactions/transaction_service";
import { ApiResponse } from "@companieshouse/api-sdk-node/dist/services/resource";
import { Payment } from "@companieshouse/api-sdk-node/dist/services/payment";
import { startPaymentsSession } from "../../../services/paymentService";
import { createAndLogError } from "../../../utils/logger";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const acspData: ACSPData = session.getExtraData(USER_DATA)!;
    const detailsAnswers: Answers = session.getExtraData(ANSWER_DATA)!;
    const amlDetails = new Map<string, string>();
    amlDetails.set("Association of Chartered Certified Accountants (ACCA)", "12345678");
    amlDetails.set("Chartered Institute of Legal Executives (CILEx)", "08297534784635");
    amlDetails.set("HMRC", "859324768974385634858");
    res.render(config.CHECK_YOUR_ANSWERS, {
        title: "Check your answers before sending your application",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + CHECK_YOUR_ANSWERS,
        previousPage: addLangToUrl(BASE_URL + AML_BODY_DETAILS_CONFIRM, lang),
        editAML: addLangToUrl(BASE_URL + AML_MEMBERSHIP_NUMBER, lang),
        typeOfBusiness: acspData.typeOfBusiness,
        detailsAnswers,
        lang,
        amlDetails
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const session: Session = req.session as any as Session;
        const transactionId: string = session.getExtraData(SUBMISSION_ID)!;
        const paymentUrl: string | undefined = await closeTransaction(session, transactionId);

        if (!paymentUrl) {
            return res.redirect(addLangToUrl(BASE_URL + CONFIRMATION, lang));
        } else {
            const paymentResponse: ApiResponse<Payment> = await startPaymentsSession(session, paymentUrl,
                transactionId);

            if (!paymentResponse.resource) {
                return next(createAndLogError("No resource in payment response"));
            }

            res.redirect(paymentResponse.resource.links.journey);
        }

    } catch (error) {
        next(error);
    }
};
