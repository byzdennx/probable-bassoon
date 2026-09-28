exports.getDocs = async (req, res) => {
  try {
    const { section } = req.query;
    const docSections = {
      'getting-started': {
        title: 'Getting Started',
        content: `
          # EpannRouter AI Documentation

          Welcome to **EpannRouter AI**, your all-in-one AI platform powered by multiple models including Gemini, GPT-4, Claude, and more.

          ## Quick Start

          1. Sign up for a free account at /register
          2. Verify your email
          3. Choose a model from the Explore page
          4. Start chatting in the Playground
          5. Track usage and billing in the Dashboard

          ## API Usage

          \`\`\`bash
          curl -X POST https://api.epannrouter.com/v1/chat \\
            -H "Authorization: Bearer YOUR_API_KEY" \\
            -H "Content-Type: application/json" \\
            -d '{
              "model": "gemini",
              "messages": [{"role": "user", "content": "Hello!"}]
            }'
          \`\`\`

          ## Models

          - **Gemini Pro** - Free, fast, multi-modal
          - **GPT-4** - Most powerful, $0.03/1K tokens
          - **Claude 3 Opus** - Enterprise grade, $0.015/1K tokens
          - **Llama 2** - Open source, free
        `
      },
      'api-reference': {
        title: 'API Reference',
        content: `
          # API Reference

          ## Base URL
          \`https://api.epannrouter.com/v1\`

          ## Authentication
          Use your API key as a Bearer token:
          \`\`\`
          Authorization: Bearer YOUR_API_KEY
          \`\`\`

          ## Endpoints

          ### POST /chat
          \`\`\`
          curl -X POST https://api.epannrouter.com/v1/chat \\
            -H "Authorization: Bearer YOUR_API_KEY" \\
            -H "Content-Type: application/json" \\
            -d '{
              "model": "gemini",
              "messages": [{"role": "user", "content": "Hello!"}],
              "temperature": 0.7
            }'
          \`\`\`

          ### GET /models
          \`\`\`
          curl -X GET https://api.epannrouter.com/v1/models \\
            -H "Authorization: Bearer YOUR_API_KEY"
          \`\`\`
        `
      },
      'billing': {
        title: 'Billing',
        content: `
          # Billing Documentation

          ## Plans

          | Plan | Price | Features |
          |------|-------|----------|
          | Free | $0 | 10 messages/day, basic models |
          | Pro | $29/mo | Unlimited messages, all models |
          | Enterprise | $99/mo | Custom integrations, SLA |

          ## Payment Methods

          We accept all major credit cards and PayPal.

          ## Invoicing

          Invoices are generated monthly and sent to your email.
        `
      },
      'faq': {
        title: 'FAQ',
        content: `
          # Frequently Asked Questions

          ## What is EpannRouter AI?
          EpannRouter AI is a platform that aggregates multiple AI models into a single interface, allowing you to choose the best model for your needs.

          ## Is my data safe?
          Yes, we take security seriously. All data is encrypted in transit and at rest.

          ## Can I upgrade/downgrade my plan?
          Yes, you can change your plan at any time from the Billing page.

          ## How do I contact support?
          Email us at support@epannrouter.com or use the live chat in the dashboard.
        `
      }
    };

    const sectionData = docSections[section] || docSections['getting-started'];

    return res.render('docs', {
      section: sectionData,
      layout: 'main'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load docs' });
  }
};
