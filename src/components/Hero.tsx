import { Button } from "./ui/button";

export const Hero = () => {
  return (
    <div className="relative bg-accent min-h-[80vh] flex items-center">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-serif text-6xl md:text-7xl text-primary mb-6 animate-fade-up">
            Explore the Restoration Movement
          </h1>
          <p className="text-lg md:text-xl text-secondary mb-8 animate-fade-up">
            Discover the complex tapestry of Mormon history through multiple perspectives. From the Sacred Grove to the present day, explore the evolving dynamics of faith, leadership, and doctrine.
          </p>
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 animate-fade-up">
            <Button size="lg" className="w-full md:w-auto bg-primary text-accent hover:bg-primary/90">
              Personalize Your Experience
            </Button>
            <Button size="lg" variant="outline" className="w-full md:w-auto border-primary text-primary hover:bg-primary/10">
              Begin Exploring
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};