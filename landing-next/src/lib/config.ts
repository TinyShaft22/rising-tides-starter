/**
 * Dynamic counts from SKILLS_INDEX.json
 * These values are embedded at build time for static generation
 */

import skillsIndex from "../data/skills-index.json";

export const SKILLS_COUNT = skillsIndex.meta.totalSkills;
export const PLUGINS_COUNT = skillsIndex.meta.totalPlugins;
export const CLIS_COUNT = skillsIndex.meta.totalCLIs;
export const MCPS_COUNT = skillsIndex.meta.totalMCPs;

// Derived counts
export const CATEGORIES_COUNT = Object.keys(skillsIndex.categories || {}).length;
