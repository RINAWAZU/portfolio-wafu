import type { SkillGroup } from '@/types/content';

/** `data.js` の TECH（4群）をそのまま移植（§7-2）。 */
export const SKILL_GROUPS: readonly SkillGroup[] = [
  {
    no: '01',
    label: 'FRONTEND',
    items: [
      { name: 'React', level: 5 },
      { name: 'TypeScript', level: 5 },
      { name: 'Next.js', level: 4 },
      { name: 'Tailwind CSS', level: 5 },
      { name: 'Framer Motion', level: 4 },
    ],
  },
  {
    no: '02',
    label: 'MOBILE / IOS',
    items: [
      { name: 'Swift', level: 4 },
      { name: 'SwiftUI', level: 4 },
      { name: 'Combine', level: 3 },
      { name: 'Xcode / TestFlight', level: 4 },
    ],
  },
  {
    no: '03',
    label: '3D / MOTION',
    items: [
      { name: 'Spline', level: 4 },
      { name: 'Three.js + R3F', level: 3 },
      { name: 'GSAP / ScrollTrigger', level: 4 },
      { name: 'Lottie', level: 3 },
    ],
  },
  {
    no: '04',
    label: 'BACKEND / AI',
    items: [
      { name: 'Supabase', level: 4 },
      { name: 'PostgreSQL', level: 3 },
      { name: 'Claude API', level: 4 },
      { name: 'OpenAI API', level: 4 },
      { name: 'Vercel / Edge', level: 4 },
    ],
  },
];
