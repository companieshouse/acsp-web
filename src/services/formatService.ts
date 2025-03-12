import { Address } from "../model/Address";

export class FormatService {

    public static findDocumentName (
        document: string | undefined,
        i18n: any
    ): string {
        if (!document || document.length === 0) {
            return "";
        }
        return FormatService.getDocumentName(document, i18n);
    }

    private static getDocumentName (document: string, i18n: any): string {
        const documentMapping: { [key: string]: string } = {
            passport: i18n.biometricPassport,
            irish_passport_card: i18n.irishPassport,
            UK_or_EU_driving_licence: i18n.ukDriversLicence,
            EEA_identity_card: i18n.identityCard,
            UK_biometric_residence_permit: i18n.biometricPermit,
            UK_biometric_residence_card: i18n.biometricCard,
            UK_frontier_worker_permit: i18n.frontierPermit,
            UK_PASS_card: i18n.passCard,
            UK_or_EU_digital_tachograph_card: i18n.ukEuDigitalCard,
            UK_HM_forces_card: i18n.ukForceCard,
            UK_HM_veteran_card: i18n.ukArmedForceCard,
            work_permit_photo_id: i18n.photoWorkPermit,
            immigration_document_photo_id: i18n.photoimmigrationDoc,
            visa_photo_id: i18n.photoVisa,
            UK_firearms_licence: i18n.ukFirearmsLicence,
            PRADO_supported_photo_id: i18n.photoIdPrado,
            birth_certificate: i18n.birthCert,
            marriage_certificate: i18n.marriageCert,
            immigration_document_non_photo_id: i18n.noPhotoimmigrationDoc,
            visa_non_photo_id: i18n.noPhotoVisa,
            work_permit_non_photo_id: i18n.noPhotoWorkPermit,
            bank_statement: i18n.bankStatement,
            rental_agreement: i18n.rentalAgreement,
            mortgage_statement: i18n.morgageStatement,
            UK_council_tax_statement: i18n.taxStatement,
            utility_bill: i18n.utilityBill
        };
        return documentMapping[document] ? documentMapping[document] : document;
    }
}
