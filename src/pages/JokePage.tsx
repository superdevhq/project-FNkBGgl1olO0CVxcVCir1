
import Layout from "@/components/layout/Layout";
import JokeGenerator from "@/components/features/JokeGenerator";

const JokePage = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Random Joke Generator</h1>
            <p className="text-gray-600 text-center mb-8">
              Need a laugh? Generate random jokes with our joke generator!
            </p>
            
            <JokeGenerator />
            
            <div className="mt-12 text-center text-gray-500 text-sm">
              <p>Jokes are provided by our static collection.</p>
              <p>This is a demo of Supabase Edge Functions.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JokePage;
