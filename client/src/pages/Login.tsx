import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
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
import { motion } from "framer-motion";
import { z } from "zod";
import { login } from "@/lib/auth";

const loginSchema = z.object({
  username: z.string().min(1, "Benutzername ist erforderlich"),
  password: z.string().min(1, "Passwort ist erforderlich"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<LoginForm>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      return await login(data.username, data.password);
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/me"], user);
      if (user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
      toast({
        title: "Anmeldung erfolgreich",
        description: user.isAdmin ? "Willkommen im Admin-Bereich." : "Willkommen zurueck!",
      });
    },
    onError: (error) => {
      toast({
        title: "Anmeldung fehlgeschlagen",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-card rounded-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-6">Anmelden</h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Anmeldung..." : "Anmelden"}
              </Button>
            </form>
          </Form>

        </div>
      </motion.div>
    </div>
  );
}
