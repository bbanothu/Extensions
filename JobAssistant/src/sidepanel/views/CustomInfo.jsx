import { useEffect, useState } from 'react';
import {
  defaultProfile,
  getProfile,
  saveProfile,
  emptyExperience,
  emptyMetric,
  emptySkill,
  emptyEducation,
  emptyProject,
  emptyActivity,
} from '../../lib/profile.js';
import ProfileField from '../components/ProfileField.jsx';
import RepeatingSection from '../components/RepeatingSection.jsx';

const IDENTITY_FIELDS = [
  { key: 'name', label: 'Full Name', type: 'text', autoComplete: 'name' },
  { key: 'location', label: 'Location', type: 'text', autoComplete: 'address-level2' },
  { key: 'remoteOk', label: 'Willing to relocate / remote', type: 'checkbox' },
  { key: 'email', label: 'Email', type: 'text', inputType: 'email', autoComplete: 'email' },
  { key: 'phone', label: 'Phone', type: 'text', inputType: 'tel', autoComplete: 'tel' },
  { key: 'github', label: 'GitHub', type: 'text', inputType: 'url', autoComplete: 'url' },
  { key: 'linkedin', label: 'LinkedIn', type: 'text', inputType: 'url', autoComplete: 'url' },
  {
    key: 'portfolio',
    label: 'Portfolio URL',
    type: 'text',
    inputType: 'url',
    autoComplete: 'url',
  },
  { key: 'workAuthorization', label: 'Work Authorization (optional)', type: 'text' },
];

const POSITIONING_FIELDS = [
  { key: 'targetTitle', label: 'Target Role Title', type: 'text' },
  { key: 'seniority', label: 'Seniority', type: 'text' },
  { key: 'yearsExperience', label: 'Years of Experience', type: 'number' },
  { key: 'jobDescription', label: 'Job Description (paste)', type: 'textarea' },
  { key: 'companyContext', label: 'Company "About" Blurb (optional)', type: 'textarea' },
  {
    key: 'voice',
    label: 'Voice',
    type: 'select',
    options: ['understated', 'metric-heavy', 'product-focused'],
  },
  { key: 'pageLimit', label: 'Page Limit', type: 'number' },
  { key: 'format', label: 'Format', type: 'select', options: ['ats', 'designed'] },
];

const SUMMARY_FIELDS = [
  {
    key: 'elaborate',
    label: "Elaborate — who you are, what you're good at, what you want next",
    type: 'textarea',
  },
  { key: 'alwaysInclude', label: 'Always Include (comma-separated)', type: 'tags' },
];

const METRIC_FIELDS = [
  { key: 'claim', label: 'Claim', type: 'text' },
  { key: 'value', label: 'Value', type: 'text' },
  { key: 'verified', label: 'Verified', type: 'checkbox' },
];

const EXPERIENCE_FIELDS = [
  { key: 'company', label: 'Company', type: 'text' },
  { key: 'companyContext', label: 'Company Context (e.g. "Series A, ~10 people")', type: 'text' },
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'promotedFrom', label: 'Promoted From (optional)', type: 'text' },
  { key: 'start', label: 'Start Date', type: 'text' },
  { key: 'end', label: 'End Date', type: 'text' },
  { key: 'location', label: 'Location', type: 'text', autoComplete: 'address-level2' },
  {
    key: 'employmentType',
    label: 'Employment Type',
    type: 'select',
    options: ['fulltime', 'contract', 'founding', 'freelance', 'intern'],
  },
  { key: 'teamSize', label: 'Team Size', type: 'number' },
  { key: 'mentored', label: 'Mentored (count)', type: 'number' },
  {
    key: 'elaborate',
    label: 'Elaborate — brain dump, everything you did, unpolished',
    type: 'textarea',
  },
  { key: 'tech', label: 'Tech Used (comma-separated)', type: 'tags' },
  {
    key: 'metrics',
    label: 'Metrics Bank',
    type: 'repeating',
    fields: METRIC_FIELDS,
    emptyItem: emptyMetric,
  },
  { key: 'include', label: 'Include in resume', type: 'checkbox' },
  { key: 'emphasis', label: 'Emphasis (0-3)', type: 'number' },
  { key: 'pinned', label: 'Always Pin', type: 'checkbox' },
];

const SKILL_FIELDS = [
  { key: 'name', label: 'Skill', type: 'text' },
  { key: 'category', label: 'Category', type: 'text' },
  {
    key: 'proficiency',
    label: 'Proficiency',
    type: 'select',
    options: ['beginner', 'intermediate', 'advanced', 'expert'],
  },
  { key: 'lastUsed', label: 'Last Used (year)', type: 'number' },
  { key: 'tier', label: 'Tier', type: 'select', options: ['core', 'secondary', 'long-tail'] },
];

const EDUCATION_FIELDS = [
  { key: 'school', label: 'School', type: 'text' },
  { key: 'degree', label: 'Degree', type: 'text' },
  { key: 'date', label: 'Date', type: 'text' },
  { key: 'include', label: 'Include', type: 'checkbox' },
];

const PROJECT_FIELDS = [
  { key: 'name', label: 'Project Name', type: 'text' },
  { key: 'elaborate', label: 'Elaborate', type: 'textarea' },
  { key: 'tech', label: 'Tech (comma-separated)', type: 'tags' },
  { key: 'url', label: 'URL', type: 'text', inputType: 'url', autoComplete: 'url' },
  { key: 'include', label: 'Include', type: 'checkbox' },
];

const ACTIVITY_FIELDS = [
  { key: 'text', label: 'Text', type: 'text' },
  { key: 'include', label: 'Include', type: 'checkbox' },
];

const CONTROLS_FIELDS = [
  {
    key: 'keywordAggressiveness',
    label: 'Keyword Aggressiveness',
    type: 'select',
    options: ['mirror-jd', 'moderate', 'own-voice'],
  },
  { key: 'rewriteBullets', label: 'Rewrite Bullets', type: 'checkbox' },
  { key: 'reorderByRelevance', label: 'Reorder Sections by Relevance', type: 'checkbox' },
  { key: 'requireMetrics', label: 'Require a Metric in Every Bullet', type: 'checkbox' },
  { key: 'bannedWords', label: 'Banned Words (comma-separated)', type: 'tags' },
  { key: 'maxBulletsPerRole', label: 'Max Bullets per Role', type: 'number' },
];

function Section({ title, subtitle, children, defaultOpen }) {
  return (
    <details className="card" open={defaultOpen} style={{ padding: 0 }}>
      <summary
        style={{ padding: 18, cursor: 'pointer', fontWeight: 700, fontSize: 17, listStyle: 'none' }}
      >
        {title}
        {subtitle && (
          <div className="muted small" style={{ fontWeight: 400, marginTop: 4 }}>
            {subtitle}
          </div>
        )}
      </summary>
      <div style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {children}
      </div>
    </details>
  );
}

function FieldGroup({ fields, data, onChange }) {
  return fields.map((f) => (
    <ProfileField key={f.key} field={f} value={data[f.key]} onChange={(v) => onChange(f.key, v)} />
  ));
}

export default function CustomInfo() {
  const [profile, setProfile] = useState(defaultProfile);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getProfile().then(setProfile);
  }, []);

  function set(section, key, value) {
    setProfile((prev) => ({ ...prev, [section]: { ...prev[section], [key]: value } }));
    setSaved(false);
  }

  function setList(key, value) {
    setProfile((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function save() {
    await saveProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <p className="muted small" style={{ margin: 0 }}>
        Fill in as much or as little as you like. This is saved locally and will power tailored
        resume generation from your own data — not just a URL — in a future update.
      </p>

      <Section title="Identity" defaultOpen>
        <FieldGroup
          fields={IDENTITY_FIELDS}
          data={profile.identity}
          onChange={(k, v) => set('identity', k, v)}
        />
      </Section>

      <Section title="Positioning" subtitle="The tuning layer — target role, JD, voice">
        <FieldGroup
          fields={POSITIONING_FIELDS}
          data={profile.positioning}
          onChange={(k, v) => set('positioning', k, v)}
        />
      </Section>

      <Section title="Summary">
        <FieldGroup
          fields={SUMMARY_FIELDS}
          data={profile.summary}
          onChange={(k, v) => set('summary', k, v)}
        />
      </Section>

      <Section title={`Experience (${profile.experience.length})`}>
        <RepeatingSection
          items={profile.experience}
          onChange={(v) => setList('experience', v)}
          fields={EXPERIENCE_FIELDS}
          emptyItem={emptyExperience}
          itemLabel={(item, i) => item.company || item.title || `Role #${i + 1}`}
        />
      </Section>

      <Section title={`Skills (${profile.skills.length})`}>
        <RepeatingSection
          items={profile.skills}
          onChange={(v) => setList('skills', v)}
          fields={SKILL_FIELDS}
          emptyItem={emptySkill}
          itemLabel={(item, i) => item.name || `Skill #${i + 1}`}
        />
      </Section>

      <Section title={`Education (${profile.education.length})`}>
        <RepeatingSection
          items={profile.education}
          onChange={(v) => setList('education', v)}
          fields={EDUCATION_FIELDS}
          emptyItem={emptyEducation}
          itemLabel={(item, i) => item.school || `School #${i + 1}`}
        />
      </Section>

      <Section title={`Projects (${profile.projects.length})`}>
        <RepeatingSection
          items={profile.projects}
          onChange={(v) => setList('projects', v)}
          fields={PROJECT_FIELDS}
          emptyItem={emptyProject}
          itemLabel={(item, i) => item.name || `Project #${i + 1}`}
        />
      </Section>

      <Section title={`Activities (${profile.activities.length})`}>
        <RepeatingSection
          items={profile.activities}
          onChange={(v) => setList('activities', v)}
          fields={ACTIVITY_FIELDS}
          emptyItem={emptyActivity}
          itemLabel={(item, i) => item.text || `Activity #${i + 1}`}
        />
      </Section>

      <Section title="Generation Controls">
        <FieldGroup
          fields={CONTROLS_FIELDS}
          data={profile.controls}
          onChange={(k, v) => set('controls', k, v)}
        />
      </Section>

      <button className="btn btn-primary" onClick={save}>
        {saved ? 'Saved ✓' : 'Save Profile'}
      </button>
    </div>
  );
}
