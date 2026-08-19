import type { InterviewQuestion, TrackDefinition, PracticeTrack } from "../types/interview";

export const TRACKS: TrackDefinition[] = [
  {
    id: "general",
    label: "General (any role)",
    description: "Common questions that come up in almost every interview.",
  },
  {
    id: "fresh-graduate",
    label: "Fresh Graduate / Entry-level",
    description: "For candidates with little or no full-time work experience.",
  },
  {
    id: "software-engineer",
    label: "Software Engineer",
    description: "For frontend, backend, or full-stack developer roles.",
  },
  {
    id: "data-analyst",
    label: "Data / Analyst",
    description: "For data analyst, reporting, or research-adjacent roles.",
  },
  {
    id: "ai-engineer",
    label: "AI Engineer",
    description: "For machine learning, AI/ML engineer, or applied data science roles.",
  },
  {
    id: "technician",
    label: "Technician",
    description: "For IT support, field technician, hardware, or maintenance roles.",
  },
  {
    id: "admin",
    label: "Admin / Office Support",
    description: "For admin, HR admin, purchasing admin, and general office roles.",
  },
  {
    id: "customer-service",
    label: "Customer Service",
    description: "For customer support, front office, or client-facing roles.",
  },
];

/**
 * A deliberately curated question bank rather than an exhaustive one — see
 * the same rationale as src/data/skills.ts. "all" means the question shows
 * up regardless of which track the user picks; role-specific questions are
 * tagged to the track(s) they apply to.
 */
export const QUESTION_BANK: InterviewQuestion[] = [
  // General / motivation — shown for every track
  {
    id: "tell-me-about-yourself",
    question: "Tell me about yourself.",
    category: "general",
    tip: "Keep it to 3 parts: a one-line summary of who you are professionally, your most relevant experience or study background, and why you're interested in this role. Aim for under 90 seconds.",
    tracks: "all",
  },
  {
    id: "why-this-role",
    question: "Why do you want this position?",
    category: "general",
    tip: "Connect something specific about the role or company to something specific about you — avoid generic answers like 'I need a job' or 'it's a good company.'",
    tracks: "all",
  },
  {
    id: "strengths-weaknesses",
    question: "What are your strengths and weaknesses?",
    category: "general",
    tip: "Pick a strength that's actually relevant to the job. For the weakness, name something real and briefly mention what you're doing to improve it — avoid disguised strengths like 'I work too hard.'",
    tracks: "all",
  },
  {
    id: "where-in-5-years",
    question: "Where do you see yourself in five years?",
    category: "general",
    tip: "Show ambition that's realistic and connected to this role or company — not a completely different career path.",
    tracks: "all",
  },
  {
    id: "why-should-we-hire-you",
    question: "Why should we hire you?",
    category: "general",
    tip: "Summarize 2-3 concrete things you bring that match what the job needs. Specific beats general — 'I'm organized' is weaker than 'I managed X while juggling Y.'",
    tracks: "all",
  },
  {
    id: "questions-for-us",
    question: "Do you have any questions for us?",
    category: "general",
    tip: "Always have at least one ready. Good options: what does success look like in this role after 3 months, or what's the team's biggest current challenge. Avoid asking about salary this early.",
    tracks: "all",
  },

  // Behavioral (STAR) — shown for every track
  {
    id: "conflict-with-coworker",
    question: "Describe a time you had a disagreement or conflict with a coworker.",
    category: "behavioral",
    tip: "Use STAR: Situation, Task, Action, Result. Focus on how you handled it professionally, not on who was 'right.'",
    tracks: "all",
  },
  {
    id: "missed-deadline",
    question: "Tell me about a time you missed a deadline or made a mistake.",
    category: "behavioral",
    tip: "Own the mistake honestly, then pivot quickly to what you learned or changed afterward. Don't blame others.",
    tracks: "all",
  },
  {
    id: "worked-in-team",
    question: "Describe a time you worked as part of a team to get something done.",
    category: "behavioral",
    tip: "Be specific about your individual contribution, not just what 'the team' did.",
    tracks: "all",
  },
  {
    id: "took-initiative",
    question: "Tell me about a time you took initiative without being asked.",
    category: "behavioral",
    tip: "A small, real example (improving a process, spotting an error) works better than an exaggerated one.",
    tracks: "all",
  },
  {
    id: "handled-pressure",
    question: "Describe a time you had to work under pressure or a tight deadline.",
    category: "behavioral",
    tip: "Show your process for staying organized under pressure, not just that you 'stayed calm.'",
    tracks: "all",
  },

  // Situational — shown for every track
  {
    id: "disagree-with-manager",
    question: "What would you do if you disagreed with a decision your manager made?",
    category: "situational",
    tip: "Show that you'd raise it respectfully and privately, with a reason — then support the final decision once it's made.",
    tracks: "all",
  },
  {
    id: "multiple-urgent-tasks",
    question: "How would you prioritize if you were given several urgent tasks at once?",
    category: "situational",
    tip: "Mention a concrete method: clarifying deadlines/impact with whoever assigned the tasks, then sequencing by urgency and importance.",
    tracks: "all",
  },
  {
    id: "dont-know-how",
    question: "What would you do if you were asked to do something you didn't know how to do yet?",
    category: "situational",
    tip: "Show a practical approach: ask clarifying questions, look for existing documentation, then ask for help if still stuck — rather than guessing silently.",
    tracks: "all",
  },

  // Fresh graduate
  {
    id: "no-work-experience",
    question: "You don't have much work experience — why should we consider you?",
    category: "role-specific",
    tip: "Translate academic projects, organizations, part-time work, or volunteering into transferable skills the employer actually needs.",
    tracks: ["fresh-graduate"],
  },
  {
    id: "biggest-achievement-school",
    question: "What's your biggest achievement during your studies or in an organization?",
    category: "role-specific",
    tip: "Pick one specific achievement and quantify it if you can (numbers, scale, outcome), rather than listing several vaguely.",
    tracks: ["fresh-graduate"],
  },
  {
    id: "learn-quickly",
    question: "How do you plan to get up to speed quickly in a role you're new to?",
    category: "role-specific",
    tip: "Mention a concrete learning habit — taking notes, asking questions early, documenting what you learn — not just 'I'm a fast learner.'",
    tracks: ["fresh-graduate"],
  },

  // Admin / office support
  {
    id: "stay-organized",
    question: "How do you stay organized when handling multiple administrative tasks?",
    category: "role-specific",
    tip: "Mention a real system — a checklist, calendar reminders, a tracking sheet — rather than just saying 'I'm organized.'",
    tracks: ["admin"],
  },
  {
    id: "confidential-info",
    question: "How would you handle sensitive or confidential information in this role?",
    category: "role-specific",
    tip: "Emphasize discretion, following procedure, and only sharing information with people who are authorized to see it.",
    tracks: ["admin"],
  },
  {
    id: "office-software",
    question: "What's your experience with office software like Excel, Word, or scheduling tools?",
    category: "role-specific",
    tip: "Name the specific tools and give one concrete example of a task you used them for, even from school or personal projects.",
    tracks: ["admin"],
  },
  {
    id: "repetitive-tasks",
    question: "How do you stay accurate and motivated with repetitive tasks like data entry or filing?",
    category: "role-specific",
    tip: "Mention how you double-check your own work and any small habits that help you avoid errors over long stretches.",
    tracks: ["admin"],
  },

  // Data / analyst
  {
    id: "walk-through-project",
    question: "Walk me through a data analysis project you've worked on.",
    category: "role-specific",
    tip: "Structure it as: the question you were answering, the data/tools you used, what you found, and what happened as a result.",
    tracks: ["data-analyst"],
  },
  {
    id: "ensure-accuracy",
    question: "How do you make sure your data or analysis is accurate?",
    category: "role-specific",
    tip: "Mention specific habits — cross-checking totals, sanity-checking against known numbers, documenting assumptions.",
    tracks: ["data-analyst"],
  },
  {
    id: "explain-to-nontechnical",
    question: "How would you explain a technical finding to someone non-technical?",
    category: "role-specific",
    tip: "Give a real or hypothetical example, focusing on the takeaway/decision rather than the method.",
    tracks: ["data-analyst"],
  },

  // Software Engineer
  {
    id: "walk-through-code-project",
    question: "Walk me through a project you've built and the technical decisions behind it.",
    category: "role-specific",
    tip: "Cover the problem, your stack choices and why, one challenge you hit, and the outcome. Avoid a feature-by-feature list — focus on decisions.",
    tracks: ["software-engineer"],
  },
  {
    id: "debug-approach",
    question: "How do you approach debugging an issue you've never seen before?",
    category: "role-specific",
    tip: "Describe a real process: reproduce it, narrow down where it breaks, check recent changes/logs, form a hypothesis before guessing at fixes.",
    tracks: ["software-engineer"],
  },
  {
    id: "code-review-feedback",
    question: "How do you handle receiving critical feedback on a code review?",
    category: "role-specific",
    tip: "Show you separate the feedback from your ego — ask clarifying questions, weigh the trade-off being raised, and use it to improve rather than getting defensive.",
    tracks: ["software-engineer"],
  },
  {
    id: "keep-up-with-tech",
    question: "How do you keep your technical skills up to date?",
    category: "role-specific",
    tip: "Name concrete habits (side projects, docs, specific communities/newsletters) rather than a vague 'I read a lot.'",
    tracks: ["software-engineer"],
  },

  // AI Engineer
  {
    id: "explain-ml-project",
    question: "Walk me through a machine learning project you've worked on, end to end.",
    category: "role-specific",
    tip: "Cover the problem framing, data, model choice and why, evaluation metric, and what happened when it was used — not just the model architecture.",
    tracks: ["ai-engineer"],
  },
  {
    id: "model-not-performing",
    question: "What would you do if a model performed well in testing but poorly in production?",
    category: "role-specific",
    tip: "Mention checking for data drift, a train/serve skew, or a mismatch between the offline metric and the real-world objective — not just 'retrain it.'",
    tracks: ["ai-engineer"],
  },
  {
    id: "explain-model-to-nontechnical",
    question: "How would you explain how a model works to a non-technical stakeholder?",
    category: "role-specific",
    tip: "Focus on inputs, outputs, and what the model is optimizing for in plain language — skip the math unless asked.",
    tracks: ["ai-engineer"],
  },
  {
    id: "responsible-ai",
    question: "How do you think about fairness or risk when building a model that affects real people?",
    category: "role-specific",
    tip: "Show awareness of checking training data for bias, considering failure cases, and knowing when a human should stay in the loop.",
    tracks: ["ai-engineer"],
  },

  // Technician
  {
    id: "diagnose-hardware-issue",
    question: "Walk me through how you'd diagnose a piece of equipment that's not working.",
    category: "role-specific",
    tip: "Describe a systematic process: check the obvious/common causes first, isolate the component, verify with a test, then escalate if needed.",
    tracks: ["technician"],
  },
  {
    id: "safety-procedure",
    question: "How do you make sure you follow safety procedures, even under time pressure?",
    category: "role-specific",
    tip: "Emphasize that shortcuts on safety aren't worth the risk, and mention any checklist or protocol habit you rely on.",
    tracks: ["technician"],
  },
  {
    id: "explain-issue-to-customer",
    question: "How would you explain a technical problem to a customer or non-technical coworker?",
    category: "role-specific",
    tip: "Focus on plain language and what it means for them (cost, timeline, impact) rather than technical jargon.",
    tracks: ["technician"],
  },

  // Customer service
  {
    id: "angry-customer",
    question: "How do you handle an upset or angry customer?",
    category: "role-specific",
    tip: "Show a calm process: listen fully, acknowledge the frustration, then move to solving the actual problem.",
    tracks: ["customer-service"],
  },
  {
    id: "went-above-and-beyond",
    question: "Tell me about a time you went above and beyond for a customer.",
    category: "role-specific",
    tip: "Pick one specific, real example rather than a general statement about caring about customers.",
    tracks: ["customer-service"],
  },
  {
    id: "high-volume",
    question: "How do you stay effective when handling a high volume of requests or calls?",
    category: "role-specific",
    tip: "Mention prioritization and pacing — not just 'I work fast' — and how you keep quality from dropping under volume.",
    tracks: ["customer-service"],
  },
];

export function getQuestionsForTrack(track: PracticeTrack): InterviewQuestion[] {
  return QUESTION_BANK.filter((q) => q.tracks === "all" || q.tracks.includes(track));
}
