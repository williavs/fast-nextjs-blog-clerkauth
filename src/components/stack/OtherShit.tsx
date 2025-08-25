export function OtherShit() {
  const tools = [
    {
      name: "YouTube to Doc",
      description: "Convert YouTube videos to documentation - perfect for capturing tutorials",
      url: "https://youtubetodoc.com/",
      linkText: "Online converter tool",
      type: "Tool"
    },
    {
      name: "Vercel",
      description: "Deploy Next.js apps instantly with zero config - just works",
      url: "https://vercel.com/docs/deployments",
      linkText: "Deployment docs",
      type: "Platform"
    },
    {
      name: "Netlify",
      description: "Static site hosting and serverless functions for JAMstack apps",
      url: "https://netlify.com/",
      linkText: "Official site",
      type: "Platform"
    },
    {
      name: "Clerk",
      description: "Authentication that doesn't make you want to cry - handles all the auth bullshit",
      url: "https://clerk.com/docs/references/nextjs/overview",
      linkText: "Next.js integration docs",
      type: "Auth"
    },
    {
      name: "Next.js + shadcn",
      description: "React framework with beautiful pre-built components - the dream team",
      url: "https://ui.shadcn.com/",
      linkText: "Component library",
      type: "Framework"
    },
    {
      name: "Printify",
      description: "Print-on-demand for WillyV3 Shop - $1,031.03 in costs so far, 5 products published",
      url: "https://printify.com/",
      linkText: "Print-on-demand platform",
      type: "E-commerce"
    },
    {
      name: "Streamlit",
      description: "Turn Python scripts into web apps without the frontend nightmare",
      url: "https://streamlit.io/",
      linkText: "Official site",
      type: "Framework"
    }
  ]

  return (
    <div className="space-y-3">
      {tools.map((tool) => (
        <div key={tool.name} className="py-2 border-b border-border/50 last:border-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-baseline gap-2 flex-1">
              <h3 className="font-virtue text-sm font-medium">
                {tool.name}
              </h3>
              <a 
                href={tool.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:underline"
              >
                {tool.linkText}
              </a>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                {tool.type}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {tool.description}
          </p>
        </div>
      ))}
    </div>
  )
}