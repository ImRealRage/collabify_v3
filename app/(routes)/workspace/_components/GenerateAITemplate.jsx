import { Button } from "@/components/ui/button";
import { Loader2Icon, Star } from "lucide-react";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { chatSession } from "@/config/GoogleAIModel";

function GenerateAITemplate({setGenetateAIOutput}) {
  const [open, setOpen] = useState(false);
  const [userInput, setUserInput] = useState();
  const [loading, setLoading] = useState(false);

  const GeneratefromAI = async () => {
    setLoading(true);
    const PROMPT = "Generate template for editor.js in JSON for" + userInput;

    const result = await chatSession.sendMessage(PROMPT);
    console.log(result.response.text());
    try {
        const output = JSON.parse(result.response.text());
        setGenetateAIOutput(output)
    } catch (error) {
        setLoading(false);
    }
    

    setLoading(false);
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="relative overflow-hidden group flex items-center gap-2 px-5 py-3 rounded-lg border border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-xl hover:shadow-2xl transition-transform duration-300 hover:scale-105"
      >
        {/* Star Icon with Spin on Hover */}
        <Star className="h-5 w-5 text-white transition-transform duration-500 ease-in-out group-hover:rotate-180" />

        {/* Gradient Text */}
        <span className="bg-gradient-to-r from-purple-400 to-red-500 bg-clip-text text-transparent font-bold">
          Generate data from AI
        </span>

        {/* Shine Effect */}
        <div className="absolute top-0 left-[-75%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 group-hover:opacity-100 transform rotate-45 group-hover:translate-x-full transition-all duration-700 ease-in-out" />
      </Button>

      <Dialog open={open}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate data from AI</DialogTitle>
            <DialogDescription>
              <h2 className="mt-5">What you want to write in document?</h2>
              <Input
                className="mt-3"
                onChange = {(event) => setUserInput(event?.target.value)}
                placeholder="Write your imaginations here to turn them into reality..."
              />
              <div className="mt-5 flex gap-5 justify-end">
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  disabled={!userInput || loading}
                  onClick={() => GeneratefromAI()}
                >
                    {loading ? <Loader2Icon className="animate-spin w-4 h-4" /> : "Generate"}
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default GenerateAITemplate;
