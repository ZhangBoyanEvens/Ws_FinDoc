import automationIllustration from '../assets/1.svg'
import dragDropIllustration from '../assets/3.svg'
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
    imageSrc: IMG('photo-1506784983877-45594efa4cbe'),
    imageAlt: 'Calendar and planning for timelines and checklists',
  },
  {
    number: '05',
    title: 'Professional Report Generation',
    description:
      'Creates complete, well-structured acceptance reports including project overview, progress summary, quality conclusions, and attachment lists — **ready for submission** to clients and supervisors.',
    imageSrc: IMG('photo-1554224155-6726b3ff858f'),
    imageAlt: 'Structured business and financial reports',
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
    imageSrc: IMG('photo-1544197150-b99a580bb7a8'),
    imageAlt: 'Hyperscale data center rows of servers — global cloud infrastructure like AWS Regions',
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
