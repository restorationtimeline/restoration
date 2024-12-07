import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

const testimonials = [
  { id: 1, initial: "SJ", image: "/placeholder.svg" },
  { id: 2, initial: "MT", image: "/placeholder.svg" },
  { id: 3, initial: "EM", image: "/placeholder.svg" },
  { id: 4, initial: "RH", image: "/placeholder.svg" },
  { id: 5, initial: "DB", image: "/placeholder.svg" },
  { id: 6, initial: "LW", image: "/placeholder.svg" },
  { id: 7, initial: "KP", image: "/placeholder.svg" },
  { id: 8, initial: "AS", image: "/placeholder.svg" },
  { id: 9, initial: "JB", image: "/placeholder.svg" },
  { id: 10, initial: "MC", image: "/placeholder.svg" },
  { id: 11, initial: "TP", image: "/placeholder.svg" },
  { id: 12, initial: "RD", image: "/placeholder.svg" },
  // Add more testimonials as needed to fill the grid
];

export const SocialProof = () => {
  return (
    <section className="py-20 bg-accent">
      <div className="container mx-auto px-4">
        <h2 className="text-center font-serif text-4xl text-primary mb-16">
          Restoration Timeline is recommended by thousands
          <br />
          upon thousands of scholars and enthusiasts.
        </h2>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 flex-1">
            {testimonials.map((testimonial) => (
              <Avatar key={testimonial.id} className="w-12 h-12 border-2 border-muted">
                <AvatarImage src={testimonial.image} alt="User avatar" />
                <AvatarFallback className="bg-muted text-primary text-sm">
                  {testimonial.initial}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>

          <div className="text-center lg:text-left lg:w-72">
            <Avatar className="w-24 h-24 mx-auto lg:mx-0 mb-4 border-4 border-muted">
              <AvatarImage src="/placeholder.svg" alt="Featured scholar" />
              <AvatarFallback className="bg-muted text-primary">DP</AvatarFallback>
            </Avatar>
            <h3 className="font-serif text-xl text-primary mb-2">Dr. Patricia Hansen</h3>
            <p className="text-secondary mb-4">
              "An invaluable resource for understanding the complexities of Mormon history."
            </p>
            <Button variant="default" className="w-full lg:w-auto">
              VIEW MORE
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};