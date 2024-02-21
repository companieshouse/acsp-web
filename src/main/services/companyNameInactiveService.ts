export class CompanyNameService {
    private companyName: string | null = null;

    constructor () {
        this.initialize();
    }

    private async initialize (): Promise<void> {
        try {
            this.companyName = await this.getCompanyNameFromSession();
        } catch (error) {
            console.error("Error during initialization:", error);
        }
    }

    public getCompanyName (): string {
        return this.companyName || "Default Company Name";
    }

    private async getCompanyNameFromSession (): Promise<string> {
        return new Promise<string>((resolve) => {
            setTimeout(() => {
                resolve("MORRIS ACCOUNTING LTD");
            }, 1000);
        });
    }
}
