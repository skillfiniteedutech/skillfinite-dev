"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Save, Download, Upload, Trash2, Copy, Terminal, Zap } from "lucide-react"
import { Loader2 } from "lucide-react"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"

interface CodeTemplate {
  language: string
  code: string
  input?: string
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || ""

function buildApiUrl(path: string) {
  const base = (API_BASE || "").replace(/\/+$/, "")
  const suffix = path.startsWith("/") ? path : `/${path}`
  // If API_BASE is empty, just return the path (for relative URLs)
  if (!API_BASE) {
    return suffix
  }
  return `${base}${suffix}`
}

async function fetchJson(url: string, init?: RequestInit & { timeoutMs?: number }) {
  const { timeoutMs = 15000, ...rest } = init || {}
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(url, { ...rest, signal: controller.signal })
    const data = await response.json().catch(() => ({}))
    return { response, data }
  } finally {
    clearTimeout(timer)
  }
}

const codeTemplates: Record<string, CodeTemplate> = {
  javascript: {
    language: "JavaScript",
    code: `// JavaScript Calculator & Compiler
console.log("=== JavaScript Terminal ===");

// Basic calculations
console.log("Basic Calculator:");
console.log("2 + 3 =", 2 + 3);
console.log("10 * 5 =", 10 * 5);
console.log("Math.sqrt(16) =", Math.sqrt(16));

// Function example
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("\\nFibonacci sequence:");
for (let i = 0; i < 10; i++) {
  console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}

// Array operations
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((a, b) => a + b, 0);
console.log("\\nArray sum:", sum);`,
    input: "",
  },
  python: {
    language: "Python",
    code: `# Python Calculator & Compiler
import math
import sys

print("=== Python Terminal ===")

# Basic calculations
print("Basic Calculator:")
print("2 + 3 =", 2 + 3)
print("10 * 5 =", 10 * 5)
print("math.sqrt(16) =", math.sqrt(16))

# Function example
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print("\\nFibonacci sequence:")
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")

# List operations
numbers = [1, 2, 3, 4, 5]
total = sum(numbers)
print(f"\\nList sum: {total}")

# List comprehension
squares = [x**2 for x in range(1, 6)]
print("Squares:", squares)`,
    input: "",
  },
  // ... existing code for other languages ...
}

export default function CodeCompiler() {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript")
  const [code, setCode] = useState(codeTemplates.javascript.code)
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [terminalInput, setTerminalInput] = useState("")
  const [savedCodes, setSavedCodes] = useState<Record<string, string>>({})

  const codeRef = useRef<HTMLTextAreaElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const terminalInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem("compiler-saved-codes")
    if (saved) {
      setSavedCodes(JSON.parse(saved))
    }
    setOutput("Terminal ready. Type your code and click 'Run' to execute.\nType 'help' for commands.\n$ ")
  }, [])

  useEffect(() => {
    // Keep focus on the terminal input when output/language changes
    terminalInputRef.current?.focus()
  }, [output, selectedLanguage])

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language)
    setCode(codeTemplates[language]?.code || "")
    setInput(codeTemplates[language]?.input || "")
    clearTerminal()
  }

  const clearTerminal = () => {
    setOutput(`Terminal cleared.\n=== ${codeTemplates[selectedLanguage]?.language || "Code"} Terminal ===\n$ `)
  }

  const executeCode = async (language: string, program: string, stdin: string) => {
    try {
      const { response, data } = await fetchJson(buildApiUrl("/api/execute-code"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ language, code: program, input: stdin }),
      })
      if (!response.ok) {
        return data?.error || `HTTP ${response.status}`
      }
      return data.output || data.error || "Code executed successfully"
    } catch (error) {
      if (language === "javascript") {
        return executeJavaScriptLocally(program, stdin)
      }
      return `Error: ${error instanceof Error ? error.message : "Unknown error"}`
    }
  }

  const calculateExpression = async (expression: string) => {
    try {
      const { response, data } = await fetchJson(buildApiUrl("/api/calculate"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ expression }),
      })
      if (!response.ok) {
        return data?.error || `HTTP ${response.status}`
      }
      if (data.success) return String(data.result)
      return data.error || "Invalid expression"
    } catch (error) {
      return `Error: ${error instanceof Error ? error.message : "Unknown error"}`
    }
  }

  const executeJavaScriptLocally = (program: string, stdin: string) => {
    const originalConsoleLog = console.log
    const logs: string[] = []
    console.log = (...args) => {
      logs.push(args.map((arg) => (typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg))).join(" "))
    }
    try {
      const executeFunction = new Function(
        "input",
        `
        ${program}
        return true;
      `,
      )
      executeFunction(stdin)
      console.log = originalConsoleLog
      return logs.join("\n")
    } catch (error) {
      console.log = originalConsoleLog
      return `Error: ${error instanceof Error ? error.message : "Unknown error"}`
    }
  }

  const runCode = async () => {
    setIsRunning(true)
    const timestamp = new Date().toLocaleTimeString()
    setOutput((prev) => prev + `\n[${timestamp}] Executing ${codeTemplates[selectedLanguage]?.language} code...\n`)
    try {
      const result = await executeCode(selectedLanguage, code, input)
      setOutput((prev) => prev + result + "\n$ ")
      setCommandHistory((prev) => [...prev, code].slice(-50))
    } catch (error) {
      setOutput((prev) => prev + `Error: ${error}\n$ `)
    }
    setIsRunning(false)
    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight
      }
    }, 100)
  }

  const handleTerminalCommand = async (command: string) => {
    setOutput((prev) => prev + command + "\n")
    const trimmed = command.trim()

    if (trimmed === "clear") {
      clearTerminal()
      return
    }

    if (trimmed === "help") {
      setOutput(
        (prev) =>
          prev +
          `Available commands:
- clear: Clear terminal
- help: Show this help
- history: Show command history
- run: Execute current code
- calc <expression>: Evaluate a math expression on server
$ `,
      )
      return
    }

    if (trimmed === "history") {
      setOutput(
        (prev) =>
          prev +
          `Command history:\n${commandHistory.map((cmd, i) => `${i + 1}. ${cmd.split("\n")[0]}...`).join("\n")}\n$ `,
      )
      return
    }

    if (trimmed === "run") {
      await runCode()
      return
    }

    if (trimmed.startsWith("calc ")) {
      const expr = trimmed.slice(5).trim()
      if (!expr) {
        setOutput((prev) => prev + "Usage: calc <expression>\n$ ")
        return
      }
      const result = await calculateExpression(expr)
      setOutput((prev) => prev + result + "\n$ ")
      return
    }

    setOutput((prev) => prev + `Unknown command: ${command}\nType 'help' for available commands.\n$ `)
  }

  const handleTerminalKeyPress = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      const cmd = terminalInput
      setTerminalInput("")
      setHistoryIndex(-1)
      await handleTerminalCommand(cmd)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setTerminalInput(commandHistory[commandHistory.length - 1 - newIndex] || "")
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setTerminalInput(commandHistory[commandHistory.length - 1 - newIndex] || "")
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setTerminalInput("")
      }
    }
  }

  const saveCode = () => {
    const name = prompt("Enter a name for this code:")
    if (name) {
      const newSavedCodes = {
        ...savedCodes,
        [`${name}_${selectedLanguage}`]: code,
      }
      setSavedCodes(newSavedCodes)
      localStorage.setItem("compiler-saved-codes", JSON.stringify(newSavedCodes))
    }
  }

  const loadCode = (key: string) => {
    setCode(savedCodes[key])
  }

  const deleteCode = (key: string) => {
    const newSavedCodes = { ...savedCodes }
    delete newSavedCodes[key]
    setSavedCodes(newSavedCodes)
    localStorage.setItem("compiler-saved-codes", JSON.stringify(newSavedCodes))
  }

  const downloadCode = () => {
    const extensions: Record<string, string> = {
      javascript: "js",
      python: "py",
      java: "java",
      cpp: "cpp",
      csharp: "cs",
      go: "go",
      rust: "rs",
    }
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `code.${extensions[selectedLanguage] || "txt"}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const uploadCode = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setCode(e.target?.result as string)
      }
      reader.readAsText(file)
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
  }

  return (
    <div className="space-y-4">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="bg-gray-800 border-b border-gray-700 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <CardTitle className="flex items-center gap-2 text-white text-sm">
                <Terminal className="h-4 w-4" />
                Code Terminal - {codeTemplates[selectedLanguage]?.language}
              </CardTitle>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1 bg-gray-700 text-gray-200">
              <Zap className="h-3 w-3" />
              {selectedLanguage.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0 bg-gray-900">
          <Tabs defaultValue="terminal" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-b border-gray-700">
              <TabsTrigger value="terminal" className="text-gray-200">
                Terminal
              </TabsTrigger>
              <TabsTrigger value="editor" className="text-gray-200">
                Code Editor
              </TabsTrigger>
              <TabsTrigger value="workout" className="text-gray-200">
                Workout
              </TabsTrigger>
              <TabsTrigger value="saved" className="text-gray-200">
                Saved Codes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="terminal" className="space-y-0 m-0">
              <div className="flex flex-wrap items-center gap-2 p-4 bg-gray-800 border-b border-gray-700">
                <select
                  value={selectedLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="px-3 py-1 bg-gray-700 text-gray-200 border border-gray-600 rounded text-sm"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="csharp">C#</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                </select>

                <Button onClick={runCode} disabled={isRunning} size="sm" className="bg-green-600 hover:bg-green-700">
                  {isRunning ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Play className="h-3 w-3 mr-1" />}
                  Run
                </Button>

                <Button
                  onClick={clearTerminal}
                  variant="outline"
                  size="sm"
                  className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                >
                  Clear
                </Button>

                <Button
                  onClick={saveCode}
                  variant="outline"
                  size="sm"
                  className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                >
                  <Save className="h-3 w-3 mr-1" />
                  Save
                </Button>
              </div>

              <div className="flex flex-col h-[600px]">
                <div
                  ref={terminalRef}
                  className="flex-1 bg-black text-green-400 font-mono text-sm p-4 overflow-auto whitespace-pre-wrap"
                  style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
                >
                  {output}
                </div>
                <form
                  className="bg-black border-t border-gray-800 px-4 py-2 flex items-center gap-2"
                  onSubmit={async (e) => {
                    e.preventDefault()
                    const cmd = terminalInput
                    setTerminalInput("")
                    setHistoryIndex(-1)
                    await handleTerminalCommand(cmd)
                  }}
                >
                  <span className="text-green-500 font-mono select-none">$</span>
                  <input
                    ref={terminalInputRef}
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    onKeyDown={handleTerminalKeyPress}
                    className="bg-transparent border-none outline-none text-green-400 font-mono text-sm flex-1"
                    placeholder="Type command..."
                    aria-label="Terminal input"
                  />
                </form>
              </div>
            </TabsContent>

            <TabsContent value="workout" className="space-y-0 m-0">
              <div className="p-3 bg-gray-800 border-b border-gray-700 flex items-center gap-2">
                <select
                  value={selectedLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="px-3 py-1 bg-gray-700 text-gray-200 border border-gray-600 rounded text-sm"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="csharp">C#</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                </select>
                <Button onClick={runCode} disabled={isRunning} size="sm" className="bg-green-600 hover:bg-green-700">
                  {isRunning ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Play className="h-3 w-3 mr-1" />}
                  Run
                </Button>
                <Button onClick={clearTerminal} variant="outline" size="sm" className="bg-gray-700 border-gray-600 text-gray-200">
                  Clear
                </Button>
                <div className="ml-auto flex items-center gap-2 text-xs text-gray-400">
                  <span>Workout Mode</span>
                  <Badge variant="secondary" className="bg-gray-700 text-gray-200">Live</Badge>
                </div>
              </div>
              <div className="h-[700px]">
                <ResizablePanelGroup direction="horizontal" className="h-full">
                  <ResizablePanel defaultSize={55} minSize={35} className="bg-white">
                    <div className="h-full flex flex-col p-4 gap-3">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-800">Editor</label>
                        <Textarea
                          ref={codeRef}
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          className="font-mono min-h-[420px] text-sm bg-gray-100 text-gray-800 border-gray-300"
                          style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
                          placeholder="Write your code here..."
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-800">Input (stdin)</label>
                        <Textarea
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          className="font-mono min-h-[120px] text-sm bg-gray-100 text-gray-800 border-gray-300"
                          placeholder="Enter input for your program..."
                        />
                      </div>
                      <div className="flex gap-2 flex-wrap pt-1">
                        <Button onClick={downloadCode} variant="outline" size="sm" className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                        <Button onClick={copyCode} variant="outline" size="sm" className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={uploadCode}
                          accept=".js,.py,.java,.cpp,.cs,.go,.rs,.txt"
                          className="hidden"
                        />
                        <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm" className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
                          <Upload className="h-3 w-3 mr-1" />
                          Upload
                        </Button>
                      </div>
                    </div>
                  </ResizablePanel>
                  <ResizableHandle withHandle className="bg-gray-800" />
                  <ResizablePanel defaultSize={45} minSize={30} className="bg-black flex flex-col">
                    <div ref={terminalRef} className="flex-1 text-green-400 font-mono text-sm p-4 overflow-auto whitespace-pre-wrap" style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}>
                      {output}
                    </div>
                    <form
                      className="bg-black border-t border-gray-800 px-4 py-2 flex items-center gap-2"
                      onSubmit={async (e) => {
                        e.preventDefault()
                        const cmd = terminalInput
                        setTerminalInput("")
                        setHistoryIndex(-1)
                        await handleTerminalCommand(cmd)
                      }}
                    >
                      <span className="text-green-500 font-mono select-none">$</span>
                      <input
                        ref={terminalInputRef}
                        type="text"
                        value={terminalInput}
                        onChange={(e) => setTerminalInput(e.target.value)}
                        onKeyDown={handleTerminalKeyPress}
                        className="bg-transparent border-none outline-none text-green-400 font-mono text-sm flex-1"
                        placeholder="Type command..."
                        aria-label="Terminal input"
                      />
                    </form>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </div>
            </TabsContent>

            <TabsContent value="editor" className="space-y-4 p-4">
              {/* Code Editor */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">Code Editor</label>
                  <Textarea
                    ref={codeRef}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="font-mono min-h-[400px] text-sm bg-gray-800 text-gray-200 border-gray-600"
                    style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
                    placeholder="Write your code here..."
                  />
                </div>

                <div className="space-y-4">
                  {/* Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-200">Input (if needed)</label>
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="font-mono min-h-[100px] text-sm bg-gray-800 text-gray-200 border-gray-600"
                      placeholder="Enter input for your program..."
                    />
                  </div>

                  {/* File Operations */}
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      onClick={downloadCode}
                      variant="outline"
                      size="sm"
                      className="bg-gray-700 border-gray-600 text-gray-200"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>

                    <Button
                      onClick={copyCode}
                      variant="outline"
                      size="sm"
                      className="bg-gray-700 border-gray-600 text-gray-200"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={uploadCode}
                      accept=".js,.py,.java,.cpp,.cs,.go,.rs,.txt"
                      className="hidden"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      size="sm"
                      className="bg-gray-700 border-gray-600 text-gray-200"
                    >
                      <Upload className="h-3 w-3 mr-1" />
                      Upload
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="saved" className="space-y-4 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(savedCodes).map(([key, savedCode]) => (
                  <Card key={key} className="bg-gray-800 border-gray-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-gray-200">{key.split("_")[0]}</CardTitle>
                      <Badge variant="outline" className="w-fit text-xs border-gray-600 text-gray-300">
                        {key.split("_")[1]}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-900 p-2 rounded text-xs font-mono mb-3 max-h-20 overflow-hidden text-gray-300">
                        {savedCode.substring(0, 100)}...
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => loadCode(key)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          Load
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteCode(key)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {Object.keys(savedCodes).length === 0 && (
                  <div className="col-span-full text-center py-8 text-gray-400">
                    No saved codes yet. Save your first code from the editor!
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}