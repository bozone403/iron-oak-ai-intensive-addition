import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2 } from "lucide-react";

interface ContactFormData {
  name: string;
  email: string;
  organization: string;
  objective: string;
  message: string;
}

export default function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    defaultValues: {
      name: "",
      email: "",
      organization: "",
      objective: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormData) => {
    console.log("Form submitted:", data);
    setIsSubmitted(true);
    toast({
      title: "Message sent successfully",
      description: "We'll review your inquiry and respond if it aligns with our mandate.",
    });
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 animate-fade-in">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
          Thank you for reaching out
        </h3>
        <p className="text-muted-foreground mb-6">
          We've received your message and will review it carefully. We respond to selected 
          inquiries that fit our mandate.
        </p>
        <Button
          data-testid="button-send-another"
          variant="outline"
          onClick={() => {
            setIsSubmitted(false);
            form.reset();
          }}
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
          Contact Iron & Oak
        </h2>
        <p className="text-muted-foreground">
          We respond to selected inquiries that fit our mandate. Please provide details 
          about your organization and strategic objectives.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            rules={{ required: "Name is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    data-testid="input-name"
                    placeholder="Your full name"
                    className="bg-background"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    data-testid="input-email"
                    type="email"
                    placeholder="your.email@company.com"
                    className="bg-background"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="organization"
            rules={{ required: "Organization is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    data-testid="input-organization"
                    placeholder="Your company or organization"
                    className="bg-background"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="objective"
            rules={{ required: "Objective is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Strategic Objective</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    data-testid="input-objective"
                    placeholder="What are you looking to accomplish?"
                    className="bg-background"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            rules={{ required: "Message is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    data-testid="input-message"
                    placeholder="Provide details about your situation, constraints, and what you're looking for..."
                    rows={6}
                    className="bg-background resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            data-testid="button-submit-contact"
            type="submit"
            size="lg"
            className="w-full"
          >
            Submit Inquiry
          </Button>
        </form>
      </Form>

      <div className="mt-8 p-6 bg-card rounded-lg border border-card-border">
        <h3 className="font-semibold text-foreground mb-3">Direct Contact</h3>
        <div className="space-y-2 text-sm">
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">General inquiries:</span>{" "}
            <a href="mailto:contact@iron-oak.ca" className="text-primary hover:underline">
              contact@iron-oak.ca
            </a>
          </p>
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Strategic consulting:</span>{" "}
            <a href="mailto:strategy@iron-oak.ca" className="text-primary hover:underline">
              strategy@iron-oak.ca
            </a>
          </p>
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Project inquiries:</span>{" "}
            <a href="mailto:projects@iron-oak.ca" className="text-primary hover:underline">
              projects@iron-oak.ca
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
