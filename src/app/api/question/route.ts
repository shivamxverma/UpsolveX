import { NextResponse } from 'next/server';
import { generateDailyQuestion } from '../../../../services/Aiagent'

export async function GET() {
  console.log('API route hit');
  try {
    const question = await generateDailyQuestion('Mathematics', 'easy');
    if (!question) {
      return NextResponse.json(
        { error: 'Failed to generate question' },
        { status: 500 }
      );
    }
    return NextResponse.json(question, { status: 200 });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}