/**
 * Import legacy projects from projects_rows.sql
 *
 * Maps old schema to new schema and only imports projects
 * that have either url or github_url.
 */

import pg from 'pg';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
try {
  const envPath = join(__dirname, '..', '.env.local');
  const envContent = readFileSync(envPath, 'utf-8');

  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').replace(/^["']|["']$/g, '');
        process.env[key.trim()] = value.trim();
      }
    }
  });
} catch (error) {
  console.warn('⚠️  Could not load .env.local file:', error.message);
}

// Legacy projects data from SQL file
const legacyProjects = [
  {
    id: '026be6c4-a238-4cbb-b87f-c8cf3182e616',
    slug: 'jira-creator',
    type: 'streamlit',
    title: 'V3 AI Jira Ticket Creator',
    description: 'Transform requirements into well-structured Jira tickets using AI. Leverages GPT-4 to create detailed, properly formatted tickets from natural language descriptions.',
    url: 'https://jira-ing.streamlit.app/',
    github_url: 'https://github.com/williavs/jira-umm',
    thumbnail: '/projects/jira-creator.jpg',
    tech_stack: ['Python', 'Streamlit', 'Jira API', 'LangChain'],
  },
  {
    id: '04a2ac6c-1afd-4e5c-8318-fef8b676a3a8',
    slug: 'itsthelist',
    type: 'demo',
    title: 'ITSTHELIST',
    description: 'Automated list enrichment tool for lead generation, powered by AI to enhance B2B prospecting data.',
    url: null,
    github_url: null,
    tech_stack: ['Python', 'OpenAI', 'Data Enrichment', 'API Integration'],
  },
  {
    id: '0a775cd1-df50-4f82-b1b3-2a98c1f300ba',
    slug: 'discourse-engine',
    type: 'streamlit',
    title: 'V3 Discourse Engine',
    description: 'Analyze topics from different angles through structured debate. Facilitates evidence-based discussions with research-backed arguments and live web search.',
    url: 'https://v3-discourse-engine.streamlit.app/',
    github_url: 'https://github.com/williavs/debater',
    thumbnail: '/projects/discourse-engine.jpg',
    tech_stack: ['Python', 'Streamlit', 'LangGraph', 'OpenAI', 'Google Search API'],
  },
  {
    id: '0ad5cae9-1bda-4625-b6d4-ab2d820dc222',
    slug: 'gtmcontext',
    type: 'live',
    title: 'HUNTER',
    description: 'Enrich your sales outreach with AI-powered personality analysis and targeted insights. Create highly personalized communications by understanding prospects\' personalities and business challenges.',
    url: 'https://hunter-2-production.up.railway.app/?embed=true',
    github_url: null,
    tech_stack: ['Streamlit', 'AI', 'Sales', 'Personality Analysis'],
  },
  {
    id: '2f0ac7d0-2c67-4eca-902a-f4256fe9749c',
    slug: 'humanfrontierlabs',
    type: 'live',
    title: 'Human Frontier Labs Inc.',
    description: '12-Week Intensive AI Builder Cohort',
    url: 'https://humanfrontierlabs.com',
    github_url: null,
    thumbnail: '/projects/humanlogo.svg',
    tech_stack: [],
  },
  {
    id: '32bf39b5-f5ee-4891-b213-b9e43c2de363',
    slug: 'v3sites',
    type: 'live',
    title: 'V3 Sites',
    description: 'Professional website building service offering custom-built websites without corporate overhead. Direct developer collaboration for businesses and individuals seeking a modern web presence.',
    url: 'https://sites.willyv3.com',
    github_url: null,
    thumbnail: '/projects/v3sites.png',
    tech_stack: [],
  },
  {
    id: '35de4315-033e-458d-a8d8-d5ced59553ed',
    slug: 'slacksage',
    type: 'opensource',
    title: 'SlackSage',
    description: 'An AI-powered knowledge assistant that brings the power of RAG (Retrieval Augmented Generation) to your Slack workspace. Upload your documents, and SlackSage will intelligently answer questions based on your knowledge base, enhanced with real-time web search capabilities.',
    url: null,
    github_url: 'https://github.com/williavs/SlackSageReal',
    tech_stack: ['Python', 'Streamlit', 'LangChain', 'Slack API', 'FAISS', 'OpenAI'],
  },
  {
    id: '46fb40c4-5896-42a7-b7d6-e83a9ca80876',
    slug: 'shieldcraft-ai',
    type: 'live',
    title: 'ShieldCraft AI',
    description: 'Quick UI built for Agentic Coding Demo during a workshop. Gifted the site to the attendee ',
    url: 'https://shieldcraft.netlify.app',
    github_url: null,
    tech_stack: ['AI', 'SOP Automation', 'Law Enforcement', 'Training', 'Next.js'],
  },
  {
    id: '4c9ce176-2603-4d87-b9fe-ece9250d2413',
    slug: 'willy-carousel',
    type: 'demo',
    title: 'V3 AI Carousel Generator',
    description: 'LinkedIn carousel creator app that helps you build engaging carousel posts with AI assistance. Features customizable branding, themes, fonts, and AI-powered content generation for professional social media content.',
    url: 'https://willy-carousel.netlify.app',
    github_url: null,
    tech_stack: ['Next.js', 'AI', 'Social Media', 'LinkedIn'],
  },
  {
    id: '54751be8-df9a-47be-af02-d881cbb8c433',
    slug: 'gravityfails-streamlit',
    type: 'streamlit',
    title: 'Gravity Fails ',
    description: 'A calming 3D particle physics game where your goal is to push particles off the platform. It\'s beautifully pointless and perfect for zoning out, stress relief, or just enjoying some meditative gameplay. This is the Streamlit embedded version.',
    url: 'https://gravityfails.fun',
    github_url: null,
    tech_stack: ['Game', 'Physics', 'Meditation', 'Stress Relief'],
  },
  {
    id: '5872628a-c992-4d46-a021-c69167db8018',
    slug: 'codepromptpro',
    type: 'demo',
    title: 'CODE PROMPT PRO',
    description: 'AI-powered code prompt engineering tool for developers to generate better, more precise prompts.',
    url: null,
    github_url: null,
    tech_stack: ['LangChain', 'Python', 'React', 'OpenAI'],
  },
  {
    id: '5b18e5a3-b407-40ed-96b9-0dbd4bbe796b',
    slug: 'human-frontier-labs-courses',
    type: 'live',
    title: 'LMS for Human Frontier Labs',
    description: 'Full stack LMS built on NextJS with Clerk auth, prisma, MUX for video playback and Stripe integrated.',
    url: 'https://courses.humanfrontierlabs.com',
    github_url: null,
    thumbnail: '/projects/humanlogo.svg',
    tech_stack: ['AI-Assisted Development', 'Software Engineering', 'Prototyping', 'Education'],
  },
  {
    id: '5f799ef1-eeef-4459-bddd-96d8f5735b02',
    slug: 'fairviewcomix',
    type: 'live',
    title: 'Fairview Comix',
    description: 'A pitch deck website showcasing comic book concepts and art',
    url: 'https://fairviewcomix.com',
    github_url: null,
    thumbnail: '/projects/fairviewcomix.png',
    tech_stack: [],
  },
  {
    id: '5fb6278a-8c32-48fa-b468-0d4444b816dd',
    slug: 'pmfeels',
    type: 'live',
    title: 'PM Feels',
    description: 'Platform for product managers to improve emotional intelligence, featuring a PRD Refiner that uses agents to improve PRD writing.',
    url: 'https://www.pmfeels.com',
    github_url: null,
    thumbnail: '/projects/pmfeels.png',
    tech_stack: [],
  },
  {
    id: '61a96fb0-dec9-4d4e-aecb-4cd8874a5836',
    slug: 'coldcallprox',
    type: 'demo',
    title: 'ColdCallProX',
    description: 'AI-powered sales training platform with real-time feedback and coaching for sales professionals.',
    url: null,
    github_url: null,
    tech_stack: ['OpenAI', 'React', 'Node.js', 'WebSocket'],
  },
  {
    id: '6f50ae6c-9439-4ad1-8bf5-0c0f07cbe43c',
    slug: 'gravityfails',
    type: 'live',
    title: 'Gravity Fails',
    description: 'Interactive Physics Game',
    url: 'https://gravityfails.fun',
    github_url: null,
    thumbnail: '/projects/gravityfails-logo.svg',
    tech_stack: [],
  },
  {
    id: '8209ed0b-704e-41cd-aa6e-47c6a168a0d7',
    slug: 'discourse',
    type: 'live',
    title: 'V3 Discourse Engine',
    description: 'Analyze topics from different angles through structured debate. Whether you\'re exploring complex decisions, understanding various viewpoints, or researching topics, our platform facilitates evidence-based discussions on any subject you choose.',
    url: 'https://debater-production.up.railway.app/?embed=true',
    github_url: null,
    tech_stack: ['Streamlit', 'AI', 'Debate', 'Analysis'],
  },
  {
    id: '92133c97-c871-49b8-8ec3-ed6e3778fb19',
    slug: 'reasoning-mashup',
    type: 'opensource',
    title: 'Reasoning Mashup',
    description: 'A multi-agent system combining multiple LLMs for enhanced reasoning and analysis, featuring a Streamlit UI and FastAPI backend. The system implements a novel approach to reasoning by leveraging local models for initial analysis and cloud models for enhanced responses.',
    url: null,
    github_url: 'https://github.com/williavs/reasoning-mashup',
    tech_stack: ['Python', 'FastAPI', 'Streamlit', 'LangChain', 'Claude 3.5', 'DeepSeek-R1'],
  },
  {
    id: '9dfd5284-2fe2-4d9c-865b-5b0ecc977c63',
    slug: 'blocky-ui',
    type: 'live',
    title: 'Blocky Design System',
    description: 'Blocky Design System is a playful, modern design system featuring bold borders, crisp shadows, and a suite of 30+ beautiful, accessible components. It enables developers to build stunning interfaces quickly with zero-config setup, full themeability, and a focus on accessibility. Each component is ARIA-compliant and supports keyboard navigation, ensuring usability for everyone.',
    url: 'https://blocky-ui.com',
    github_url: null,
    thumbnail: 'projects/blocky-ui.png',
    tech_stack: ['React', 'TypeScript', 'CSS', 'Design System'],
  },
  {
    id: 'a20247c5-78e7-44df-a156-66e65b4590f9',
    slug: 'sagedoc',
    type: 'live',
    title: 'SageDoc',
    description: 'AI-powered documentation generator that creates comprehensive specs, from API documentation to system architecture, with beautiful design and intelligent analysis.',
    url: 'https://www.sagedoc.me',
    github_url: null,
    thumbnail: '/projects/sagedoc.png',
    tech_stack: [],
  },
  {
    id: 'b80e137d-3673-40c6-9e69-ac078782f76b',
    slug: 'lead-gen-tool',
    type: 'streamlit',
    title: 'SMB Lead Generation Tool',
    description: 'Get instant lists of small and medium-sized businesses for sales outreach. Perfect for salespeople targeting local service providers and professionals.',
    url: 'https://v3-biz-finder.streamlit.app/',
    github_url: 'https://github.com/williavs/laughing-fiesta',
    thumbnail: '/projects/lead-gen.jpg',
    tech_stack: ['Python', 'Streamlit', 'Business Search APIs', 'Data Processing'],
  },
  {
    id: 'bb6301a3-94af-4d51-b4a1-c8fd4ae3d2ce',
    slug: 'hunter-sales',
    type: 'opensource',
    title: 'HUNTER - Deep Sales Intelligence System',
    description: 'AI-powered sales intelligence platform for B2B teams. HUNTER analyzes prospect personalities, identifies business challenges, and generates highly personalized outreach using a multi-agent workflow. Features Streamlit UI, LangGraph orchestration, OpenAI web search, and robust data processing.',
    url: null,
    github_url: 'https://github.com/williavs/hunter-2',
    tech_stack: ['Python', 'Streamlit', 'LangChain', 'LangGraph', 'OpenAI GPT-4.1', 'Pandas', 'BeautifulSoup', 'asyncio'],
  },
  {
    id: 'bca1f8d4-3108-467a-8827-66ceb06a22df',
    slug: 'v3consult',
    type: 'live',
    title: 'V3 Consult',
    description: 'This site! Built on NextJS.',
    url: 'https://v3consult.replit.app',
    github_url: null,
    thumbnail: '/projects/v3-consult.jpg',
    tech_stack: [],
  },
  {
    id: 'bea074bb-5c6a-4836-a588-d02d23746e4f',
    slug: 'confluence-chat',
    type: 'streamlit',
    title: 'Confluence Documentation Assistant',
    description: 'AI-powered documentation assistant that helps teams navigate and understand their Confluence content. Built with Streamlit and powered by GPT-4.',
    url: 'https://confluence-chat.streamlit.app/',
    github_url: 'https://github.com/williavs/confluence-chat',
    thumbnail: '/projects/confluence-chat.jpg',
    tech_stack: ['Python', 'Streamlit', 'Confluence API', 'LangChain'],
  },
  {
    id: 'c010e14a-ad84-4574-a57e-772e4a4da7c4',
    slug: 'coloranalysisx',
    type: 'demo',
    title: 'Color Analysis X',
    description: 'AI-powered color analysis tool using multimodal OpenAI for accurate 12 seasons color analysis.',
    url: null,
    github_url: null,
    tech_stack: ['OpenAI Vision', 'Python', 'React', 'Computer Vision'],
  },
  {
    id: 'c30d6f82-3f1f-4257-b936-b77b6d2016a8',
    slug: 'terminalagent',
    type: 'demo',
    title: 'Terminal Agent',
    description: 'A terminal-based Langgraph Agent with chat capabilities and memory management.',
    url: null,
    github_url: 'https://github.com/williavs/terminal_agent',
    tech_stack: ['Python', 'LangChain', 'LangGraph', 'CLI'],
  },
  {
    id: 'd172602c-8baa-4b53-85bb-4879f1890225',
    slug: 'breakshit-blog',
    type: 'live',
    title: 'My HomeLab Blog',
    description: 'Blog site to document my homelab adventures. ',
    url: 'https://breakshit.blog',
    github_url: '',
    thumbnail: '/breakshit.png',
    tech_stack: ['NextJS'],
  },
  {
    id: 'db960fc8-c07b-42e3-9127-95a90607b14e',
    slug: 'sonicpicomposer',
    type: 'live',
    title: 'Sonic Pi AI Composer',
    description: 'Use AI to write and play live music with code.',
    url: 'https://www.sonicpicomposer.com/dashboard',
    github_url: null,
    thumbnail: '/projects/sonicpilogo.png',
    tech_stack: [],
  },
  {
    id: 'f6a53d89-3474-47eb-9b24-71096df27dfc',
    slug: 'wethebuilders',
    type: 'live',
    title: 'We The Builders',
    description: 'A social media platform dedicated to AI builders and creators',
    url: 'https://wethebuilders.app/landing',
    github_url: null,
    thumbnail: '/projects/logo-wethebuilders.png',
    tech_stack: [],
  },
];

/**
 * Map legacy project type to new category
 */
function mapTypeToCategory(type) {
  const mapping = {
    'streamlit': 'Python',
    'opensource': 'OSS',
    'live': 'Web',
    'demo': 'Web',
  };
  return mapping[type] || 'Web';
}

/**
 * Extract GitHub owner and repo from URL
 */
function parseGitHubUrl(url) {
  if (!url) return { owner: null, repo: null };

  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (match) {
    return {
      owner: match[1],
      repo: match[2],
    };
  }
  return { owner: null, repo: null };
}

/**
 * Main import function
 */
async function importProjects() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable is required');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: databaseUrl });

  let imported = 0;
  let skipped = 0;

  try {
    for (const legacy of legacyProjects) {
      // Filter: Only import if has url OR github_url
      if (!legacy.url && !legacy.github_url) {
        console.log(`⏭️  Skipping ${legacy.slug} - no url or github_url`);
        skipped++;
        continue;
      }

      const { owner, repo } = parseGitHubUrl(legacy.github_url);

      try {
        await pool.query(
          `INSERT INTO projects (
            id,
            slug,
            title,
            description,
            category,
            source,
            github_url,
            github_owner,
            github_repo,
            stars,
            language,
            manual_screenshot_url,
            manual_images,
            tech_stack,
            homepage_url,
            install_command,
            readme_content,
            last_synced_at,
            created_at,
            updated_at
          ) VALUES (
            $1::uuid,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            $9,
            $10,
            $11,
            $12,
            $13,
            $14,
            $15,
            $16,
            $17,
            $18,
            NOW(),
            NOW()
          )
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            category = EXCLUDED.category,
            github_url = EXCLUDED.github_url,
            github_owner = EXCLUDED.github_owner,
            github_repo = EXCLUDED.github_repo,
            manual_screenshot_url = EXCLUDED.manual_screenshot_url,
            manual_images = EXCLUDED.manual_images,
            tech_stack = EXCLUDED.tech_stack,
            homepage_url = EXCLUDED.homepage_url,
            updated_at = NOW()`,
          [
            legacy.id,
            legacy.slug,
            legacy.title,
            legacy.description || null,
            mapTypeToCategory(legacy.type),
            'manual',
            legacy.github_url || null,
            owner,
            repo,
            null, // stars
            null, // language
            legacy.thumbnail || null,
            legacy.thumbnail ? [legacy.thumbnail] : null,
            legacy.tech_stack.length > 0 ? legacy.tech_stack : null,
            legacy.url || null,
            null, // install_command
            null, // readme_content
            null, // last_synced_at
          ]
        );

        console.log(`✅ Imported ${legacy.slug}`);
        imported++;
      } catch (error) {
        console.error(`❌ Failed to import ${legacy.slug}:`, error.message);
      }
    }

    console.log(`\n📊 Import Summary:`);
    console.log(`   ✅ Imported: ${imported}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
  } finally {
    await pool.end();
  }
}

// Run the import
importProjects().catch(error => {
  console.error('💥 Import failed:', error);
  process.exit(1);
});
