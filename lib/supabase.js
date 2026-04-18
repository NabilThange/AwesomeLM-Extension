// NotebookLM Extension - Supabase Fetch Helpers

(function() {
  'use strict';

  const SUPABASE_URL = 'https://qyhtrqobtwmbymviezcs.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5aHRycW9idHdtYnltdmllemNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5ODM0NDIsImV4cCI6MjA5MTU1OTQ0Mn0.G9OvB-j49IMGaeniTaAGSuGb1pd0YWKBqlp_59jt7Bc';
  const PLACEHOLDER_IMAGE = '';
  const FALLBACK_TEMPLATES = [
    {
      id: 'fallback-beginner-friendly',
      title: 'Beginner-Friendly Deck',
      description: 'Clear, approachable structure for introducing a topic step by step.',
      prompt: 'Create a beginner-friendly presentation with:\n- Clear, simple language\n- Step-by-step explanations\n- Bold visuals and diagrams\n- Real-world examples\n- Key takeaways on each slide',
      imageUrl: PLACEHOLDER_IMAGE,
      tags: ['fallback', 'education'],
      category: 'general',
      isFeatured: true,
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 'fallback-executive-summary',
      title: 'Executive Summary',
      description: 'High-level presentation focused on key findings, recommendations, and next steps.',
      prompt: 'Create an executive summary presentation with:\n- High-level key findings\n- Data-driven insights\n- Strategic recommendations\n- ROI and impact metrics\n- Clear next steps',
      imageUrl: PLACEHOLDER_IMAGE,
      tags: ['fallback', 'business'],
      category: 'business',
      isFeatured: true,
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 'fallback-technical-deep-dive',
      title: 'Technical Deep Dive',
      description: 'Detailed, technical walkthrough with architecture, implementation, and tradeoffs.',
      prompt: 'Create a technical deep dive presentation with:\n- Detailed technical explanations\n- Architecture diagrams\n- Code examples and best practices\n- Performance considerations\n- Implementation guidelines',
      imageUrl: PLACEHOLDER_IMAGE,
      tags: ['fallback', 'technical'],
      category: 'tech',
      isFeatured: false,
      createdAt: '',
      updatedAt: '',
    },
  ];

  function normalizeTemplate(row) {
    return {
      id: row.id,
      title: row.title || 'Untitled Template',
      description: row.description || 'No description available.',
      prompt: row.prompt || '',
      imageUrl: row.main_image_url || PLACEHOLDER_IMAGE,
      tags: Array.isArray(row.tags) ? row.tags : [],
      category: row.category || null,
      isFeatured: Boolean(row.is_featured),
      createdAt: row.created_at || '',
      updatedAt: row.updated_at || '',
    };
  }

  async function fetchTemplates() {
    const endpoint = `${SUPABASE_URL}/rest/v1/treasures?select=id,title,description,prompt,main_image_url,tags,category,is_featured,created_at,updated_at&order=is_featured.desc,created_at.desc`;
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Supabase request failed: ${response.status} ${response.statusText}`);
    }

    const rows = await response.json();
    return rows.map(normalizeTemplate);
  }

  window.AwesomeLMSupabase = {
    SUPABASE_URL,
    FALLBACK_TEMPLATES,
    fetchTemplates,
    normalizeTemplate,
  };
})();
