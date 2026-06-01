import { copyFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

async function copyStyles() {
  const src = join('src', 'styles');
  const dest = join('build', 'src', 'styles');
  const files = [
    'theme.css',
    'tokens.css',
  ];
  await mkdir(dest, { recursive: true });
  await Promise.all(
    files.map(async (name) => {
      const destFile = join(dest, name);
      await copyFile(join(src, name), destFile);
    })
  );
}

await copyStyles();
