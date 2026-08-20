import { createLegalPage } from "@/lib/i18n/legal-page";

const page = createLegalPage("privacy");

export const dynamic = "force-dynamic";
export const generateMetadata = page.generateMetadata;
export default page.Page;
