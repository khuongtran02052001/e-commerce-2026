import { execSync } from 'node:child_process';

function run(cmd) {
  return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

const diff = run('git diff --staged');
if (!diff) {
  console.error('No staged changes. Stage files first.');
  process.exit(1);
}

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('Missing OPENAI_API_KEY env var.');
  process.exit(1);
}

const prompt = `Write a concise Conventional Commit message (type(scope): subject).
Rules:
- Subject <= 72 chars, imperative mood
- If needed add short body bullet points
Diff:
${diff}`;

const res = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You write excellent git commit messages.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.2,
  }),
});

if (!res.ok) {
  console.error(await res.text());
  process.exit(1);
}

const data = await res.json();
const msg = data.choices?.[0]?.message?.content?.trim();
if (!msg) {
  console.error('No message returned.');
  process.exit(1);
}

console.log(msg);
