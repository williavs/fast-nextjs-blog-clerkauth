# Markdown Cheatsheet

This is intended as a quick reference and showcase for AI developers writing blog posts. For more complete info, see John Gruber's original spec and the Github-flavored Markdown info page.

## Table of Contents
- [Headers](#headers)
- [Emphasis](#emphasis)
- [Lists](#lists)
- [Links](#links)
- [Images](#images)
- [Code and Syntax Highlighting](#code-and-syntax-highlighting)
- [Tables](#tables)
- [Blockquotes](#blockquotes)
- [Horizontal Rule](#horizontal-rule)
- [Line Breaks](#line-breaks)

## Headers

```markdown
# H1
## H2
### H3
#### H4
##### H5
###### H6
```

Alternatively, for H1 and H2, an underline-ish style:

```markdown
Alt-H1
======

Alt-H2
------
```

## Emphasis

```markdown
Emphasis, aka italics, with *asterisks* or _underscores_.

Strong emphasis, aka bold, with **asterisks** or __underscores__.

Combined emphasis with **asterisks and _underscores_**.

Strikethrough uses two tildes. ~~Scratch this.~~
```

## Lists

```markdown
1. First ordered list item
2. Another item
   * Unordered sub-list
1. Actual numbers don't matter, just that it's a number
   1. Ordered sub-list
4. And another item

* Unordered list can use asterisks
- Or minuses
+ Or pluses
```

## Links

```markdown
[I'm an inline-style link](https://www.google.com)

[I'm an inline-style link with title](https://www.google.com "Google's Homepage")

[I'm a reference-style link][arbitrary case-insensitive reference text]

URLs and URLs in angle brackets will automatically get turned into links. 
http://www.example.com or <http://www.example.com>

[arbitrary case-insensitive reference text]: https://www.mozilla.org
```

## Images

```markdown
Inline-style: 
![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 1")

Reference-style: 
![alt text][logo]

[logo]: https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 2"
```

## Code and Syntax Highlighting

Inline `code` has `back-ticks around` it.

Blocks of code are fenced by lines with three back-ticks:

```javascript
var s = "JavaScript syntax highlighting";
alert(s);
```

```python
s = "Python syntax highlighting"
print s
```

```bash
# Bash commands
echo "Hello World"
```

```
No language indicated, so no syntax highlighting. 
But let's throw in a <b>tag</b>.
```

## Tables

```markdown
| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |
```

Colons can be used to align columns. The outer pipes (|) are optional.

## Blockquotes

```markdown
> Blockquotes are very handy in email to emulate reply text.
> This line is part of the same quote.

Quote break.

> This is a very long line that will still be quoted properly when it wraps. 
> Oh, you can *put* **Markdown** into a blockquote.
```

## Horizontal Rule

Three or more...

```markdown
---
Hyphens

***
Asterisks

___
Underscores
```

## Line Breaks

```markdown
Here's a line for us to start with.

This line is separated from the one above by two newlines, so it will be a *separate paragraph*.

This line is also a separate paragraph, but...
This line is only separated by a single newline, so it's a separate line in the *same paragraph*.
```

## MDX Components Available

When writing blog posts, you can use these React components:

```mdx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

<Card>
  <CardHeader>
    <CardTitle>Component Title</CardTitle>
    <CardDescription>Description text</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
</Card>

<Alert>
  <AlertDescription>
    Important information or warnings
  </AlertDescription>
</Alert>

<Badge variant="secondary">Tag</Badge>

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  
  <TabsContent value="tab1">
    Content for tab 1
  </TabsContent>
  
  <TabsContent value="tab2">
    Content for tab 2
  </TabsContent>
</Tabs>
```

## Blog Post Frontmatter

Every blog post needs frontmatter at the top:

```yaml
---
title: "Your Post Title"
date: "2025-08-19"
category: "infrastructure"
tags: ["tag1", "tag2", "tag3"]
excerpt: "Brief description that appears in post previews"
---
```

## Spacing Guidelines

- Add extra whitespace before major section headers (##)
- Use blank lines generously to prevent component clipping
- Separate code blocks with blank lines
- Add space before and after components