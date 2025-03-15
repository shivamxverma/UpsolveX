// app/create-course/page.tsx
"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster, toast } from "sonner";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { generateCourseOutline } from "../../../services/Aimodel";
import { useState } from "react";
import { useThemeStore } from "@/app/store/theme";

const formSchema = z.object({
  TopicName: z.string().min(3, "Topic name must be at least 3 characters").max(300),
  Playlist: z.string().optional(),
  Prerequisite: z.string().min(3, "Prerequisite must be at least 3 characters").max(300),
  Lessions: z.number().min(1, "Must have at least 1 lesson").max(50),
  PracticeSet: z.number().min(1, "Must have at least 1 practice set").max(50),
  Difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
});

const CreateCourse = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useThemeStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      TopicName: "",
      Playlist: "",
      Prerequisite: "",
      Lessions: 1,
      PracticeSet: 1,
      Difficulty: "Beginner",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const { TopicName, Playlist, Prerequisite, Lessions, PracticeSet, Difficulty } = values;
      const data = await generateCourseOutline(TopicName, Playlist || "", Prerequisite, Lessions, PracticeSet);
      console.log(data);
      toast.success("Course created successfully!");
      router.push("/course/asd");
    } catch (error) {
      toast.error("Failed to create course. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className={`min-h-screen pt-24 flex transition-colors duration-300 ${
          theme === "dark"
            ? "bg-gradient-to-br from-gray-800 via-gray-900 to-black"
            : "bg-gradient-to-br from-indigo-50 via-gray-50 to-purple-50"
        }`}
      >
        <aside
          className={`w-64 p-6 fixed top-24 bottom-0 hidden lg:block transition-colors ${
            theme === "dark" ? "bg-gray-800 shadow-gray-900" : "bg-white shadow-lg"
          }`}
        >
          <h2
            className={`text-xl font-bold mb-6 ${
              theme === "dark" ? "text-indigo-300" : "text-indigo-600"
            }`}
          >
            Course Creation Tools
          </h2>
          <ul className="space-y-4">
            <li>
              <Button
                variant="ghost"
                className={`w-full text-left transition-colors ${
                  theme === "dark"
                    ? "text-gray-300 hover:bg-gray-700 hover:text-indigo-300"
                    : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                }`}
                onClick={() => form.reset()}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Reset Form
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className={`w-full text-left transition-colors ${
                  theme === "dark"
                    ? "text-gray-300 hover:bg-gray-700 hover:text-indigo-300"
                    : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                }`}
                onClick={() => router.push("/courses")}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253"
                  />
                </svg>
                View Courses
              </Button>
            </li>
          </ul>
        </aside>
        <div className="flex-1 pl-0 lg:pl-64 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto pt-8">
            <Card
              className={`shadow-xl rounded-xl overflow-hidden transition-colors ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              <CardHeader
                className={`p-6 transition-colors ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-gray-700 to-gray-800"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600"
                }`}
              >
                <CardTitle
                  className={`text-2xl md:text-3xl font-bold text-center ${
                    theme === "dark" ? "text-gray-100" : "text-white"
                  }`}
                >
                  Create New Course
                </CardTitle>
                <p
                  className={`text-sm text-center mt-2 ${
                    theme === "dark" ? "text-gray-400" : "text-indigo-100"
                  }`}
                >
                  Fill in the details to generate your course outline
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                      control={form.control}
                      name="TopicName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            className={`text-sm font-semibold flex items-center gap-2 ${
                              theme === "dark" ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            Course Topic
                            <span className="text-red-500 text-xs">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Advanced React Patterns"
                              className={`w-full rounded-lg border transition-colors focus:border-indigo-500 focus:ring-indigo-500 py-2.5 ${
                                theme === "dark"
                                  ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                                  : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500"
                              }`}
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="Playlist"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            className={`text-sm font-semibold flex items-center gap-2 ${
                              theme === "dark" ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            Playlist{" "}
                            <span className="text-xs font-normal text-gray-500">(Optional)</span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <svg
                                className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M14.752 11.168l-3.197-2.2A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.2a1 1 0 000-1.664z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <Input
                                placeholder="e.g., https://youtube.com/playlist"
                                className={`w-full pl-10 rounded-lg border transition-colors focus:border-indigo-500 focus:ring-indigo-500 py-2.5 ${
                                  theme === "dark"
                                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                                    : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500"
                                }`}
                                disabled={isLoading}
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs text-red-500" />
                        </FormItem>
                      )}
                    />
                    {/* Apply similar theme toggling to other fields */}
                    <div className="flex justify-between items-center pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/")}
                        className={`rounded-full border-indigo-500 transition-colors px-6 py-2 ${
                          theme === "dark"
                            ? "text-indigo-400 hover:bg-gray-700"
                            : "text-indigo-600 hover:bg-indigo-50"
                        }`}
                        disabled={isLoading}
                      >
                        Back to Home
                      </Button>
                      <div className="space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => form.reset()}
                          className={`rounded-full border-indigo-500 transition-colors px-6 py-2 ${
                            theme === "dark"
                              ? "text-indigo-400 hover:bg-gray-700"
                              : "text-indigo-600 hover:bg-indigo-50"
                          }`}
                          disabled={isLoading}
                        >
                          Reset
                        </Button>
                        <Button
                          type="submit"
                          className={`rounded-full transition-colors shadow-md px-6 py-2 ${
                            theme === "dark"
                              ? "bg-indigo-500 text-white hover:bg-indigo-600"
                              : "bg-indigo-600 text-white hover:bg-indigo-700"
                          }`}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <span className="flex items-center">
                              <svg
                                className="animate-spin h-5 w-5 mr-2 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                                />
                              </svg>
                              Creating...
                            </span>
                          ) : (
                            "Create Course"
                          )}
                        </Button>
                      </div>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Toaster position="top-right" richColors />
    </>
  );
};

export default CreateCourse;