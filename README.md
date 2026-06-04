# Text-Panic-Calculator


A lightweight, client-side web application and decision engine built to solve a hyper-specific daily problem: the overthinking and analysis paralysis that comes with replying to messages. 

Instead of staring at a screen or wrestling with standard chatbots to write a response, this tool structures the user's social context into a clean interface and generates a deterministic execution strategy alongside a hyper-targeted LLM prompt.

🚀 [Launch Live Application]()

---

## 🛠 Why I Built This
Social overthinking is a real friction point, especially for introverts. While standard chatbots can generate text, they completely ignore the cognitive load, battery drain, and anxiety that comes with managing social dynamics. 

I built this tool to act as a localized buffer—giving users a structured, zero-pressure interface to map out their exact scenario and get a highly tailored response strategy before their energy runs out.
Most text-assistant wrappers are over-engineered, slow, and expensive. I wanted a fast, friction-free tool that operates entirely on the frontend, treats personal communication data with total privacy, and outputs human-sounding text variations. 

## ⚙️ Core Engineering Features
- Deterministic Context Matrix: Evaluates 8 sender profiles (Boss, Ex, Crush, etc.) paired against 7 semantic text tones (Passive-aggressive, walls of text, mixed signals) to calculate localized social advice.
- Dynamic Prompt Engineering: Conditionally maps data structures (such as incoming string inputs, tone strength variables, and social battery metrics) into standard instructions that prevent external AIs from generating robotic or clinical responses.
- Zero-Friction UX: A mobile-first, multi-step state wizard that cuts down form fatigue. Includes a native Clipboard API implementation for one-click copy logic.
- Privacy-First (No Backend): Executes 100% locally in the user's browser runtime environment. Private strings and text contents are never transmitted across the network or stored on an external server.

## 🧰 Architecture & Stack
- Languages: Semantic HTML5, Vanilla JavaScript (ES6+), Modern CSS3
- Design Paradigm: High-contrast glassmorphic dark mode utilizing radial gradients and flexible layout grids (flexbox/grid).
- Dependencies: None. Completely isolated client-side architecture.

## 🚀 Local Deployment
If you want to run or tweak the code locally:
1. Clone this repository to your machine.
2. Open the directory in your code editor.
3. Open index.html directly inside any modern web browser.
