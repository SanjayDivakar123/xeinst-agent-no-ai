import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RefreshCw, Save, Send, Plus, X } from "lucide-react";

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
    { value: 'gpt-4o', label: 'GPT-4o' },
    { value: 'claude-sonnet', label: 'Claude Sonnet' },
    { value: 'mixtral', label: 'Mixtral' },
    { value: 'llama3', label: 'Llama 3' }
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
    <div className="min-h-screen bg-background font-inter text-foreground">
      {/* Floating Logo */}
      <div className="fixed top-6 left-6 z-50">
        <img 
          src="/lovable-uploads/dee4b780-928d-46d3-9df9-4b544fe7dbe5.png" 
          alt="Xeinst" 
          className="h-8 w-auto shadow-glow"
        />
      </div>

      {/* Main Layout */}
      <div className="flex h-screen pt-16">
        {/* Left Sidebar - Agent Configuration */}
        <div className="w-80 border-r border-separator bg-card p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Agent Name */}
            <div className="space-y-2">
              <Label htmlFor="agent-name" className="text-sm font-medium">
                Agent Name
              </Label>
              <Input
                id="agent-name"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="bg-input border-input-border focus:border-input-focus transition-colors"
                placeholder="Enter agent name"
              />
            </div>

            {/* Model Selector */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Model</Label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="bg-input border-input-border focus:border-input-focus">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {models.map((model) => (
                    <SelectItem key={model.value} value={model.value} className="text-foreground hover:bg-card-hover">
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Temperature Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">Temperature</Label>
                <span className="text-sm text-muted-foreground">{temperature[0]}</span>
              </div>
              <Slider
                value={temperature}
                onValueChange={setTemperature}
                max={2}
                min={0}
                step={0.1}
                className="w-full"
              />
            </div>

            <Separator className="bg-separator" />

            {/* System Prompt */}
            <div className="space-y-2">
              <Label htmlFor="system-prompt" className="text-sm font-medium">
                System Prompt
              </Label>
              <Textarea
                id="system-prompt"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="bg-input border-input-border focus:border-input-focus min-h-32 resize-none transition-colors"
                placeholder="Define your agent's behavior and personality..."
              />
            </div>

            <Separator className="bg-separator" />

            {/* Save Button */}
            <Button 
              className="w-full bg-primary text-primary-foreground hover:bg-primary-glow shadow-glow transition-all duration-300"
              size="lg"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Agent
            </Button>
          </div>
        </div>

        {/* Center Workspace - Prompt Builder */}
        <div className="flex-1 relative bg-background p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Visual Prompt Builder</h2>
              <Button 
                onClick={addPromptBlock}
                variant="outline" 
                size="sm"
                className="border-input-border hover:bg-card-hover"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Block
              </Button>
            </div>

            {promptBlocks.map((block) => (
              <Card key={block.id} className="bg-card border-border hover:bg-card-hover transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">
                      <Input
                        value={block.label}
                        onChange={(e) => updatePromptBlock(block.id, 'label', e.target.value)}
                        className="bg-transparent border-none p-0 h-auto font-medium text-base focus:ring-0"
                        placeholder="Block Label"
                      />
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Select
                        value={block.type}
                        onValueChange={(value) => updatePromptBlock(block.id, 'type', value)}
                      >
                        <SelectTrigger className="w-20 h-8 bg-input border-input-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="text" className="text-foreground hover:bg-card-hover">Text</SelectItem>
                          <SelectItem value="json" className="text-foreground hover:bg-card-hover">JSON</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePromptBlock(block.id)}
                        className="h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-400"
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
                    className="bg-input border-input-border focus:border-input-focus min-h-24 resize-none font-mono text-sm transition-colors"
                    placeholder={block.type === 'json' ? '{\n  "key": "value"\n}' : 'Enter your prompt content...'}
                  />
                </CardContent>
              </Card>
            ))}
          </div>

        </div>

        {/* Right Panel - Chat Preview */}
        <div className="w-96 border-l border-separator bg-card flex flex-col">
          <div className="p-4 border-b border-separator">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Live Preview</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshResponse}
                className="hover:bg-card-hover"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {chatMessages.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-chat-user ml-4' 
                    : 'bg-chat-agent mr-4'
                }`}
              >
                <div className="text-sm font-medium mb-1 text-muted-foreground">
                  {message.role === 'user' ? 'You' : agentName}
                </div>
                <div className="text-sm">{message.content}</div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-separator">
            <div className="flex gap-2">
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Test your agent..."
                className="bg-input border-input-border focus:border-input-focus"
              />
              <Button 
                onClick={sendMessage}
                size="icon"
                className="bg-primary text-primary-foreground hover:bg-primary-glow"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentBuilder;