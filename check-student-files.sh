#!/bin/bash

# Script to check specific student files for TypeScript errors
# Ignoring specific configuration warnings

echo "Checking student-specific files for errors..."

cd frontend || { echo "Error: frontend directory not found"; exit 1; }

FILES_TO_CHECK=(
  "src/pages/student-specific/AttendanceRecords.tsx"
  "src/pages/student-specific/Feedback.tsx"
  "src/pages/student-specific/Grades.tsx"
  "src/pages/student-specific/Overview.tsx"
  "src/pages/student-specific/TimeTable.tsx"
)

ERROR_FOUND=0
ERROR_LIST=""

for file in "${FILES_TO_CHECK[@]}"; do
  if [ -f "$file" ]; then
    echo "Checking $file..."
    # Run TypeScript check on each file individually and filter out specific errors
    ERROR_OUTPUT=$(npx tsc --noEmit "$file" 2>&1 | \
      grep -v "Cannot use JSX unless the '--jsx' flag is provided" | \
      grep -v "but '--jsx' is not set" | \
      grep -v "Type 'Set<string>' can only be iterated through when using the '--downlevelIteration' flag" | \
      grep -v "can only be default-imported using the 'esModuleInterop' flag")
    
    if [ -n "$ERROR_OUTPUT" ]; then
      ERROR_FOUND=1
      echo -e "\033[0;31m❌ Errors found in $file:\033[0m"
      echo "$ERROR_OUTPUT"
      echo ""
      ERROR_LIST="$ERROR_LIST\n- $file"
    else
      echo -e "\033[0;32m✅ No errors found in $file\033[0m"
    fi
  else
    echo -e "\033[0;33m⚠️ Warning: File $file not found\033[0m"
  fi
done

if [ $ERROR_FOUND -eq 0 ]; then
  echo -e "\n\033[0;32m✅ All student files passed validation!\033[0m"
  exit 0
else
  echo -e "\n\033[0;31m❌ Errors found in the following files:$ERROR_LIST\033[0m"
  echo "Check the error details above."
  exit 1
fi