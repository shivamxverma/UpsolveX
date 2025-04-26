import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

interface Lesson {
  LessonNumber: number;
  Title: string;
  Description: string;
}

interface PracticeSet {
  SetNumber: number;
  Title: string;
  Questions: string[];
}

interface CourseOutline {
  TopicName: string;
  Prerequisite: string;
  YoutubePlaylist: string;
  NumberOfLessons: number;
  NumberOfPracticeSets: number;
  Lessons: Lesson[];
  PracticeSets: PracticeSet[];
}

interface GenerateCourseOutlineParams {
  topicName: string;
  prerequisites: string;
  youtubePlaylist: string;
  numberOfLessons: number;
  numberOfPracticeSets: number;
}

interface GenerateContentRequest {
  contents: { role: string; parts: { text: string }[] }[];
  generationConfig: {
    responseMimeType: string;
  };
}

export async function generateCourseOutline(
  topicName: string,
  prerequisites: string,
  youtubePlaylist: string,
  numberOfLessons: number,
  numberOfPracticeSets: number
): Promise<CourseOutline | null> {
  const prompt = `
    You are A Course Creator Assistant designed to PLAN, ACTION, STRUCTURE, and OUTPUT a comprehensive course based on the information provided below:
    - Topic Name: ${topicName}
    - Prerequisites: ${prerequisites}
    - YouTube Playlist Link: ${youtubePlaylist}
    - Number of Lessons: ${numberOfLessons}
    - Number of Practice Sets: ${numberOfPracticeSets}

    Tools Available:
    - Research_Topic: Takes a String as input and returns a String output with detailed research on the topic. Enhanced with multi-source integration (academic papers, blogs, YouTube metadata, X posts), contextual analysis using NLP, adaptive depth (basic/intermediate/advanced), and real-time updates via web scraping and X search as of March 01, 2025.
    - Plan_Lesson: Takes a String as input and plans lessons using six fundamental study principles for rapid mastery. Enhanced with personalized learning paths based on prerequisites, optimized six-principles implementation with measurable outcomes, multimedia enrichment from YouTube playlists, and scalable lesson templates.
    - Plan_PracticeSet: Takes a String as input and plans practice sets using first-principles problem-solving. Enhanced with difficulty tiering (easy/medium/hard), solution frameworks with step-by-step breakdowns, gamification (scoring, hints), and real-world scenario-based problems from industry examples or X discussions.
    - Structure_Course: Takes a String as input and structures the course in a detailed JSON format optimized for great UI. Enhanced with UI-driven fields (progress bars, themes, icons), interactive metadata (time estimates, difficulty), modular architecture, and export compatibility for LMS platforms.

    Workflow:
    1. Validate the user-provided inputs (topicName, prerequisites, youtubePlaylist, numberOfLessons, numberOfPracticeSets) to ensure they are non-empty and meet expected formats.
    2. Research Phase:
       - Research the TopicName in detail to gather foundational knowledge and context.
       - Call the enhanced Research_Topic tool with input: ${topicName}.
       - Analyze the prerequisites to ensure alignment with the topic and identify gaps.
       - Call the enhanced Research_Topic tool with input: ${prerequisites}.
    3. Lesson Planning:
       - Use the YouTube playlist link and researched data to plan lessons based on six fundamental study principles for rapid mastery.
       - Call the enhanced Plan_Lesson tool with inputs: ${topicName} and ${prerequisites}, generating ${numberOfLessons} lessons.
    4. Practice Set Design:
       - Design practice sets focusing on building a strong foundation and applying first-principles problem-solving.
       - Call the enhanced Plan_PracticeSet tool with input: ${topicName}, creating ${numberOfPracticeSets} practice sets with progressive difficulty (easy, medium, hard).
    5. Course Structuring:
       - Call the enhanced Structure_Course tool with inputs: ${topicName}, ${prerequisites}, ${youtubePlaylist}, ${numberOfLessons} lessons, and ${numberOfPracticeSets} practice sets, outputting a detailed JSON structure optimized for great UI display.
    6. Output:
       - Compile all generated data into a comprehensive course overview including topic name, prerequisites, YouTube playlist link, number of lessons, and number of practice sets.
    7. General Enhancements:
       - Add error handling and fallbacks for invalid inputs or unavailable data.
       - Implement caching for frequent topics to improve responsiveness.
       - Enable cross-tool synergy (e.g., Research_Topic outputs inform Plan_Lesson).
       - Introduce a feedback loop where user interactions refine future outputs.
    8. Additional Features:
       - Add metadata (lesson duration, difficulty, objectives) for each lesson and practice set.
       - Suggest review points every ${Math.floor(numberOfLessons / 3)} lessons.
       - Enhance JSON with UI fields (color themes, icons, progress tracking).

    ### Important:
    - Return only the JSON object—start with '{' and end with '}'.
    - Do NOT include additional text, explanations, comments, or markdown (e.g., no \`\`\`json or backticks).
    - The response will be parsed directly as JSON, so it must be valid and contain no extra characters.
  `;

  const request: GenerateContentRequest = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
    },
  };

  let text = "";
  try {
    const result = await model.generateContent(request);
    const response = await result.response;
    text = await response.text();

    // Validate the response is a valid JSON string
    if (!text.startsWith('{') || !text.endsWith('}')) {
      throw new Error("Response is not a valid JSON object");
    }

    const courseOutline: CourseOutline = JSON.parse(text);

    // Basic validation to ensure the output matches the expected structure
    // if (
    //   !courseOutline.TopicName ||
    //   !courseOutline.Prerequisite ||
    //   !courseOutline.YoutubePlaylist ||
    //   !Array.isArray(courseOutline.Lessons) ||
    //   !Array.isArray(courseOutline.PracticeSets) ||
    //   courseOutline.NumberOfLessons !== courseOutline.Lessons.length ||
    //   courseOutline.NumberOfPracticeSets !== courseOutline.PracticeSets.length
    // ) {
    //   throw new Error("Generated course outline does not match expected structure");
    // }

    return courseOutline;
  } catch (error) {
    console.error("Failed to generate course outline:", error);
    console.log("Raw response text:", text);
    return null;
  }
}
