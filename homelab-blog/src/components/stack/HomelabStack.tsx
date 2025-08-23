export function HomelabStack() {
  const stack = [
    {
      name: "MinisForum UN100L",
      description: "Intel N100 mini PC that runs the entire homelab infrastructure - hosts VMs, containers, development environments, and all services without needing a server rack or dedicated room",
      url: "https://www.microcenter.com/product/685406/minisforum-un100l-mff-mini-pc",
      linkText: "Micro Center had a good deal",
      type: "Hardware"
    },
    {
      name: "Ubuntu Server",
      description: "Headless Ubuntu installation that hosts development environments, runs automation scripts, and manages all services through SSH and tmux - no desktop bloat wasting resources",
      url: "https://ubuntu.com/download/server",
      linkText: "Official Ubuntu download",
      type: "OS"
    },
    {
      name: "tmux",
      description: "Keeps all processes running even when SSH disconnects - hosts persistent Claude Code instances, automation scripts, and development servers across multiple terminal sessions",
      url: "https://github.com/tmux/tmux",
      linkText: "GitHub repo",
      type: "Terminal"
    },
    {
      name: "Tailscale",
      description: "Mesh VPN that connects MacBook (100.98.202.66) to homelab (100.72.192.70) and mobile devices - enables secure remote access without port forwarding or complex firewall rules",
      url: "https://tailscale.com/",
      linkText: "Official site",
      type: "Network"
    },
    {
      name: "Cloudflare Tunnels",
      description: "Exposes homelab web services to the internet through Cloudflare's network without opening firewall ports - handles SSL termination and DDoS protection automatically",
      url: "https://medium.com/@sirkirby/replace-your-homelab-vpn-with-cloudflare-zero-trust-8416a1d7045e",
      linkText: "My work friend taught me how to do this, here's a Medium article.",
      type: "Tunneling"
    }
  ]

  return (
    <div className="space-y-3">
      {stack.map((item) => (
        <div key={item.name} className="py-2 border-b border-border/50 last:border-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-baseline gap-2 flex-1">
              <h3 className="font-virtue text-sm font-medium">
                {item.name}
              </h3>
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:underline"
              >
                {item.linkText}
              </a>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                {item.type}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  )
}