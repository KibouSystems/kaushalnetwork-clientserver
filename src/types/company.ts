export interface Company {
  id: number;
  verified: boolean;
  companyName: string;
  tradeName: string;
  legalName: string;
  companyType: string;
  email: string;
  countryCode: string;
  contactNumber: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  tagline: string | null;
  entityType: string;
  incorporationYear: number;
  registeredOfficeAddress: string;
  websiteUrl: string;
  businessType: string;
  deliverableNames: string;
  sector: string;
  industry: string;
  minEmployeeCount: number;
  maxEmployeeCount: number;
  aboutCompany: string | null;
  aboutFounderAndTeam: string | null;
  expertise: string | null;
}
