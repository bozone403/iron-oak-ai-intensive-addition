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
      <div className="max-w-3xl mx-auto text-center py-20 animate-scale-in">
        <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/20">
          <CheckCircle2 className="w-12 h-12 text-primary" />
        </div>
        <h3 className="font-serif text-4xl font-bold text-foreground mb-6">
          Thank you for reaching out
        </h3>
        <p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
          We've received your message and will review it carefully. We respond to selected 
          inquiries that fit our mandate.
        </p>
        <Button
          data-testid="button-send-another"
          variant="outline"
          size="lg"
          onClick={() => {
            setIsSubmitted(false);
            form.reset();
          }}
          className="text-base px-8 py-6"
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-12">
        <div className="inline-block mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
          <p className="text-sm font-mono text-primary">Get in Touch</p>
        </div>
        <h2 className="font-serif text-5xl font-bold text-foreground mb-6">
          Contact Iron & Oak
        </h2>
        <div className="h-1 w-24 bg-gradient-to-r from-primary to-yellow-500 rounded-full mb-8"></div>
        <p className="text-lg text-muted-foreground leading-relaxed">
          We respond to selected inquiries that fit our mandate. Please provide details 
          about your organization and strategic objectives.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      data-testid="input-name"
                      placeholder="Your full name"
                      className="bg-card border-2 h-14 text-base focus:border-primary transition-all"
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
                  <FormLabel className="text-base font-medium">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      data-testid="input-email"
                      type="email"
                      placeholder="your.email@company.com"
                      className="bg-card border-2 h-14 text-base focus:border-primary transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="organization"
            rules={{ required: "Organization is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Organization</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    data-testid="input-organization"
                    placeholder="Your company or organization"
                    className="bg-card border-2 h-14 text-base focus:border-primary transition-all"
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
                <FormLabel className="text-base font-medium">Strategic Objective</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    data-testid="input-objective"
                    placeholder="What are you looking to accomplish?"
                    className="bg-card border-2 h-14 text-base focus:border-primary transition-all"
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
                <FormLabel className="text-base font-medium">Message</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    data-testid="input-message"
                    placeholder="Provide details about your situation, constraints, and what you're looking for..."
                    rows={8}
                    className="bg-card border-2 text-base resize-none focus:border-primary transition-all"
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
            className="w-full text-lg py-7 shadow-2xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
          >
            Submit Inquiry
          </Button>
        </form>
      </Form>

      <div className="mt-12 p-10 bg-gradient-to-br from-card to-primary/5 rounded-3xl border-2 border-card-border">
        <h3 className="font-serif text-2xl font-bold text-foreground mb-6">Direct Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">General Inquiries</p>
            <a href="mailto:contact@iron-oak.ca" className="text-lg text-primary hover:underline font-medium transition-all">
              contact@iron-oak.ca
            </a>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Strategic Consulting</p>
            <a href="mailto:strategy@iron-oak.ca" className="text-lg text-primary hover:underline font-medium transition-all">
              strategy@iron-oak.ca
            </a>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Project Inquiries</p>
            <a href="mailto:projects@iron-oak.ca" className="text-lg text-primary hover:underline font-medium transition-all">
              projects@iron-oak.ca
            </a>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Client Support</p>
            <a href="mailto:support@iron-oak.ca" className="text-lg text-primary hover:underline font-medium transition-all">
              support@iron-oak.ca
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
