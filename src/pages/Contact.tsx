import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "sonner";

export const Contact = ({ className }: { className?: string }) => {
  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.15 },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const registerSchema = z.object({
    name: z
      .string()
      .min(3, {
        error: "Name is too short",
      })
      .max(50),
    email: z.email(),
    subject: z.string().min(3, { error: "Subject is too short" }),
    message: z.string().min(6, { error: "Message is too short" }),
  });

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    // defaultValues: {
    //   name: "Rakib",
    //   email: "rakib@gmail.com",
    //   password: "111222",
    //   confirmPassword: "111222",
    // },
  });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    const contactInfo = {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    };

    console.log(contactInfo);
    console.log(data);

    try {
      // const result = await register(userInfo).unwrap();
      // console.log(result);

      toast.success("User created successfully");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className={cn("relative overflow-hidden text-white py-16 sm:py-20 lg:py-28", className)}>
      <div className="absolute inset-0 web3-gradient" />

      {/*  blobs */}
      <motion.div
        aria-hidden
        animate={{ y: [0, -60, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute -top-40 -left-40 h-112 w-md rounded-full bg-purple-500/20 blur-[140px]"
      />

      <motion.div
        aria-hidden
        animate={{ y: [0, 60, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute -bottom-40 -right-40 h-128 w-lg rounded-full bg-blue-500/20 blur-[160px]"
      />

      {/* ✅ OUTER CONTAINER (gives side padding always) */}
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        {/* ✅ INNER MAX WIDTH (prevents over-stretch on 1536+) */}
        <div className="mx-auto w-full max-w-350 2xl:max-w-375">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid items-start gap-14 lg:grid-cols-[0.9fr_1.1fr] xl:gap-20"
          >
            {/* LEFT */}
            <motion.div variants={item} className="max-w-xl space-y-6">
              <div className=" text-gray-200">
                <p className="text-2xl  font-bold">Office Address</p>
                <p>
                  <span className="font-semibold text-white "></span> House 33, Road 12, Pisciculture Housing Society,<br></br> Mohammadpur, Dhaka,
                  Bangladesh.
                </p>

                <div>
                  <p className="text-2xl font-bold mt-4">Open Hours</p>
                  <p className="text-md">
                    Saturday - Thursday <br />
                    09:00 AM to 06:00 PM
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold mt-4">Contact</p>
                  <p>
                    <span className="font-semibold text-white">Phone:</span> 01943223060
                  </p>

                  <p>
                    <span className="font-semibold text-white">Email:</span> geomarkbd@gmail.com
                  </p>

                  {/* <p>
                    <span className="font-semibold text-white">Web:</span>{" "}
                    <a href="https://geomarkbd.com" target="_blank" className="underline hover:text-blue-400">
                      Visit Website
                    </a>
                  </p> */}
                </div>
              </div>
            </motion.div>

            {/* FORM */}
            <motion.div
              variants={item}
              whileHover={{ y: -6 }}
              className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl py-6 sm:p-8 lg:p-10 shadow-2xl"
            >
              <h1 className="text-2xl font-bold p-0 mb-4">Do you have any question?</h1>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        {/* <FormLabel>Name</FormLabel> */}
                        <FormControl>
                          <Input placeholder="Name" {...field} />
                        </FormControl>
                        <FormDescription className="sr-only">This is your public display name.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        {/* <FormLabel>Email</FormLabel> */}
                        <FormControl>
                          <Input placeholder="Email" type="email" {...field} />
                        </FormControl>
                        <FormDescription className="sr-only">This is your public display name.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        {/* <FormLabel></FormLabel> */}
                        <FormControl>
                          <Input placeholder="Subject" {...field} />
                        </FormControl>
                        <FormDescription className="sr-only">This is your public display name.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        {/* <FormLabel>Name</FormLabel> */}
                        <FormControl>
                          <Textarea placeholder="Message" {...field} />
                        </FormControl>
                        <FormDescription className="sr-only">This is your public display name.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* <Button type="submit" className="w-full">
                    Submit
                  </Button> */}
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="mt-6">
                    <Button type="submit" className="w-full rounded-xl bg-linear-to-r from-purple-500 to-blue-500">
                      Send Message
                    </Button>
                  </motion.div>
                </form>
              </Form>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

//  <div className="grid gap-5 sm:grid-cols-2">
//                 <div className="grid gap-1.5">
//                   {/* <Label>First Name</Label> */}
//                   <Input className="bg-white/5 border-white/20 focus-visible:border-blue-500" placeholder="First Name" />
//                 </div>

//                 <div className="grid gap-1.5">
//                   {/* <Label>Last Name</Label> */}
//                   <Input className="bg-white/5 border-white/20 focus-visible:border-blue-500" placeholder="Last Name" />
//                 </div>
//               </div>

//               <div className="grid gap-1.5 mt-7">
//                 {/* <Label>Email</Label> */}
//                 <Input className="bg-white/5 border-white/20 focus-visible:border-blue-500" placeholder="Email" />
//               </div>

//               <div className="grid gap-1.5 mt-7">
//                 {/* <Label>Subject</Label> */}
//                 <Input className="bg-white/5 border-white/20 focus-visible:border-blue-500" placeholder="Subject" />
//               </div>

//               <div className="grid gap-1.5 mt-7">
//                 {/* <Label>Message</Label> */}
//                 <Textarea className="min-h-35 bg-white/5 border-white/20 focus-visible:border-blue-500" placeholder="Message" />
//               </div>
