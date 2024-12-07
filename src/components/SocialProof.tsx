import { Card, CardContent } from "./ui/card";

export const SocialProof = () => {
  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-serif text-4xl text-primary mb-4">Trusted by Scholars & Students</h2>
          <p className="text-lg text-secondary">
            Join a community dedicated to understanding the nuances of Mormon history through rigorous research and respectful dialogue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-card">
            <CardContent className="p-6">
              <p className="text-secondary mb-4 italic">
                "This platform has revolutionized how I teach Mormon history. The multiple perspectives and primary sources create a rich learning environment."
              </p>
              <div className="font-serif">
                <p className="text-primary font-medium">Dr. Sarah Johnson</p>
                <p className="text-sm text-muted-foreground">Religious Studies Professor</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardContent className="p-6">
              <p className="text-secondary mb-4 italic">
                "The timeline's approach to controversial topics is balanced and thorough. It's refreshing to see complex issues treated with such care."
              </p>
              <div className="font-serif">
                <p className="text-primary font-medium">Michael Thompson</p>
                <p className="text-sm text-muted-foreground">Independent Researcher</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardContent className="p-6">
              <p className="text-secondary mb-4 italic">
                "The interactive features and primary source integration make this an invaluable resource for understanding the Restoration movement."
              </p>
              <div className="font-serif">
                <p className="text-primary font-medium">Dr. Emily Martinez</p>
                <p className="text-sm text-muted-foreground">Church History Specialist</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};