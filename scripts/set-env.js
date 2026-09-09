const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/environments/environment.ts');

const content = `export const environment = {
  production: true,
  SUPABASE_URL: '${process.env.SUPABASE_URL}',
  SUPABASE_KEY: '${process.env.SUPABASE_ANON_KEY}',
};
`;

fs.mkdirSync(path.dirname(targetPath), { recursive: true });
fs.writeFileSync(targetPath, content);