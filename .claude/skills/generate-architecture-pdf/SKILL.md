---
name: generate-architecture-pdf
description: Generate a professional, print-ready architecture PDF document for any project. Use when the user wants to create an architecture document, technical PDF, or interview-ready project documentation.
argument-hint: [optional: specific focus areas or notes]
---

# Generate Architecture PDF

Create a **professional, print-ready HTML architecture document** (designed to be saved as PDF via Ctrl+P > Save as PDF) for the current project.

## Instructions

1. **Analyze the project** — Read all relevant source files (frontend components, backend routes, configs, package.json) to understand the full architecture.

2. **Generate a multi-page HTML document** with these exact sections:
   - **Page 1 — Cover Page**: Dark themed cover with project name, subtitle, version, architecture type, and date. Use Playfair Display font for the title with an amber accent dot.
   - **Page 2 — Table of Contents**: Numbered list of all sections with descriptions.
   - **Page 3 — System Overview**: High-level architecture diagram (ASCII art in a dark code block), core design principles in two columns.
   - **Page 4 — Technology Stack**: Tech cards in a 2x2 grid for frontend and backend, plus project file structure in a code block.
   - **Page 5 — Backend Architecture**: Middleware pipeline flow diagram, REST API endpoints table (with colored method badges: GET=green, POST=blue, PUT=orange, DELETE=red), data model, input validation code, error handling.
   - **Page 6 — Frontend Architecture**: Component hierarchy tree, state management pattern, state variables, derived state, API integration layer, key patterns list.
   - **Page 7 — UI/UX Design System**: Color palette swatches, typography choices, animation strategy table, design features list.
   - **Page 8 — Data Flow**: Request lifecycle diagrams for each CRUD operation, state update code examples, interview tips about stale closures.
   - **Page 9 — Trade-offs & Roadmap**: Trade-offs table (Decision / Benefit / Limitation), 6-phase production scaling roadmap, key takeaway callout.

3. **Print-first CSS rules** (critical for perfect PDF output):
   - Use `@page { size: A4 portrait; margin: 0; }`.
   - Every page must be a `.pdf-page` div with `width: 210mm; height: 297mm; overflow: hidden; page-break-after: always; page-break-inside: avoid;`.
   - Use **mm units** for all spacing (padding, margins, gaps) — not px.
   - Add `@media print` block to enforce page dimensions.
   - Use `-webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;` on body.
   - Do NOT use `color-adjust` (deprecated). Use `forced-color-adjust: none` instead.
   - Do NOT use `min-height: 100vh` — use fixed `297mm` height.

4. **Design system**:
   - **Fonts**: Google Fonts — `Inter` (body), `JetBrains Mono` (code), `Playfair Display` (display headings).
   - **Cover**: Dark gradient background (`#0a0a0f` to `#1a1028`), amber accent (`#e8a738`), radial glow.
   - **Content pages**: White background, dark header bar with section name + project name, page numbers bottom-right.
   - **Components**: `.highlight-box` (amber left border), `.tech-card` (light bg cards), `.arch-diagram` / `.code-block` (dark bg, syntax-colored spans), `.api-table`, `.flow` (step arrows), `.feature-list` (amber square bullets), `.tree` (component hierarchy), `.two-col` grid, `.color-swatch` grid.
   - **Syntax colors in code blocks**: `.keyword` = pink (#d4729a), `.string` = green (#7fb069), `.comment` = dim (#4a4a5a), `.func` = blue (#6ba3d6), `.accent` = amber (#e8a738).

5. **Output**: Save the HTML file as `<ProjectName>-Architecture-Document.html` in the project root.

6. **Tell the user** to open in Chrome, press Ctrl+P, set Margins to "None", enable "Background graphics", and save as PDF.

## Additional Notes from $ARGUMENTS

$ARGUMENTS
