import automationIllustration from '../assets/1.svg'
import dragDropIllustration from '../assets/3.svg'
import checklistIllustration from '../assets/4.svg'
import reportIllustration from '../assets/5.svg'
import cloudBrandIllustration from '../assets/7.svg'
import engineeringDeliveryIllustration from '../assets/8.svg'

/**
 * 配图：Unsplash 直链（可换成自有 OSS/CDN）。
 * @see https://unsplash.com/license
 */
const IMG = (photoPath) =>
  `https://images.unsplash.com/${photoPath}?auto=format&fit=crop&w=1600&q=82`

/** FinDoc overview：八个卖点；imageSrc 与 description 语义对应 */
export const SCROLL_ITEMS = [
  {
    number: '01',
    title: 'Intelligent Acceptance Automation',
    description:
      'FinDoc automatically processes hundreds of engineering files, extracts metadata and dates, and builds a precise project timeline — eliminating manual sorting and **boosting delivery efficiency by over 10x**.',
    imageSrc: automationIllustration,
    imageAlt: 'Illustration of automated document processing and timeline',
    imageObjectFit: 'contain',
  },
  {
    number: '02',
    title: 'Perfect Template Fidelity',
    description:
      "Upload your company's standard acceptance template. FinDoc learns its structure, chapters, and table styles, then generates reports that **fully retain original formatting**, fonts, and layout.",
    imageSrc: IMG('photo-1455390582262-044cdead277a'),
    imageAlt: 'Writing and standard document layout on desk',
  },
  {
    number: '03',
    title: 'Effortless Drag-and-Drop Experience',
    description:
      'Simply drag all project files on the left and your standard template on the right. Click one button to start. No technical skills required — **complete in under 30 seconds**.',
    imageSrc: dragDropIllustration,
    imageAlt: 'Illustration of drag-and-drop files between two panels',
    imageObjectFit: 'contain',
  },
  {
    number: '04',
    title: 'Accurate Timeline & Checklist Generation',
    description:
      'Automatically sorts files by modification date, and intelligently generates a **professional acceptance checklist** with categories, versions, key summaries, and "required" status.',
    imageSrc: checklistIllustration,
    imageAlt: 'Checklist with checked items for acceptance tasks',
    imageObjectFit: 'contain',
  },
  {
    number: '05',
    title: 'Professional Report Generation',
    description:
      'Creates complete, well-structured acceptance reports including project overview, progress summary, quality conclusions, and attachment lists — **ready for submission** to clients and supervisors.',
    imageSrc: reportIllustration,
    imageAlt: 'Illustration of professional acceptance report generation',
    imageObjectFit: 'contain',
  },
  {
    number: '06',
    title: 'Hallucination-Free Processing',
    description:
      'Uses structured code extraction first, then applies AI only for template filling. Every date, filename, and conclusion is **grounded in real project files**.',
    imageSrc: IMG('photo-1555066931-4365d14bab8c'),
    imageAlt: 'Structured code and technical processing on screen',
  },
  {
    number: '07',
    title: 'Secure Cloud-Powered Workflow',
    description:
      'Deployed on AWS, Alibaba Cloud, or Tencent Cloud with **encrypted storage**. Generates secure download links (7-day validity) for easy team access and sharing.',
    imageSrc: cloudBrandIllustration,
    imageAlt: 'Cloud platform branding suited to secure global workflow',
    imageObjectFit: 'contain',
    /** 深色底上反相为近白色图形 */
    imageTone: 'invertWhite',
  },
  {
    number: '08',
    title: 'Built Specifically for Engineering Delivery',
    description:
      'Designed for civil, mechanical, electrical, renovation, and equipment installation projects. **Deeply understands** hidden inspections, material records, test reports, and other engineering scenarios.',
    imageSrc: engineeringDeliveryIllustration,
    imageAlt: 'Illustration of engineering delivery and project scenarios',
    imageObjectFit: 'contain',
  },
]
