module.exports = { ci: {
  collect: { staticDistDir: './dist', numberOfRuns: 1, url: ['http://localhost/'] },
  assert: { assertions: {
    'categories:performance': ['error', { minScore: 0.9 }],
    'categories:accessibility': ['error', { minScore: 0.9 }],
    'categories:best-practices': ['error', { minScore: 0.9 }],
    'categories:seo': ['error', { minScore: 0.9 }],
    'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
  } },
  upload: { target: 'filesystem', outputDir: './qa/lighthouse' },
} };
