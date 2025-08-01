import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  RefreshCw, 
  Save, 
  Send, 
  Plus, 
  X, 
  Settings, 
  Zap,
  Brain,
  MessageSquare,
  Play,
  Sparkles
} from "lucide-react";

interface PromptBlock {
  id: string;
  type: 'text' | 'json';
  content: string;
  label: string;
}

const AgentBuilder = () => {
  const [agentName, setAgentName] = useState("Untitled Agent");
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [temperature, setTemperature] = useState([0.7]);
  const [systemPrompt, setSystemPrompt] = useState("You are a helpful AI assistant. Be concise and accurate in your responses.");
  const [promptBlocks, setPromptBlocks] = useState<PromptBlock[]>([
    { id: '1', type: 'text', content: 'Hello! How can I help you today?', label: 'Welcome Message' }
  ]);
  const [chatMessages, setChatMessages] = useState([
    { role: 'agent', content: 'Hello! I\'m your AI agent. How can I assist you?' },
  ]);
  const [userInput, setUserInput] = useState('');

  const models = [
    { value: 'gpt-4o', label: 'GPT-4o', icon: Brain },
    { value: 'claude-sonnet', label: 'Claude Sonnet', icon: Sparkles },
    { value: 'mixtral', label: 'Mixtral', icon: Zap },
    { value: 'llama3', label: 'Llama 3', icon: MessageSquare }
  ];

  const addPromptBlock = () => {
    const newBlock: PromptBlock = {
      id: Date.now().toString(),
      type: 'text',
      content: '',
      label: 'New Block'
    };
    setPromptBlocks([...promptBlocks, newBlock]);
  };

  const removePromptBlock = (id: string) => {
    setPromptBlocks(promptBlocks.filter(block => block.id !== id));
  };

  const updatePromptBlock = (id: string, field: keyof PromptBlock, value: string) => {
    setPromptBlocks(promptBlocks.map(block => 
      block.id === id ? { ...block, [field]: value } : block
    ));
  };

  const sendMessage = () => {
    if (!userInput.trim()) return;
    
    setChatMessages([
      ...chatMessages,
      { role: 'user', content: userInput },
      { role: 'agent', content: 'This is a simulated response from your AI agent. In a real implementation, this would be generated based on your configuration.' }
    ]);
    setUserInput('');
  };

  const refreshResponse = () => {
    setChatMessages([
      { role: 'agent', content: 'Hello! I\'m your AI agent. How can I assist you?' },
    ]);
  };

  return (
    <div className="min-h-screen bg-background font-poppins">
      {/* Header with Logo */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-card-border">
        <div className="h-16 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/dee4b780-928d-46d3-9df9-4b544fe7dbe5.png" 
              alt="Xeinst" 
              className="h-8 w-auto"
            />
            <div className="text-xl font-semibold neon-text">
              Xeinst
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hover:bg-card-hover">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="pt-16 grid grid-cols-12 min-h-screen gap-6 p-6">
        
        {/* Left Sidebar - Agent Configuration */}
        <div className="col-span-12 lg:col-span-3">
          <div className="glass-card p-6 h-fit sticky top-24">
            <div className="space-y-6">
              {/* Agent Header */}
              <div className="text-center pb-4 border-b border-separator">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-semibold text-lg">Agent Configuration</h3>
                <p className="text-sm text-muted-foreground">Define your AI's behavior</p>
              </div>

              {/* Agent Name */}
              <div className="space-y-3">
                <Label htmlFor="agent-name" className="text-sm font-medium text-foreground">
                  Agent Name
                </Label>
                <Input
                  id="agent-name"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="bg-input border-input-border focus:border-accent input-glow smooth-transition rounded-lg h-11"
                  placeholder="Enter agent name"
                />
              </div>

              {/* Model Selector */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-foreground">Model</Label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="bg-input border-input-border focus:border-accent h-11 rounded-lg">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-card-border rounded-lg">
                    {models.map((model) => (
                      <SelectItem 
                        key={model.value} 
                        value={model.value} 
                        className="text-foreground hover:bg-card-hover rounded-md"
                      >
                        <div className="flex items-center gap-2">
                          <model.icon className="w-4 h-4 text-accent" />
                          {model.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Temperature Slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium text-foreground">Temperature</Label>
                  <div className="text-sm font-mono bg-accent-muted text-accent px-2 py-1 rounded-md">
                    {temperature[0]}
                  </div>
                </div>
                <Slider
                  value={temperature}
                  onValueChange={setTemperature}
                  max={2}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Focused</span>
                  <span>Creative</span>
                </div>
              </div>

              <Separator className="bg-separator" />

              {/* System Prompt */}
              <div className="space-y-3">
                <Label htmlFor="system-prompt" className="text-sm font-medium text-foreground">
                  System Prompt
                </Label>
                <Textarea
                  id="system-prompt"
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="bg-input border-input-border focus:border-accent input-glow min-h-32 resize-none smooth-transition rounded-lg"
                  placeholder="Define your agent's behavior and personality..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Center Panel - Prompt Builder */}
        <div className="col-span-12 lg:col-span-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="glass-card p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Visual Prompt Builder</h2>
                  <p className="text-muted-foreground mt-1">Create structured prompts with blocks</p>
                </div>
                <Button 
                  onClick={addPromptBlock}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground hover-glow rounded-lg px-6"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Block
                </Button>
              </div>
            </div>

            {/* Prompt Blocks */}
            <div className="space-y-4">
              {promptBlocks.map((block, index) => (
                <Card 
                  key={block.id} 
                  className="glass-card hover:bg-card-hover smooth-transition group"
                >
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-accent-foreground font-medium text-sm">
                          {index + 1}
                        </div>
                        <CardTitle className="text-base">
                          <Input
                            value={block.label}
                            onChange={(e) => updatePromptBlock(block.id, 'label', e.target.value)}
                            className="bg-transparent border-none p-0 h-auto font-semibold text-base focus:ring-0 text-foreground"
                            placeholder="Block Label"
                          />
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={block.type}
                          onValueChange={(value) => updatePromptBlock(block.id, 'type', value)}
                        >
                          <SelectTrigger className="w-20 h-8 bg-input border-input-border text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-card-border">
                            <SelectItem value="text" className="text-foreground hover:bg-card-hover text-xs">Text</SelectItem>
                            <SelectItem value="json" className="text-foreground hover:bg-card-hover text-xs">JSON</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePromptBlock(block.id)}
                          className="h-8 w-8 p-0 hover:bg-destructive/20 hover:text-destructive opacity-0 group-hover:opacity-100 smooth-transition"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={block.content}
                      onChange={(e) => updatePromptBlock(block.id, 'content', e.target.value)}
                      className="bg-input border-input-border focus:border-accent input-glow min-h-24 resize-none font-mono text-sm smooth-transition rounded-lg"
                      placeholder={block.type === 'json' ? '{\n  "key": "value"\n}' : 'Enter your prompt content...'}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Save Button - Fixed Position */}
            <div className="fixed bottom-6 right-6 z-40">
              <Button 
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow-lg hover-glow rounded-2xl px-8 py-3 text-base font-semibold"
              >
                <Save className="w-5 h-5 mr-2" />
                Save Agent
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel - Chat Preview */}
        <div className="col-span-12 lg:col-span-3">
          <div className="glass-card h-[calc(100vh-7rem)] flex flex-col sticky top-24">
            {/* Chat Header */}
            <div className="p-6 border-b border-separator">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg text-foreground">Live Preview</h3>
                  <p className="text-sm text-muted-foreground">Test your agent</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={refreshResponse}
                  className="hover:bg-card-hover rounded-lg"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl smooth-transition ${
                      message.role === 'user' 
                        ? 'bg-accent-muted ml-4 text-accent-foreground' 
                        : 'bg-card-hover mr-4 text-foreground'
                    }`}
                  >
                    <div className="text-xs font-medium mb-2 opacity-70">
                      {message.role === 'user' ? 'You' : agentName}
                    </div>
                    <div className="text-sm leading-relaxed">{message.content}</div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Chat Input */}
            <div className="p-4 border-t border-separator">
              <div className="flex gap-3">
                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Test your agent..."
                  className="bg-input border-input-border focus:border-accent input-glow h-11 rounded-lg"
                />
                <Button 
                  onClick={sendMessage}
                  size="icon"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground hover-glow rounded-lg h-11 w-11"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentBuilder;