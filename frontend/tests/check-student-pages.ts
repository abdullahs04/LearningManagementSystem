import { execSync } from 'child_process';

const filesToCheck = [
  'src/pages/student-specific/AttendanceRecords.tsx',
  'src/pages/student-specific/Feedback.tsx',
  'src/pages/student-specific/Grades.tsx',
  'src/pages/student-specific/Overview.tsx',
  'src/pages/student-specific/TimeTable.tsx',
];

try {
  console.log('🔍 Checking TypeScript errors in student-specific pages...\n');

  const result = execSync(
    `npx tsc --noEmit ${filesToCheck.join(' ')}`,
    { stdio: 'pipe' }
  ).toString();

  console.log('✅ No TypeScript errors found.\n');
} catch (err: any) {
  console.error('❌ TypeScript errors detected:\n');
  console.error(err.stdout.toString());
  process.exit(1);
}

