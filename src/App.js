import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ArrowUpTrayIcon, DocumentTextIcon, XCircleIcon, BeakerIcon, ArrowPathIcon, ClipboardDocumentIcon, PrinterIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';

// UPDATED: New component to render the structured JSON report
const StructuredReport = ({ data }) => {
    if (!data) return null;

    const getConfidenceChip = (confidence) => {
        switch (confidence?.toLowerCase()) {
            case 'high':
                return <span className="inline-block bg-green-500/20 text-green-300 text-xs font-medium px-2.5 py-1 rounded-full">High</span>;
            case 'medium':
                return <span className="inline-block bg-yellow-500/20 text-yellow-300 text-xs font-medium px-2.5 py-1 rounded-full">Medium</span>;
            case 'low':
                return <span className="inline-block bg-blue-500/20 text-blue-300 text-xs font-medium px-2.5 py-1 rounded-full">Low</span>;
            default:
                return <span className="inline-block bg-slate-600 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-full">{confidence}</span>;
        }
    };
    
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-cyan-300 mb-2 border-b border-slate-700 pb-2">Observations</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-300">
                    {data.observations?.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            </div>
            <div>
                <h3 className="text-xl font-semibold text-cyan-300 mb-2 border-b border-slate-700 pb-2">Potential Diagnoses</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-700 text-slate-400">
                                <th className="p-2">Diagnosis</th>
                                <th className="p-2">Confidence</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.potentialDiagnoses?.map((item, index) => (
                                <tr key={index} className="border-b border-slate-800">
                                    <td className="p-2 text-white font-medium">{item.diagnosis}</td>
                                    <td className="p-2">{getConfidenceChip(item.confidence)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div>
                <h3 className="text-xl font-semibold text-cyan-300 mb-2 border-b border-slate-700 pb-2">Recommendations</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-300">
                     {data.recommendations?.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            </div>
             {data.disclaimer && (
                <div className="mt-6 border-t border-slate-700 pt-4 text-slate-400 text-sm flex items-start gap-2">
                    <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0 mt-0.5"/>
                    <p>{data.disclaimer}</p>
                </div>
             )}
        </div>
    );
};


// Main App Component
const App = () => {
    const [images, setImages] = useState([]);
    const [analysis, setAnalysis] = useState(null); // Will hold the JSON object
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [copySuccess, setCopySuccess] = useState('');

    const [patientName, setPatientName] = useState('');
    const [patientAge, setPatientAge] = useState('');
    const [patientGender, setPatientGender] = useState('');
    const [clinicalHistory, setClinicalHistory] = useState('');

    // UPDATED: Logic to handle structured JSON analysis
    const handleAnalysis = async () => {
        if (images.length === 0) {
            setError("Please upload at least one CT scan image.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysis(null);

        const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

        if (!apiKey) {
            setError("API key not configured. Please check your environment variables.");
            setIsLoading(false);
            return;
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`;

        const patientContext = `Patient Context: Name: ${patientName || "N/A"}, Age: ${patientAge || "N/A"}, Gender: ${patientGender || "N/A"}, Clinical History: ${clinicalHistory || "N/A"}.`;

        const prompt = `
            ${patientContext}
            Role: Act as a board-certified radiologist.
            Task: Analyze the provided series of CT head scan images with utmost precision, considering the patient context. Synthesize findings from all images into a single JSON report.
            Instructions: Examine the entire series for abnormalities (hemorrhage, stroke, tumors, fractures, edema, etc.). Based on your findings, populate the JSON object according to the provided schema. Ensure the observations, diagnoses, and recommendations are clear and concise.
        `;
        
        const imageParts = images.map(image => ({ inlineData: { mimeType: "image/jpeg", data: image.base64 } }));
        
        // UPDATED: Payload with JSON schema definition
        const payload = {
            contents: [{ parts: [{ text: prompt }, ...imageParts] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        "observations": { "type": "ARRAY", "items": { "type": "STRING" } },
                        "potentialDiagnoses": { 
                            "type": "ARRAY", 
                            "items": { 
                                "type": "OBJECT",
                                "properties": {
                                    "diagnosis": { "type": "STRING" },
                                    "confidence": { "type": "STRING" }
                                }
                            } 
                        },
                        "recommendations": { "type": "ARRAY", "items": { "type": "STRING" } },
                        "disclaimer": { "type": "STRING" }
                    }
                }
            }
        };

        try {
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) { const errorBody = await response.json(); throw new Error(`API Error: ${errorBody.error.message}`); }
            const result = await response.json();
            if (result.candidates && result.candidates.length > 0 && result.candidates[0].content.parts[0].text) {
                // The API returns the JSON as a string, so we need to parse it
                const parsedAnalysis = JSON.parse(result.candidates[0].content.parts[0].text);
                setAnalysis(parsedAnalysis);
            } else if (result.candidates && result.candidates[0].finishReason === "SAFETY") {
                 setError("Analysis stopped due to safety settings. One or more images may contain sensitive content.");
            } else { throw new Error("Failed to get a valid analysis from the API."); }
        } catch (err) {
            console.error(err);
            setError(`An error occurred during analysis: ${err.message}`);
        } finally { setIsLoading(false); }
    };

    const onDrop = useCallback(acceptedFiles => {
        const newImages = [];
        acceptedFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                newImages.push({ preview: reader.result, base64: reader.result.split(',')[1] });
                if (newImages.length === acceptedFiles.length) setImages(prevImages => [...prevImages, ...newImages]);
            };
            reader.readAsDataURL(file);
        });
        setError(null);
        setAnalysis(null); 
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/jpeg': [], 'image/png': [] } });
    const removeImage = (indexToRemove) => setImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));

    const clearCase = () => {
        setImages([]); setPatientName(''); setPatientAge(''); setPatientGender(''); setClinicalHistory(''); setAnalysis(null); setError(null); setCopySuccess('');
    };
    
    // UPDATED: Copy to clipboard now stringifies the JSON object
    const copyToClipboard = () => {
        if (!analysis) return;
        const reportText = JSON.stringify(analysis, null, 2); // Pretty print JSON
        navigator.clipboard.writeText(reportText).then(() => {
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, () => {
            setCopySuccess('Failed');
        });
    };
    
    const printReport = () => window.print();

    const inputStyles = "w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition";
    const labelStyles = "block text-sm font-medium text-slate-300 mb-1";

    return (
        <>
            <style>{`@media print{body *{visibility:hidden}#print-section,#print-section *{visibility:visible}#print-section{position:absolute;left:0;top:0;width:100%;padding:2rem;color:#000!important}#print-section h2,#print-section h3,#print-section h4,#print-section p,#print-section li,#print-section strong{color:#000!important}#print-section table{color:#000!important}#print-section ul{list-style-position:outside;padding-left:20px}}`}</style>
            <div className="bg-slate-900 min-h-screen font-sans text-slate-200 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-700 via-slate-900 to-black print:hidden">
                <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                    <header className="text-center mb-10"><div className="inline-flex items-center justify-center"><svg className="w-12 h-12 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2.5c1.4-1.2 3.6-1.2 5 0l4.5 4c1.4 1.2 1.4 3.3 0 4.5l-4.5 4c-1.4 1.2-3.6 1.2-5 0l-4.5-4c-1.4-1.2-1.4-3.3 0-4.5l4.5-4z"></path><path d="M5.5 6.5l4 4"></path><path d="M14.5 6.5l-4 4"></path><path d="M10 14.5v-4"></path></svg><h1 className="text-4xl sm:text-5xl font-bold text-white ml-3">GuardianNeuro</h1></div><p className="text-lg text-slate-400 mt-2">AI-Powered Diagnostic Assistant for CT Head Scans</p></header>
                    <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/10 flex flex-col"><div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-semibold text-cyan-300">1. Upload & Details</h2><button onClick={clearCase} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors py-1 px-3 bg-slate-700/50 rounded-md border border-slate-600 hover:border-cyan-400"><ArrowPathIcon className="w-4 h-4" />Clear Case</button></div><div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${isDragActive ? 'border-cyan-400 bg-cyan-500/10' : 'border-slate-600 hover:border-cyan-500'}`}><input {...getInputProps()} /><ArrowUpTrayIcon className="w-12 h-12 mx-auto text-slate-500" /><p className="mt-2 text-slate-400">Drag & drop scans, or click to select.</p></div>
                            {images.length > 0 && (<div className="mt-4"><h3 className="text-lg font-medium text-slate-200 mb-2">Image Previews ({images.length})</h3><div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-40 overflow-y-auto p-2 bg-slate-800/50 rounded-lg">{images.map((image, index) => (<div key={index} className="relative group aspect-square"><img src={image.preview} alt={`Scan preview ${index + 1}`} className="w-full h-full object-cover rounded-md" /><button onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-black/60 backdrop-blur-sm rounded-full p-1 text-slate-300 hover:bg-red-500 hover:text-white transition-all opacity-50 group-hover:opacity-100" aria-label="Remove image"><XCircleIcon className="w-5 h-5" /></button></div>))}</div></div>)}
                            <div className="mt-6 space-y-4 border-t border-white/10 pt-6"><h3 className="text-xl font-medium text-slate-200">Optional Patient Details</h3><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label htmlFor="patientName" className={labelStyles}>Patient Name</label><input type="text" id="patientName" value={patientName} onChange={(e) => setPatientName(e.target.value)} className={inputStyles} placeholder="e.g., John Doe" /></div><div><label htmlFor="patientAge" className={labelStyles}>Age</label><input type="text" id="patientAge" value={patientAge} onChange={(e) => setPatientAge(e.target.value)} className={inputStyles} placeholder="e.g., 45" /></div></div><div><label htmlFor="patientGender" className={labelStyles}>Gender</label><select id="patientGender" value={patientGender} onChange={(e) => setPatientGender(e.target.value)} className={inputStyles}><option value="">Select...</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></div><div><label htmlFor="clinicalHistory" className={labelStyles}>Brief Clinical History / Indication</label><textarea id="clinicalHistory" value={clinicalHistory} onChange={(e) => setClinicalHistory(e.target.value)} rows="3" className={inputStyles} placeholder="e.g., Headache following trauma"></textarea></div></div>
                            <div className="mt-auto pt-6 text-center"><button onClick={handleAnalysis} disabled={images.length === 0 || isLoading} className="w-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:from-cyan-400 hover:to-blue-500 disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 transform hover:scale-105 disabled:scale-100">{isLoading ? "Analyzing..." : "2. Analyze Scans"}</button></div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/10 flex flex-col">
                            <div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-semibold text-cyan-300 flex items-center"><DocumentTextIcon className="w-7 h-7 mr-3"/>Diagnostic Report</h2><div className="flex items-center gap-2"><button onClick={copyToClipboard} disabled={!analysis || isLoading} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors py-1 px-3 bg-slate-700/50 rounded-md border border-slate-600 hover:border-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"><ClipboardDocumentIcon className="w-4 h-4" />{copySuccess || "Copy"}</button><button onClick={printReport} disabled={!analysis || isLoading} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors py-1 px-3 bg-slate-700/50 rounded-md border border-slate-600 hover:border-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"><PrinterIcon className="w-4 h-4" />Print</button></div></div>
                            <div id="print-section" className="bg-slate-800/50 rounded-lg p-4 flex-grow max-h-[70vh] overflow-y-auto"><div className="p-4 rounded-lg min-h-[400px]">
                                {error && <div className="text-red-400 bg-red-500/10 border border-red-400/30 p-3 rounded-md"><p className="font-bold">Error</p><p>{error}</p></div>}
                                {isLoading && !analysis && <div className="text-center text-slate-400 pt-12 flex flex-col items-center"><BeakerIcon className="w-12 h-12 text-cyan-400 animate-pulse"/><p className="mt-4">The AI is analyzing the scan. Please wait...</p></div>}
                                {analysis ? <StructuredReport data={analysis} /> : (!isLoading && !error && <p className="text-slate-500 italic text-center pt-12">Analysis will appear here.</p>)}
                            </div></div>
                        </div>
                    </main>
                     <footer className="text-center mt-12 text-sm text-slate-500"><p><strong>Disclaimer:</strong> This tool is an AI-powered assistant for medical professionals and is for informational purposes only.</p></footer>
                </div>
            </div>
        </>
    );
};

export default App;
