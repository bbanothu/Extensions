const KEY = 'candidateProfile';

export const defaultProfile = {
  identity: {
    name: '',
    location: '',
    remoteOk: true,
    email: '',
    phone: '',
    github: '',
    linkedin: '',
    portfolio: '',
    workAuthorization: '',
  },
  positioning: {
    targetTitle: '',
    seniority: '',
    yearsExperience: 0,
    jobDescription: '',
    companyContext: '',
    voice: 'metric-heavy',
    pageLimit: 1,
    format: 'ats',
  },
  summary: {
    elaborate: '',
    alwaysInclude: [],
  },
  experience: [],
  skills: [],
  education: [],
  projects: [],
  activities: [],
  controls: {
    keywordAggressiveness: 'moderate',
    rewriteBullets: true,
    reorderByRelevance: true,
    requireMetrics: false,
    bannedWords: ['synergy', 'leveraged', 'spearheaded'],
    maxBulletsPerRole: 3,
  },
};

export function getProfile() {
  return new Promise((resolve) => {
    chrome.storage.local.get(KEY, (items) => {
      resolve(items[KEY] ? { ...defaultProfile, ...items[KEY] } : defaultProfile);
    });
  });
}

export function saveProfile(profile) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [KEY]: profile }, resolve);
  });
}

export const emptyExperience = {
  company: '',
  companyContext: '',
  title: '',
  promotedFrom: '',
  start: '',
  end: '',
  location: '',
  employmentType: 'fulltime',
  teamSize: null,
  mentored: null,
  elaborate: '',
  tech: [],
  metrics: [],
  include: true,
  emphasis: 2,
  pinned: false,
};

export const emptyMetric = { claim: '', value: '', verified: true };

export const emptySkill = {
  name: '',
  category: '',
  proficiency: 'intermediate',
  lastUsed: new Date().getFullYear(),
  tier: 'core',
};

export const emptyEducation = { school: '', degree: '', date: '', include: true };

export const emptyProject = { name: '', elaborate: '', tech: [], url: '', include: false };

export const emptyActivity = { text: '', include: true };

export function serializeProfile(profile) {
  const lines = [];
  const { identity, positioning, summary } = profile;

  lines.push(identity.name || 'Candidate');
  lines.push(
    [
      identity.location,
      identity.email,
      identity.phone,
      identity.github,
      identity.linkedin,
      identity.portfolio,
    ]
      .filter(Boolean)
      .join(' · '),
  );
  if (identity.workAuthorization) lines.push(`Work authorization: ${identity.workAuthorization}`);
  if (positioning.targetTitle)
    lines.push(
      `\nTarget role: ${positioning.targetTitle}${positioning.seniority ? ` (${positioning.seniority})` : ''}`,
    );
  if (summary.elaborate) lines.push(`\nSummary:\n${summary.elaborate}`);

  const experience = (profile.experience || []).filter((e) => e.include !== false);
  if (experience.length) {
    lines.push('\nExperience:');
    for (const e of experience) {
      lines.push(
        `\n${e.title || ''} — ${e.company || ''}${e.companyContext ? ` (${e.companyContext})` : ''}`,
      );
      lines.push(`${e.start || ''} – ${e.end || ''}${e.location ? `, ${e.location}` : ''}`);
      if (e.elaborate) lines.push(e.elaborate);
      if (e.tech?.length) lines.push(`Tech: ${e.tech.join(', ')}`);
      for (const m of e.metrics || []) {
        if (m.claim) lines.push(`- ${m.claim}${m.value ? `: ${m.value}` : ''}`);
      }
    }
  }

  const skills = (profile.skills || []).filter((s) => s.name);
  if (skills.length) {
    lines.push('\nSkills:');
    lines.push(skills.map((s) => s.name).join(', '));
  }

  const education = (profile.education || []).filter((e) => e.include !== false && e.school);
  if (education.length) {
    lines.push('\nEducation:');
    for (const e of education)
      lines.push(`${e.degree || ''}, ${e.school || ''}${e.date ? ` (${e.date})` : ''}`);
  }

  const projects = (profile.projects || []).filter((p) => p.include !== false && p.name);
  if (projects.length) {
    lines.push('\nProjects:');
    for (const p of projects) lines.push(`${p.name}${p.elaborate ? `: ${p.elaborate}` : ''}`);
  }

  const activities = (profile.activities || []).filter((a) => a.include !== false && a.text);
  if (activities.length) {
    lines.push('\nActivities:');
    lines.push(activities.map((a) => a.text).join(', '));
  }

  return lines.join('\n');
}
