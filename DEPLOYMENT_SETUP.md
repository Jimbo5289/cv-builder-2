# 🚀 Multi-Model AI Deployment Setup

## Environment Configuration

### Required Environment Variables
Set these in your deployment platform (Render, Vercel, etc.):

```bash
# AI Analysis Configuration
OPENAI_API_KEY=sk-proj-your-actual-openai-key
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-anthropic-key
USE_AI_ANALYSIS=true

# Your existing configuration
NODE_ENV=production
DATABASE_URL=your-database-url
JWT_SECRET=your-jwt-secret
STRIPE_SECRET_KEY=your-stripe-key
# ... other variables
```

## Getting API Keys

### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new secret key
5. Copy the key (starts with `sk-proj-`)

### Anthropic API Key  
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new key
5. Copy the key (starts with `sk-ant-api03-`)

## Multi-Model Benefits

✅ **Claude 3.5 Sonnet** - Superior reasoning and analysis quality
✅ **GPT-4o Mini** - Fast, cost-effective secondary validation  
✅ **Consensus Engine** - Cross-validation for maximum accuracy
✅ **Intelligent Fallbacks** - Works with one or both models
✅ **Realistic Scoring** - Honest field compatibility assessment

## Cost Optimization

- **Claude 3.5 Sonnet**: ~$3 per 1M tokens (high-quality analysis)
- **GPT-4o Mini**: ~$0.15 per 1M tokens (cost-effective validation)
- **Smart Routing**: Automatically uses most appropriate model combination
- **Enhanced Fallbacks**: Intelligent mock analysis when APIs unavailable

## Deployment Checklist

- [ ] Set OPENAI_API_KEY in environment
- [ ] Set ANTHROPIC_API_KEY in environment  
- [ ] Set USE_AI_ANALYSIS=true
- [ ] Test both single-model and multi-model scenarios
- [ ] Verify realistic scoring for different career transitions
- [ ] Monitor API usage and costs
- [ ] Ensure fallback to enhanced mock analysis works

## Security Notes

- Environment files are now gitignored for security
- API keys are managed through deployment platform environment variables
- No sensitive data in repository
- Keys can be rotated without code changes

Your CV Builder now offers the most advanced AI analysis available! 🎉 