# Instagram Engagement Bot

An Instagram engagement automation project built with **Node.js and Puppeteer** to experiment with browser automation, media processing, and automated social-media workflows.

## About This Project

The Instagram Engagement Bot is an automation project developed to explore how browser automation can be used to interact with Instagram content and streamline repetitive engagement workflows.

The application uses **Puppeteer** to programmatically control a browser and interact with Instagram through its web interface. Puppeteer Extra and its stealth plugin are incorporated into the project to provide additional browser automation capabilities.

The project also integrates **FFmpeg** and **Whisper** for media processing and speech-to-text functionality, allowing video or audio content to be processed as part of the bot's workflow.

Environment variables are used to separate sensitive configuration from the application's source code.

This project was primarily built as an exploration of automation, browser control, asynchronous JavaScript, media processing, and integrating multiple Node.js libraries into a single workflow.

## Built With

[![Node.js][Node.js]][Node-url]
[![JavaScript][JavaScript]][JavaScript-url]
[![Puppeteer][Puppeteer]][Puppeteer-url]

## Libraries & Integrations

[![FFmpeg][FFmpeg]][FFmpeg-url]
[![Whisper][Whisper]][Whisper-url]

- **Puppeteer** — browser automation and interaction with web content
- **Puppeteer Extra Stealth** — additional browser automation behavior
- **FFmpeg** — audio and video processing
- **Whisper** — speech-to-text transcription
- **dotenv** — environment variable management
- **fs-extra** — extended filesystem operations

## Key Features

- Automated browser control with Puppeteer
- Programmatic interaction with Instagram's web interface
- Automated navigation and content processing
- Audio and video processing using FFmpeg
- Speech-to-text processing using Whisper
- Environment-based configuration
- Asynchronous automation workflows
- Modular Node.js architecture

> This repository is intended primarily as an automation and software-engineering project. Automated interaction with third-party platforms should be used responsibly and in accordance with their applicable terms and policies.

---

<!-- MARKDOWN LINKS & IMAGES -->

[Node.js]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org/

[JavaScript]: https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black
[JavaScript-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript

[Puppeteer]: https://img.shields.io/badge/Puppeteer-40B5A4?style=for-the-badge&logo=puppeteer&logoColor=white
[Puppeteer-url]: https://pptr.dev/

[FFmpeg]: https://img.shields.io/badge/FFmpeg-007808?style=for-the-badge&logo=ffmpeg&logoColor=white
[FFmpeg-url]: https://ffmpeg.org/

[Whisper]: https://img.shields.io/badge/Whisper-412991?style=for-the-badge&logo=openai&logoColor=white
[Whisper-url]: https://github.com/openai/whisper
