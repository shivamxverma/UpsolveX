'use client'
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Toaster } from 'sonner';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { generateCourseOutline } from '../../../services/Aimodel';

const formSchema = z.object({
  TopicName: z.string().min(3, "Topic name must be at least 3 characters").max(300),
  Playlist: z.string().optional(),
  Prerequisite: z.string().min(3, "Prerequisite must be at least 3 characters").max(300),
  Lessions: z.number().min(1, "Must have at least 1 lesson").max(50),
  PracticeSet: z.number().min(1, "Must have at least 1 practice set").max(50),
})


const CreateCourse = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      TopicName: "",
      Playlist : "",
      Prerequisite: "",
      Lessions: 1,
      PracticeSet: 1,
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { TopicName, Playlist, Prerequisite, Lessions, PracticeSet } = values;
    const data = await generateCourseOutline(TopicName, Playlist || "", Prerequisite, Lessions, PracticeSet);
    console.log(data);
  }

  return (
    <> 
      <Navbar/>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="bg-primary/10">
          <CardTitle className="text-2xl font-bold text-primary">
            Create New Course
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="TopicName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Course Topic
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Advanced React Patterns"
                        className="w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-600" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Playlist"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Playlist
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., http://youtu.be/"
                        className="w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-600" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Prerequisite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Prerequisites
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Basic JavaScript knowledge"
                        className="w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-600" />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="Lessions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Number of Lessons
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="1-50"
                          className="w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-600" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="PracticeSet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Practice Sets
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="1-50"
                          className="w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-600" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  className="w-32 cursor-pointer"
                >
                  Reset
                </Button>
                <Button 
                  type="submit"
                  className="w-32 bg-primary bg-black hover:bg-primary/90 text-white cursor-pointer"
                  onClick={()=>router.push('/course/asd')}
                >
                  Create Course
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
    </>
  )
}

export default CreateCourse;