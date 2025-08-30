export interface CVData {
	metadata: Metadata;
	certificates: Certificate[];
	//education: Education[];
	projects: Project[];
	otherProjects: Project[];
	publications: Publication[];
	bibliography: Bibliography;
	skills: Skill[];
	//others: Other[];
}

export type Certificate = CVHonor;
export type Project = CVEntry;
export type Publication = CVEntry;
export type Skill = CVSkill;
//export type Other = CVEntry;

export interface CVHonor {
	date: string;
	title: string;
	issuer: string;
	url: string;
	location: string;
}

export interface CVSkill {
	type: string;
	info: string[];
}

export interface CVEntry {
	title: string;
	type: string;
	engine: string;
	date: string;
	location: string | Location;
	description: string[];
	preview: string;
	logo: string;
	tags: string[];
}

export interface Metadata {
	firstName: string;
	lastName: string;
	headerQuote: string[];
	awesomeColor: string;
	profilePhoto: string;
	varLanguage: string;
	varEntryEngineFirst: boolean;
	varDisplayLogo: boolean;
	cvFooter: string;
	letterFooter: string;
	personalInfo: PersonalInfo;
}

export interface PersonalInfo {
	github: string;
	phone: string;
	email: string;
	linkedin: string;
	homepage: string;
	orcid: string;
}

export interface Location {
	github?: string;
}

export interface Bibliography {
	bibPath: string;
	refStyle: string;
}
