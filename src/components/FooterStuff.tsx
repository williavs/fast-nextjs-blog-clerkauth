"use client";

import Link from "next/link";
import { DIcons } from "dicons";
 

import ThemeToogle from "@/components/ui/footer";

const navigation = {
  categories: [
    {
      id: "main",
      name: "Main",

      sections: [
        {
          id: "main",
          name: "Main",
          items: [
            { name: "Homepage", href: "https://willyv3.com" },
            { name: "App Playground", href: "https://willyv3.com/app-playground" },
            { name: "Breaking Shit Blog", href: "https://breakshit.blog" },
            { name: "Stack", href: "/stack" },
          ],
        },
        {
          id: "projects",
          name: "Projects",
          items: [
            { name: "We The Builders Social Media Build", href: "https://wethebuilders.app/landing" },
            { name: "Free Linkedin Caraousel Creator", href: "https://willy-carousel.netlify.app" },
            { name: "Brainrot Game - Gravity Fails", href: "https://gravityfails.fun" },
            { name: "Fairview Comix", href: "https://fairviewcomix.com" },
          ],
        },
        {
          id: "experiments",
          name: "AI & Tools",
          items: [
            { name: "Debater AI", href: "https://debater-production.up.railway.app/?embed=true" },
            { name: "Blocky UI", href: "https://blocky-ui.com" },
            { name: "Sonic Pi", href: "https://www.sonicpicomposer.com/dashboard" },
          ],
        },
        {
          id: "social",
          name: "Social",
          items: [
            { name: "GitHub", href: "https://github.com/williavs" },
            { name: "Linkedin", href: "https://www.linkedin.com/in/willyv3/" },
            { name: "X (Twitter)", href: "https://x.com/V3_Willy" },
          ],
        },
        {
          id: "resources",
          name: "Resources",
          items: [
            { name: "Build Your Own Blog Like This One", href: "https://github.com/williavs/fast-nextjs-blog-clerkauth" },
            { name: "RSS Feed", href: "/feed.xml" },
          ],
        },
      ],
    },
  ],
};

const Underline = `hover:-translate-y-1 border border-dotted rounded-xl p-2.5 transition-transform `;

export function Footer() {
  return (
    <footer className="border-ali/20 :px-4 mx-auto w-full border-b   border-t  px-2">
      <div className="relative mx-auto grid  max-w-7xl items-center justify-center gap-6 p-10 pb-0 md:flex ">
        <Link href="/">
          <p className="flex items-center justify-center rounded-full  ">
            <span className="font-virtue text-3xl text-red-600">WV3</span>
          </p>
        </Link>
        <p className="bg-transparent text-center text-xs leading-4 text-primary/60 md:text-left">
          Portfolio of projects, experiments, and things I&apos;ve built. From TUI apps to web platforms,
          AI tools to random experiments. Everything here represents hours of trial and error, copious
          amounts of coffee, and Claude helping me not completely destroy everything. Check out my
          homelab blog at <Link href="https://breakshit.blog" className="text-red-600 hover:underline font-bold">breakshit.blog</Link> for
          the full chaos documentation.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="border-b border-dotted"> </div>
        <div className="py-10">
          {navigation.categories.map((category) => (
            <div
              key={category.name}
              className="grid grid-cols-3 flex-row justify-between gap-6 leading-6 md:flex"
            >
              {category.sections.map((section) => (
                <div key={section.name}>
                  <ul
                    role="list"
                    aria-labelledby={`${category.id}-${section.id}-heading-mobile`}
                    className="flex flex-col space-y-2"
                  >
                    {section.items.map((item) => (
                      <li key={item.name} className="flow-root">
                        <Link
                          href={item.href}
                          className="text-sm text-slate-600 hover:text-black dark:text-slate-400 hover:dark:text-white md:text-xs"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="border-b border-dotted"> </div>
      </div>

      <div className="flex flex-wrap justify-center gap-y-6">
        <div className="flex flex-wrap items-center justify-center gap-6 gap-y-4 px-6">
          <Link
            aria-label="Logo"
            href="mailto:willy@willyv3.com"
            rel="noreferrer"
            target="_blank"
            className={Underline}
          >
            <DIcons.Mail strokeWidth={1.5} className="h-5 w-5" />
          </Link>
          <Link
            aria-label="Logo"
            href="https://x.com/V3_Willy"
            rel="noreferrer"
            target="_blank"
            className={Underline}
          >
            <DIcons.X className="h-5 w-5" />
          </Link>
          <Link
            aria-label="Logo"
            href="https://github.com/williavs"
            rel="noreferrer"
            target="_blank"
            className={Underline}
          >
            <DIcons.GitBranch className="h-5 w-5" />
          </Link>
          <Link
            aria-label="Logo"
            href="https://www.linkedin.com/in/willyv3/"
            rel="noreferrer"
            target="_blank"
            className={Underline}
          >
            <DIcons.LinkedIn className="h-5 w-5" />
          </Link>
          <Link
            aria-label="Logo"
            href="https://willyv3.com"
            rel="noreferrer"
            target="_blank"
            className={Underline}
          >
            <DIcons.Globe className="h-5 w-5" />
          </Link>
        </div>
        <ThemeToogle />
      </div>

      <div className="mx-auto mb-10 mt-10 flex flex-col justify-between text-center text-xs md:max-w-7xl">
        <div className="flex flex-row items-center justify-center gap-1 text-slate-600 dark:text-slate-400">
          <span> © </span>
          <span>{new Date().getFullYear()}</span>
          <span>Made with</span>
          <DIcons.Heart className="text-red-600 mx-1 h-4 w-4 animate-pulse" />
          <span> by </span>
          <span className="hover:text-red-600 dark:hover:text-red-600 cursor-pointer text-black dark:text-white">
            <Link
              aria-label="Logo"
              className="font-bold font-virtue"
              href="https://willyv3.com"
              target="_blank"
            >
              WillyV3
            </Link>
          </span>
          -
          <span className="hover:text-red-600 dark:hover:text-red-600 cursor-pointer text-slate-600 dark:text-slate-400">
            <Link aria-label="Logo" className="" href="https://breakshit.blog">
              Breaking Shit Blog
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
