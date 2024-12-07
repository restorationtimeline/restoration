import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Github, Twitter, Youtube } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-primary text-accent py-16">
      {/* Newsletter Section */}
      <div className="container mx-auto mb-16 text-center">
        <div className="relative mb-8">
          <div className="absolute left-1/2 -top-12 -translate-x-1/2">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse">
                <div className="h-full w-full rounded-full bg-accent/20 blur-xl"></div>
              </div>
              <div className="h-3 w-3 rounded-sm bg-accent rotate-45"></div>
            </div>
          </div>
        </div>
        <h2 className="text-2xl md:text-3xl mb-4">
          Want to receive occasional updates about Mormon history?
        </h2>
        <div className="max-w-xl mx-auto">
          <div className="flex gap-2">
            <Input 
              type="email" 
              placeholder="Enter your email address" 
              className="bg-accent/10 border-accent/20 text-accent placeholder:text-accent/60"
            />
            <Button variant="secondary">
              Subscribe
            </Button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-serif mb-4">Restoration Timeline</h3>
            <p className="text-accent/80 text-sm mb-6">
              Nine out of ten historians recommend Restoration Timeline for understanding Mormon history. Join us to explore the rich tapestry of the Restoration movement.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-accent/80 hover:text-accent">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="text-accent/80 hover:text-accent">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-accent/80 hover:text-accent">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Learn Section */}
          <div>
            <h4 className="font-medium mb-4">LEARN</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-accent/80 hover:text-accent">Get Started</a></li>
              <li><a href="#" className="text-accent/80 hover:text-accent">Timeline</a></li>
              <li><a href="#" className="text-accent/80 hover:text-accent">Topics</a></li>
              <li><a href="#" className="text-accent/80 hover:text-accent">Historical Figures</a></li>
              <li><a href="#" className="text-accent/80 hover:text-accent">Documents</a></li>
              <li><a href="#" className="text-accent/80 hover:text-accent">Search</a></li>
            </ul>
          </div>

          {/* Discuss Section */}
          <div>
            <h4 className="font-medium mb-4">DISCUSS</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-accent/80 hover:text-accent">Forum</a></li>
              <li><a href="#" className="text-accent/80 hover:text-accent">Podcast</a></li>
              <li><a href="#" className="text-accent/80 hover:text-accent">Blog</a></li>
              <li><a href="#" className="text-accent/80 hover:text-accent">Support</a></li>
            </ul>
          </div>

          {/* Extras Section */}
          <div>
            <h4 className="font-medium mb-4">EXTRAS</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-accent/80 hover:text-accent">About Us</a></li>
              <li><a href="#" className="text-accent/80 hover:text-accent">Contribute</a></li>
              <li><a href="#" className="text-accent/80 hover:text-accent">FAQ</a></li>
              <li><a href="#" className="text-accent/80 hover:text-accent">Privacy</a></li>
              <li><a href="#" className="text-accent/80 hover:text-accent">Terms</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-accent/20 text-center text-sm text-accent/60">
          <p>© Restoration Timeline {new Date().getFullYear()}. All rights reserved.</p>
          <p className="mt-2">
            Proudly hosted with{" "}
            <a href="#" className="text-accent hover:text-accent/80">
              Modern Infrastructure
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
};