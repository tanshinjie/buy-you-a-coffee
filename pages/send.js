import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/router";

const formSchema = z.object({
  sender_name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  receiver_name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  message: z.string(),
  appreciation: z.enum(["buy-you-a-coffee"]),
});

export default function Send() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sender_name: "",
      receiver_name: "",
      message: "",
      appreciation: "buy-you-a-coffee",
    },
  });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;

  const onSubmit = async (data) => {
    fetch("/api/goodwill", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((response) => {
        router.push(`/deposit?ref=${response.ref}`);
      });
  };

  return (
    <main className="max-w-80 mx-auto mt-10 text-[#591F0B]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="sender_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What is your name?</FormLabel>
                <FormControl>
                  <Input placeholder="Alice" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="receiver_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Who are you sending the gift to?</FormLabel>
                <FormControl>
                  <Input placeholder="Bob" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Drop the person a short message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="You are amazing!"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="appreciation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Now choose a cup size!</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Standard" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="buy-you-a-coffee">
                      Standard (SGD 5)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="w-full rounded-full p-8 bg-[#2D0C05] text-[#E8C5A5]"
            type="submit"
          >
            Next
          </Button>
        </form>
      </Form>
    </main>
  );
}
