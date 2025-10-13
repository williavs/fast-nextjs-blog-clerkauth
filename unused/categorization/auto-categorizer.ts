/**
 * Automatic project categorization engine.
 *
 * Intelligently categorizes projects based on technology stack,
 * language, dependencies, and repository characteristics.
 *
 * @module lib/categorization/auto-categorizer
 */

import type { ProjectCategory, Project, CreateProjectData } from '@/lib/types/project';

/**
 * Categorization result with confidence and reasoning.
 */
export interface CategorizationResult {
  /** Determined category */
  category: ProjectCategory;

  /** Confidence score (0-1) */
  confidence: number;

  /** Human-readable reasoning */
  reasoning: string;
}

/**
 * Category detection signals and scoring.
 */
interface CategoryScore {
  category: ProjectCategory;
  score: number;
  signals: string[];
}

/**
 * Automatic project categorizer.
 *
 * Uses heuristics to determine project category based on available metadata.
 *
 * @example
 * ```typescript
 * const categorizer = new AutoCategorizer();
 * const result = categorizer.categorize({
 *   language: 'Go',
 *   tech_stack: ['Bubble Tea', 'Charm'],
 *   readme_content: '# TUI Application...'
 * });
 * console.log(result.category); // 'TUI'
 * console.log(result.confidence); // 0.95
 * ```
 */
export class AutoCategorizer {
  /**
   * Categorize a project based on available metadata.
   *
   * @param project - Partial project data
   * @returns Categorization result with confidence and reasoning
   */
  categorize(project: Partial<Project> | Partial<CreateProjectData>): CategorizationResult {
    const scores: CategoryScore[] = [
      this.calculateTUIScore(project),
      this.calculateWebScore(project),
      this.calculateCLIScore(project),
      this.calculatePythonScore(project),
      this.calculateOSSScore(project),
    ];

    // Sort by score (highest first)
    scores.sort((a, b) => b.score - a.score);

    const topScore = scores[0];

    // If score is too low, use language-based fallback
    if (topScore.score < 0.3) {
      return this.fallbackCategorization(project);
    }

    return {
      category: topScore.category,
      confidence: topScore.score,
      reasoning: `Categorized as ${topScore.category}: ${topScore.signals.join(', ')}`,
    };
  }

  /**
   * Calculate TUI (Terminal UI) category score.
   *
   * Detects: Bubble Tea, Charm, Lipgloss, textual, rich
   */
  private calculateTUIScore(project: Partial<Project> | Partial<CreateProjectData>): CategoryScore {
    const signals: string[] = [];
    let score = 0;

    const techStack = project.tech_stack?.map(t => t.toLowerCase()) || [];
    const readme = project.readme_content?.toLowerCase() || '';
    const desc = project.description?.toLowerCase() || '';
    const title = project.title?.toLowerCase() || '';

    // Strong TUI indicators
    const tuiLibraries = ['bubbletea', 'bubble tea', 'charm', 'lipgloss', 'textual', 'rich', 'urwid'];

    for (const lib of tuiLibraries) {
      if (techStack.some(t => t.includes(lib)) ||
          readme.includes(lib) ||
          desc.includes(lib)) {
        score += 0.4;
        signals.push(`uses ${lib}`);
      }
    }

    // TUI keywords
    const tuiKeywords = ['terminal ui', 'tui', 'terminal app', 'terminal interface', 'cli ui'];
    for (const keyword of tuiKeywords) {
      if (readme.includes(keyword) || desc.includes(keyword) || title.includes(keyword)) {
        score += 0.2;
        signals.push(`mentions "${keyword}"`);
      }
    }

    // Go language with terminal focus
    if (project.language?.toLowerCase() === 'go' &&
        (readme.includes('terminal') || desc.includes('terminal'))) {
      score += 0.1;
      signals.push('Go language with terminal focus');
    }

    return {
      category: 'TUI',
      score: Math.min(score, 1.0),
      signals,
    };
  }

  /**
   * Calculate Web Application category score.
   *
   * Detects: Next.js, React, Vue, Svelte, web frameworks
   */
  private calculateWebScore(project: Partial<Project> | Partial<CreateProjectData>): CategoryScore {
    const signals: string[] = [];
    let score = 0;

    const techStack = project.tech_stack?.map(t => t.toLowerCase()) || [];
    const readme = project.readme_content?.toLowerCase() || '';
    const desc = project.description?.toLowerCase() || '';
    const language = project.language?.toLowerCase() || '';

    // Web frameworks
    const webFrameworks = [
      'next.js', 'nextjs', 'react', 'vue', 'svelte', 'angular',
      'express', 'fastapi', 'django', 'flask', 'rails'
    ];

    for (const framework of webFrameworks) {
      if (techStack.some(t => t.includes(framework)) ||
          readme.includes(framework) ||
          desc.includes(framework)) {
        score += 0.4;
        signals.push(`uses ${framework}`);
      }
    }

    // Web keywords
    if (readme.includes('web app') || desc.includes('web app') ||
        readme.includes('website') || desc.includes('website')) {
      score += 0.2;
      signals.push('web application keywords');
    }

    // TypeScript/JavaScript language
    if (language === 'typescript' || language === 'javascript') {
      score += 0.1;
      signals.push(`${language} language`);
    }

    return {
      category: 'Web',
      score: Math.min(score, 1.0),
      signals,
    };
  }

  /**
   * Calculate CLI (Command Line Interface) category score.
   *
   * Detects: Cobra, CLI patterns, command-line tools
   */
  private calculateCLIScore(project: Partial<Project> | Partial<CreateProjectData>): CategoryScore {
    const signals: string[] = [];
    let score = 0;

    const techStack = project.tech_stack?.map(t => t.toLowerCase()) || [];
    const readme = project.readme_content?.toLowerCase() || '';
    const desc = project.description?.toLowerCase() || '';
    const language = project.language?.toLowerCase() || '';

    // CLI libraries/frameworks
    const cliLibraries = ['cobra', 'click', 'argparse', 'commander', 'yargs', 'clap'];

    for (const lib of cliLibraries) {
      if (techStack.some(t => t.includes(lib)) || readme.includes(lib)) {
        score += 0.4;
        signals.push(`uses ${lib}`);
      }
    }

    // CLI keywords
    const cliKeywords = ['command line', 'cli tool', 'command-line', 'cli utility'];
    for (const keyword of cliKeywords) {
      if (readme.includes(keyword) || desc.includes(keyword)) {
        score += 0.2;
        signals.push(`mentions "${keyword}"`);
      }
    }

    // Go language (common for CLI tools)
    if (language === 'go' && !readme.includes('web') && !readme.includes('server')) {
      score += 0.15;
      signals.push('Go language (CLI-focused)');
    }

    // Installation command patterns (brew, npm, pip install)
    if (readme.includes('brew install') || readme.includes('npm install -g') ||
        readme.includes('pip install')) {
      score += 0.1;
      signals.push('installable CLI tool');
    }

    return {
      category: 'CLI',
      score: Math.min(score, 1.0),
      signals,
    };
  }

  /**
   * Calculate Python Application category score.
   *
   * Detects: Python projects without web frameworks
   */
  private calculatePythonScore(project: Partial<Project> | Partial<CreateProjectData>): CategoryScore {
    const signals: string[] = [];
    let score = 0;

    const techStack = project.tech_stack?.map(t => t.toLowerCase()) || [];
    const readme = project.readme_content?.toLowerCase() || '';
    const language = project.language?.toLowerCase() || '';

    // Must be Python
    if (language !== 'python') {
      return { category: 'Python', score: 0, signals: [] };
    }

    score += 0.4;
    signals.push('Python language');

    // Check it's NOT a web framework
    const webFrameworks = ['django', 'flask', 'fastapi', 'pyramid'];
    const isWebFramework = webFrameworks.some(fw =>
      techStack.includes(fw) || readme.includes(fw)
    );

    if (!isWebFramework) {
      score += 0.3;
      signals.push('not a web framework');
    }

    // Python-specific tools
    const pythonTools = ['pandas', 'numpy', 'scikit-learn', 'pytorch', 'tensorflow'];
    for (const tool of pythonTools) {
      if (techStack.includes(tool) || readme.includes(tool)) {
        score += 0.1;
        signals.push(`uses ${tool}`);
      }
    }

    return {
      category: 'Python',
      score: Math.min(score, 1.0),
      signals,
    };
  }

  /**
   * Calculate OSS (Open Source Contribution) category score.
   *
   * Detects: Forks, contributions to other projects
   * Note: Currently deferred - requires fork detection
   */
  private calculateOSSScore(project: Partial<Project> | Partial<CreateProjectData>): CategoryScore {
    // TODO: Implement fork detection via GitHub API or scraping
    // For now, return low score as this is deferred
    return {
      category: 'OSS',
      score: 0,
      signals: [],
    };
  }

  /**
   * Fallback categorization based on language when no strong signals.
   */
  private fallbackCategorization(project: Partial<Project> | Partial<CreateProjectData>): CategorizationResult {
    const language = project.language?.toLowerCase();

    const languageMap: Record<string, ProjectCategory> = {
      'python': 'Python',
      'go': 'CLI',
      'javascript': 'Web',
      'typescript': 'Web',
      'rust': 'CLI',
      'java': 'CLI',
      'c++': 'CLI',
      'c': 'CLI',
    };

    const category = (language && languageMap[language]) || 'CLI';

    return {
      category,
      confidence: 0.5,
      reasoning: `Fallback categorization based on ${language || 'unknown'} language`,
    };
  }
}

/**
 * Create a default auto-categorizer instance.
 */
export function createAutoCategorizer(): AutoCategorizer {
  return new AutoCategorizer();
}
