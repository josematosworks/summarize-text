# Summarize Text CloudFlare Worker

A Cloudflare Worker that leverages OpenAI's API to summarize text content. This worker provides a secure and efficient way to generate text summaries using AI, with built-in CORS support and error handling.

## Features

- Text summarization using OpenAI's API
- Configurable API endpoints and models
- Custom prompt support
- CORS protection with configurable allowed origins
- Error handling and response formatting
- GitHub Actions deployment workflow

## Prerequisites

- Node.js 20 or higher
- Cloudflare account
- OpenAI API key
- Wrangler CLI

## Environment Variables

The worker requires the following environment variables:

- `OPENAI_API_KEY`: Your OpenAI API key
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS

## Installation

1. Clone the repository:

```
    git clone https://github.com/josematosworks/summarize-text-worker
    cd summarize-text-worker
```
2. Install dependencies:

    npm install

3. Create a `.dev.vars` file in the root directory with your environment variables:

    OPENAI_API_KEY=your_openai_api_key
    ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com

4. Start the development server:

```
    npm run dev
```

## Usage

Send a POST request to your worker's endpoint with the following JSON body:

    {
      "text": "Your text to summarize",
      "prompt": "Optional custom prompt",
      "model": "Optional model override (default: gpt-4)",
      "apiUrl": "Optional OpenAI API URL override"
    }

Example response:

    {
      "result": {
        "choices": [
          {
            "message": {
              "content": "Summarized text content..."
            }
          }
        ]
      }
    }

## Deployment

1. Log in to your Cloudflare account:

```
    npx wrangler login
```

2. Add your environment variables to Cloudflare:

```
    npx wrangler secret put OPENAI_API_KEY
    npx wrangler secret put ALLOWED_ORIGINS
```

3. Deploy the worker:

```
    npm run deploy
```

Alternatively, you can use GitHub Actions for automated deployment by setting up the following secrets in your repository:
- `CLOUDFLARE_API_TOKEN`
- `OPENAI_API_KEY`
- `ALLOWED_ORIGINS`

## Development

- `npm run dev`: Start the development server
- `npm run deploy`: Deploy to Cloudflare Workers

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository.
