export interface SkillDefinition {
  id: string;
  /** Display label shown in the UI. */
  label: string;
  category: "programming" | "data" | "design" | "marketing" | "office" | "soft" | "other";
  /** Alternate spellings/abbreviations to match against, lowercase. */
  aliases: string[];
}

/**
 * A deliberately small, curated dictionary rather than an exhaustive one.
 * Keeping it curated (vs. scraping every possible term) keeps matches
 * meaningful and keeps the bundle tiny. Extend this list as real job
 * postings surface skills that aren't covered yet.
 */
export const SKILL_DICTIONARY: SkillDefinition[] = [
  // Programming / engineering
  { id: "python", label: "Python", category: "programming", aliases: ["python"] },
  { id: "javascript", label: "JavaScript", category: "programming", aliases: ["javascript", "js"] },
  { id: "typescript", label: "TypeScript", category: "programming", aliases: ["typescript", "ts"] },
  { id: "java", label: "Java", category: "programming", aliases: ["java"] },
  { id: "sql", label: "SQL", category: "programming", aliases: ["sql", "mysql", "postgresql", "postgres", "t-sql"] },
  { id: "react", label: "React", category: "programming", aliases: ["react", "reactjs", "react.js"] },
  { id: "node", label: "Node.js", category: "programming", aliases: ["node.js", "nodejs", "node js"] },
  { id: "html-css", label: "HTML/CSS", category: "programming", aliases: ["html", "css", "html5", "css3", "html/css"] },
  { id: "php", label: "PHP", category: "programming", aliases: ["php"] },
  { id: "c-sharp", label: "C#", category: "programming", aliases: ["c#", "c sharp", ".net"] },
  { id: "git", label: "Git", category: "programming", aliases: ["git", "github", "gitlab", "version control"] },
  { id: "api", label: "REST API", category: "programming", aliases: ["rest api", "restful", "api integration"] },

  // Data
  { id: "excel", label: "Excel", category: "data", aliases: ["excel", "microsoft excel", "spreadsheet"] },
  { id: "power-bi", label: "Power BI", category: "data", aliases: ["power bi", "powerbi"] },
  { id: "tableau", label: "Tableau", category: "data", aliases: ["tableau"] },
  { id: "data-visualization", label: "Data Visualization", category: "data", aliases: ["data visualization", "data viz", "visualisasi data"] },
  { id: "data-analysis", label: "Data Analysis", category: "data", aliases: ["data analysis", "analisis data", "data analytics"] },
  { id: "machine-learning", label: "Machine Learning", category: "data", aliases: ["machine learning", "ml"] },
  { id: "statistics", label: "Statistics", category: "data", aliases: ["statistics", "statistik", "statistical analysis"] },

  // Design
  { id: "figma", label: "Figma", category: "design", aliases: ["figma"] },
  { id: "adobe-xd", label: "Adobe XD", category: "design", aliases: ["adobe xd"] },
  { id: "photoshop", label: "Photoshop", category: "design", aliases: ["photoshop"] },
  { id: "ui-ux", label: "UI/UX Design", category: "design", aliases: ["ui/ux", "ui ux", "user experience", "user interface design"] },

  // Marketing
  { id: "seo", label: "SEO", category: "marketing", aliases: ["seo", "search engine optimization"] },
  { id: "social-media", label: "Social Media Marketing", category: "marketing", aliases: ["social media", "social media marketing"] },
  { id: "content-writing", label: "Content Writing", category: "marketing", aliases: ["content writing", "copywriting", "penulisan konten"] },
  { id: "google-ads", label: "Google Ads", category: "marketing", aliases: ["google ads", "adwords"] },
  { id: "digital-marketing", label: "Digital Marketing", category: "marketing", aliases: ["digital marketing", "pemasaran digital"] },

  // Office / general
  { id: "powerpoint", label: "PowerPoint", category: "office", aliases: ["powerpoint", "microsoft powerpoint", "presentation"] },
  { id: "word", label: "Microsoft Word", category: "office", aliases: ["microsoft word", "ms word"] },
  { id: "project-management", label: "Project Management", category: "office", aliases: ["project management", "manajemen proyek"] },

  // Soft skills
  { id: "communication", label: "Communication", category: "soft", aliases: ["communication", "komunikasi"] },
  { id: "teamwork", label: "Teamwork", category: "soft", aliases: ["teamwork", "kerja tim", "collaboration"] },
  { id: "problem-solving", label: "Problem Solving", category: "soft", aliases: ["problem solving", "pemecahan masalah"] },
  { id: "leadership", label: "Leadership", category: "soft", aliases: ["leadership", "kepemimpinan"] },
  { id: "time-management", label: "Time Management", category: "soft", aliases: ["time management", "manajemen waktu"] },
  { id: "analytical-thinking", label: "Analytical Thinking", category: "soft", aliases: ["analytical thinking", "berpikir analitis", "analytical skills"] },
  { id: "adaptability", label: "Adaptability", category: "soft", aliases: ["adaptability", "adaptif"] },
  { id: "attention-to-detail", label: "Attention to Detail", category: "soft", aliases: ["attention to detail", "teliti"] },

  // Languages
  { id: "english", label: "English", category: "other", aliases: ["english", "bahasa inggris"] },
  { id: "mandarin", label: "Mandarin", category: "other", aliases: ["mandarin", "chinese language"] },
];
