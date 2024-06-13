# Style guide

This guide describes our approach to building effective documentation, the
conventions we follow, and the recommended practices for organizing, crafting,
and evolving our information architecture with a clear and consistent voice.

Many style rules have equally justifiable alternatives. Following a common style
guide is intended to prevent debates over style questions from getting in the
way of documenting Teleport. If you don't see an answer to a style question in
this guide, follow your best judgement and keep the style you choose consistent
within the page you're working on.

## Organizing information into purpose-driven documents

For software documentation, you can structure information using the
following information model:

- Tutorials are learning oriented and designed to give a newcomer a positive, successful 
  experience. Tutorials should be tested regularly to ensure they don't get stale and that
  they always provide a successful result.
- How-to guides are task oriented with practical steps to achieve a specific goal. 
  These guides assume that readers are familiar enough with Teleport that they know the task
  they want to complete for a specific scenario but not necessarily how to complete it.
- References are information oriented technical descriptions of a system or its components.
- Explanations are the conceptual framework for understanding how or why a system works.
  Explanation provide the context that surrounds what people learn in a tutorial, do in a 
  how-to guide, or look up in reference material.

For more detailed information and examples of how to structure documentation using this 
information model, see [The Grand Unified Theory of Documentation](https://documentation.divio.com/).

## Structuring content into pages

In general, every page of documentation should have a purpose and be self-contained. 
It's okay for information to be in multiple places and similar content can exist in 
pages that serve different purposes. For example, you might have conceptual information
about trusted clusters in one page and have similar content as context in a how-to topic.
When possible, you should reuse content rather than duplicate content, but it's perfectly
fine to cover the same information in more than one place to serve different purposes.

## How-to guides

A how-to guide describes how to achieve a goal or complete a task. 
Only the information that is pertinent to achieving that goal or completing the task is included. 
With how-to guides, readers have enough information to know what they want to do—for example, 
open a bank account—but not necessarily enough information to know how to do it.
For example, the how-to guide for opening a bank account wouldn't explain what a bank account 
is or why you might want to open one, but would focus on specific steps such as:

1. Select an institution.
1. Fill out an application.
1. Deposit a minimum amount of currency.
 
How-to guides often include links to additional information, but should not include 
explanations that take the focus away from what the reader wants to accomplish.

### What's in a how-to guide?

In most cases, how-to guides contain the following sections:

- Frontmatter with a guide title, description, and other information.
  The title should be short and identify the subject of the how-to topic in the fewest words possible.
  The description should be a sentence that starts with a verb and summarizes the content of the topic.
  Additional information might include a video banner link, a list of keywords, or an alternate 
  first-level heading.

- One or more introductory paragraphs that explain what the task-at-hand is, the use case or 
  scenario driving the reader to complete the task, and the expected outcome.

- List of prerequisites.
  Actions that are common to multiple topics that must be taken before starting the procedure 
  in how-to topics are generally documented in partial files and referenced in the
  list of prerequisites. 

- Task step sections that break down the how-to procedure into manageable chunks or subtasks
  with clearly-defined goals.
  Currently, task step sections use headings that convey the current and total number of steps
  involved to complete the procedure, for example, **Step 1/3. Add a local user**.

  In most cases, task step sections include code examples, configuration settings, and 
  screenshots to illustrate the actions the read should perform. Whenever possible, readers
  should be able to copy and paste the example code and configurations with minimal changes 
  to complete the procedure being documenting.

- Next steps section can be used to add links to logically related topics, if applicable, or
  to recommend related topics for further reading, such as reference topics related to the
  procedure completed.

### Using links, admonishments, and details in how-to guides

You should avoid breaking the reader's focus in how-to guides. 
For example, avoid adding links to other pages or to other sections in the same topic.
Avoid inserting notices, tips, admonishments, or collapsed details sections unless
absolutely necessary.

If you do include a link in a how-to guide to external documentation,
be sure to tell the reader why to follow the link and what information to glean from it.
For example, use explicit information like "Follow the installation instructions in the 
AWS documentation" instead of "Read the AWS documentation for more information".

## Tutorials

Tutorials are designed to give first-time Teleport users hands-on experience completing 
a set of explicit instructions. Tutorials should be as simple and straightforward as 
possible. Tutorials must provide a positive learning experience and a successful outcome 
with no unexpected behavior or unexplained errors. It's okay for a tutorial to include a 
red herring to illustrate a common misstep but the author must provide a sufficient 
explanation of the error and how to correct it.

### What's in a tutorial?

Tutorial or getting started guides contain much of the same content as how-to guides 
but are focused on achieving learning objectives:

- Frontmatter with a demo video to reach readers who prefer video.
- One or more introductory paragraphs that explain what the tutorial demonstrates.
- Before you begin list of the tools required to complete the tutorial.
- Learning objectives that summarize what the reader will accomplish by completing the tutorial.
- Task steps that the reader must follow in sequence to successfully complete the lesson.
- Next steps section can be used to add links to logically related topics, if applicable, or
  to recommend related topics for further reading, such as reference topics related to the
  procedure completed.

## Conceptual guides

**Conceptual guides** and **Architecture guides** explain core concepts and how Teleport works
at system, component, and operational levels.
Guide for conceptual and architectural information can include the following types of topics:

- **Networking** for audiences interested in networking concepts, components, and protocols.
- **Security** for audiences interested in security protocols, cryptographic primitives, and 
  reducing attack vectors.
- **Deployment** for audiences interested in deployment architecture.

### What's in a conceptual guide?

Conceptual guides typically contain the following sections:

- Frontmatter with a guide title, description, and other information.
  The title should be short and identify the subject of the how-to topic in the fewest words possible.
  The description should be a sentence that starts with a verb and summarizes the content of the topic.
  Additional information might include a list of keywords, or an alternate first-level heading.
- Body paragraphs that explain that explain concepts, components, system operations, and context to
  help the reader understand what something is, why it's important, and how it works.
- Diagrams to illustrate component relationships or flow of operations.
- Links to related topics, where applicable. 

## Reference manuals

**Reference manuals** provide an exhaustive list of configuration options, API methods, 
and other possible fields and values for the various ways in which users can interact with 
Teleport.

- Should be comprehensive. If listing configuration options, API paths, and so on, list 
  all of them, rather than a few examples.
- HTML or Markdown tables are often the best formats for this kind of article.
- Should be easy to navigate with a browser's search functionality. List all content on 
  the same page.
- Should avoid prose and be expressed with brevity.

### What's in a reference manual?

Reference manuals typically contain the following sections:

- Frontmatter with a guide title, description, and other information.
  The title should be short and identify the subject of the how-to topic in the fewest words possible.
  The description should be a sentence that starts with a verb and summarizes the content of the topic.
  Additional information might include a list of keywords.
- One or more introductory paragraphs that explain what information the covers.
- Formatted reference information. The format might resemble a `man` page or API description with a 
  common set of sections (name, description, syntax, options, examples, and so on) or the format
  might use lists or tables to present information.
- Links to related topics, where applicable. 

## General style rules

Please refer to this style guide when determining how address questions about
English grammar, usage, and so on. Since many of these rules have equally
justifiable alternatives, a style guide prevents debates over these questions
from getting in the way of documenting Teleport.

If a commonly debated style question does not have a resolution in this guide
(e.g., the Oxford comma), all we ask is that you keep your style consistent
within a particular page to maintain a professional polish.

### Use of frontend components

In general, we want pages in the documentation to emphasize text and provide an
uncluttered experience to readers. Before adding a component besides a
paragraph, heading, or example code snippet, ask what benefit the component adds
to a page, and if it is possible to achieve a similar result with only
paragraphs, headings, and code snippets. 

For example, when adding a `Tabs` component, ask if it would make sense to add a
subheading instead of each `TabItem`. `TabItems` would be useful if only one
variation of the instructions you are adding is relevant to a reader, and the
other two would only add distraction. If all variations of the instructions are
useful, subheadings would make more sense.

### Voice

The documentation should be technically precise and directed toward a technical
audience, e.g., application developers, site reliability engineers, and security
engineering team leads. 

Even when describing Teleport generally, we should emphasize specific technical
capabilities over broad statements of benefit. The aim is not to pique the
audience's interest, but to provide information.

For example, rather than:

```markdown
Teleport replaces insecure secrets with true identity.
```

Use:

```markdown
Teleport replaces shared secrets with short-lived X.509 and SSH certificates.
```

Some guides are intended for end users seeking to access resources in their
cluster. For certain use cases, it may be necessary to adjust our usual voice
for the audience of a specific guide.

### Body text

- Write sparser one to two-sentence groupings rather than lengthier blocks of text.
- Use periods at the end of a line even in a list unless the ending item is a command.

### Code, commands, and configuration

- `tsh`, `tctl`, and other core commands should be placed in backticks.

- All ports or values should be enclosed in backticks, e.g., `443`.

- Prefer putting commands into full-line code snippets. These will render with a handy copy button.

### Diagrams

- Use [Teleport's Lucidchart library](https://app.lucidchart.com/lucidchart/dfcf1f4a-5cf0-4758-8ebb-f6ea86900aba/edit) to create diagrams with a consistent design language.
- Diagram multistep sections using sequence diagrams that depict steps linearly.
- Several great examples are available here: https://gravitational.slab.com/posts/diagrams-ix9nzhpd.

### Footnotes

- Footnotes should be ordered by appearance (chronological precedence). `2` should not come before `1`.

### Headings

- Headings should be in sentence case. For example, "Next steps" is preferred over "Next Steps." We want to clarify proper nouns and products in headings by using sentence casing.

### Lists

- We prefer short paragraph blocks over bulleted or numbered lists. This leads to a preference for completeness and brevity rather than enumeration. 

- When you do include a list, we prefer bullet points over numbered lists.

- Use numbered lists for any sequence of steps, but use these sparingly. 

  Each number should mention the total number of steps, e.g., "Step 1/5," so the reader knows how far along they are in the sequence.

### Names of products, services, and features

- Product proper nouns should be capitalized. Say "Trusted Cluster," not "trusted cluster."
- Avoid using quotes to refer to product names, since they often have negative connotations. E.g, do not say, "Trusted Cluster."
- Product proper nouns should be bolded on first use. "Trusted Cluster" should be **Trusted Cluster**.

### Names of technical concepts

- Within a single page, use consistent acronyms and concept keywords. For example, pick one of "2-factor," "two-factor", "2fa," or "tfa" within a given page.
- Acronyms should always be introduced following a concept keyword and then consistently used thereafter.

### Page titles

- Should have all words capitalized except for determiners (`a`, `the`, etc.).
- Should follow a `Title Name | Teleport Docs` format. The `| Teleport Docs` suffix will be added automatically by our static site generator.
- The total character count should not exceed 70 for the entire title since this can impact SEO. Including the suffix `| Teleport Docs`, that leaves 55 characters for the article's title.

### SEO

- Make sure to have a good, well-worded description that uses common keywords around the subject. Also, liberally sprinkle said keywords throughout the article.

### Videos

- Mac users should use Quicktime's `Cmd-Shift-5` to record a small part of the screen:

  ![quicktime](img/quicktime.webp)

- Convert `.mov` videos to `.mp4` and `webm`.

  Quicktime outputs large `.mov` files. Use `ffmpeg` to convert them into `mp4` and `webm`
  web-friendly formats:

  ```bash
  # create MP4
  $ ffmpeg -i input.mov -b:v 0 -crf 25 output.mp4
  # create WebM
  $ ffmpeg -i input.mov -c vp9 -b:v 0 -crf 41 output.webm
  ```

