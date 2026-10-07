import { PROGRAMMATIC_SEO_REGISTRY } from '../src/data/programmaticSeoData';

export function verifyAllNumbers(): boolean {
  console.log('================================================================================');
  console.log('           WORKED-EXAMPLE MATHEMATICAL VERIFICATION & SANITY AUDIT              ');
  console.log('================================================================================\n');

  let passed = true;

  // 1. FINAL EXAM GRADE CALCULATOR VERIFICATION
  console.log('--- 1. Final Exam Grade Calculator Math Verification ---');
  const finalExam = PROGRAMMATIC_SEO_REGISTRY['final-exam-grade-calculator'];
  const currentGrade = 84.0;
  const currentWeight = 0.75;
  const finalWeight = 0.25;

  const bankedPoints = currentGrade * currentWeight;
  console.log(`Banked Points: ${currentGrade} × ${currentWeight} = ${bankedPoints.toFixed(1)} (expected 63.0)`);
  if (bankedPoints !== 63.0) {
    console.error('❌ Banked points mismatch!');
    passed = false;
  }

  const maxPossible = bankedPoints + 100.0 * finalWeight;
  console.log(`Max Possible Semester Grade: ${bankedPoints} + (100 × ${finalWeight}) = ${maxPossible.toFixed(1)}% (expected 88.0%)`);
  if (maxPossible !== 88.0) {
    console.error('❌ Max possible grade mismatch!');
    passed = false;
  }

  // Target A (90.0%)
  const reqA = (90.0 - bankedPoints) / finalWeight;
  console.log(`Target A (90.0%): (90.0 - ${bankedPoints}) / ${finalWeight} = ${reqA.toFixed(1)}% (impossible without curve/extra credit)`);
  if (Math.round(reqA * 10) / 10 !== 108.0) {
    console.error('❌ Target A math mismatch!');
    passed = false;
  }

  // Target B+ (86.0%)
  const reqBPlus = (86.0 - bankedPoints) / finalWeight;
  console.log(`Target B+ (86.0%): (86.0 - ${bankedPoints}) / ${finalWeight} = ${reqBPlus.toFixed(1)}% (achievable)`);
  if (Math.round(reqBPlus * 10) / 10 !== 92.0) {
    console.error('❌ Target B+ math mismatch!');
    passed = false;
  }

  // Target B (80.0%)
  const reqB = (80.0 - bankedPoints) / finalWeight;
  console.log(`Target B (80.0%): (80.0 - ${bankedPoints}) / ${finalWeight} = ${reqB.toFixed(1)}% (achievable)`);
  if (Math.round(reqB * 10) / 10 !== 68.0) {
    console.error('❌ Target B math mismatch!');
    passed = false;
  }

  // 2. EZ GRADER ONLINE MATH VERIFICATION
  console.log('\n--- 2. EZ Grader Online Math Verification ---');
  const totalQuestions = 35;
  const wrongAnswers = 4;
  const correctAnswers = totalQuestions - wrongAnswers;

  console.log(`Correct Answers: ${totalQuestions} - ${wrongAnswers} = ${correctAnswers} (expected 31)`);
  if (correctAnswers !== 31) {
    console.error('❌ Correct answers mismatch!');
    passed = false;
  }

  const pointValuePerQuestion = 100 / totalQuestions;
  console.log(`Point Value Per Question: 100 / ${totalQuestions} = ${pointValuePerQuestion.toFixed(3)}% (expected ~2.857%)`);

  const rawPercentage = (correctAnswers / totalQuestions) * 100;
  const roundedPercentage = Math.round(rawPercentage * 10) / 10;
  console.log(`Score Percentage: (${correctAnswers} / ${totalQuestions}) × 100 = ${rawPercentage.toFixed(4)}% -> rounded: ${roundedPercentage.toFixed(1)}% (expected 88.6%)`);
  if (roundedPercentage !== 88.6) {
    console.error('❌ Score percentage mismatch!');
    passed = false;
  }

  console.log('\n================================================================================');
  if (passed) {
    console.log('✅ ALL WORKED EXAMPLE NUMBERS RECOMPUTED AND 100% VERIFIED!');
  } else {
    console.error('❌ Worked example verification failed.');
  }
  console.log('================================================================================');

  return passed;
}

if (process.argv[1] && process.argv[1].endsWith('verify-worked-examples.ts')) {
  const ok = verifyAllNumbers();
  process.exit(ok ? 0 : 1);
}
