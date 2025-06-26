# GuardianNeuro - AI-Powered CT Scan Analysis

GuardianNeuro is an advanced AI-powered diagnostic assistant specifically designed for analyzing CT head scans. Built with React and powered by Google's Gemini 2.5 Pro API, it provides medical professionals with structured diagnostic insights.

## 🚀 Features

- **AI-Powered Analysis**: Utilizes Google's Gemini 2.5 Pro for accurate CT scan interpretation
- **Drag & Drop Interface**: Easy upload of multiple CT scan images
- **Patient Information Management**: Optional patient details and clinical history
- **Structured Reports**: Organized observations, potential diagnoses, and recommendations
- **Modern UI**: Dark theme with responsive design using Tailwind CSS
- **Export Functionality**: Print and copy reports for documentation
- **Security**: Environment-based API key management

## 🛠️ Technology Stack

- **Frontend**: React 19.1.0
- **Styling**: Tailwind CSS 3.4.0
- **Icons**: Heroicons React
- **File Upload**: React Dropzone
- **AI API**: Google Gemini 2.5 Pro
- **Build Tool**: Create React App

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Gemini API key

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/OGUN01/ct_scan.git
cd ct_scan
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

4. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub (already done)
2. Connect your GitHub repository to Vercel
3. Add the environment variable `REACT_APP_GEMINI_API_KEY` in Vercel dashboard
4. Deploy!

## 📖 Usage

1. **Upload CT Scans**: Drag and drop or click to select CT scan images
2. **Add Patient Details**: Optionally fill in patient information and clinical history
3. **Analyze**: Click "Analyze Scans" to get AI-powered diagnostic insights
4. **Review Results**: View structured observations, diagnoses, and recommendations
5. **Export**: Copy or print the report for documentation

## ⚠️ Disclaimer

This tool is an AI-powered assistant for medical professionals and is for informational purposes only. It should not replace professional medical judgment or be used as the sole basis for medical decisions.

## 🔒 Security

- API keys are stored as environment variables
- No sensitive data is stored locally
- All API communications are encrypted

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support or questions, please open an issue on GitHub.
